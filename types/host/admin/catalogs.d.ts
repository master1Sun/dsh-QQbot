export interface ModelOption {
    /** 路由 id："provider/model"（与 StoredBotConfig.model 的写入格式一致）。 */
    id: string;
    /** 展示名（模型 name 字段；缺省用 id）。 */
    name: string;
    provider: string;
    /** 供应商显示名（如 "DeepSeek"），用于下拉分组标题；缺省用 provider。 */
    providerLabel?: string;
}
/** 读取宿主已配置的模型（读不到时返回空数组，调用方自行兜底当前值）。 */
export declare function loadConfiguredModels(settingsPath?: string): Promise<ModelOption[]>;
