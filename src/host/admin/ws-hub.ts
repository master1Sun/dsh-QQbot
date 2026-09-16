/**
 * WebSocket 推送中枢：向设置界面长连接推送「机器人列表 / 连接状态已变化」事件。
 *
 * 背景：客户端此前用 15s 轮询 bots.list 检测登录状态变化，后改用 SSE
 *（`GET /qqbot-settings/events`）。SSE 是单向半双工、只能走 HTTP 请求通道，
 * 而 dsh 的 `webServer` 提供了 `registerUpgrade`（精确路径 HTTP upgrade），
 * 本模块改为在 `ws://<host>/qqbot-settings/events` 上提供全双工 WebSocket。
 *
 * 职责边界：
 *  - 本模块只做 RFC 6455 传输（握手 + 帧编解码 + ping/pong 心跳 + 广播）；
 *  - 鉴权栅栏（Host/Origin + 浏览器会话）在 `rpc-channel.ts` 的 upgrade 入口执行，
 *    与 RPC 通道共用同一套策略；
 *  - 广播内容为极小的 JSON 帧 `{ event, data }`，客户端按 `event` 分派。
 *
 * 实现取舍：只支持 RFC 6455 的最小必要子集——文本帧、分片重组、ping/pong、
 * close；不支持扩展协商（Sec-WebSocket-Extensions）、不支持 permessage-deflate。
 * 浏览器客户端不协商扩展，因此不受影响。
 */
import { createHash } from "node:crypto";
import type { IncomingMessage } from "node:http";
import type { Duplex } from "node:stream";

/** 帧操作码（RFC 6455 §5.2）。 */
const OPCODE_CONTINUATION = 0x0;
const OPCODE_TEXT = 0x1;
const OPCODE_CLOSE = 0x8;
const OPCODE_PING = 0x9;
const OPCODE_PONG = 0xa;

/** 握手固定魔串（RFC 6455 §1.3）。 */
const WS_GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

/** 心跳间隔（毫秒）：发 ping 并回收上一轮未回 pong 的僵死连接。 */
const HEARTBEAT_INTERVAL_MS = 25_000;

/**
 * 单帧 / 单消息载荷上限（1 MiB）。
 * 本通道只传极小的 JSON 事件帧，超限视为异常流量并直接断开，避免无界缓冲。
 */
const MAX_PAYLOAD_BYTES = 1024 * 1024;

/** 广播事件名：机器人列表或连接状态变化（客户端据此重新拉取 bots.list）。 */
export const WS_EVENT_BOTS_CHANGED = "bots-changed";

/** 一条已建立的 WebSocket 连接。 */
interface WsClient {
  socket: Duplex;
  /** 上一轮心跳是否收到过 pong。 */
  alive: boolean;
}

export interface WsHub {
  /** 向所有在线客户端广播一个事件（JSON 文本帧）。 */
  broadcast(event: string, data?: unknown): void;
  /** 接管一个已通过鉴权的 HTTP upgrade 连接，完成握手后开始收发帧。 */
  handleUpgrade(req: IncomingMessage, socket: Duplex, head: Buffer): void;
  /** 当前在线客户端数（诊断用）。 */
  clientCount(): number;
  /** 停止心跳并关闭所有连接（插件卸载时调用）。 */
  dispose(): void;
}

/** 解析出的一帧。 */
interface WsFrame {
  fin: boolean;
  opcode: number;
  payload: Buffer;
}

type ParseResult =
  /** 完整读出一帧，rest 为剩余字节。 */
  | { kind: "frame"; frame: WsFrame; rest: Buffer }
  /** 字节不够一帧，rest 为待续读的缓冲。 */
  | { kind: "incomplete"; rest: Buffer }
  /** 协议违规（超长载荷 / 保留操作码），调用方应立即断开。 */
  | { kind: "fatal" };

/** 计算握手响应里的 Sec-WebSocket-Accept。 */
function acceptKey(key: string): string {
  return createHash("sha1").update(`${key}${WS_GUID}`).digest("base64");
}

