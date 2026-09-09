/**
 * 设置界面样式表（原 index.tsx 内联 CSS_TEXT，整段搬移未做修改）：
 * 对齐 @xmanrui/dsh-im 的 --dsw-alias-* 设计令牌（含浅色回退）。
 */
/**
 * 样式完全对齐 @xmanrui/dsh-im 的 plugin-src/client/styles.js：
 * 同一套 --dsw-alias-* 设计令牌（含浅色回退）、同样的圆角/阴影/字号/间距/交互态。
 */
export const CSS_TEXT = `
.qbot-page {
  --qbot-blue: #1677ff;
  --qbot-blue-dark: #0958d9;
  --qbot-business: var(--dsw-alias-state-business-primary, #3370ff);
  width: 100%;
  max-width: 1080px;
  padding: 2px 0 30px;
  color: var(--dsw-alias-label-primary, #1f2329);
  box-sizing: border-box;
}
.qbot-page *, .qbot-page *::before, .qbot-page *::after { box-sizing: border-box; }

/* ── 标题栏（dim-title）────────────────────────────────────────────────── */
/* sticky 吸顶：长页面滚动时标题栏（含连接状态）常驻视口顶部；负顶 margin 抵消
   .qbot-page 的 2px 顶部 padding，使吸附时背景无缝贴合滚动容器顶缘。 */
.qbot-title { position: sticky; top: 0; z-index: 40; display: flex; align-items: center; justify-content: space-between; gap: 16px; margin: -2px 0 8px; padding: 8px 2px 10px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-brand { min-width: 0; width: max-content; max-width: 100%; display: flex; flex-direction: column; align-items: flex-start; gap: 1px; margin: -2px -6px; padding: 2px 6px; border-radius: 8px; }
.qbot-brandHeading { display: flex; align-items: baseline; gap: 8px; white-space: nowrap; }
.qbot-brandName { color: var(--dsw-alias-label-primary, #1f2329); font-size: 20px; line-height: 24px; font-weight: 800; letter-spacing: .04em; }
.qbot-brandVersion { color: var(--dsw-alias-label-tertiary, #8f959e); font: 500 10px/16px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: 0; }
.qbot-updateBtn { align-self: center; min-height: 20px; padding: 1px 9px; border-radius: 999px; font-size: 11px; line-height: 16px; font-weight: 560; }
.qbot-updateBtn:disabled { cursor: default; opacity: .65; }
.qbot-updateBtn.is-done { color: var(--dsw-alias-state-success-primary, #2ea121); border-color: color-mix(in srgb, var(--dsw-alias-state-success-primary, #2ea121) 45%, var(--dsw-alias-border-l2, #dfe1e5)); }
.qbot-title p { margin: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 18px; font-weight: 500; white-space: nowrap; }
.qbot-titleActions { display: flex; align-items: center; justify-content: flex-end; gap: 8px; flex-wrap: wrap; }

/* 标题栏品牌区：QQ 机器人图标 + 文案（横向排列） */
.qbot-brand { flex-direction: row; align-items: center; gap: 10px; }
.qbot-brandText { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.qbot-brandGlyph { flex: none; width: 30px; height: 30px; color: var(--qbot-blue, #1677ff); }

/* 设置侧栏导航项：QQ 机器人图标 + 文案，隐藏宿主默认齿轮 */
.qbot-navLabel { display: inline-flex; align-items: center; gap: 8px; }
.qbot-navGlyph { flex: none; width: 18px; height: 18px; color: inherit; }
.qbot-navText { white-space: nowrap; }
.VOzbGW_navCell:has(.qbot-navLabel) .VOzbGW_navIcon { display: none !important; }

/* ── 面板（dim-panel）──────────────────────────────────────────────────── */
.qbot-panel { min-width: 0; }

/* ── 状态胶囊 / 状态标签（dim-onlineBadge / dim-stateLabel / dim-stateDot）─ */
.qbot-onlineBadge { min-height: 30px; display: inline-flex; align-items: center; gap: 7px; padding: 0 11px; border: 0; border-radius: 999px; color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-bg-module-platform, #f2f3f5); font: inherit; font-size: 12px; font-weight: 400; line-height: normal; white-space: nowrap; }
.qbot-stateLabel { display: inline-flex; align-items: center; gap: 8px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: normal; font-weight: 600; }
.qbot-stateDot { flex: none; width: 8px; height: 8px; border-radius: 50%; background: var(--dsw-alias-label-tertiary, #8f959e); box-shadow: none; }
.qbot-stateDot[data-tone="success"] { background: var(--dsw-alias-state-success-primary, #20a162); box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-success-primary, #20a162) 14%, transparent); }
.qbot-stateDot[data-tone="warning"] { background: var(--dsw-alias-state-warn-primary, #d97706); }
.qbot-stateDot[data-tone="error"] { background: var(--dsw-alias-state-error-primary, #d54941); }

/* ── 面板通用（dim-channelPage / dim-surfaceCard）─────────────────────── */
.qbot-channelPage { min-width: 0; width: 100%; max-width: none; display: flex; flex-direction: column; gap: 12px; padding: 0 0 24px; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-surfaceCard { position: relative; overflow: hidden; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 14px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 1px 2px rgb(31 35 41 / 3%); }
.qbot-surfaceBody { padding: 24px; display: flex; flex-direction: column; gap: 12px; }
.qbot-cardTitle { margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 17px; line-height: 1.35; font-weight: 650; }
.qbot-listHeading { min-height: 0; display: flex; align-items: center; justify-content: space-between; gap: 16px; margin: 0; }
.qbot-listHeading h3 { margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 14px; line-height: normal; font-weight: 650; }
.qbot-listTitle { min-width: 0; display: inline-flex; align-items: center; gap: 10px; }
.qbot-hint { margin: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 1.6; }

/* ── 通知（dim-statusNotice / info 变体）──────────────────────────────── */
.qbot-statusNotice { display: flex; align-items: flex-start; gap: 10px; padding: 13px 15px; border: 1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 22%, var(--dsw-alias-border-l2, #dfe1e5)); border-radius: 10px; color: var(--dsw-alias-state-error-primary, #d54941); background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 8%, var(--dsw-alias-bg-layer-1, #fff)); font-size: 13px; line-height: 1.5; }
.qbot-infoNotice { display: flex; align-items: flex-start; gap: 10px; padding: 13px 15px; border: 1px solid color-mix(in srgb, var(--qbot-business) 22%, var(--dsw-alias-border-l2, #dfe1e5)); border-radius: 10px; color: var(--qbot-business); background: color-mix(in srgb, var(--qbot-business) 7%, var(--dsw-alias-bg-layer-1, #fff)); font-size: 13px; line-height: 1.5; }
/* 页面级更新提示（qbot-page 是普通块布局，无 channelPage 的 flex gap，需自带下边距与面板隔开） */
.qbot-updateNotice { margin: 0 0 18px; }

/* ── 机器人卡片（dim-botCard）─────────────────────────────────────────── */
.qbot-botList { min-width: 0; width: 100%; max-width: 100%; display: grid; grid-template-columns: minmax(0, 1fr); gap: 8px; }
.qbot-botCard { position: relative; min-width: 0; width: 100%; max-width: 100%; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 14px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 1px 2px rgb(31 35 41 / 3%); font: inherit; text-align: left; cursor: pointer; transition: border-color .16s ease, box-shadow .16s ease; }
.qbot-botCard:hover { border-color: color-mix(in srgb, var(--qbot-blue) 25%, var(--dsw-alias-border-l2, #e5e6eb)); box-shadow: 0 5px 16px rgb(31 35 41 / 5%); }
.qbot-botCard:focus-visible { outline: none; border-color: color-mix(in srgb, var(--qbot-blue) 72%, var(--dsw-alias-border-l2, #dfe1e5)); box-shadow: 0 0 0 1px color-mix(in srgb, var(--qbot-blue) 24%, transparent) inset, 0 3px 12px rgb(22 119 255 / 7%); }
.qbot-botCardBody { padding: 12px; display: flex; align-items: center; gap: 12px; }
.qbot-botTop { min-width: 0; flex: 1 1 auto; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.qbot-botIdentity { min-width: 0; flex: 1 1 0; display: flex; align-items: center; gap: 10px; }
.qbot-botAvatar { flex: none; width: 38px; height: 38px; display: grid; place-items: center; overflow: hidden; border-radius: 11px; color: #fff; background: var(--qbot-blue); }
.qbot-botAvatar svg { width: 27px; height: 27px; }
.qbot-botName { min-width: 0; }
.qbot-botName h3 { overflow: hidden; margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 15px; font-weight: 650; line-height: normal; text-overflow: ellipsis; white-space: nowrap; }
.qbot-botName p { overflow: hidden; margin: 4px 0 0; color: var(--dsw-alias-label-secondary, #646a73); font: 12px ui-monospace, SFMono-Regular, monospace; line-height: normal; text-overflow: ellipsis; white-space: nowrap; }
.qbot-botTools { flex: none; display: flex; align-items: center; gap: 8px; }
.qbot-botHealthGroup { min-width: 0; max-width: 100%; flex: none; display: grid; justify-items: end; gap: 5px; }
.qbot-lastChecked { display: inline-flex; align-items: baseline; gap: 4px; color: var(--dsw-alias-label-tertiary, #8f959e); font: inherit; font-size: 11px; font-weight: 400; line-height: normal; white-space: nowrap; }
.qbot-botChevron { flex: none; width: 9px; height: 9px; border-right: 1.6px solid var(--dsw-alias-label-tertiary, #8f959e); border-bottom: 1.6px solid var(--dsw-alias-label-tertiary, #8f959e); transform: rotate(-45deg); }

/* ── 空状态（dim-emptyView）───────────────────────────────────────────── */
.qbot-emptyView { min-height: 230px; display: grid; grid-template-columns: minmax(0, 1fr) 180px; align-items: center; gap: 30px; }
.qbot-emptyCopy { min-width: 0; }
.qbot-emptyCopy h3 { margin: 8px 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 18px; line-height: 1.35; font-weight: 650; }
.qbot-emptyCopy > p { max-width: 560px; margin: 0; color: var(--dsw-alias-label-secondary, #646a73); line-height: 1.65; }
.qbot-emptyBrand { width: 110px; height: 110px; display: grid; place-items: center; justify-self: center; border-radius: 28px; color: #fff; background: var(--qbot-blue); box-shadow: 0 18px 45px rgb(22 119 255 / 18%); }
.qbot-emptyBrand svg { width: 56px; height: 56px; }

/* ── 分段 Tab（dim-contextTabs）───────────────────────────────────────── */
.qbot-segTabs { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 3px; padding: 3px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 8px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-segTabs button { min-width: 0; min-height: 34px; padding: 5px 12px; border: 0; border-radius: 6px; color: var(--dsw-alias-label-secondary, #646a73); background: transparent; font: inherit; font-weight: 500; cursor: pointer; transition: color .15s ease, background .15s ease, box-shadow .15s ease; }
.qbot-segTabs button:hover:not([aria-selected="true"]) { color: var(--dsw-alias-label-primary, #1f2329); background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-segTabs button[aria-selected="true"] { color: var(--qbot-business); background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 1px 3px rgb(31 35 41 / 12%); }

/* ── 扫码布局（dim-qrLayout / dim-qrFrame / dim-steps）────────────────── */
/* 设置面板实际宽度有限，扫码区改为纵向：二维码在上，说明在下（不再左右分栏）。 */
.qbot-qrLayout { display: flex; flex-direction: column; align-items: stretch; gap: 22px; }
.qbot-qrColumn { width: 100%; min-width: 0; max-width: 320px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 12px; }
.qbot-qrFrame { position: relative; width: min(270px, 100%); height: auto; aspect-ratio: 1; display: grid; place-items: center; overflow: hidden; padding: 10px; border: 1px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 16px; background: #fff; }
.qbot-qrFrame::before { content: ""; position: absolute; inset: 7px; z-index: 0; border: 1px solid color-mix(in srgb, var(--qbot-blue) 16%, var(--dsw-alias-border-l2, #dfe1e5)); border-radius: 12px; pointer-events: none; }
.qbot-qrSvg { position: relative; z-index: 1; width: 100%; height: 100%; }
.qbot-qrSvg svg { width: 100%; height: 100%; display: block; }
.qbot-qrFallback { position: relative; z-index: 1; display: grid; place-items: center; gap: 8px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 13px; line-height: 1.5; text-align: center; }
.qbot-qrPending { position: absolute; left: 10px; right: 10px; bottom: 10px; z-index: 2; padding: 5px 0; border-radius: 8px; color: var(--qbot-blue); background: rgb(255 255 255 / 92%); font-size: 12px; font-weight: 600; text-align: center; backdrop-filter: blur(3px); }
.qbot-countdown { width: 100%; margin: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: normal; }
.qbot-qrCopy { width: 100%; min-width: 0; display: flex; flex-direction: column; gap: 12px; overflow-wrap: anywhere; }
.qbot-qrCopy h3 { margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 18px; line-height: 1.35; font-weight: 650; }
.qbot-qrCopy > p { margin: 0; color: var(--dsw-alias-label-secondary, #646a73); line-height: 1.65; }
.qbot-qrLead { margin: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12.5px; line-height: 1.7; }

/* ── 添加机器人：页面层级（页头）───────────────────────────────────────── */
.qbot-addView { gap: 14px; }
/* 返回导航吸顶（添加页 / 详情页）：滚动时返回按钮（详情页含连接状态）常驻顶部 */
.qbot-addNav { position: sticky; top: 0; z-index: 40; display: flex; align-items: center; gap: 10px; margin: -2px 0 0; padding: 8px 2px 6px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-addHead { display: flex; flex-direction: column; gap: 5px; }
.qbot-addHead h2 { margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 19px; line-height: 1.35; font-weight: 700; }
.qbot-addHead p { max-width: 760px; margin: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12.5px; line-height: 1.75; }

/* ── 添加机器人：引导块（第二层层次）──────────────────────────────────── */
.qbot-manualPanel { gap: 16px; }
.qbot-copyHead { display: flex; flex-direction: column; gap: 5px; }
.qbot-copyHead h3 { margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 17px; line-height: 1.35; font-weight: 650; }
.qbot-copyHead p { max-width: 660px; margin: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12.5px; line-height: 1.7; }
.qbot-guideBlock { min-width: 0; display: flex; flex-direction: column; gap: 10px; padding: 14px 15px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-guideTitle { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; font-weight: 700; letter-spacing: .1em; }
.qbot-steps.is-rich { width: 100%; margin: 0; }
.qbot-steps.is-rich li { flex-direction: column; align-items: flex-start; gap: 2px; min-height: 0; padding: 2px 0 9px 36px; }
.qbot-steps.is-rich li:last-child { padding-bottom: 0; }
.qbot-steps.is-rich li strong { color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; font-weight: 650; line-height: 1.5; }
.qbot-steps.is-rich li > span { color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 1.7; }

/* ── 添加机器人：补充说明（第三层层次）────────────────────────────────── */
.qbot-noteList { min-width: 0; display: flex; flex-direction: column; gap: 7px; padding: 13px 15px; border: 1px dashed var(--dsw-alias-border-l2, #dfe1e5); border-radius: 10px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-noteTitle { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; font-weight: 700; letter-spacing: .1em; }
.qbot-noteList ul { display: flex; flex-direction: column; gap: 6px; margin: 0; padding: 0; list-style: none; }
.qbot-noteList li { position: relative; padding-left: 13px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 1.75; }
.qbot-noteList li::before { content: ""; position: absolute; left: 0; top: 9px; width: 4px; height: 4px; border-radius: 50%; background: var(--dsw-alias-border-l2, #c9cdd4); }

/* ── 扫码：二维码占位 + 操作区 ─────────────────────────────────────────── */
.qbot-qrPlaceholder { position: relative; z-index: 1; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 9px; text-align: center; color: var(--dsw-alias-label-secondary, #646a73); }
.qbot-qrPlaceholderIcon { display: grid; place-items: center; width: 54px; height: 54px; border-radius: 16px; color: var(--qbot-blue); background: color-mix(in srgb, var(--qbot-blue) 10%, transparent); }
.qbot-qrPlaceholderIcon svg { width: 28px; height: 28px; }
.qbot-qrPlaceholder strong { color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; font-weight: 650; }
.qbot-qrPlaceholderHint { font-size: 12px; line-height: 1.6; }
.qbot-qrActions { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 10px; }
.qbot-qrError { margin: 12px 0 0; color: var(--dsw-alias-state-error-primary, #d54941); font-size: 12px; line-height: 1.5; overflow-wrap: anywhere; }
.qbot-steps { margin: 18px 0 0; padding: 0; list-style: none; counter-reset: qbot-step; }
.qbot-steps li { position: relative; min-height: 28px; display: flex; align-items: center; padding: 5px 0 5px 36px; color: var(--dsw-alias-label-secondary, #646a73); line-height: 1.5; counter-increment: qbot-step; }
.qbot-steps li::before { content: counter(qbot-step); position: absolute; left: 0; top: 4px; width: 25px; height: 25px; display: grid; place-items: center; border-radius: 8px; color: #4d93f8; background: color-mix(in srgb, var(--qbot-blue) 16%, var(--dsw-alias-bg-layer-1, #fff)); font-size: 12px; font-weight: 650; }

/* ── 凭据表单（dim-credentialPanel / dim-credentialField）─────────────── */
.qbot-credentialPanel { display: grid; gap: 18px; }
.qbot-credentialTitle { margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 17px; line-height: 1.35; font-weight: 650; }
.qbot-credentialForm { min-width: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px 12px; }
.qbot-credentialActions { grid-column: 1 / -1; }
.qbot-field { min-width: 0; display: grid; gap: 7px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: normal; font-weight: 560; }
.qbot-input { width: 100%; min-width: 0; height: 38px; padding: 0 11px; border: 1px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 8px; outline: none; color: var(--dsw-alias-label-primary, #1f2329); background: var(--dsw-alias-bg-layer-1, #fff); font: 13px ui-monospace, SFMono-Regular, Menlo, monospace; transition: border-color .16s ease, box-shadow .16s ease; }
.qbot-input:focus { border-color: #4e5969; box-shadow: 0 0 0 3px rgb(78 89 105 / 10%); }
.qbot-input::placeholder { color: var(--dsw-alias-label-tertiary, #8f959e); font-family: inherit; }
select.qbot-input { cursor: pointer; font-family: inherit; }

/* ── 配置网格 ─────────────────────────────────────────────────────────── */
.qbot-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px 12px; }

/* ── 卡片层级：标题块 / 分组标签 ──────────────────────────────────────── */
.qbot-cardHead { display: flex; flex-direction: column; gap: 5px; }
.qbot-cardHead .qbot-cardTitle { margin: 0; }
.qbot-subLabel { margin: 8px 0 -6px; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; font-weight: 680; letter-spacing: .12em; }

/* ── 工作区路径字段 ───────────────────────────────────────────────────── */
.qbot-pathField { display: flex; align-items: stretch; gap: 8px; }
.qbot-pathBox { flex: 1 1 auto; min-width: 0; height: 34px; display: flex; align-items: center; padding: 0 12px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 8px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-pathText { overflow: hidden; color: var(--dsw-alias-label-primary, #1f2329); font: 12px ui-monospace, SFMono-Regular, Menlo, monospace; text-overflow: ellipsis; white-space: nowrap; }
.qbot-pathField .qbot-btn { flex: none; min-height: 34px; }

/* ── 高级选项折叠区（模仿 dsh-im dim-collapsibleAccount）──────────────── */
.qbot-collapsible { min-width: 0; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-collapsibleHead { min-width: 0; display: flex; align-items: center; gap: 10px; padding: 13px 15px; border-radius: 10px; cursor: pointer; user-select: none; -webkit-user-select: none; transition: background .15s ease; }
.qbot-collapsibleHead:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-collapsibleHead:focus-visible { outline: 2px solid var(--qbot-business); outline-offset: 2px; }
.qbot-collapsibleCopy { min-width: 0; flex: 1 1 auto; display: flex; flex-direction: column; gap: 2px; }
.qbot-collapsibleCopy strong { color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; line-height: normal; font-weight: 650; }
.qbot-collapsibleCopy span { overflow: hidden; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: normal; text-overflow: ellipsis; white-space: nowrap; }
.qbot-collapsibleChevron { flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; width: 9px; height: 9px; border-right: 1.6px solid var(--dsw-alias-label-tertiary, #8f959e); border-bottom: 1.6px solid var(--dsw-alias-label-tertiary, #8f959e); transform: rotate(-45deg); transition: transform .22s cubic-bezier(.4, 0, .2, 1); transform-origin: 50% 50%; }
.qbot-collapsible.is-open .qbot-collapsibleChevron { transform: rotate(45deg); }
.qbot-collapsibleBody { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .22s cubic-bezier(.4, 0, .2, 1); }
.qbot-collapsible.is-open > .qbot-collapsibleBody { grid-template-rows: 1fr; }
.qbot-collapsibleInner { min-height: 0; overflow: hidden; }
.qbot-collapsible:not(.is-open) .qbot-collapsibleInner { visibility: hidden; }
.qbot-collapsibleContent { display: flex; flex-direction: column; gap: 14px; padding: 2px 15px 15px; border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); padding-top: 14px; }

/* ── 目录选择弹窗 ─────────────────────────────────────────────────────── */
.qbot-modalOverlay { position: fixed; inset: 0; z-index: 9999; display: grid; place-items: center; padding: 24px; background: rgb(31 35 41 / 42%); backdrop-filter: blur(2px); animation: qbotFadeIn 0.16s ease-out; }
/* 自定义确认框：z-index 高于 modalOverlay，盖在任意打开的弹窗之上 */
.qbot-confirmOverlay { position: fixed; inset: 0; z-index: 10010; display: grid; place-items: center; padding: 24px; background: rgb(31 35 41 / 46%); backdrop-filter: blur(2px); animation: qbotFadeIn 0.16s ease-out; }
.qbot-confirmBox { width: min(420px, 92vw); display: flex; flex-direction: column; gap: 16px; padding: 18px 20px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 12px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 12px 40px rgb(31 35 41 / 18%); animation: qbotPopIn 0.16s ease-out; }
.qbot-confirmMsg { color: var(--dsw-alias-label-primary, #1f2329); font-size: 13.5px; line-height: 1.6; overflow-wrap: anywhere; white-space: pre-wrap; }
.qbot-confirmFoot { display: flex; justify-content: flex-end; gap: 10px; }
.qbot-modal { width: min(560px, 100%); height: min(72vh, 640px); display: flex; flex-direction: column; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 14px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 24px 64px rgb(31 35 41 / 24%); overflow: hidden; animation: qbotPopIn 0.18s ease-out; }
@keyframes qbotFadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes qbotPopIn { from { opacity: 0; transform: scale(0.97) translateY(6px); } to { opacity: 1; transform: none; } }
.qbot-modalHead { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 18px 20px 14px; }
.qbot-modalHead strong { color: var(--dsw-alias-label-primary, #1f2329); font-size: 16px; line-height: 1.4; font-weight: 650; }
.qbot-modalHead p { margin: 2px 0 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; }
.qbot-modalClose { flex: none; width: 28px; height: 28px; border: 0; border-radius: 8px; color: var(--dsw-alias-label-tertiary, #8f959e); background: transparent; font-size: 18px; line-height: 1; cursor: pointer; }
.qbot-modalClose:hover { color: var(--dsw-alias-label-primary, #1f2329); background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-modalPath { margin: 0 20px; padding: 8px 12px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 8px; color: var(--dsw-alias-label-primary, #1f2329); background: var(--dsw-alias-bg-module-platform, #f7f8fa); font-size: 12px; overflow-wrap: anywhere; }
.qbot-modalList { flex: 1 1 auto; min-height: 0; margin: 12px 20px 0; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; overflow: hidden; display: flex; flex-direction: column; }
/* 吸顶：tabs/notice 固定在面板头部，仅内层内容区滚动 */
.qbot-modalListScroll { flex: 1 1 auto; min-height: 0; overflow-y: auto; overscroll-behavior: contain; display: flex; flex-direction: column; gap: 2px; padding: 0 6px 6px; }
.qbot-dirRow { display: flex; align-items: center; gap: 10px; min-height: 38px; padding: 0 10px; border: 0; border-radius: 8px; color: var(--dsw-alias-label-primary, #1f2329); background: transparent; font: inherit; font-size: 13px; text-align: left; cursor: pointer; transition: background .12s ease; }
.qbot-dirRow.is-selected { background: var(--dsw-alias-bg-active, rgba(22, 119, 255, .14)); font-weight: 600; }
.qbot-dirRow:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-dirRow svg { flex: none; width: 16px; height: 16px; color: var(--qbot-business); }
.qbot-modalState { display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 96px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 13px; }
.qbot-modalError { color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-modalFoot { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding: 14px 20px 18px; }
/* 弹窗底部内联错误：常驻可见，不随弹窗内容滚动而移出视口 */
.qbot-footError { margin: 0; color: var(--dsw-alias-state-error-primary, #d54941); font-size: 12px; line-height: 1.6; overflow-wrap: anywhere; }
/* 宽弹窗：定时消息 / 消息归档 列表内容较长，放宽上限 */
.qbot-modalWide { width: min(760px, 100%); }
/* ── 概览第一行右侧操作区（定时消息 / 消息归档 入口） ── */
.qbot-heroActions { display: flex; align-items: center; gap: 8px; margin-left: auto; padding-left: 12px; flex: none; }
/* ── 定时消息弹窗：范围 Tab + 群聊/单聊分组 ── */
.qbot-schedTabs { display: flex; align-items: center; gap: 4px; padding: 10px 12px 8px; border-bottom: 1px solid var(--dsw-alias-border-l1, #eef0f3); background: var(--dsw-alias-bg-module-platform, #f7f8fa); border-radius: 9px 9px 0 0; flex: none; }
.qbot-schedTab { flex: none; padding: 5px 14px; border: 1px solid transparent; border-radius: 999px; background: transparent; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; cursor: pointer; }
.qbot-schedTab:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-schedTab.is-active { background: var(--dsw-alias-bg-layer-1, #fff); border-color: var(--dsw-alias-border-l2, #e5e6eb); color: var(--qbot-blue); font-weight: 600; box-shadow: 0 1px 2px rgb(31 35 41 / 6%); }
.qbot-schedAdd { margin-left: auto; padding: 4px 12px; font-size: 12px; }

/* 消息归档双栏：左月份文件 / 右记录内容 */
.qbot-modalAlert { flex: none; margin: 10px 20px 0; padding: 8px 12px; border-radius: 8px; background: var(--dsw-alias-state-error-bg, #fee9e7); color: var(--dsw-alias-state-error-primary, #d54941); font-size: 12px; font-weight: 600; }
.qbot-archSplit { flex: 1 1 auto; min-height: 140px; margin: 12px 20px 0; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; overflow: hidden; display: flex; }
.qbot-archSide { width: 176px; flex: none; overflow-y: auto; padding: 8px; border-right: 1px solid var(--dsw-alias-border-l1, #eef0f3); display: flex; flex-direction: column; gap: 4px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-archSideEmpty { padding: 10px 6px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; }
.qbot-archMonth { display: flex; align-items: center; gap: 2px; border-radius: 8px; }
.qbot-archMonth.is-active { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-archMonthBtn { flex: 1; min-width: 0; display: flex; align-items: center; justify-content: space-between; gap: 6px; padding: 6px 8px; border: 0; border-radius: 8px; background: transparent; color: inherit; font-size: 12px; cursor: pointer; text-align: left; }
.qbot-archMonthBtn:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-archMonth.is-active .qbot-archMonthBtn:hover { background: transparent; }
.qbot-archMonthName { font-family: var(--dsw-alias-font-mono, ui-monospace, monospace); font-weight: 600; }
.qbot-archMonth.is-active .qbot-archMonthName { color: var(--qbot-blue); }
.qbot-archMonthCount { color: var(--dsw-alias-label-secondary, #646a73); font-size: 11px; }
.qbot-archMonthDel { flex: none; width: 20px; height: 20px; padding: 0; border: 0; border-radius: 6px; background: transparent; color: var(--dsw-alias-label-secondary, #646a73); font-size: 13px; line-height: 1; cursor: pointer; opacity: 0; }
.qbot-archMonth:hover .qbot-archMonthDel, .qbot-archMonthDel:focus-visible { opacity: 1; }
.qbot-archMonthDel:hover { background: var(--dsw-alias-state-error-bg, #fee9e7); color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-archMain { flex: 1; min-width: 0; overflow-y: auto; padding: 10px 12px; display: flex; flex-direction: column; gap: 2px; }
.qbot-schedGroup { display: flex; flex-direction: column; gap: 6px; padding: 8px 12px 4px; }
.qbot-schedGroupTitle { display: flex; align-items: center; gap: 8px; margin: 4px 0 2px; font-size: 12px; font-weight: 600; color: var(--dsw-alias-label-secondary, #646a73); }
.qbot-schedGroupTitle[data-scope="group"] { color: var(--qbot-blue); }
.qbot-schedGroupTitle::after { content: ""; flex: 1; height: 1px; background: var(--dsw-alias-border-l1, #eef0f3); }
.qbot-schedCount { flex: none; min-width: 20px; text-align: center; padding: 0 6px; border-radius: 999px; background: var(--dsw-alias-interactive-bg-hover, #eef0f3); color: var(--dsw-alias-label-secondary, #646a73); font-size: 11px; font-weight: 600; }
/* 定时消息行：任务卡片式（类型徽标 + 内容 + 元信息 + 删除） */
.qbot-schedRow { display: flex; align-items: flex-start; gap: 12px; padding: 10px 12px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-schedMain { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
.qbot-schedTop { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.qbot-chipWarn { color: var(--dsw-alias-state-warn-primary, #d97706); }
.qbot-schedContent { color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; line-height: 1.5; overflow-wrap: anywhere; white-space: pre-wrap; }
.qbot-schedMeta { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 12px; }
.qbot-schedError { color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-schedRemove { flex: none; }
/* 行内操作列：测试 / 启用禁用 / 编辑 / 删除 横向排布、可换行，紧凑对齐 */
.qbot-schedOps { display: flex; flex-direction: row; flex-wrap: wrap; gap: 6px; flex: none; align-self: center; }
.qbot-schedOps .qbot-btn { padding: 4px 12px; font-size: 12px; }
.qbot-schedTest { border-color: color-mix(in srgb, var(--qbot-business) 42%, transparent); color: var(--qbot-business); }
.qbot-schedTest:hover:not(:disabled) { background: color-mix(in srgb, var(--qbot-business) 10%, transparent); }
.qbot-schedTest:disabled { opacity: .6; cursor: default; }
/* 测试执行结果横幅（列表顶部） */
.qbot-schedNotice { margin: 8px 8px 0; padding: 8px 12px; border-radius: 8px; font-size: 12px; line-height: 1.5; border: 1px solid color-mix(in srgb, var(--qbot-business) 34%, transparent); background: color-mix(in srgb, var(--qbot-business) 8%, transparent); color: var(--qbot-business); flex: none; }
.qbot-schedNotice.is-error { border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 34%, transparent); background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 8%, transparent); color: var(--dsw-alias-state-error-primary, #d54941); }
/* 列表卡片：悬浮反馈 + 左侧色条强化层次 */
.qbot-schedRow { position: relative; transition: border-color .15s ease, box-shadow .15s ease; }
.qbot-schedRow:hover { border-color: var(--dsw-alias-border-l2, #e5e6eb); box-shadow: 0 2px 8px rgb(31 35 41 / 6%); }
.qbot-schedEdit { padding: 4px 12px; font-size: 12px; }
.qbot-schedRemove { padding: 4px 12px; font-size: 12px; }
/* 禁用态：虚线边框 + 左侧内容降透明，让「不会再执行」一眼可辨 */
.qbot-schedRow.is-disabled { background: var(--dsw-alias-bg-layer-1, #fff); border-style: dashed; }
.qbot-schedRow.is-disabled .qbot-schedMain { opacity: .55; }
.qbot-schedRow.is-disabled .qbot-chip.is-active { border-color: var(--dsw-alias-border-l2, #e5e6eb); color: var(--dsw-alias-label-tertiary, #8f959e); background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-schedRow.is-failed { border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 45%, transparent); background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 6%, var(--dsw-alias-bg-module-platform, #f7f8fa)); }
.qbot-schedRow.is-failed .qbot-schedError { font-weight: 600; }
.qbot-chipOff { border-color: color-mix(in srgb, var(--dsw-alias-state-warn-primary, #d97706) 34%, transparent); color: var(--dsw-alias-state-warn-primary, #d97706); background: color-mix(in srgb, var(--dsw-alias-state-warn-primary, #d97706) 10%, transparent); }
.qbot-schedToggle { padding: 4px 12px; font-size: 12px; }
.qbot-schedToggle.is-off { border-color: color-mix(in srgb, var(--qbot-business) 32%, transparent); color: var(--qbot-business); }
/* AI 脚本生成状态条（编辑表单内） */
.qbot-schedGen { padding: 8px 12px; border-radius: 8px; font-size: 12px; line-height: 1.5; overflow-wrap: anywhere; }
.qbot-schedGen.is-pending { border: 1px solid color-mix(in srgb, var(--dsw-alias-state-warn-primary, #d97706) 34%, transparent); background: color-mix(in srgb, var(--dsw-alias-state-warn-primary, #d97706) 8%, transparent); color: var(--dsw-alias-state-warn-primary, #d97706); }
.qbot-schedGen.is-done { border: 1px solid color-mix(in srgb, var(--qbot-business) 28%, transparent); background: color-mix(in srgb, var(--qbot-business) 8%, transparent); color: var(--qbot-business); }
.qbot-schedGen.is-error { border: 1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 34%, transparent); background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 8%, transparent); color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-chipInfo { border-color: color-mix(in srgb, var(--qbot-business) 32%, transparent); color: var(--qbot-business); background: color-mix(in srgb, var(--qbot-business) 10%, transparent); }
.qbot-chipError { border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 34%, transparent); color: var(--dsw-alias-state-error-primary, #d54941); background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 10%, transparent); }
.qbot-schedContent.qbot-mono, .qbot-schedCmd .qbot-textarea { font-family: var(--dsw-alias-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace); }
/* ── 定时编辑表单：三步分区（发送给谁 / 什么时候 / 做什么） ── */
.qbot-schedForm { gap: 0; }
.qbot-schedSection { padding: 14px 16px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 12px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-schedSection + .qbot-schedSection { margin-top: 12px; }
.qbot-schedSectionHead { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; padding-bottom: 10px; margin-bottom: 12px; border-bottom: 1px dashed var(--dsw-alias-border-l1, #eef0f3); }
.qbot-schedSectionTitle { font-size: 13.5px; font-weight: 650; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-schedSectionDesc { font-size: 12px; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-schedSectionBody { display: flex; flex-direction: column; gap: 14px; }
.qbot-schedFieldRow { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 16px; }
.qbot-schedFieldCol { display: flex; flex-direction: column; gap: 14px; }
@media (max-width: 640px) {
  .qbot-schedFieldRow { grid-template-columns: 1fr; }
}
/* 触发条件分段按钮 */
.qbot-schedSeg { display: inline-flex; gap: 4px; padding: 3px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-segBtn { padding: 5px 14px; border: 1px solid transparent; border-radius: 8px; background: transparent; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12.5px; cursor: pointer; transition: background .15s ease, color .15s ease; }
.qbot-segBtn:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-segBtn.is-on { background: var(--dsw-alias-bg-layer-1, #fff); border-color: var(--dsw-alias-border-l2, #e5e6eb); color: var(--qbot-business); font-weight: 600; box-shadow: 0 1px 2px rgb(31 35 41 / 6%); }
/* 星期过滤：按钮 + 快捷 + 当前结果 */
.qbot-weekdayPicker { display: flex; flex-direction: column; gap: 8px; }
.qbot-weekdayRow { display: flex; gap: 6px; }
.qbot-weekdayBtn { width: 34px; height: 32px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 8px; background: var(--dsw-alias-bg-layer-1, #fff); color: var(--dsw-alias-label-secondary, #646a73); font-size: 13px; cursor: pointer; transition: background .12s ease, color .12s ease, border-color .12s ease; }
.qbot-weekdayBtn:hover { border-color: color-mix(in srgb, var(--qbot-business) 45%, transparent); }
.qbot-weekdayBtn.is-on { background: var(--qbot-business); border-color: var(--qbot-business); color: #fff; font-weight: 600; box-shadow: 0 1px 3px rgb(31 35 41 / 12%); }
.qbot-weekdayQuick { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.qbot-weekdayHint { font-size: 12px; color: var(--dsw-alias-label-tertiary, #8f959e); }
/* 通用小按钮（快捷值 / 模板） */
.qbot-miniBtn { flex: none; padding: 3px 10px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 999px; background: var(--dsw-alias-bg-layer-1, #fff); color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; cursor: pointer; transition: background .12s ease, color .12s ease, border-color .12s ease; }
.qbot-miniBtn:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-miniBtn.is-on { border-color: color-mix(in srgb, var(--qbot-business) 40%, transparent); color: var(--qbot-business); background: color-mix(in srgb, var(--qbot-business) 10%, transparent); font-weight: 600; }
/* 快捷值行 */
.qbot-schedPresets { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.qbot-schedPresetLabel { font-size: 12px; color: var(--dsw-alias-label-tertiary, #8f959e); }
/* 数字输入 + 单位 */
.qbot-schedNumber { display: flex; align-items: center; gap: 8px; }
.qbot-schedNumber .qbot-input { width: 110px; }
.qbot-schedUnit { font-size: 12px; color: var(--dsw-alias-label-tertiary, #8f959e); }
/* cron 预览 */
.qbot-schedPreview { padding: 7px 12px; border: 1px solid color-mix(in srgb, var(--qbot-business) 30%, transparent); border-left: 3px solid var(--qbot-business); border-radius: 8px; background: color-mix(in srgb, var(--qbot-business) 8%, transparent); color: var(--dsw-alias-label-primary, #1f2329); font-size: 12.5px; }
.qbot-schedPreview.is-warn { border-color: var(--dsw-alias-state-warn-primary, #d97706); border-left-color: var(--dsw-alias-state-warn-primary, #d97706); background: color-mix(in srgb, var(--dsw-alias-state-warn-primary, #d97706) 10%, transparent); }
/* 时区：下拉 + 自定义输入 */
.qbot-schedTz { display: flex; flex-direction: column; gap: 6px; }
.qbot-schedTz .qbot-settingSelect { max-width: 100%; }
/* 命令编辑区 */
.qbot-schedCmd { display: flex; flex-direction: column; gap: 8px; }
.qbot-schedCmd .qbot-textarea { resize: vertical; }
/* ── 定时消息编辑表单：标签 + 控件 + 提示 三行式 ── */
.qbot-editForm { display: flex; flex-direction: column; gap: 14px; padding: 14px 16px 18px; }
/* 定时消息编辑视图：编辑表单放在无边的 modalBody 里，与带边框的列表容器区分 */
.qbot-modalBody { flex: 1 1 auto; min-height: 140px; margin: 12px 20px 0; overflow: hidden; display: flex; flex-direction: column; }
.qbot-modalBody .qbot-editForm { flex: 1 1 auto; min-height: 0; overflow-y: auto; padding: 4px 2px 10px; overscroll-behavior: contain; }
.qbot-editGrid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 16px; }
.qbot-editRow { display: flex; flex-direction: column; gap: 4px; }
.qbot-editLabel { font-size: 13px; font-weight: 600; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-editHint { font-size: 12px; line-height: 1.5; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-editActions { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-top: 2px; }
/* ── 归档时间轴：左竖线 + 节点圆点；用户蓝气泡靠左、机器人灰气泡靠右 ── */
.qbot-timeline { position: relative; display: flex; flex-direction: column; gap: 14px; padding: 6px 4px 6px 30px; }
.qbot-timeline::before { content: ""; position: absolute; left: 10px; top: 0; bottom: 0; width: 2px; border-radius: 1px; background: var(--dsw-alias-border-l2, #e5e6eb); }
.qbot-tlItem { position: relative; }
.qbot-tlDot { position: absolute; left: -25px; top: 26px; width: 10px; height: 10px; border-radius: 50%; background: var(--dsw-alias-label-tertiary, #8f959e); box-shadow: 0 0 0 3px var(--dsw-alias-bg-layer-1, #fff); }
.qbot-tlItem.is-user .qbot-tlDot { background: var(--qbot-blue); }
.qbot-tlBody { display: flex; flex-direction: column; gap: 4px; max-width: 84%; }
.qbot-tlItem.is-user .qbot-tlBody { align-items: flex-start; }
.qbot-tlItem.is-bot .qbot-tlBody { margin-left: auto; align-items: flex-end; }
.qbot-tlMeta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 11px; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-tlRole { font-weight: 650; color: var(--dsw-alias-label-secondary, #646a73); }
.qbot-tlItem.is-user .qbot-tlRole { color: var(--qbot-blue); }
.qbot-tlBubble { padding: 8px 12px; border-radius: 12px; font-size: 13px; line-height: 1.55; overflow-wrap: anywhere; white-space: pre-wrap; color: var(--dsw-alias-label-primary, #1f2329); }
/* Markdown 可视化：块级元素排版（转义后的受控 HTML，非用户可写标签） */
.qbot-tlBubble.qbot-md { white-space: normal; }
.qbot-tlBubble.qbot-md > :first-child { margin-top: 0; }
.qbot-tlBubble.qbot-md > :last-child { margin-bottom: 0; }
.qbot-tlBubble.qbot-md p { margin: 4px 0; }
.qbot-tlBubble.qbot-md h3, .qbot-tlBubble.qbot-md h4, .qbot-tlBubble.qbot-md h5, .qbot-tlBubble.qbot-md h6 { margin: 8px 0 4px; font-size: 13.5px; line-height: 1.4; font-weight: 650; }
.qbot-tlBubble.qbot-md ul, .qbot-tlBubble.qbot-md ol { margin: 4px 0; padding-left: 20px; }
.qbot-tlBubble.qbot-md li { margin: 2px 0; }
.qbot-tlBubble.qbot-md blockquote { margin: 4px 0; padding: 2px 10px; border-left: 3px solid var(--dsw-alias-border-l2, #e5e6eb); color: var(--dsw-alias-label-secondary, #646a73); }
.qbot-tlBubble.qbot-md code { padding: 1px 5px; border-radius: 5px; background: color-mix(in srgb, var(--dsw-alias-label-primary, #1f2329) 8%, transparent); font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 12px; }
.qbot-tlBubble.qbot-md pre { margin: 6px 0; padding: 8px 10px; border-radius: 8px; background: color-mix(in srgb, var(--dsw-alias-label-primary, #1f2329) 6%, transparent); overflow-x: auto; }
.qbot-tlBubble.qbot-md pre code { padding: 0; background: transparent; font-size: 12px; line-height: 1.5; }
.qbot-tlBubble.qbot-md a { color: var(--qbot-blue); text-decoration: none; }
.qbot-tlBubble.qbot-md a:hover { text-decoration: underline; }
.qbot-tlBubble.qbot-md strong { font-weight: 650; }
.qbot-tlBubble.qbot-md del { opacity: 0.65; }
/* 用户：蓝色高亮气泡（左） */
.qbot-tlItem.is-user .qbot-tlBubble { background: color-mix(in srgb, var(--qbot-blue) 9%, var(--dsw-alias-bg-layer-1, #fff)); border: 1px solid color-mix(in srgb, var(--qbot-blue) 32%, transparent); border-top-left-radius: 4px; }
/* 机器人：中性灰气泡（右） */
.qbot-tlItem.is-bot .qbot-tlBubble { background: var(--dsw-alias-bg-module-platform, #f7f8fa); border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-top-right-radius: 4px; }
.qbot-tlNote { font-size: 11px; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-tlSystem { position: relative; text-align: center; font-size: 12px; color: var(--dsw-alias-label-tertiary, #8f959e); padding: 2px 0; }

/* ── 开关行（dim-contextSwitchRow / dim-contextSwitch）────────────────── */
.qbot-switches { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 3px 24px; }
.qbot-switchRow { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 34px; cursor: pointer; }
.qbot-switchText { min-width: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; line-height: normal; }
.qbot-switch { appearance: none; flex: none; width: 32px; height: 19px; margin: 0; border: 1px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 12px; background: var(--dsw-alias-interactive-bg-hover, #eef0f3); cursor: pointer; transition: background .16s ease, border-color .16s ease; }
.qbot-switch::before { content: ""; display: block; width: 13px; height: 13px; margin: 2px; border-radius: 50%; background: var(--dsw-alias-label-secondary, #646a73); transition: transform .16s ease, background .16s ease; }
.qbot-switch:checked { border-color: var(--qbot-business); background: var(--qbot-business); }
.qbot-switch:checked::before { transform: translateX(13px); background: #fff; }

/* ── 按钮（dim-viewActions / dim-cardActions / dim-updateButton）──────── */
.qbot-viewActions { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; }
.qbot-cardActions { display: flex; align-items: center; justify-content: flex-end; flex-wrap: wrap; gap: 8px; margin: 0; padding-top: 6px; border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
.qbot-btn { min-height: 34px; display: inline-flex; align-items: center; justify-content: center; padding: 0 13px; border: 1px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 8px; color: var(--dsw-alias-label-primary, #1f2329); background: var(--dsw-alias-bg-layer-1, #fff); font: inherit; font-size: 13px; font-weight: 560; line-height: normal; white-space: nowrap; cursor: pointer; transition: border-color .15s ease, background .15s ease, color .15s ease; }
.qbot-btn:hover:not(:disabled) { border-color: #aeb3bb; background: var(--dsw-alias-interactive-bg-hover, #f7f8fa); }
.qbot-btn:focus-visible { outline: 2px solid color-mix(in srgb, var(--qbot-blue) 62%, white); outline-offset: 2px; }
.qbot-btn:disabled { opacity: .55; cursor: default; }
.qbot-btnPrimary, .qbot-btnPrimary:hover:not(:disabled) { border-color: var(--qbot-blue); color: #fff; background: var(--qbot-blue); }
.qbot-btnPrimary:hover:not(:disabled) { border-color: var(--qbot-blue-dark); background: var(--qbot-blue-dark); }
.qbot-btnDanger { color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-btnDanger:hover:not(:disabled) { border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 40%, var(--dsw-alias-border-l2, #dfe1e5)); background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 7%, var(--dsw-alias-bg-layer-1, #fff)); }

/* ── KV 网格（dim-updateVersions）─────────────────────────────────────── */
.qbot-kv { display: grid; grid-template-columns: max-content minmax(0, 1fr); gap: 8px 18px; margin: 0; font-size: 12px; line-height: 18px; }
.qbot-kv > div { display: contents; }
.qbot-kv dt { color: var(--dsw-alias-label-secondary, #646a73); white-space: nowrap; }
.qbot-kv dd { min-width: 0; margin: 0; overflow-wrap: anywhere; }
.qbot-mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }

/* ── 双卡并排 / 加载 ──────────────────────────────────────────────────── */
.qbot-cardPair { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 12px; align-items: start; }
.qbot-spinner { width: 24px; height: 24px; border: 3px solid var(--dsw-alias-border-l2, #e6e8eb); border-top-color: var(--qbot-blue); border-radius: 50%; animation: qbot-spin .8s linear infinite; }
@keyframes qbot-spin { to { transform: rotate(360deg); } }

/* ── 扫码倒计时（dim-countdown / dim-progress）────────────────────────── */
.qbot-qrFrame img { position: relative; z-index: 1; width: 100%; height: 100%; display: block; image-rendering: pixelated; }
.qbot-countdown { width: 100%; margin: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: normal; }
.qbot-countdownTop { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 6px; }
.qbot-countdownTop strong { color: var(--dsw-alias-label-primary, #1f2329); font-variant-numeric: tabular-nums; }
.qbot-progress { height: 4px; overflow: hidden; margin: 0; border-radius: 99px; background: var(--dsw-alias-bg-module-platform, #eef0f3); }
.qbot-progress span { display: block; width: var(--qbot-progress, 100%); height: 100%; border-radius: 99px; background: var(--qbot-blue); transition: width 1s linear; }

/* ── 账号卡折叠头（dim-collapsibleAccount 头部 + dim-botCardTools）────── */
.qbot-accountHead { min-width: 0; display: flex; align-items: center; gap: 12px; padding: 14px 16px; cursor: pointer; user-select: none; -webkit-user-select: none; }
.qbot-accountHead:hover { background: var(--dsw-alias-interactive-bg-hover, #f7f8fa); }
.qbot-accountHead:focus-visible { outline: 2px solid var(--qbot-business); outline-offset: -2px; border-radius: 14px; }
.qbot-accountTools { min-width: 0; flex: 1 1 auto; display: flex; align-items: center; justify-content: flex-end; gap: 12px; }
.qbot-healthGroup { min-width: 0; display: grid; justify-items: end; gap: 3px; }


/* ── 高级选项行（dim-contextEnhancement 行样式）───────────────────────── */
.qbot-enhanceRow { border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 9px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-enhanceRow > .qbot-collapsibleHead { padding: 10px 12px; border-radius: 9px; gap: 8px; }
.qbot-enhanceLead { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 8px; color: var(--qbot-business); background: color-mix(in srgb, var(--qbot-business) 10%, transparent); }
.qbot-enhanceLead svg { width: 15px; height: 15px; }
.qbot-enhanceRow .qbot-collapsibleHead strong { flex: 1 1 auto; color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; font-weight: 650; }
.qbot-enhanceChip { flex: none; padding: 2px 8px; border-radius: 999px; color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-bg-layer-1, #fff); border: 1px solid var(--dsw-alias-border-l1, #eef0f3); font-size: 11px; white-space: nowrap; }
.qbot-enhanceRow .qbot-collapsibleContent { padding: 2px 12px 12px; }

/* ── 底部操作（dim-cardFooter / dim-cardSummary）──────────────────────── */
.qbot-cardFooter { display: flex; align-items: center; justify-content: flex-end; gap: 10px; margin-top: 6px; padding-top: 12px; border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
.qbot-cardSummary { min-width: 0; color: var(--dsw-alias-label-secondary, #646a73); font: inherit; font-size: 12px; font-weight: 400; line-height: normal; overflow-wrap: anywhere; white-space: normal; }

/* ── 详情页：顶部导航 ─────────────────────────────────────────────────── */
.qbot-detailNav { position: sticky; top: 0; z-index: 40; display: flex; align-items: center; gap: 14px; margin: -2px 0 0; padding: 8px 2px 6px; background: var(--dsw-alias-bg-layer-1, #fff); }
/* 吸顶导航条（详情页）：返回 + 机器人身份（图标/编号/启用状态/连接状态）常驻顶部 */
.qbot-detailIdentity { min-width: 0; display: flex; align-items: center; gap: 9px; }
.qbot-detailAvatar { flex: none; width: 28px; height: 28px; display: grid; place-items: center; border-radius: 9px; color: #fff; background: linear-gradient(140deg, #3d8bff, var(--qbot-blue-dark)); }
.qbot-detailAvatar svg { width: 17px; height: 17px; }
.qbot-detailIdentity > strong { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--dsw-alias-label-primary, #1f2329); font-size: 15px; line-height: normal; font-weight: 700; }
/* 吸顶导航条右侧的连接状态胶囊：推到行尾，滚动时始终可见 */
.qbot-detailNavState { margin-left: auto; }

/* ── 详情页：概览横幅 ─────────────────────────────────────────────────── */
.qbot-hero { position: relative; overflow: hidden; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 14px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 1px 2px rgb(31 35 41 / 3%); }
.qbot-hero::before { content: ""; position: absolute; inset: 0 0 auto; height: 3px; background: linear-gradient(90deg, var(--qbot-blue), color-mix(in srgb, var(--qbot-blue) 25%, transparent)); }
.qbot-heroMain { display: flex; align-items: center; gap: 14px; padding: 20px 20px 14px; }
.qbot-heroAvatar { flex: none; width: 52px; height: 52px; display: grid; place-items: center; border-radius: 16px; color: #fff; background: linear-gradient(140deg, #3d8bff, var(--qbot-blue-dark)); box-shadow: 0 8px 20px rgb(22 119 255 / 22%); }
.qbot-heroAvatar svg { width: 30px; height: 30px; }
.qbot-heroIdentity { min-width: 0; flex: 1 1 auto; display: flex; flex-direction: column; gap: 6px; }
.qbot-heroNameRow { min-width: 0; display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
.qbot-heroNameRow h2 { margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font: 700 18px/1.3 ui-monospace, SFMono-Regular, Menlo, monospace; overflow-wrap: anywhere; }
.qbot-chip { flex: none; padding: 2px 9px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 999px; color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-bg-module-platform, #f7f8fa); font-size: 11px; font-weight: 600; line-height: 17px; white-space: nowrap; }
.qbot-chip.is-active { border-color: color-mix(in srgb, var(--qbot-business) 32%, transparent); color: var(--qbot-business); background: color-mix(in srgb, var(--qbot-business) 10%, transparent); }
.qbot-heroMeta { display: flex; align-items: center; gap: 8px; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 12px; line-height: normal; }
.qbot-metaDot { width: 3px; height: 3px; border-radius: 50%; background: currentColor; opacity: .6; }
.qbot-heroStats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1px; margin: 0 20px 20px; padding: 1px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-border-l1, #eef0f3); overflow: hidden; }
.qbot-heroStat { min-width: 0; display: flex; flex-direction: column; gap: 5px; padding: 11px 14px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-heroStatLabel { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; font-weight: 600; letter-spacing: .06em; }
.qbot-heroStatValue { display: flex; align-items: center; gap: 7px; color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; font-weight: 650; line-height: normal; }
.qbot-heroFoot { margin: 0 20px 18px; padding: 10px 13px; border: 1px solid color-mix(in srgb, var(--dsw-alias-state-warn-primary, #d97706) 24%, var(--dsw-alias-border-l2, #dfe1e5)); border-radius: 9px; color: var(--dsw-alias-label-secondary, #646a73); background: color-mix(in srgb, var(--dsw-alias-state-warn-primary, #d97706) 7%, var(--dsw-alias-bg-layer-1, #fff)); font-size: 12px; line-height: 1.6; overflow-wrap: anywhere; }

/* ── 详情页：分区卡片（第一层层次，details/summary 折叠）──────────────── */
.qbot-section { border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 14px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 1px 2px rgb(31 35 41 / 3%); overflow: hidden; }
.qbot-section.is-danger { border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 26%, var(--dsw-alias-border-l2, #e5e6eb)); }
.qbot-section > summary.qbot-sectionHead { cursor: pointer; list-style: none; user-select: none; }
/* 分区头部操作按钮组（如运行统计的 刷新/复位）：并排靠右 */
.qbot-sectionActions { display: flex; align-items: center; justify-content: flex-end; gap: 8px; flex-wrap: wrap; }
.qbot-section > summary.qbot-sectionHead::-webkit-details-marker { display: none; }
.qbot-section:not([open]) > summary.qbot-sectionHead { border-bottom-color: transparent; }
.qbot-sectionChevron { flex: none; align-self: center; margin-left: auto; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 13px; line-height: 1; transition: transform .18s ease; }
.qbot-sectionAction + .qbot-sectionChevron { margin-left: 0; }
.qbot-section > summary.qbot-sectionHead:hover .qbot-sectionTitle h3 { color: color-mix(in srgb, var(--dsw-alias-brand-primary, #4e5969) 72%, var(--dsw-alias-label-primary, #1f2329)); }
.qbot-section[open] > summary.qbot-sectionHead .qbot-sectionChevron { transform: rotate(90deg); }
.qbot-sectionHead { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; padding: 16px 20px 13px; border-bottom: 1px solid var(--dsw-alias-border-l1, #eef0f3); background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-sectionTitle { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.qbot-sectionTitle h3 { margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 15px; line-height: normal; font-weight: 680; }
.qbot-sectionTitle p { margin: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 1.6; }
.qbot-section.is-danger .qbot-sectionTitle h3 { color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-sectionAction { flex: none; display: flex; align-items: center; gap: 8px; }
.qbot-sectionBody { min-width: 0; padding: 14px 20px 18px; background: var(--dsw-alias-bg-layer-1, #fff); }

/* ── 详情页：设置行列表（第二层层次）─────────────────────────────────── */
.qbot-settingList { display: flex; flex-direction: column; gap: 8px; }
.qbot-settingRow { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; column-gap: 16px; row-gap: 8px; padding: 12px 14px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); transition: border-color .15s ease, background .15s ease; }
.qbot-settingRow:hover { border-color: var(--dsw-alias-border-l2, #dfe1e5); }
.qbot-settingCopy { min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.qbot-settingTitle { color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; font-weight: 650; line-height: normal; }
.qbot-settingDesc { min-width: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 1.65; }
.qbot-settingControl { flex: none; display: flex; align-items: center; justify-content: flex-end; min-width: 190px; }
.qbot-settingSelect { width: 100%; min-width: 0; max-width: 260px; height: 34px; padding: 0 9px; border: 1px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 8px; outline: none; color: var(--dsw-alias-label-primary, #1f2329); background: var(--dsw-alias-bg-layer-1, #fff); font: inherit; font-size: 13px; cursor: pointer; transition: border-color .16s ease, box-shadow .16s ease; }
.qbot-settingSelect:focus { border-color: #4e5969; box-shadow: 0 0 0 3px rgb(78 89 105 / 10%); }

/* 文本输入设置行（textarea）：说明在上、输入框通栏在下，长文本不再被窄框截断 */
.qbot-settingRow.is-wide { grid-template-columns: minmax(0, 1fr); }
.qbot-settingControl.is-wide { width: 100%; min-width: 0; justify-content: stretch; }
.qbot-settingControl.is-wide > .qbot-textarea { width: 100%; }
.qbot-textarea { display: block; width: 100%; min-width: 0; min-height: 56px; max-height: 240px; padding: 8px 11px; border: 1px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 8px; outline: none; resize: vertical; color: var(--dsw-alias-label-primary, #1f2329); background: var(--dsw-alias-bg-layer-1, #fff); font: inherit; font-size: 13px; line-height: 1.6; transition: border-color .16s ease, box-shadow .16s ease; }
.qbot-textarea:focus { border-color: #4e5969; box-shadow: 0 0 0 3px rgb(78 89 105 / 10%); }
.qbot-textarea::placeholder { color: var(--dsw-alias-label-tertiary, #8f959e); font-family: inherit; }

/* ── 详情页：工作区卡片 ───────────────────────────────────────────────── */
.qbot-workspaceCard { min-width: 0; display: flex; flex-direction: column; gap: 9px; padding: 13px 14px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-workspaceCardHead { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; column-gap: 16px; row-gap: 8px; }
.qbot-workspacePath { min-width: 0; display: block; padding: 8px 11px; border: 1px dashed var(--dsw-alias-border-l2, #dfe1e5); border-radius: 8px; color: var(--dsw-alias-label-primary, #1f2329); background: var(--dsw-alias-bg-layer-1, #fff); font: 12px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace; overflow-wrap: anywhere; }

/* ── 详情页：运行统计指标卡 ───────────────────────────────────────────── */
.qbot-metricGrid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
.qbot-metric { min-width: 0; display: flex; flex-direction: column; gap: 5px; padding: 12px 13px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-left: 3px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 10px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-metric[data-tone="success"] { border-left-color: var(--dsw-alias-state-success-primary, #20a162); }
.qbot-metric[data-tone="warning"] { border-left-color: var(--dsw-alias-state-warn-primary, #d97706); }
.qbot-metric[data-tone="error"] { border-left-color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-metricLabel { color: var(--dsw-alias-label-secondary, #646a73); font-size: 11px; line-height: normal; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.qbot-metricValue { color: var(--dsw-alias-label-primary, #1f2329); font-size: 19px; line-height: 1.2; font-weight: 700; font-variant-numeric: tabular-nums; }
.qbot-metric[data-tone="error"] .qbot-metricValue { color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-metric[data-tone="warning"] .qbot-metricValue { color: var(--dsw-alias-state-warn-primary, #d97706); }

/* ── 响应式 ───────────────────────────────────────────────────────────── */
@media (max-width: 900px) {
  .qbot-metricGrid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 760px) {
  .qbot-emptyView { grid-template-columns: 1fr; }
  .qbot-emptyBrand { display: none; }
  .qbot-credentialForm, .qbot-grid, .qbot-switches { grid-template-columns: 1fr; }
  .qbot-heroStats { grid-template-columns: 1fr; }
  .qbot-heroMain { flex-wrap: wrap; }
  .qbot-sectionHead { flex-direction: column; align-items: stretch; }
  .qbot-settingRow, .qbot-workspaceCardHead { grid-template-columns: minmax(0, 1fr); }
  .qbot-settingControl { justify-content: flex-start; min-width: 0; }
  .qbot-settingSelect { max-width: none; }
}
@media (pointer: coarse) {
  .qbot-segTabs button, .qbot-switchRow { min-height: 44px; }
}
`;
