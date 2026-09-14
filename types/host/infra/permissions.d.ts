/** 读取该机器人生效的默认权限文本（无则 null）。 */
declare function resolvePermission(appId: string | undefined): Promise<string | null>;
/** 读取默认权限原文（/perm view）。 */
declare function readDefault(appId: string | undefined): Promise<string | null>;
/** 写默认权限（/perm set，截断到 4000 字）。 */
declare function writeDefault(appId: string | undefined, text: string): Promise<void>;
/** 清除默认权限（/perm clear），返回是否确有文件被清。 */
declare function clearDefault(appId: string | undefined): Promise<boolean>;
/** 把权限文本包成 prompt 顶部指令块（防注入：声明为必须遵守的用户设定）。 */
declare function permissionBlock(text: string): string;
/**
 * 判定 openid 是否可修改权限：名单为空=不设限（true）；含 "*"=全部放行；
 * 否则仅名单内 openid 可改。
 */
declare function isPermissionAdmin(adminOpenids: string[] | undefined, openid: string): boolean;
export { clearDefault, isPermissionAdmin, permissionBlock, readDefault, resolvePermission, writeDefault };