/** 编码一个服务端帧（FIN=1，不掩码——RFC 6455 要求服务端到客户端不掩码）。 */
function encodeFrame(opcode: number, payload: Buffer): Buffer {
  const length = payload.length;
  let header: Buffer;
  if (length < 126) {
    header = Buffer.alloc(2);
    header[1] = length;
  } else if (length <= 0xffff) {
    header = Buffer.alloc(4);
    header[1] = 126;
    header.writeUInt16BE(length, 2);
  } else {
    header = Buffer.alloc(10);
    header[1] = 127;
    header.writeBigUInt64BE(BigInt(length), 2);
  }
  header[0] = 0x80 | opcode;
  return Buffer.concat([header, payload]);
}

/**
 * 从缓冲里解出一帧。
 *
 * 客户端到服务端的帧必须掩码；这里对未掩码帧也兼容（仅内部可信来源会这样），
 * 但不主动做安全假设——载荷上限始终生效。
 */
function parseFrame(buf: Buffer): ParseResult {
  if (buf.length < 2) return { kind: "incomplete", rest: buf };
  const first = buf[0]!;
  const second = buf[1]!;
  const fin = (first & 0x80) !== 0;
  const opcode = first & 0x0f;
  const masked = (second & 0x80) !== 0;
  let length = second & 0x7f;
  let offset = 2;

  if (length === 126) {
    if (buf.length < offset + 2) return { kind: "incomplete", rest: buf };
    length = buf.readUInt16BE(offset);
    offset += 2;
  } else if (length === 127) {
    if (buf.length < offset + 8) return { kind: "incomplete", rest: buf };
    const declared = buf.readBigUInt64BE(offset);
    offset += 8;
    if (declared > BigInt(MAX_PAYLOAD_BYTES)) return { kind: "fatal" };
    length = Number(declared);
  }
  if (length > MAX_PAYLOAD_BYTES) return { kind: "fatal" };

  let mask: Buffer | undefined;
  if (masked) {
    if (buf.length < offset + 4) return { kind: "incomplete", rest: buf };
    mask = buf.subarray(offset, offset + 4);
    offset += 4;
  }
  if (buf.length < offset + length) return { kind: "incomplete", rest: buf };

  // 拷贝一份再异或：subarray 共享底层内存，直接改写会污染接收缓冲。
  const payload = Buffer.from(buf.subarray(offset, offset + length));
  if (mask) {
    for (let i = 0; i < payload.length; i += 1) payload[i] = payload[i]! ^ mask[i & 3]!;
  }
  return { kind: "frame", frame: { fin, opcode, payload }, rest: buf.subarray(offset + length) };
}

/** 检查操作码是否是控制帧之外的保留值。 */
function isReservedOpcode(opcode: number): boolean {
  return (opcode >= 0x3 && opcode <= 0x7) || opcode >= 0xb;
}

