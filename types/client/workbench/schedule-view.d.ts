/** 文件工作台扩展视图 id（带插件命名空间，避免与其它插件冲突）。 */
export declare const QQBOT_WORKBENCH_VIEW_ID = "@sunjuntao/dsh-qqbot.schedule";
/**
 * 安装文件工作台扩展视图。全局未就绪时轮询等待（插件加载顺序不确定）。
 * 幂等：模块级 `installed` 守卫 + 同 id 覆盖，重复调用不会重复注册。
 */
export declare function installScheduleWorkbenchView(): void;
