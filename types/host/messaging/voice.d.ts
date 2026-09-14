type Logger = Pick<Console, "warn">;
export interface SttConfig {
    baseUrl: string;
    apiKey: string;
    model: string;
}
export interface TtsConfig {
    baseUrl: string;
    apiKey: string;
    model: string;
    voice: string;
}
/** 语音附件最小形状（QqAttachment 的子集，便于测试）。 */
export interface VoiceAttachmentLike {
    content_type?: string;
    url?: string;
    filename?: string;
    voice_wav_url?: string;
}
/** TTS 单条输入上限：QQ 语音消息有平台时长限制，超长文本合并发送意义不大。 */
export declare const TTS_MAX_INPUT_CHARS = 400;
/** STT 配置是否可用（baseUrl + apiKey 齐备）。 */
export declare function sttReady(config: {
    sttBaseUrl?: string;
    sttApiKey?: string;
}): boolean;
/**
 * 语音附件 → STT 转写文本。任何一步失败都返回 null（不抛错），
 * 由调用方回退平台 asr_refer_text / 占位说明。
 */
export declare function transcribeVoiceAttachment(att: VoiceAttachmentLike, config: SttConfig, logger: Logger): Promise<string | null>;
/**
 * 文本 → TTS 合成 WAV 文件（OpenAI 兼容 /audio/speech，response_format=wav）。
 * 返回本地 WAV 路径；失败返回 null（回复泵回退文字发送）。
 */
export declare function synthesizeSpeech(text: string, config: TtsConfig, logger: Logger): Promise<string | null>;
export {};
