/** 简化 semver 比较：逐段数字比较；返回 true 表示 a > b。 */
export declare function isNewerVersion(a: string, b: string): boolean;
/** 本地安装的版本号（读安装目录 package.json，失败回退空串）。 */
export declare function currentVersion(): Promise<string>;
export interface UpdateCheckResult {
    current: string;
    latest: string;
    hasUpdate: boolean;
    repoUrl: string;
}
/** 检查 GitHub 上的最新版本。 */
export declare function checkUpdate(): Promise<UpdateCheckResult>;
export interface UpdateApplyResult {
    updatedFrom: string;
    updatedTo: string;
    backupDir: string;
    restartRequired: true;
}
/** 下载并覆盖安装目录文件（先备份旧文件）。假定调用前已确认有新版本。 */
export declare function applyUpdate(): Promise<UpdateApplyResult>;
