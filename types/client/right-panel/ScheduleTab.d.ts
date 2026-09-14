/**
 * 右侧面板「定时消息」tab 主体（注册于 `sidebar.right.pane.tab`，key = 包名）。
 *
 * 与设置页的定时弹窗共用同一个无外壳管理器组件 ScheduleManager，
 * 因此具备完整的增删改查 + 测试能力（而非只读概览）。
 *
 * 本 tab 仅负责「机器人作用域」选择（所有机器人 / 指定机器人），
 * 并把它转译为 ScheduleManager 的 forceScope：
 *   - 选「所有机器人」→ forceScope="all"，ScheduleManager 拉取所有机器人聚合列表；
 *   - 选某个机器人   → forceScope="current" + detailAppId=该机器人，
 *     列表只显示该机器人名下任务，且新增任务默认归属该机器人。
 *
 * 样式说明：全部复用全局注入的 qbot-* 类与 --dsw-alias-* 设计令牌
 * （installStyles 在 apply 时已注入 document.head），因此深浅色主题自动适配，
 * 不在此写死任何颜色。文案全部走 i18n 字段名，并由 useLocale() 订阅语言切换。
 */
import * as React from "react";
export declare function ScheduleTab(): React.ReactNode;