export function createWsHub({ logger }: { logger: Pick<Console, "warn"> }): WsHub {
  const clients = new Set<WsClient>();

  const drop = (client: WsClient): void => {
    clients.delete(client);
  };

  /** 写帧；写失败（对端已消失）直接摘除连接。 */
  const send = (client: WsClient, opcode: number, payload: Buffer): void => {
    if (client.socket.destroyed) {
      drop(client);
      return;
    }
    try {
      client.socket.write(encodeFrame(opcode, payload), (error) => {
        if (error) drop(client);
      });
    } catch (error) {
      drop(client);
      logger.warn("[dsh-qqbot] WebSocket 写入失败，已摘除该客户端:", error);
    }
  };

  /** 主动关闭：先发 close 帧再断开，让浏览器侧走正常 onclose 重连。 */
  const close = (client: WsClient, code = 1001): void => {
    if (!client.socket.destroyed) {
      const body = Buffer.alloc(2);
      body.writeUInt16BE(code, 0);
      send(client, OPCODE_CLOSE, body);
    }
    drop(client);
    try {
      client.socket.end();
    } catch { /* 对端已断开 */ }
  };

  /**
   * 接管一条 upgrade 连接：完成握手、开始解帧。
   * @param onText - 收到完整文本帧的回调（已做分片重组）。
   * @param head - upgrade 事件里握手之后已经到达的字节（通常为空）。
   */
  const attach = (client: WsClient, onText: (text: string) => void, head: Buffer): void => {
    let buffer: Buffer = Buffer.alloc(0);
    const fragments: Buffer[] = [];
    let fragmentOpcode = OPCODE_CONTINUATION;

    const feed = (chunk: Buffer): void => {
      buffer = buffer.length === 0 ? chunk : Buffer.concat([buffer, chunk]);
      // 一帧载荷上限 + 头部开销；超出说明对端在灌垃圾数据。
      if (buffer.length > MAX_PAYLOAD_BYTES + 16) {
        client.socket.destroy();
        return;
      }
      for (;;) {
        const result = parseFrame(buffer);
        if (result.kind === "incomplete") {
          buffer = result.rest;
          return;
        }
        if (result.kind === "fatal") {
          client.socket.destroy();
          return;
        }
        buffer = result.rest;
        const { fin, opcode, payload } = result.frame;

        if (opcode === OPCODE_CONTINUATION) {
          fragments.push(payload);
          if (!fin) continue;
          const full = Buffer.concat(fragments);
          fragments.length = 0;
          if (fragmentOpcode === OPCODE_TEXT) onText(full.toString("utf8"));
          fragmentOpcode = OPCODE_CONTINUATION;
          continue;
        }
        if (isReservedOpcode(opcode)) {
          client.socket.destroy();
          return;
        }
        if (opcode === OPCODE_TEXT) {
          if (!fin) {
            fragmentOpcode = OPCODE_TEXT;
            fragments.length = 0;
            fragments.push(payload);
            continue;
          }
          onText(payload.toString("utf8"));
          continue;
        }
        if (opcode === OPCODE_PING) {
          send(client, OPCODE_PONG, payload);
          continue;
        }
        if (opcode === OPCODE_PONG) {
          client.alive = true;
          continue;
        }
        if (opcode === OPCODE_CLOSE) {
          close(client, 1000);
          return;
        }
        // 其余（二进制帧）：本通道不承载，忽略。
      }
    };

    client.socket.on("data", (chunk: Buffer | string) => {
      feed(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, "utf8"));
    });
    client.socket.on("error", () => drop(client));
    client.socket.on("close", () => drop(client));
    if (head.length > 0) feed(head);
  };

  const timer = setInterval(() => {
    for (const client of [...clients]) {
      // 上一轮 ping 没回 pong：连接已僵死（浏览器休眠 / 网络中断），直接回收。
      if (!client.alive) {
        drop(client);
        try {
          client.socket.destroy();
        } catch { /* 已断开 */ }
        continue;
      }
      client.alive = false;
      send(client, OPCODE_PING, Buffer.alloc(0));
    }
  }, HEARTBEAT_INTERVAL_MS);
  timer.unref?.();

  return {
    handleUpgrade(req, socket, head) {
      const upgrade = String(req.headers.upgrade ?? "").toLowerCase();
      const key = req.headers["sec-websocket-key"];
      const versions = String(req.headers["sec-websocket-version"] ?? "")
        .split(",")
        .map((v) => v.trim());
      if (upgrade !== "websocket" || typeof key !== "string" || key === "" || !versions.includes("13")) {
        try {
          socket.write("HTTP/1.1 400 Bad Request\r\nConnection: close\r\nContent-Length: 0\r\n\r\n");
        } catch { /* 对端已断开 */ }
        socket.destroy();
        return;
      }
      try {
        socket.write(
          "HTTP/1.1 101 Switching Protocols\r\n"
          + "Upgrade: websocket\r\n"
          + "Connection: Upgrade\r\n"
          + `Sec-WebSocket-Accept: ${acceptKey(key)}\r\n\r\n`,
        );
      } catch (error) {
        logger.warn("[dsh-qqbot] WebSocket 握手响应失败:", error);
        socket.destroy();
        return;
      }

      const client: WsClient = { socket, alive: true };
      clients.add(client);
      // 文本帧目前只承载客户端的心跳/探活；广播方向才是本通道的主用途。
      attach(client, () => { /* 服务端不消费客户端文本帧 */ }, head ?? Buffer.alloc(0));
    },

    broadcast(event, data) {
      if (clients.size === 0) return;
      const payload = Buffer.from(JSON.stringify({ event, data: data ?? null, at: Date.now() }), "utf8");
      for (const client of [...clients]) send(client, OPCODE_TEXT, payload);
    },

    clientCount() {
      return clients.size;
    },

    dispose() {
      clearInterval(timer);
      for (const client of [...clients]) close(client);
      clients.clear();
    },
  };
}
