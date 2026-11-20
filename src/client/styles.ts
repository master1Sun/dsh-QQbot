/**
 * 设置界面样式表（原 index.tsx 内联 CSS_TEXT，整段搬移未做修改）：
 * 对齐 @xmanrui/dsh-im 的 --dsw-alias-* 设计令牌（含浅色回退）。
 */
/**
 * 样式完全对齐 @xmanrui/dsh-im 的 plugin-src/client/styles.js：
 * 同一套 --dsw-alias-* 设计令牌（含浅色回退）、同样的圆角/阴影/字号/间距/交互态。
 */
export const CSS_TEXT = `
/* 品牌令牌放到 :root，保证右侧面板（不在 .qbot-page 内）也能解析，
   按钮/强调色在深色与浅色下都正确。宿主若定义 --dsw-alias-* 则在各自作用域覆盖。 */
:root {
  --qbot-blue: #1677ff;
  --qbot-blue-dark: #0958d9;
  --qbot-business: var(--dsw-alias-state-business-primary, #3370ff);
}

.qbot-page {
  --qbot-blue: #1677ff;
  --qbot-blue-dark: #0958d9;
  --qbot-business: var(--dsw-alias-state-business-primary, #3370ff);
  /* 铺满设置面板宽度：不再限 max-width，避免右侧大片空白（对齐词库设置页改法） */
  width: 100%;
  padding: 2px 0 30px;
  color: var(--dsw-alias-label-primary, #1f2329);
  box-sizing: border-box;
}
.qbot-page *, .qbot-page *::before, .qbot-page *::after { box-sizing: border-box; }

/* ── 页面底部页脚：常规软件 About 风格（细分隔线 + 居中 + 低调链接） ── */
.qbot-pageFoot { margin: 10px 2px 0; padding: 12px 8px 2px; border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); color: var(--dsw-alias-label-tertiary, #8f959e); text-align: center; }
.qbot-pageFootBody { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 4px 10px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 11.5px; line-height: 1.5; }
.qbot-pageFootDot { color: var(--dsw-alias-border-l2, #dfe1e5); user-select: none; }
.qbot-pageFootCopy { margin-top: 5px; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 10.5px; line-height: 1.6; }
.qbot-uiSwitch { display: inline-flex; align-items: center; gap: 5px; margin-left: 8px; vertical-align: middle; color: var(--dsw-alias-label-tertiary, #8f959e); cursor: pointer; user-select: none; }
.qbot-uiSwitchInput { position: absolute; width: 1px; height: 1px; opacity: 0; }
.qbot-uiSwitchTrack { position: relative; flex: none; width: 22px; height: 12px; border-radius: 999px; background: var(--dsw-alias-border-l2, #dfe1e5); transition: background .15s ease; }
.qbot-uiSwitchTrack::after { content: ""; position: absolute; top: 2px; left: 2px; width: 8px; height: 8px; border-radius: 50%; background: #fff; box-shadow: 0 1px 2px rgb(31 35 41 / 16%); transition: transform .15s ease, background .15s ease; }
.qbot-uiSwitch:hover .qbot-uiSwitchTrack { background: var(--dsw-alias-border-l3, #c9cdd4); }
.qbot-uiSwitchInput:checked + .qbot-uiSwitchTrack { background: rgb(22 119 255 / 26%); }
.qbot-uiSwitchInput:hover:checked + .qbot-uiSwitchTrack { background: rgb(22 119 255 / 38%); }
.qbot-uiSwitchInput:checked + .qbot-uiSwitchTrack::after { background: var(--qbot-blue, #1677ff); transform: translateX(10px); }
.qbot-uiSwitchInput:focus-visible + .qbot-uiSwitchTrack { outline: 2px solid var(--qbot-blue, #1677ff); outline-offset: 2px; }
.qbot-uiSwitchLabel { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 10px; }

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
.qbot-hint { margin: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 1.6; overflow-wrap: anywhere; }

/* ── 通知（dim-statusNotice / info 变体）──────────────────────────────── */
.qbot-statusNotice { display: flex; align-items: flex-start; gap: 10px; padding: 13px 15px; border: 1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 22%, var(--dsw-alias-border-l2, #dfe1e5)); border-radius: 10px; color: var(--dsw-alias-state-error-primary, #d54941); background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 8%, var(--dsw-alias-bg-layer-1, #fff)); font-size: 13px; line-height: 1.5; }
/* 会话运行时缺失告警：主文案 + 修复指引竖排，常驻不淡出（与 8s 消失的 infoNotice 区分）。 */
.qbot-runtimeNotice { flex-direction: column; gap: 6px; }
.qbot-runtimeNotice strong { font-weight: 650; }
.qbot-runtimeNotice span { min-width: 0; font-weight: 400; overflow-wrap: anywhere; }
.qbot-runtimeNotice .qbot-btn { align-self: flex-start; }

.qbot-infoNotice { display: flex; align-items: flex-start; gap: 10px; padding: 13px 15px; border: 1px solid color-mix(in srgb, var(--qbot-business) 22%, var(--dsw-alias-border-l2, #dfe1e5)); border-radius: 10px; color: var(--qbot-business); background: color-mix(in srgb, var(--qbot-business) 7%, var(--dsw-alias-bg-layer-1, #fff)); font-size: 13px; line-height: 1.5; animation: qbotNoticeOut 8s ease-in forwards; }
.qbot-noticeText { flex: 1 1 auto; min-width: 0; overflow-wrap: anywhere; }
/* 提示条右侧倒计时胶囊：右对齐、等宽数字、随 8s 自动消失同步归零。 */
.qbot-noticeCount { margin-left: auto; flex: none; align-self: flex-start; font-variant-numeric: tabular-nums; font-weight: 600; font-size: 12px; line-height: 1.4; padding: 1px 9px; border-radius: 999px; white-space: nowrap; background: color-mix(in srgb, var(--qbot-business) 14%, var(--dsw-alias-bg-layer-1, #fff)); border: 1px solid color-mix(in srgb, var(--qbot-business) 28%, var(--dsw-alias-border-l2, #dfe1e5)); }
/* 页面级更新提示（qbot-page 是普通块布局，无 channelPage 的 flex gap，需自带下边距与面板隔开） */
.qbot-updateNotice { margin: 0 0 18px; }
/* 进行中：不吃 8s 淡出动画（更新可能耗时较久），并改为竖排以突出「请勿关闭」警示行。 */
.qbot-updateNotice.is-busy { flex-direction: column; align-items: stretch; gap: 6px; animation: none; }
.qbot-updateMsg { min-width: 0; overflow-wrap: anywhere; }
.qbot-updateKeepOpen { color: var(--dsw-alias-state-error-primary, #d54941); font-size: 13px; font-weight: 650; line-height: 1.5; }

/* ── 机器人卡片（dim-botCard）─────────────────────────────────────────── */
.qbot-botList { min-width: 0; width: 100%; max-width: 100%; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; align-items: stretch; }
/* 奇数张时最后一张占满整行：1 张铺满、3 张 2+1、2 张并排，不留半行空白 */
.qbot-botCard:last-child:nth-child(odd) { grid-column: 1 / -1; }
.qbot-botCard { position: relative; min-width: 0; width: 100%; max-width: 100%; min-height: 156px; display: flex; flex-direction: column; gap: 12px; padding: 16px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 14px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 1px 2px rgb(31 35 41 / 3%); font: inherit; text-align: left; cursor: pointer; transition: border-color .16s ease, box-shadow .16s ease, transform .16s ease; }
.qbot-botCard:hover { border-color: color-mix(in srgb, var(--qbot-blue) 25%, var(--dsw-alias-border-l2, #e5e6eb)); box-shadow: 0 6px 18px rgb(31 35 41 / 6%); transform: translateY(-2px); }
.qbot-botCard:focus-visible { outline: none; border-color: color-mix(in srgb, var(--qbot-blue) 72%, var(--dsw-alias-border-l2, #dfe1e5)); box-shadow: 0 0 0 1px color-mix(in srgb, var(--qbot-blue) 24%, transparent) inset, 0 3px 12px rgb(22 119 255 / 7%); }
.qbot-botCardHead { min-width: 0; display: flex; align-items: center; gap: 12px; }
.qbot-botAvatar { flex: none; width: 44px; height: 44px; display: grid; place-items: center; overflow: hidden; border-radius: 12px; color: #fff; background: var(--qbot-blue); }
.qbot-botAvatar svg { width: 30px; height: 30px; }
.qbot-botCardTitle { min-width: 0; display: flex; flex-direction: column; gap: 5px; }
.qbot-botCardTitle strong { overflow: hidden; color: var(--dsw-alias-label-primary, #1f2329); font-size: 15px; font-weight: 650; line-height: normal; text-overflow: ellipsis; white-space: nowrap; }
.qbot-botCardMeta { min-width: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 1.45; overflow-wrap: anywhere; }
.qbot-botCardStatus { min-width: 0; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 8px 10px; border-radius: 9px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-botCardRole { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; white-space: nowrap; }
.qbot-botCardFoot { margin-top: auto; display: flex; align-items: center; justify-content: space-between; gap: 8px; color: var(--qbot-blue); font-size: 12px; font-weight: 600; }
.qbot-botCardArrow { font-size: 16px; line-height: 1; transition: transform .16s ease; }
.qbot-botCard:hover .qbot-botCardArrow { transform: translateX(3px); }

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
.qbot-fieldLabel { display: block; min-width: 0; overflow-wrap: anywhere; }
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
.qbot-modalList { flex: 1 1 auto; min-width: 0; min-height: 0; margin: 12px var(--qbot-gutter, 20px) 0; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; overflow: hidden; display: flex; flex-direction: column; }
/* 无外壳管理器根（右侧面板 / 设置页弹窗共用）：宽度完全由父容器决定，禁止撑破父级 */
/* 无外壳管理器根（右侧面板 / 设置页弹窗共用）：宽度完全由父容器决定，禁止撑破父级。
   --qbot-gutter 是唯一的水平留白来源：列表容器外边距、编辑表单内边距、底部操作区共用，
   因此表单卡片与列表容器的外边缘始终对齐，面板宽窄变化时同步收敛，不会出现两套间距。 */
.qbot-schedRoot { --qbot-gutter: clamp(12px, 3.2%, 20px); min-width: 0; width: 100%; max-width: 100%; }
/* 吸顶：tabs/notice 固定在面板头部，仅内层内容区滚动 */
.qbot-modalListScroll { flex: 1 1 auto; min-height: 0; overflow-y: auto; overscroll-behavior: contain; display: flex; flex-direction: column; gap: 2px; padding: 0 6px 6px; }
.qbot-dirRow { display: flex; align-items: center; gap: 10px; min-height: 38px; padding: 0 10px; border: 0; border-radius: 8px; color: var(--dsw-alias-label-primary, #1f2329); background: transparent; font: inherit; font-size: 13px; text-align: left; cursor: pointer; transition: background .12s ease; }
.qbot-dirRow.is-selected { background: var(--dsw-alias-bg-active, rgba(22, 119, 255, .14)); font-weight: 600; }
.qbot-dirRow:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-dirRow svg { flex: none; width: 16px; height: 16px; color: var(--qbot-business); }
.qbot-modalState { display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 96px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 13px; }
.qbot-modalError { color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-modalFoot { min-width: 0; flex: none; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding: 12px clamp(10px, 3.2%, 20px) 14px; font-variant-numeric: tabular-nums; }
/* 弹窗底部内联错误：常驻可见，不随弹窗内容滚动而移出视口 */
.qbot-footError { margin: 0; color: var(--dsw-alias-state-error-primary, #d54941); font-size: 12px; line-height: 1.6; overflow-wrap: anywhere; }
/* 宽弹窗：定时消息 / 消息归档 列表内容较长，放宽上限 */
.qbot-modalWide { width: min(760px, 100%); }
/* ── 概览第一行右侧操作区（定时消息 / 消息归档 入口） ── */
.qbot-heroActions { display: flex; align-items: center; gap: 8px; margin-left: auto; padding-left: 12px; flex: none; }
/* ── 定时消息弹窗：范围 Tab + 群聊/单聊分组 ── */
.qbot-schedTabs { min-width: 0; display: flex; align-items: center; gap: 4px; flex-wrap: wrap; padding: 10px 12px 8px; border-bottom: 1px solid var(--dsw-alias-border-l1, #eef0f3); background: var(--dsw-alias-bg-module-platform, #f7f8fa); border-radius: 9px 9px 0 0; flex: none; }
.qbot-schedTab { flex: none; padding: 5px 14px; border: 1px solid transparent; border-radius: 999px; background: transparent; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; cursor: pointer; }
.qbot-schedTab:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-schedTab.is-active { background: var(--dsw-alias-bg-layer-1, #fff); border-color: var(--dsw-alias-border-l2, #e5e6eb); color: var(--qbot-blue); font-weight: 600; box-shadow: 0 1px 2px rgb(31 35 41 / 6%); }
/* 右侧面板「定时消息」工具栏：机器人作用域 + 刷新（自适应面板宽度、可换行） */
.qbot-schedToolbar { flex: none; position: sticky; top: 0; z-index: 2; min-width: 0; display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; padding: 10px clamp(8px, 3%, 14px); border-bottom: 1px solid var(--dsw-alias-border-l1, #eef0f3); background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-fieldInline { min-width: 0; flex: 1 1 auto; display: inline-flex; align-items: center; gap: 8px; }
.qbot-fieldInlineLabel { flex: none; font-size: 12px; font-weight: 600; color: var(--dsw-alias-label-secondary, #646a73); }
.qbot-schedToolbar .qbot-settingSelect { flex: 1 1 auto; min-width: 0; max-width: 240px; }
.qbot-schedRefresh { flex: none; }
/* 面板级错误提示：走错误态令牌，深浅色均正确 */
.qbot-schedPanelError { margin: 10px clamp(8px, 3%, 14px); padding: 8px 12px; border: 1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 34%, transparent); border-radius: 8px; background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 8%, transparent); color: var(--dsw-alias-state-error-primary, #d54941); font-size: 12px; line-height: 1.5; overflow-wrap: anywhere; }
.qbot-schedAdd { margin-left: auto; padding: 4px 12px; font-size: 12px; }

/* 消息归档双栏：左会话列表（个人/群聊）/ 右消息内容（卡片式） */
.qbot-modalAlert { flex: none; margin: 10px 20px 0; padding: 8px 12px; border-radius: 8px; background: var(--dsw-alias-state-error-bg, #fee9e7); color: var(--dsw-alias-state-error-primary, #d54941); font-size: 12px; font-weight: 600; }
.qbot-modalWide { width: min(880px, 100%); height: min(80vh, 760px); }
/* 定时编辑态底部动作条：与表单区隔一层，按钮靠右、提示靠左 */
.qbot-schedEditFoot { border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); background: color-mix(in srgb, var(--dsw-alias-bg-module-platform, #f7f8fa) 55%, var(--dsw-alias-bg-layer-1, #fff)); }
.qbot-schedEditFoot .qbot-viewActions { margin-left: auto; }
.qbot-archSplit { flex: 1 1 auto; min-height: 140px; margin: 12px 20px 0; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; overflow: hidden; display: flex; }
.qbot-archSplit.is-refreshing { opacity: 0.6; pointer-events: none; }
/* 左栏：会话列表 */
.qbot-archSide { width: 252px; flex: none; overflow-y: auto; padding: 8px; border-right: 1px solid var(--dsw-alias-border-l1, #eef0f3); background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-archSideEmpty { padding: 14px 8px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 1.6; }
.qbot-archChats { display: flex; flex-direction: column; gap: 12px; }
.qbot-convSection { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.qbot-convSectionTitle { padding: 4px 8px 2px; font-size: 11px; font-weight: 700; letter-spacing: .08em; color: var(--dsw-alias-label-tertiary, #8f959e); text-transform: uppercase; }
/* 左栏会话 → 月份 两级折叠树 */
.qbot-convGroup { border-radius: 10px; }
.qbot-convGroup.is-open { background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-convGroupHeadRow { display: flex; align-items: stretch; gap: 2px; }
.qbot-convGroupHead { flex: 1; min-width: 0; display: flex; align-items: center; gap: 9px; padding: 7px 6px; border: 0; border-radius: 10px; background: transparent; color: inherit; font: inherit; text-align: left; cursor: pointer; }
.qbot-convGroupHead:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-convGroupName { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13px; font-weight: 600; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-convGroupCount { flex: none; min-width: 20px; padding: 0 6px; height: 18px; display: inline-flex; align-items: center; justify-content: center; border-radius: 999px; background: var(--dsw-alias-bg-layer-1, #fff); border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); color: var(--dsw-alias-label-secondary, #646a73); font-size: 10.5px; font-weight: 700; font-variant-numeric: tabular-nums; }
.qbot-convGroupMembers { flex: none; padding: 0 6px; height: 16px; display: inline-flex; align-items: center; border-radius: 999px; background: color-mix(in srgb, var(--qbot-blue, #2466e8) 12%, transparent); color: var(--qbot-blue, #2466e8); font-size: 10px; font-weight: 600; white-space: nowrap; }
.qbot-chevron { flex: none; color: var(--dsw-alias-label-tertiary, #8f959e); transition: transform .15s ease; }
.qbot-convGroup.is-open .qbot-chevron { transform: rotate(90deg); }
.qbot-convMonths { display: flex; flex-direction: column; gap: 1px; padding: 2px 0 6px; }
.qbot-convMonth { display: flex; align-items: center; gap: 8px; width: 100%; padding: 6px 6px 6px 28px; border: 0; border-radius: 8px; background: transparent; color: inherit; font: inherit; text-align: left; cursor: pointer; }
.qbot-convMonth:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-convMonth.is-active { background: var(--dsw-alias-bg-active, rgba(22, 119, 255, .14)); }
.qbot-convMonthMeta { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
.qbot-convMonthName { font-size: 12.5px; font-weight: 600; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-convMonth.is-active .qbot-convMonthName { color: var(--qbot-blue); }
.qbot-convMonthSub { font-size: 11px; color: var(--dsw-alias-label-tertiary, #8f959e); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.qbot-convMonthCount { flex: none; font-size: 11px; color: var(--dsw-alias-label-tertiary, #8f959e); font-variant-numeric: tabular-nums; }
.qbot-convMonthEmpty { padding: 4px 6px 4px 28px; font-size: 11px; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-avatarXs { width: 18px; height: 18px; flex: none; }
/* 右栏：消息内容（标题栏固定，仅消息列表滚动，滚动条不越过标题） */
.qbot-archMain { flex: 1; min-width: 0; display: flex; flex-direction: column; overflow: hidden; }
.qbot-archChatHead { flex: none; display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 14px; border-bottom: 1px solid var(--dsw-alias-border-l1, #eef0f3); background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-archChatTitleWrap { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.qbot-archChatTitle { display: inline-flex; align-items: center; gap: 8px; min-width: 0; font-size: 14px; font-weight: 650; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-archChatTitle > span:last-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.qbot-archGroupMeta { min-width: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; padding-left: 36px; font-size: 11px; font-weight: 400; color: var(--dsw-alias-label-secondary, #646a73); }
.qbot-archGroupMeta > span { min-width: 0; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding: 1px 7px; border-radius: 999px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-archChatActions { flex: none; display: inline-flex; align-items: center; gap: 4px; }
.qbot-archChatDel:disabled { opacity: 0.5; cursor: default; }
.qbot-archChatDel { flex: none; width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; border: 0; border-radius: 8px; background: transparent; color: var(--dsw-alias-label-secondary, #646a73); cursor: pointer; }
.qbot-archChatDel:hover { background: var(--dsw-alias-state-error-bg, #fee9e7); color: var(--dsw-alias-state-error-primary, #d54941); }
/* 右栏筛选栏（仿聊天记录搜索）：关键词 / 群成员（仅群聊） / 日期，客户端过滤已加载记录 */
.qbot-archSearchBar { flex: none; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 8px 14px; border-bottom: 1px solid var(--dsw-alias-border-l1, #eef0f3); background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-archSearchBox { flex: 1 1 170px; min-width: 0; display: flex; align-items: center; gap: 7px; height: 32px; padding: 0 9px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 9px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); transition: border-color .15s ease, background .15s ease; }
.qbot-archSearchBox:focus-within { border-color: var(--qbot-business); background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-archSearchIcon { flex: none; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-archSearchInput { flex: 1 1 auto; min-width: 0; height: 100%; border: 0; outline: none; background: transparent; font: inherit; font-size: 12.5px; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-archSearchInput::placeholder { color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-archSearchX { flex: none; width: 18px; height: 18px; display: inline-flex; align-items: center; justify-content: center; border: 0; border-radius: 50%; background: transparent; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 15px; line-height: 1; cursor: pointer; }
.qbot-archSearchX:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); color: var(--dsw-alias-label-primary, #1f2329); }

/* ── 群成员下拉（自定义弹层，替代原生 select）：只高亮选中项与悬停项 ── */
.qbot-archMemberWrap { flex: none; position: relative; }
.qbot-archMemberBtn { max-width: 168px; height: 32px; padding: 0 9px; display: inline-flex; align-items: center; justify-content: space-between; gap: 6px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 9px; background: var(--dsw-alias-bg-layer-1, #fff); font: inherit; font-size: 12.5px; color: var(--dsw-alias-label-primary, #1f2329); cursor: pointer; transition: border-color .15s ease; }
.qbot-archMemberBtn:hover { border-color: var(--dsw-alias-border-l3, #d8dadf); }
.qbot-archMemberBtn.is-on { border-color: color-mix(in srgb, var(--qbot-business) 45%, transparent); color: var(--qbot-business); font-weight: 600; }
.qbot-archMemberBtnText { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.qbot-archMemberCaret { flex: none; opacity: 0.65; }
.qbot-archMemberPanel { position: absolute; top: calc(100% + 6px); left: 0; z-index: 60; min-width: 200px; max-width: 280px; max-height: 248px; overflow-y: auto; overflow-x: hidden; padding: 6px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 12px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 8px 24px rgb(31 35 41 / 14%); }
.qbot-archMemberItem { display: flex; width: 100%; align-items: center; border: 0; border-radius: 8px; background: transparent; padding: 7px 10px; font: inherit; font-size: 12.5px; line-height: 1.4; text-align: left; color: var(--dsw-alias-label-primary, #1f2329); cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
/* 悬停高亮：淡灰 */
.qbot-archMemberItem:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
/* 选中高亮：淡品牌底 + 品牌色字（不是大色块） */
.qbot-archMemberItem.is-on { background: color-mix(in srgb, var(--qbot-business) 10%, transparent); color: var(--qbot-business); font-weight: 600; }
.qbot-archMemberItem.is-on:hover { background: color-mix(in srgb, var(--qbot-business) 16%, transparent); }

/* ── 日期范围选择器：触发按钮 + 弹出日历（有消息的日子打点标记） ── */
.qbot-archDateWrap { flex: none; position: relative; }
.qbot-archDateBtn { height: 32px; min-width: 136px; padding: 0 10px; display: inline-flex; align-items: center; justify-content: space-between; gap: 6px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 9px; background: var(--dsw-alias-bg-layer-1, #fff); font: inherit; font-size: 12.5px; color: var(--dsw-alias-label-primary, #1f2329); cursor: pointer; transition: border-color .15s ease; }
.qbot-archDateBtn:hover { border-color: var(--dsw-alias-border-l3, #d8dadf); }
.qbot-archDateBtn.is-on { border-color: color-mix(in srgb, var(--qbot-business) 45%, transparent); color: var(--qbot-business); font-weight: 600; }
.qbot-archDateBtnText { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.qbot-archDatePanel { position: absolute; top: calc(100% + 6px); right: 0; z-index: 60; width: 254px; padding: 10px 12px 8px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 12px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 8px 24px rgb(31 35 41 / 14%); }
.qbot-archDateHead { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; }
.qbot-archDateTitle { flex: 1; min-width: 0; text-align: center; font-size: 13px; font-weight: 650; color: var(--dsw-alias-label-primary, #1f2329); white-space: nowrap; }
.qbot-archDateNav { flex: none; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; border: 0; border-radius: 7px; background: transparent; color: var(--dsw-alias-label-secondary, #646a73); font-size: 14px; line-height: 1; cursor: pointer; }
.qbot-archDateNav:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-archDateGrid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
.qbot-archDateWd { text-align: center; padding: 2px 0 4px; font-size: 11px; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-archDateCell { position: relative; height: 28px; display: inline-flex; align-items: center; justify-content: center; border: 0; border-radius: 7px; background: transparent; font: inherit; font-size: 12px; line-height: 1; color: var(--dsw-alias-label-primary, #1f2329); cursor: pointer; font-variant-numeric: tabular-nums; transition: background .12s ease; }
.qbot-archDateCell:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-archDateCell.is-out { color: var(--dsw-alias-label-quaternary, #b8bcc2); cursor: default; pointer-events: none; }
/* 打点：当天有消息 */
.qbot-archDateCell::after { content: ""; position: absolute; bottom: 3px; left: 50%; transform: translateX(-50%); width: 4px; height: 4px; border-radius: 50%; background: transparent; }
.qbot-archDateCell.is-marked::after { background: color-mix(in srgb, var(--qbot-business) 72%, transparent); }
/* 范围中间日 / 起止端点 */
.qbot-archDateCell.is-inrange { background: color-mix(in srgb, var(--qbot-business) 12%, transparent); border-radius: 0; }
.qbot-archDateCell.is-edge, .qbot-archDateCell.is-edge:hover { background: var(--qbot-business); color: #fff; font-weight: 650; }
.qbot-archDateCell.is-edge.is-marked::after { background: rgb(255 255 255 / 85%); }
.qbot-archDateFoot { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 8px; padding-top: 6px; border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
.qbot-archDateClear { flex: none; border: 0; background: transparent; padding: 2px 6px; border-radius: 6px; color: var(--dsw-alias-label-secondary, #646a73); font: inherit; font-size: 12px; cursor: pointer; }
.qbot-archDateClear:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-archDateHint { min-width: 0; font-size: 11px; color: var(--dsw-alias-label-tertiary, #8f959e); text-align: right; }
/* 一键清除：固定尺寸的 × 图标按钮，常驻占位（隐藏用 visibility），避免出现/消失引起布局抖动 */
.qbot-archSearchClear { flex: none; width: 32px; height: 32px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border: 1px solid color-mix(in srgb, var(--qbot-business) 38%, transparent); border-radius: 9px; background: color-mix(in srgb, var(--qbot-business) 8%, transparent); color: var(--qbot-business); font: inherit; font-size: 16px; line-height: 1; cursor: pointer; }
.qbot-archSearchClear:hover { background: color-mix(in srgb, var(--qbot-business) 14%, transparent); }
.qbot-archSearchClear:disabled { cursor: default; }
.qbot-archState { flex: 1 1 auto; min-height: 0; display: flex; align-items: center; justify-content: center; padding: 12px 14px; text-align: center; }
.qbot-archMore { padding: 8px 14px 2px; font-size: 11px; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-msgList { flex: 1 1 auto; min-height: 0; padding: 12px 14px 14px; display: flex; flex-direction: column; gap: 14px; overflow-y: auto; overflow-x: hidden; }
/* 消息卡片：聊天式左右对话——用户消息靠左、机器人靠右（头像在外侧），内容收进气泡 */
.qbot-msgCard { display: flex; gap: 10px; align-items: flex-start; min-width: 0; }
.qbot-msgCard.is-bot { flex-direction: row-reverse; }
.qbot-msgAvatar { flex: none; }
/* 真实头像（消息事件学习的 avatar URL），与占位图标同尺寸。 */
.qbot-avatarImg { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; display: block; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
/* 左栏会话头 / 月份节点的真实头像尺寸，与占位图标对齐。 */
.qbot-avatarImg.qbot-convAvatarImg { width: 34px; height: 34px; }
.qbot-avatarImg.qbot-convMonthAvatarImg { width: 18px; height: 18px; }
/* 气泡：不占满全宽（max-width 86%），按内容收缩；用户灰底、机器人淡品牌底 */
.qbot-msgBody { min-width: 0; flex: 0 1 auto; max-width: min(86%, 760px); display: flex; flex-direction: column; gap: 4px; padding: 9px 12px 10px; border-radius: 14px 14px 14px 4px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-msgCard.is-bot .qbot-msgBody { border-radius: 14px 14px 4px 14px; border-color: color-mix(in srgb, var(--qbot-blue) 16%, transparent); background: color-mix(in srgb, var(--qbot-blue) 8%, var(--dsw-alias-bg-layer-1, #fff)); }
.qbot-msgHead { display: flex; align-items: baseline; gap: 8px; }
.qbot-msgCard.is-bot .qbot-msgHead { justify-content: flex-end; }
.qbot-msgName { font-size: 13px; font-weight: 600; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-msgTime { font-size: 11px; color: var(--dsw-alias-label-tertiary, #8f959e); font-variant-numeric: tabular-nums; }
/* 引用块：嵌在气泡内，改用浮起的白底 + 左侧竖线 */
.qbot-msgQuote { margin: 2px 0; padding: 7px 10px; border-left: 3px solid var(--dsw-alias-border-l2, #d0d3d9); border-radius: 0 8px 8px 0; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-msgQuoteName { font-size: 11px; font-weight: 600; color: var(--dsw-alias-label-secondary, #646a73); margin-bottom: 2px; }
.qbot-msgQuoteText { font-size: 12px; color: var(--dsw-alias-label-secondary, #646a73); overflow-wrap: anywhere; }
.qbot-msgText { font-size: 13.5px; line-height: 1.65; color: var(--dsw-alias-label-primary, #1f2329); overflow-wrap: anywhere; word-break: break-word; white-space: pre-wrap; }
.qbot-msgFace { display: inline-block; font-size: 11px; line-height: 1.5; padding: 1px 8px; margin: 0 2px; border-radius: 999px; background: var(--dsw-alias-fill-secondary, rgba(31,35,41,.06)); color: var(--dsw-alias-label-secondary, #646a73); vertical-align: baseline; }
.qbot-msgNote { font-size: 11px; color: var(--dsw-alias-label-tertiary, #8f959e); }
/* 归档媒体：图片缩略图 / 视频 / 文件条目 */
.qbot-archMediaList { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; }
.qbot-archMedia { display: flex; flex-direction: column; gap: 4px; max-width: 100%; min-width: 0; }
.qbot-archMediaBtn { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; padding: 6px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-bg-layer-1, #fff); cursor: pointer; max-width: 240px; min-width: 0; transition: border-color .15s ease, background .15s ease; }
.qbot-archMediaBtn:hover { border-color: color-mix(in srgb, var(--qbot-blue) 40%, transparent); }
.qbot-archMediaBtn.is-expanded { border-color: var(--qbot-blue); }
.qbot-archMediaImg { display: block; width: 100%; max-width: 228px; height: auto; max-height: 320px; object-fit: contain; border-radius: 6px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-archMediaPlaceholder { display: flex; align-items: center; justify-content: center; width: 180px; height: 110px; font-size: 12px; color: var(--dsw-alias-label-tertiary, #8f959e); border-radius: 6px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); text-align: center; padding: 8px; }
.qbot-archMediaName { font-size: 11px; color: var(--dsw-alias-label-secondary, #646a73); max-width: 228px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.qbot-archMediaSize { font-size: 10px; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-archMediaIcon { font-size: 18px; line-height: 1; color: var(--qbot-blue); }
.qbot-archMediaBtn.is-file, .qbot-archMediaBtn.is-video { flex-direction: row; align-items: center; gap: 8px; padding: 7px 10px; }
.qbot-archMediaErr { font-size: 10px; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-archMediaVideo { display: block; max-width: 100%; max-height: 360px; border-radius: 8px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-msgCard.is-bot .qbot-msgName { color: var(--qbot-blue); }
/* 右栏按月分组分隔线 */
.qbot-monthGroup { display: flex; flex-direction: column; gap: 14px; }
.qbot-monthDivider { display: flex; align-items: center; gap: 8px; margin: 2px 0 0; padding: 0 2px; }
.qbot-monthDividerLabel { font-size: 12px; font-weight: 700; color: var(--dsw-alias-label-secondary, #646a73); }
.qbot-monthDivider::before, .qbot-monthDivider::after { content: ""; height: 1px; background: var(--dsw-alias-border-l1, #eef0f3); }
.qbot-monthDivider::before { flex: none; width: 14px; }
.qbot-monthDivider::after { flex: 1; }
.qbot-monthDividerCount { font-size: 11px; color: var(--dsw-alias-label-tertiary, #8f959e); font-variant-numeric: tabular-nums; }
/* 右栏底部分页条（显示进度 + 加载更多 / 显示全部） */
.qbot-archFoot { flex: none; display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: nowrap; padding: 4px 14px; border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-archFootInfo { flex: none; font-size: 12px; color: var(--dsw-alias-label-tertiary, #8f959e); font-variant-numeric: tabular-nums; }
.qbot-archFootMore { flex: none; display: flex; align-items: center; justify-content: flex-end; gap: 8px; margin-left: auto; color: var(--dsw-alias-border-l1, #eef0f3); }
.qbot-archFootLink { flex: none; padding: 1px 4px; border: 0; border-radius: 6px; background: transparent; font-size: 12px; line-height: 1.3; color: var(--dsw-alias-label-tertiary, #8f959e); cursor: pointer; white-space: nowrap; }
.qbot-archFootLink:hover:not(:disabled) { color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-archFootLink:disabled { opacity: .55; cursor: default; }
.qbot-archFootSep { flex: none; color: var(--dsw-alias-border-l1, #eef0f3); }
/* Markdown：代码块换行，避免横向滚动条 */
.qbot-md pre { white-space: pre-wrap; word-break: break-word; max-width: 100%; }
/* 头像（无真实头像图，用图标占位）：浅色底 + 品牌色图标，与控制台浅色风格一致 */
.qbot-avatar { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; color: var(--qbot-blue, #1677ff); }
.qbot-avatar svg { width: 22px; height: 22px; }
.qbot-avatar-bot { background: color-mix(in srgb, var(--qbot-blue, #1677ff) 13%, var(--dsw-alias-bg-layer-1, #fff)); color: var(--qbot-blue, #1677ff); }
.qbot-avatar-person { background: color-mix(in srgb, #8f959e 16%, var(--dsw-alias-bg-layer-1, #fff)); color: var(--dsw-alias-label-secondary, #646a73); }
.qbot-avatar-group { background: color-mix(in srgb, var(--qbot-business, #7c4dff) 12%, var(--dsw-alias-bg-layer-1, #fff)); color: var(--qbot-business, #7c4dff); }
.qbot-avatarSm { width: 22px; height: 22px; }
.qbot-avatarSm svg { width: 13px; height: 13px; }
.qbot-modalStateInline { min-height: 60px; padding: 0; }
/* 分组（群聊 / 单聊）：标题即折叠开关，可收起以减少滚动长度。
   同时作为「任务卡」的宽度容器：卡片实际可用宽度随面板拖拽变化，
   由下方 @container schedgroup 决定正文与操作列是并排还是上下堆叠。 */
.qbot-schedGroup { container-type: inline-size; container-name: schedgroup; min-width: 0; display: flex; flex-direction: column; gap: 6px; padding: 8px clamp(8px, 2.5%, 12px) 4px; }
.qbot-schedGroupTitle {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  box-sizing: border-box;
  margin: 4px 0 2px;
  padding: 4px 6px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  font: inherit;
  font-size: 12.5px;
  font-weight: 650;
  text-align: left;
  color: var(--dsw-alias-label-secondary, #646a73);
  cursor: pointer;
  transition: background .14s ease;
}
.qbot-schedGroupTitle:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-schedGroupTitle:focus-visible { outline: 2px solid color-mix(in srgb, var(--qbot-business) 55%, transparent); outline-offset: 1px; }
.qbot-schedGroupTitle[data-scope="group"] { color: var(--qbot-blue); }
.qbot-schedGroupTitle::after { content: ""; flex: 1; height: 1px; background: var(--dsw-alias-border-l1, #eef0f3); }
/* 折叠指示箭头：展开朝下，收起朝右（纯 CSS 旋转，随主题色 currentColor） */
.qbot-schedCaret { flex: none; width: 7px; height: 7px; border-right: 1.6px solid currentColor; border-bottom: 1.6px solid currentColor; transform: rotate(45deg); transition: transform .18s ease; transform-origin: 50% 50%; }
.qbot-schedGroup.is-collapsed .qbot-schedCaret { transform: rotate(-45deg); }
.qbot-schedCount { flex: none; min-width: 20px; text-align: center; padding: 0 6px; border-radius: 999px; background: var(--dsw-alias-interactive-bg-hover, #eef0f3); color: var(--dsw-alias-label-secondary, #646a73); font-size: 11px; font-weight: 600; font-variant-numeric: tabular-nums; }
.qbot-schedGroupTitle[data-scope="group"] .qbot-schedCount { color: var(--qbot-blue); background: color-mix(in srgb, var(--qbot-business) 12%, transparent); }
.qbot-schedGroup.is-collapsed .qbot-schedGroupTitle { opacity: .82; }
/* 定时消息行：任务卡片式（类型徽标 + 内容 + 元信息 + 操作列） */
.qbot-schedRow { min-width: 0; position: relative; display: flex; align-items: flex-start; gap: 12px; padding: 11px 13px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 12px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 1px 2px rgb(31 35 41 / 4%); }
.qbot-schedMain { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
.qbot-schedTop { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.qbot-chipWarn { color: var(--dsw-alias-state-warn-primary, #d97706); }
.qbot-schedContent { color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; font-weight: 550; line-height: 1.55; overflow-wrap: anywhere; white-space: pre-wrap; }
.qbot-schedMeta { min-width: 0; max-width: 100%; display: flex; align-items: center; gap: 8px 12px; flex-wrap: wrap; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 12px; }
/* 元信息里的每一项都必须可收缩：flex item 默认 min-width:auto，遇到无空格长串
   （典型是 python 报错里的绝对路径）会把整行撑破、溢出卡片外。 */
.qbot-schedMeta > * { min-width: 0; max-width: 100%; overflow-wrap: anywhere; word-break: break-word; }
/* 运行失败原因：独占整行、必须换行（报错常含无空格长路径），默认限高 + 内部滚动，
   点击展开 / 收起查看完整报错；滚动条本身即「还有更多内容」的提示。 */
.qbot-schedError {
  flex: 1 1 100%;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
  margin-top: 2px;
  padding: 5px 9px;
  border: 1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 22%, transparent);
  border-radius: 7px;
  background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 7%, transparent);
  color: var(--dsw-alias-state-error-primary, #d54941);
  overflow-wrap: anywhere;
  word-break: break-word;
  max-height: 7.5em;
  overflow-y: auto;
  overscroll-behavior: contain;
  cursor: pointer;
  transition: background .15s ease;
}
.qbot-schedError:hover { background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 12%, transparent); }
.qbot-schedError.is-expanded { max-height: none; overflow-y: visible; }
.qbot-schedError:focus-visible { outline: 2px solid color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 55%, transparent); outline-offset: 2px; }
.qbot-schedRemove { flex: none; }
/* 行内操作列：查看 / 测试 / 编辑 / 启用禁用 / 删除 右对齐紧凑排布；
   删除前用细分隔条与常规操作隔开，弱化视觉权重。 */
.qbot-schedOps { display: inline-flex; flex-direction: row; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: 6px; flex: none; align-self: flex-start; margin-left: auto; }
.qbot-schedOps .qbot-btn { min-height: 28px; padding: 3px 11px; font-size: 12px; line-height: 1; border-radius: 7px; }
.qbot-schedView { color: var(--qbot-business, #3370ff); border-color: color-mix(in srgb, var(--qbot-business, #3370ff) 42%, transparent); }
.qbot-schedView:hover:not(:disabled) { background: color-mix(in srgb, var(--qbot-business, #3370ff) 10%, transparent); }
.qbot-schedDivider { width: 1px; height: 16px; margin: 0 1px; background: var(--dsw-alias-border-l2, #dfe1e5); align-self: center; }
.qbot-schedTest { border-color: color-mix(in srgb, var(--qbot-business) 42%, transparent); color: var(--qbot-business); }
.qbot-schedTest:hover:not(:disabled) { background: color-mix(in srgb, var(--qbot-business) 10%, transparent); }
.qbot-schedTest:disabled { opacity: .6; cursor: default; }
/* 测试执行结果横幅（列表顶部） */
.qbot-schedNotice { min-width: 0; max-width: calc(100% - 16px); margin: 8px; padding: 8px 12px; border-radius: 8px; font-size: 12px; line-height: 1.5; border: 1px solid color-mix(in srgb, var(--qbot-business) 34%, transparent); background: color-mix(in srgb, var(--qbot-business) 8%, transparent); color: var(--qbot-business); flex: none; overflow-wrap: anywhere; word-break: break-word; white-space: pre-wrap; max-height: 32vh; overflow-y: auto; overscroll-behavior: contain; }
.qbot-schedNotice.is-error { border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 34%, transparent); background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 8%, transparent); color: var(--dsw-alias-state-error-primary, #d54941); }
/* 成功提示：8 秒内保持可读，最后 0.8s 淡出后由组件卸载（见自动收起定时器） */
@keyframes qbotNoticeOut { 0%, 90% { opacity: 1; } 100% { opacity: 0; } }
.qbot-schedNotice.is-autoHide { animation: qbotNoticeOut 8s ease-in forwards; }
/* 列表卡片：左侧品牌色条强化层次 + 悬浮反馈 */
.qbot-schedRow { transition: border-color .15s ease, box-shadow .15s ease; }
.qbot-schedRow::before { content: ""; position: absolute; left: 0; top: 9px; bottom: 9px; width: 3px; border-radius: 0 3px 3px 0; background: var(--qbot-business); }
.qbot-schedRow:hover { border-color: color-mix(in srgb, var(--qbot-business) 32%, var(--dsw-alias-border-l2, #e5e6eb)); box-shadow: 0 3px 12px rgb(31 35 41 / 9%); }
.qbot-schedRow.is-failed::before { background: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-schedRow.is-disabled::before { background: var(--dsw-alias-border-l2, #e5e6eb); }
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
/* ── 定时编辑表单：三步向导卡片（发送给谁 / 什么时候 / 做什么） ──
   宽度自适应面板：字段一律单列堆叠、控件宽度 100%、容器 min-width:0，
   窄面板不挤压文字、不产生横向滚动条；宽面板自动铺满，间距由 clamp 收敛。 */
.qbot-schedForm { gap: 14px; counter-reset: qbot-schedStep; min-width: 0; padding-bottom: 2px; }
.qbot-schedSection {
  min-width: 0; width: 100%; max-width: 100%; box-sizing: border-box;
  border: 1px solid var(--dsw-alias-border-l2, #e5e6eb);
  border-radius: 14px;
  background: var(--dsw-alias-bg-layer-1, #fff);
  box-shadow: 0 1px 3px rgb(31 35 41 / 5%);
  transition: border-color .16s ease, box-shadow .16s ease;
}
.qbot-schedSection:focus-within { border-color: color-mix(in srgb, var(--qbot-business) 42%, var(--dsw-alias-border-l2, #e5e6eb)); box-shadow: 0 2px 10px color-mix(in srgb, var(--qbot-business) 12%, transparent); }
.qbot-schedSectionHead {
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
  padding: 12px clamp(12px, 3%, 16px);
  border-bottom: 1px solid var(--dsw-alias-border-l1, #eef0f3);
  border-radius: 13px 13px 0 0;
  background: linear-gradient(100deg, color-mix(in srgb, var(--qbot-business) 9%, var(--dsw-alias-bg-layer-1, #fff)), var(--dsw-alias-bg-layer-1, #fff) 78%);
}
/* 步骤序号：实心品牌圆牌，由 CSS 计数器生成，与文案解耦，随语言切换保持 1/2/3 顺序 */
.qbot-schedSectionHead::before {
  counter-increment: qbot-schedStep;
  content: counter(qbot-schedStep);
  flex: none;
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--qbot-business), color-mix(in srgb, var(--qbot-business) 78%, var(--qbot-blue, #3370ff)));
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  box-shadow: 0 2px 5px color-mix(in srgb, var(--qbot-business) 32%, transparent);
}
.qbot-schedSectionTitle { flex: 1 1 auto; min-width: 0; font-size: 14px; font-weight: 680; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-schedSectionDesc { flex: 1 1 100%; min-width: 0; margin-left: 34px; font-size: 12px; line-height: 1.5; color: var(--dsw-alias-label-tertiary, #8f959e); overflow-wrap: anywhere; }
.qbot-schedSectionBody { min-width: 0; display: flex; flex-direction: column; gap: 15px; padding: 15px clamp(12px, 3%, 16px) 17px; }
/* 字段行 / 编辑栅格：一律单列竖向堆叠（步骤式配置），子项允许收缩 */
.qbot-schedFieldRow, .qbot-editGrid { min-width: 0; display: grid; grid-template-columns: minmax(0, 1fr); gap: 14px; align-items: start; }
.qbot-schedFieldCol { min-width: 0; display: flex; flex-direction: column; gap: 14px; }
/* 触发条件分段按钮：等宽弹性铺满，绝不横向溢出（窄面板由省略号收敛） */
.qbot-schedSeg { min-width: 0; max-width: 100%; width: 100%; box-sizing: border-box; display: flex; flex-wrap: nowrap; gap: 4px; padding: 3px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-segBtn { flex: 1 1 0; min-width: 0; padding: 5px 6px; border: 1px solid transparent; border-radius: 8px; background: transparent; color: var(--dsw-alias-label-secondary, #646a73); font: inherit; font-size: 12.5px; line-height: 1.4; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; cursor: pointer; transition: background .15s ease, color .15s ease; }
.qbot-segBtn:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-segBtn.is-on { background: var(--dsw-alias-bg-layer-1, #fff); border-color: var(--dsw-alias-border-l2, #e5e6eb); color: var(--qbot-business); font-weight: 600; box-shadow: 0 1px 2px rgb(31 35 41 / 6%); }
/* 勾选框行：原生 checkbox + 状态文字，整行可点 */
.qbot-checkRow { min-width: 0; align-self: flex-start; display: inline-flex; align-items: center; gap: 9px; padding: 7px 12px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 9px; background: var(--dsw-alias-bg-layer-1, #fff); cursor: pointer; transition: border-color .16s ease, background .16s ease; }
.qbot-checkRow:hover { border-color: color-mix(in srgb, var(--qbot-business) 45%, var(--dsw-alias-border-l2, #e5e6eb)); }
.qbot-checkRow:has(.qbot-checkbox:checked) { border-color: color-mix(in srgb, var(--qbot-business) 42%, transparent); background: color-mix(in srgb, var(--qbot-business) 6%, var(--dsw-alias-bg-layer-1, #fff)); }
.qbot-checkbox { appearance: none; flex: none; width: 17px; height: 17px; margin: 0; border: 1.5px solid var(--dsw-alias-border-l2, #c9cdd4); border-radius: 5px; background: var(--dsw-alias-bg-layer-1, #fff); cursor: pointer; position: relative; transition: background .15s ease, border-color .15s ease; }
.qbot-checkbox:hover { border-color: var(--qbot-business); }
.qbot-checkbox:checked { background: var(--qbot-business); border-color: var(--qbot-business); }
.qbot-checkbox:checked::after { content: ""; position: absolute; left: 5px; top: 2px; width: 4px; height: 8px; border: solid #fff; border-width: 0 2px 2px 0; transform: rotate(45deg); }
.qbot-checkbox:focus-visible { outline: 2px solid color-mix(in srgb, var(--qbot-business) 45%, transparent); outline-offset: 2px; }
.qbot-checkText { min-width: 0; font-size: 13px; line-height: 1.4; color: var(--dsw-alias-label-secondary, #646a73); }
.qbot-checkRow:has(.qbot-checkbox:checked) .qbot-checkText { color: var(--qbot-business); font-weight: 600; }
/* 星期过滤：七等分网格，随面板宽度自适应，不再固定像素导致溢出 */
.qbot-weekdayPicker { min-width: 0; display: flex; flex-direction: column; gap: 8px; }
.qbot-weekdayRow { min-width: 0; display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 5px; }
.qbot-weekdayBtn { min-width: 0; height: 32px; padding: 0; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 8px; background: var(--dsw-alias-bg-layer-1, #fff); color: var(--dsw-alias-label-secondary, #646a73); font: inherit; font-size: 13px; cursor: pointer; transition: background .12s ease, color .12s ease, border-color .12s ease; }
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
/* 数字输入 + 单位：单位紧随其后，输入框吃满剩余宽度，
   右边缘与同列的下拉 / 文本域对齐（全表单控件宽度一致） */
.qbot-schedNumber { min-width: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.qbot-schedNumber .qbot-input { flex: 1 1 auto; width: 100%; min-width: 0; max-width: none; }
.qbot-schedUnit { font-size: 12px; color: var(--dsw-alias-label-tertiary, #8f959e); }
/* cron 预览 */
.qbot-schedPreview { min-width: 0; padding: 7px 12px; border: 1px solid color-mix(in srgb, var(--qbot-business) 30%, transparent); border-left: 3px solid var(--qbot-business); border-radius: 8px; background: color-mix(in srgb, var(--qbot-business) 8%, transparent); color: var(--dsw-alias-label-primary, #1f2329); font-size: 12.5px; line-height: 1.5; overflow-wrap: anywhere; }
.qbot-schedPreview.is-warn { border-color: var(--dsw-alias-state-warn-primary, #d97706); border-left-color: var(--dsw-alias-state-warn-primary, #d97706); background: color-mix(in srgb, var(--dsw-alias-state-warn-primary, #d97706) 10%, transparent); }
/* 时区：下拉 + 自定义输入 */
.qbot-schedTz { display: flex; flex-direction: column; gap: 6px; }
.qbot-schedTz .qbot-settingSelect { max-width: 100%; }
/* 表单内控件宽度统一：输入框 / 文本域 / 下拉 / 接收对象选择器一律铺满当前列，
   右边缘互相对齐，宽度随面板变化保持一致。
   写在具体控件规则之后，用于覆盖 .qbot-settingSelect 的全局 260px 上限等问题。 */
.qbot-schedForm .qbot-input,
.qbot-schedForm .qbot-textarea,
.qbot-schedForm .qbot-settingSelect,
.qbot-schedForm .qbot-idPicker,
.qbot-schedForm .qbot-idPicker .qbot-input { width: 100%; min-width: 0; max-width: 100%; box-sizing: border-box; }
/* 命令编辑区 */
.qbot-schedCmd { display: flex; flex-direction: column; gap: 8px; }
.qbot-schedCmd .qbot-textarea { resize: vertical; }
/* ── 定时消息编辑表单：标签 + 控件 + 提示 竖向三行式（步骤内单列堆叠） ── */
.qbot-editForm { min-width: 0; width: 100%; max-width: 100%; box-sizing: border-box; display: flex; flex-direction: column; gap: 14px; padding: 14px 16px 18px; }
/* 定时消息编辑视图：编辑表单放在无边的 modalBody 里，与带边框的列表容器区分。
   overflow-x: hidden 是「不出现横向滚动条」的兜底（overflow-y:auto 会把另一轴隐式变为 auto）。 */
.qbot-modalBody { flex: 1 1 auto; min-width: 0; min-height: 140px; margin: 12px 0 0; overflow: hidden; display: flex; flex-direction: column; }
.qbot-modalBody .qbot-editForm { flex: 1 1 auto; min-width: 0; min-height: 0; overflow-y: auto; overflow-x: hidden; padding: 14px var(--qbot-gutter, 20px) 18px; overscroll-behavior: contain; }
/* 群覆盖弹窗：editForm 直接作为 modalList（overflow:hidden）的子元素，内容超高时自身成为滚动层，
   否则超出部分被裁掉无法查看/编辑（弹窗高度固定 72vh，字段多时必然溢出）。 */
.qbot-modalList > .qbot-editForm { flex: 1 1 auto; min-width: 0; min-height: 0; overflow-y: auto; overflow-x: hidden; overscroll-behavior: contain; }
/* 注：.qbot-editGrid 已在上方「定时编辑表单」块中与 .qbot-schedFieldRow 统一为单列，此处不再重复定义。 */
.qbot-editRow { min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.qbot-editRow > * { min-width: 0; max-width: 100%; }
.qbot-editLabel { min-width: 0; font-size: 13px; font-weight: 600; line-height: 1.45; color: var(--dsw-alias-label-primary, #1f2329); overflow-wrap: anywhere; }
.qbot-editHint { min-width: 0; font-size: 12px; line-height: 1.5; color: var(--dsw-alias-label-tertiary, #8f959e); overflow-wrap: anywhere; }
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

/* ── 详情页：面包屑（只标位置；身份与状态统一由 hero 承载） ────────────── */
.qbot-detailNav { position: sticky; top: 0; z-index: 40; min-width: 0; display: flex; align-items: center; gap: 12px; margin: -2px 0 0; padding: 8px 2px 6px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-detailCrumb { min-width: 0; display: flex; align-items: center; gap: 10px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: normal; }
.qbot-detailCrumbSep { color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-detailCrumb > span:last-child { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--dsw-alias-label-primary, #1f2329); }
/* 平台能力操作结果：贴着面包屑下方吸顶，只有警告 / 操作成功才出现，5 秒自动消失。 */
/* 层级必须高于 sticky 的标题栏(40)与返回栏(40)，否则 top:42px 处会被标题栏压住只露一条边。 */
.qbot-detailToast { position: sticky; top: 68px; z-index: 41; min-width: 0; margin: 4px 0 0; padding: 10px 12px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 9px; font-size: 12.5px; line-height: 1.55; overflow-wrap: anywhere; cursor: pointer; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 6px 18px rgb(31 35 41 / 14%); }
.qbot-detailToast.is-error { border: 1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 35%, transparent); background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 8%, var(--dsw-alias-bg-layer-1, #fff)); color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-detailToast.is-success { border: 1px solid color-mix(in srgb, var(--qbot-business) 35%, transparent); background: color-mix(in srgb, var(--qbot-business) 8%, var(--dsw-alias-bg-layer-1, #fff)); color: var(--qbot-business); }

/* ── 详情页：概览横幅 ─────────────────────────────────────────────────── */
.qbot-hero { position: relative; overflow: hidden; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 14px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 1px 2px rgb(31 35 41 / 3%); }
.qbot-hero::before { content: ""; position: absolute; inset: 0 0 auto; height: 3px; background: linear-gradient(90deg, var(--qbot-blue), color-mix(in srgb, var(--qbot-blue) 25%, transparent)); }
.qbot-heroMain { display: flex; align-items: center; gap: 14px; padding: 20px 20px 14px; }
.qbot-heroAvatar { flex: none; width: 52px; height: 52px; display: grid; place-items: center; border-radius: 16px; color: #fff; background: linear-gradient(140deg, #3d8bff, var(--qbot-blue-dark)); box-shadow: 0 8px 20px rgb(22 119 255 / 22%); }
.qbot-heroAvatar svg { width: 30px; height: 30px; }
.qbot-heroIdentity { min-width: 0; flex: 1 1 auto; display: flex; flex-direction: column; gap: 6px; }
.qbot-heroNameRow { min-width: 0; display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
.qbot-heroNameRow h2 { margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font: 700 18px/1.3 ui-monospace, SFMono-Regular, Menlo, monospace; overflow-wrap: anywhere; }
.qbot-chip { flex: none; max-width: 100%; overflow: hidden; text-overflow: ellipsis; padding: 2px 9px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 999px; color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-bg-module-platform, #f7f8fa); font-size: 11px; font-weight: 600; line-height: 17px; white-space: nowrap; }
.qbot-chip.is-active { border-color: color-mix(in srgb, var(--qbot-business) 32%, transparent); color: var(--qbot-business); background: color-mix(in srgb, var(--qbot-business) 10%, transparent); }
.qbot-heroMeta { display: flex; align-items: center; gap: 8px; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 12px; line-height: normal; }
.qbot-metaDot { width: 3px; height: 3px; border-radius: 50%; background: currentColor; opacity: .6; }
/* 状态压成一行 inline，不再用表格状三格；窄容器自动换行。 */
.qbot-heroStatusLine { display: flex; align-items: center; flex-wrap: wrap; gap: 8px 18px; margin: 0 20px 18px; padding: 9px 13px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-heroStatusItem { min-width: 0; display: inline-flex; align-items: center; gap: 7px; font-size: 12px; line-height: normal; }
.qbot-heroStatusItem + .qbot-heroStatusItem { padding-left: 18px; border-left: 1px solid var(--dsw-alias-border-l2, #e5e6eb); }
.qbot-heroStatusLabel { color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-heroStatusItem strong { color: var(--dsw-alias-label-primary, #1f2329); font-weight: 650; font-variant-numeric: tabular-nums; }

/* ── 详情页：分组网格（运行 / 配置 / 管理） ──────────────────────────────
   auto-fit + minmax 按「网格自身可用宽度」决定列数：够 652px 就两列，否则一列，
   不依赖容器查询（避免给祖先加 containment 影响 sticky 面包屑），也不依赖视口宽度。
   分组标题与「已展开」的分区横跨整行——表单行是「说明 + 控件」双列结构，
   半宽下会被挤成窄缝，展开即独占一行也避免把邻卡拉高。 */
.qbot-detailGrid { min-width: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr)); gap: 12px; align-items: stretch; }
/* 详情页横向 Tab：运行 / 配置 / 管理 */
.qbot-detailTabs { display: flex; align-items: stretch; gap: 4px; padding: 3px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-detailTab { flex: 1 1 0; min-width: 0; display: inline-flex; align-items: center; justify-content: center; gap: 7px; height: 34px; padding: 0 10px; border: 0; border-radius: 8px; color: var(--dsw-alias-label-secondary, #646a73); background: transparent; font: inherit; font-size: 13px; font-weight: 600; line-height: normal; white-space: nowrap; cursor: pointer; transition: background .14s ease, color .14s ease, box-shadow .14s ease; }
.qbot-detailTab:hover { color: var(--dsw-alias-label-primary, #1f2329); background: color-mix(in srgb, var(--dsw-alias-bg-layer-1, #fff) 55%, transparent); }
.qbot-detailTab.is-active { color: var(--qbot-blue); background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 1px 3px rgb(31 35 41 / 10%); }
.qbot-detailTabCount { flex: none; min-width: 18px; padding: 1px 6px; border-radius: 999px; color: var(--dsw-alias-label-tertiary, #8f959e); background: color-mix(in srgb, var(--dsw-alias-label-tertiary, #8f959e) 12%, transparent); font-size: 11px; line-height: 16px; text-align: center; font-variant-numeric: tabular-nums; }
.qbot-detailTab.is-active .qbot-detailTabCount { color: var(--qbot-blue); background: color-mix(in srgb, var(--qbot-blue) 12%, transparent); }
/* 所有分区卡（展开 / 折叠）始终占满整行，不再并排缩成半列。 */
.qbot-detailGrid > .qbot-section { grid-column: 1 / -1; align-self: start; }

/* 分区头：彩色图标 + 标题 + 一句说明 + 当前值摘要 chip */
.qbot-sectionIcon { flex: none; width: 28px; height: 28px; display: grid; place-items: center; border-radius: 9px; color: var(--qbot-business, #3370ff); background: color-mix(in srgb, var(--qbot-business, #3370ff) 10%, transparent); font-size: 14px; line-height: 1; }
.qbot-sectionIcon[data-tone="success"] { color: var(--dsw-alias-state-success-primary, #20a162); background: color-mix(in srgb, var(--dsw-alias-state-success-primary, #20a162) 12%, transparent); }
.qbot-sectionIcon[data-tone="warning"] { color: var(--dsw-alias-state-warn-primary, #d97706); background: color-mix(in srgb, var(--dsw-alias-state-warn-primary, #d97706) 12%, transparent); }
.qbot-sectionIcon[data-tone="danger"] { color: var(--dsw-alias-state-error-primary, #d54941); background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 12%, transparent); }
.qbot-sectionSummary { align-self: flex-start; max-width: 100%; min-width: 0; margin-top: 5px; padding: 2px 8px; border-radius: 999px; color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-bg-module-platform, #f7f8fa); font-size: 11px; line-height: 16px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* 快捷入口卡：整卡可点，视觉与折叠卡对齐 */
.qbot-actionCard { width: 100%; min-width: 0; display: flex; align-items: center; gap: 12px; padding: 14px 16px; font: inherit; text-align: left; cursor: pointer; transition: border-color .16s ease, background .16s ease; }
.qbot-actionCard:hover:not(:disabled) { border-color: color-mix(in srgb, var(--qbot-business, #3370ff) 45%, var(--dsw-alias-border-l2, #e5e6eb)); background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-actionCard:disabled { cursor: default; opacity: .6; }
.qbot-actionCard .qbot-sectionTitle { flex: 1 1 auto; }
.qbot-actionCardTitle { color: var(--dsw-alias-label-primary, #1f2329); font-size: 15px; line-height: normal; font-weight: 680; }
.qbot-actionCardDesc { color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 1.5; }
.qbot-actionCard .qbot-sectionChevron { margin-left: 0; font-size: 16px; }

.qbot-heroFoot { display: flex; align-items: flex-start; gap: 10px; margin: 0 20px 18px; padding: 10px 13px; border: 1px solid color-mix(in srgb, var(--dsw-alias-state-warn-primary, #d97706) 24%, var(--dsw-alias-border-l2, #dfe1e5)); border-radius: 9px; color: var(--dsw-alias-label-secondary, #646a73); background: color-mix(in srgb, var(--dsw-alias-state-warn-primary, #d97706) 7%, var(--dsw-alias-bg-layer-1, #fff)); font-size: 12px; line-height: 1.6; overflow-wrap: anywhere; }

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
.qbot-sectionHead { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 92px; box-sizing: border-box; padding: 14px 16px; border-bottom: 1px solid var(--dsw-alias-border-l1, #eef0f3); background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-sectionTitle { min-width: 0; flex: 1 1 auto; display: flex; flex-direction: column; gap: 3px; }
.qbot-sectionTitle h3 { margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 15px; line-height: normal; font-weight: 680; }
.qbot-sectionTitle p { margin: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 1.6; }
/* 危险区只靠边框 + 图标辨识，标题保持主色（红字读起来像报错，不是分区） */
.qbot-section.is-danger .qbot-sectionTitle h3 { color: var(--dsw-alias-label-primary, #1f2329); }
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
/* 关于卡：版本 / 作者 / 许可证 / 开源地址 */
.qbot-aboutList { display: flex; flex-direction: column; }
.qbot-aboutRow { display: flex; align-items: center; justify-content: space-between; gap: 16px; min-width: 0; padding: 10px 2px; border-bottom: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
.qbot-aboutRow > span { min-width: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 13px; }
.qbot-aboutRow > code, .qbot-aboutRow > strong { min-width: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; font-weight: 600; line-height: normal; text-align: right; overflow-wrap: anywhere; }
.qbot-aboutRow > code { font: 13px ui-monospace, SFMono-Regular, Menlo, monospace; }

/* ── 平台能力（设置页管理 Tab：分享链接 / 菜单 / 面板 / 卡片 / 审批 / 群管理） ──
   布局已改为左侧分组导航（见下方 .qbot-ptLayout / .qbot-ptNav*），与频道管理同款。 */
/* 选群入口卡：淡品牌色底 + 左侧步骤标签。 */
.qbot-ptPickCard { min-width: 0; display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; padding: 12px; border: 1px solid color-mix(in srgb, var(--qbot-business) 25%, transparent); border-radius: 11px; background: color-mix(in srgb, var(--qbot-business) 4%, var(--dsw-alias-bg-layer-1, #fff)); }
.qbot-ptStepTag { align-self: flex-start; padding: 2px 8px; border-radius: 6px; background: color-mix(in srgb, var(--qbot-business) 12%, transparent); color: var(--qbot-business); font-size: 11px; font-weight: 600; }
/* 子标签导航：横向可换行，选中态品牌色下划线。 */
.qbot-ptSubNav { min-width: 0; display: flex; flex-wrap: wrap; gap: 4px; padding: 3px; border-radius: 10px; background: var(--dsw-alias-bg-layer-2, #f7f8fa); }
.qbot-ptSubTab { min-width: 0; padding: 6px 12px; border: 0; border-radius: 8px; background: transparent; color: var(--dsw-alias-label-secondary, #646a73); font: inherit; font-size: 12.5px; cursor: pointer; white-space: nowrap; }
.qbot-ptSubTab:hover { background: var(--dsw-alias-interactive-bg-hover, #f2f3f5); color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-ptSubTab.is-active { background: var(--dsw-alias-bg-layer-1, #fff); color: var(--qbot-business); font-weight: 600; box-shadow: 0 1px 4px rgb(31 35 41 / 8%); }
.qbot-ptSubPane { min-width: 0; }
/* 未选群空态引导。 */
.qbot-ptEmpty { min-width: 0; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 26px 14px; border: 1px dashed var(--dsw-alias-border-l2, #e5e6eb); border-radius: 11px; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 12.5px; text-align: center; }
.qbot-ptEmptyIcon { font-size: 18px; color: var(--dsw-alias-label-tertiary, #8f959e); }
/* 操作按钮行：与上方内容分隔，避免挤在一起。 */
.qbot-ptOps { padding-top: 8px; border-top: 1px dashed var(--dsw-alias-border-l1, #eef0f3); }
/* 能力卡片分区：每个能力一块，标题 + 说明 + 内容。 */
.qbot-ptBlock { min-width: 0; display: flex; flex-direction: column; gap: 10px; padding: 12px 14px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 12px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-ptBlockHead { min-width: 0; display: flex; flex-direction: column; gap: 3px; padding-bottom: 8px; border-bottom: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
.qbot-ptBlockTitle { font-size: 13px; font-weight: 600; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-ptBlockDesc { font-size: 12px; line-height: 1.5; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-ptRow { min-width: 0; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.qbot-ptShareUrl { min-width: 0; flex: 1 1 220px; font-size: 12px; color: var(--dsw-alias-label-secondary, #646a73); overflow-wrap: anywhere; }
.qbot-ptFieldLabel { flex: none; font-size: 12px; color: var(--dsw-alias-label-secondary, #646a73); }
/* 图文卡片·被动回复选择区。 */
.qbot-ptReply { min-width: 0; display: flex; flex-direction: column; gap: 7px; padding: 9px 11px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-bg-layer-2, #f7f8fa); }
.qbot-ptReplySelect { width: 100%; }
.qbot-ptTextarea { min-width: 0; width: 100%; box-sizing: border-box; padding: 9px 11px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 9px; background: var(--dsw-alias-bg-layer-1, #fff); color: var(--dsw-alias-label-primary, #1f2329); font: 12px ui-monospace, SFMono-Regular, Menlo, monospace; line-height: 1.55; resize: vertical; }
.qbot-ptTextarea:focus { outline: none; border-color: var(--qbot-business); }
.qbot-ptList { min-width: 0; display: flex; flex-direction: column; gap: 6px; }
.qbot-ptPanelRow { min-width: 0; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 7px 10px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 9px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-ptPanelRow > .qbot-mono { font-size: 11.5px; color: var(--dsw-alias-label-tertiary, #8f959e); overflow-wrap: anywhere; }
.qbot-ptPanelRemark { min-width: 0; flex: 1 1 120px; font-size: 12px; color: var(--dsw-alias-label-secondary, #646a73); overflow-wrap: anywhere; }
.qbot-ptGrid { min-width: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap: 8px; }
.qbot-ptField { min-width: 0; display: flex; flex-direction: column; gap: 5px; font-size: 12px; color: var(--dsw-alias-label-secondary, #646a73); }
.qbot-ptFieldWide { grid-column: 1 / -1; }
.qbot-ptFieldHint { font-size: 11px; line-height: 1.5; color: var(--dsw-alias-label-tertiary, #8f959e); overflow-wrap: anywhere; }
/* Combo 放进纵向 Field 时不能被 flex:1 1 240px 当高度撑高整行。 */
.qbot-ptField > .qbot-ptCombo { flex: 0 0 auto; width: 100%; }
.qbot-ptGroupPick { min-width: 0; flex: 1 1 240px; }
/* ── 群 / openid 可搜索选择器（按钮 + 弹出搜索面板，候选项带来源徽章） ── */
.qbot-ptCombo { position: relative; min-width: 0; flex: 1 1 240px; }
.qbot-ptComboBtn { min-width: 0; width: 100%; height: 32px; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 0 10px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 9px; background: var(--dsw-alias-bg-layer-1, #fff); color: var(--dsw-alias-label-tertiary, #8f959e); font: inherit; font-size: 12.5px; text-align: left; cursor: pointer; }
.qbot-ptComboBtn.is-on { color: var(--dsw-alias-label-primary, #1f2329); border-color: color-mix(in srgb, var(--qbot-business) 40%, var(--dsw-alias-border-l2, #e5e6eb)); }
.qbot-ptComboBtn:hover { border-color: var(--qbot-business); }
.qbot-ptComboBtnText { min-width: 0; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
/* fixed 定位挂到 body，避开 .qbot-section 的 overflow:hidden 裁切；坐标由 JS 计算（下方不够则翻到上方）。
   z-index 高于弹窗遮罩（9999）、低于全局确认框（10010），保证平台能力弹窗内也能正常展开。 */
.qbot-ptComboPanel { position: fixed; z-index: 10005; overflow: hidden; padding: 6px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 10px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 8px 24px rgb(31 35 41 / 12%); display: flex; flex-direction: column; gap: 5px; }
.qbot-ptComboSearch { width: 100%; flex: none; }
.qbot-ptComboList { flex: 1 1 auto; min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 2px; }
.qbot-ptComboItem { min-width: 0; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; padding: 6px 8px; border: 0; border-radius: 7px; background: transparent; color: var(--dsw-alias-label-primary, #1f2329); text-align: left; cursor: pointer; }
.qbot-ptComboItem:hover { background: var(--dsw-alias-interactive-bg-hover, #f2f3f5); }
.qbot-ptComboItem.is-on { background: color-mix(in srgb, var(--qbot-business) 12%, transparent); }
.qbot-ptComboItemLabel { min-width: 0; flex: 1 1 130px; font-size: 12px; overflow-wrap: anywhere; }
.qbot-ptComboSource { flex: none; padding: 1px 6px; border-radius: 6px; font-size: 10.5px; line-height: 1.6; color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-interactive-bg-hover, #f2f3f5); }
.qbot-ptComboSource.is-config { color: var(--qbot-business); background: color-mix(in srgb, var(--qbot-business) 10%, transparent); }
.qbot-ptComboItemHint { flex: 1 1 100%; font-size: 10.5px; color: var(--dsw-alias-label-tertiary, #8f959e); overflow-wrap: anywhere; }
.qbot-ptComboEmpty { padding: 8px 9px; font-size: 12px; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-ptComboManual { padding: 6px 9px; border: 1px dashed var(--dsw-alias-border-l2, #e5e6eb); border-radius: 7px; background: color-mix(in srgb, var(--qbot-business) 5%, transparent); color: var(--qbot-business); font-size: 11.5px; text-align: left; cursor: pointer; overflow-wrap: anywhere; }
.qbot-ptComboManual:hover { border-color: var(--qbot-business); }
/* ── 平台能力弹窗：头部下方吸顶提示 + 自滚动主体 ── */
.qbot-ptDialogToast { position: static; top: auto; z-index: auto; margin: 0 20px 2px; }
.qbot-ptDialogBody { flex: 1 1 auto; min-width: 0; min-height: 0; overflow: hidden; display: flex; }
.qbot-ptModal { width: min(980px, 100%); height: min(84vh, 800px); }
/* 群聊管理：左侧分组导航（群聊 / 通用两大组），与频道管理同款布局。 */
.qbot-ptLayout { flex: 1 1 auto; min-width: 0; min-height: 0; display: flex; }
.qbot-ptNav { flex: none; width: 168px; display: flex; flex-direction: column; gap: 3px; padding: 14px 10px; border-right: 1px solid var(--dsw-alias-border-l1, #eef0f3); background: var(--dsw-alias-bg-module-platform, #f7f8fa); overflow-y: auto; overscroll-behavior: contain; }
.qbot-ptNavGroup { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.qbot-ptNavGroup + .qbot-ptNavGroup { margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
.qbot-ptNavGroupTitle { flex: none; padding: 3px 10px 5px; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; font-weight: 650; letter-spacing: 0.4px; }
.qbot-ptNavItem { flex: none; min-width: 0; display: flex; align-items: center; gap: 8px; padding: 8px 10px; border: 1px solid transparent; border-radius: 9px; color: var(--dsw-alias-label-secondary, #646a73); background: transparent; font: inherit; font-size: 12.5px; text-align: left; cursor: pointer; }
.qbot-ptNavItem:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-ptNavItem.is-active { border-color: color-mix(in srgb, var(--qbot-blue, #1677ff) 32%, transparent); background: var(--dsw-alias-bg-layer-1, #fff); color: var(--qbot-blue, #1677ff); font-weight: 650; }
.qbot-ptNavIcon { flex: none; width: 18px; text-align: center; font-size: 14px; }
.qbot-ptContent { flex: 1 1 auto; min-width: 0; min-height: 0; padding: 16px 20px 20px; overflow-x: hidden; overflow-y: auto; overscroll-behavior: contain; }
.qbot-ptDialogFoot { border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
/* ── 权限状态横幅 ── */
.qbot-ptPerm { min-width: 0; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; padding: 9px 12px; border-radius: 10px; font-size: 12px; line-height: 1.55; }
.qbot-ptPerm.is-checking { border: 1px solid var(--dsw-alias-border-l1, #eef0f3); background: var(--dsw-alias-bg-layer-2, #f7f8fa); color: var(--dsw-alias-label-secondary, #646a73); }
.qbot-ptPerm.is-admin { border: 1px solid color-mix(in srgb, var(--qbot-business) 28%, transparent); background: color-mix(in srgb, var(--qbot-business) 6%, transparent); color: var(--qbot-business); }
.qbot-ptPerm.is-member, .qbot-ptPerm.is-error { border: 1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 28%, transparent); background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 6%, transparent); color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-ptPermBadge { flex: none; padding: 2px 8px; border-radius: 6px; background: color-mix(in srgb, currentColor 12%, transparent); font-weight: 600; font-size: 11px; }
.qbot-ptPermText { min-width: 0; flex: 1 1 200px; overflow-wrap: anywhere; }
.qbot-ptPermRetry { flex: none; }
.qbot-ptPermTip { min-width: 0; padding: 6px 10px; border-left: 3px solid var(--dsw-alias-state-error-primary, #d54941); background: var(--dsw-alias-bg-layer-2, #f7f8fa); color: var(--dsw-alias-state-error-primary, #d54941); font-size: 11.5px; }
.qbot-ptGroupId { min-width: 0; flex: 1 1 200px; font: 11px ui-monospace, SFMono-Regular, Menlo, monospace; color: var(--dsw-alias-label-tertiary, #8f959e); overflow-wrap: anywhere; }
/* ── 群资料栅格 ── */
.qbot-ptInfoGrid { min-width: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap: 8px; }
/* 指令面板：列表元信息 / 编辑表单 */
.qbot-ptPanelMeta { min-width: 0; flex: 1 1 100%; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.qbot-ptPanelForm { min-width: 0; display: flex; flex-direction: column; gap: 8px; padding: 10px 11px; border: 1px solid color-mix(in srgb, var(--qbot-business) 25%, transparent); border-radius: 10px; background: color-mix(in srgb, var(--qbot-business) 4%, var(--dsw-alias-bg-layer-1, #fff)); }
.qbot-ptPanelForm .qbot-settingInput:disabled,
.qbot-ptPanelForm .qbot-ptTextarea:disabled,
.qbot-ptPanelForm .qbot-settingSelect:disabled,
.qbot-ptPanelForm .qbot-checkbox:disabled { opacity: 1; cursor: default; color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-bg-layer-2, #f7f8fa); border-color: var(--dsw-alias-border-l1, #eef0f3); }
.qbot-ptPanelHelp { min-width: 0; border: 1px dashed color-mix(in srgb, var(--qbot-business) 40%, transparent); border-radius: 9px; padding: 7px 10px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-ptPanelHelp > summary { cursor: pointer; font-size: 12px; color: var(--qbot-business); font-weight: 600; }
.qbot-ptPanelHelpCode { margin: 9px 0 2px; padding: 9px 11px; white-space: pre-wrap; overflow-wrap: anywhere; font: 11.5px/1.6 ui-monospace, SFMono-Regular, Menlo, monospace; color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-bg-layer-2, #f7f8fa); border-radius: 8px; }
.qbot-ptItemCard { min-width: 0; display: flex; flex-direction: column; gap: 9px; padding: 10px 11px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 9px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-ptItemHead { display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; }
.qbot-ptItemHeadOps { min-width: 0; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.qbot-ptItemNo { font-size: 12px; font-weight: 650; color: var(--dsw-alias-label-secondary, #646a73); }
/* 查看模式的「仅管理员可见」状态徽标：明确显示是/否，勾选态一眼可见。 */
.qbot-ptAdminBadge { font-size: 11.5px; padding: 3px 9px; border-radius: 6px; color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-bg-layer-2, #f7f8fa); border: 1px solid var(--dsw-alias-border-l1, #eef0f3); white-space: nowrap; }
.qbot-ptAdminBadge.is-on { color: var(--qbot-business); background: color-mix(in srgb, var(--qbot-business) 10%, transparent); border-color: color-mix(in srgb, var(--qbot-business) 30%, transparent); }
/* 查看模式的命令值纯文本回显 + 无效值提醒。 */
.qbot-ptCmdReadonly { min-height: 32px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 6px 10px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 7px; background: var(--dsw-alias-bg-layer-2, #f7f8fa); font-size: 12px; overflow-wrap: anywhere; }
.qbot-ptCmdWarn { font-size: 11px; color: var(--dsw-alias-state-error-primary, #d54941); }
/* 元素字段两列固定栅格：类型较窄、名称较宽，描述/链接整行。 */
.qbot-ptItemGrid { min-width: 0; display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.4fr); gap: 9px 10px; }
.qbot-ptItemGrid .qbot-ptFieldWide { grid-column: 1 / -1; }
.qbot-ptItemGrid .qbot-ptField > .qbot-settingInput,
.qbot-ptItemGrid .qbot-ptField > .qbot-settingSelect { width: 100%; box-sizing: border-box; }
/* 「删除按钮」改为轻量危险按钮，不抢主操作视觉。 */
.qbot-ptItemDel { min-height: 28px; padding: 0 9px; font-size: 11.5px; color: var(--dsw-alias-state-error-primary, #d54941); border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 28%, var(--dsw-alias-border-l2, #dfe1e5)); background: transparent; }
/* 表单底部操作栏：添加靠左、保存/取消靠右并分开。 */
.qbot-ptPanelActions { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; padding-top: 10px; margin-top: 2px; border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
.qbot-ptPanelActionsEnd { margin-left: auto; }
.qbot-ptAddBtn { border-style: dashed; color: var(--qbot-business); }
.qbot-ptSelf { min-width: 0; display: flex; flex-direction: column; gap: 8px; padding-top: 9px; border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
.qbot-ptInfoCell { min-width: 0; display: flex; flex-direction: column; gap: 3px; padding: 8px 10px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 9px; background: var(--dsw-alias-bg-layer-2, #f7f8fa); }
.qbot-ptInfoLabel { font-size: 11px; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-ptInfoValue { min-width: 0; font-size: 12.5px; color: var(--dsw-alias-label-primary, #1f2329); overflow-wrap: anywhere; }
.qbot-ptTags { display: inline-flex; flex-wrap: wrap; gap: 4px; }
/* ── 成员行 / 搜索 ── */
.qbot-ptSearch { min-width: 0; flex: 1 1 180px; }
.qbot-ptMemberCheck { min-width: 0; flex: 1; display: flex; align-items: center; gap: 8px; cursor: pointer; }
.qbot-ptMemberInfo { flex: none; padding: 2px 8px; font-size: 12px; }
/* ── AI 群规审核：违规类型 + 配置/记录双 tab ───────────────────────────── */
.qbot-ptModCats { min-width: 0; display: flex; flex-wrap: wrap; gap: 6px 12px; }
.qbot-ptModCat { min-width: 0; display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--dsw-alias-label-primary, #1f2329); cursor: pointer; }
/* 判定尺度（宽松/标准/严格）：分类下方的一组单选按钮。 */
.qbot-ptModStrict { min-width: 0; display: flex; flex-direction: column; gap: 7px; margin-top: 11px; padding-top: 11px; border-top: 1px dashed var(--dsw-alias-border-l1, #eef0f3); }
.qbot-ptModStrictLabel { font-size: 12px; font-weight: 600; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-ptModPane { min-width: 0; display: flex; flex-direction: column; gap: 12px; }
/* 配置 Hero：状态总览卡，开启时用品牌色渐变强调。 */
.qbot-ptModHero { min-width: 0; display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap; padding: 15px 17px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 14px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 2px 10px rgb(31 35 41 / 4%); }
.qbot-ptModHero.is-on { border-color: color-mix(in srgb, var(--qbot-business) 32%, transparent); background: linear-gradient(120deg, color-mix(in srgb, var(--qbot-business) 9%, var(--dsw-alias-bg-layer-1, #fff)), var(--dsw-alias-bg-layer-1, #fff) 72%); }
.qbot-ptModHeroMain { min-width: 0; display: flex; flex-direction: column; gap: 6px; }
.qbot-ptModHeroTitle { min-width: 0; display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
.qbot-ptModHeroTitle > strong { font-size: 14px; font-weight: 700; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-ptModHeroIcon { flex: none; width: 28px; height: 28px; display: inline-grid; place-items: center; border-radius: 9px; background: var(--dsw-alias-interactive-bg-hover, #f2f3f5); color: var(--dsw-alias-label-secondary, #646a73); font-size: 15px; font-weight: 700; }
.qbot-ptModHero.is-on .qbot-ptModHeroIcon { background: var(--qbot-business); color: #fff; }
.qbot-ptModHeroDesc { min-width: 0; font-size: 11.5px; line-height: 1.55; color: var(--dsw-alias-label-secondary, #646a73); overflow-wrap: anywhere; }
.qbot-ptModHeroSummary { min-width: 0; display: flex; flex-wrap: wrap; gap: 6px; }
.qbot-ptModHeroSummary > span { display: inline-flex; padding: 2px 9px; border-radius: 999px; font-size: 11px; font-weight: 550; color: var(--qbot-business); background: color-mix(in srgb, var(--qbot-business) 9%, transparent); }
.qbot-ptModHeroActions { flex: none; display: flex; align-items: center; gap: 8px; }
/* 分组头：左侧色条 + 主标题 + 副标题，形成清晰的两段层次。 */
.qbot-ptModGroupHead { min-width: 0; display: flex; align-items: stretch; gap: 10px; margin-top: 2px; }
.qbot-ptModGroupBar { flex: none; width: 3px; border-radius: 3px; background: var(--qbot-business); }
.qbot-ptModGroupText { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.qbot-ptModGroupText strong { font-size: 13px; font-weight: 700; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-ptModGroupText span { font-size: 11px; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-ptModGroup { min-width: 0; display: flex; flex-direction: column; gap: 8px; }
/* 表单项：左 label（序号 + 标题 + 说明）+ 右控件区，Element UI 风格两栏布局。
   flex-wrap：宽面板两栏（label 固定 150px），窄面板自动堆叠，无需容器查询名。 */
.qbot-ptModStep { min-width: 0; display: flex; flex-wrap: wrap; align-items: flex-start; gap: 12px; padding: 13px 14px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 11px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-ptModStepHead { flex: 0 0 150px; min-width: 0; display: flex; align-items: flex-start; gap: 9px; padding-top: 5px; }
.qbot-ptModStepNo { flex: none; width: 20px; height: 20px; display: inline-grid; place-items: center; border-radius: 6px; background: var(--qbot-business); color: #fff; font-size: 11px; font-weight: 700; }
.qbot-ptModStepText { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.qbot-ptModStepText strong { font-size: 12.5px; font-weight: 650; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-ptModStepText span { font-size: 11px; line-height: 1.5; color: var(--dsw-alias-label-secondary, #646a73); overflow-wrap: anywhere; }
.qbot-ptModStepBody { flex: 1 1 280px; min-width: 0; display: flex; flex-direction: column; gap: 9px; }
/* 开关勾选行：整行可点，勾选后高亮。 */
.qbot-ptModCheck { min-width: 0; align-self: flex-start; display: inline-flex; align-items: center; gap: 9px; padding: 7px 12px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 9px; background: var(--dsw-alias-bg-layer-1, #fff); cursor: pointer; transition: border-color .16s ease, background .16s ease; }
.qbot-ptModCheck:hover { border-color: color-mix(in srgb, var(--qbot-business) 45%, var(--dsw-alias-border-l2, #e5e6eb)); }
.qbot-ptModCheck:has(.qbot-checkbox:checked) { border-color: color-mix(in srgb, var(--qbot-business) 45%, transparent); background: color-mix(in srgb, var(--qbot-business) 6%, var(--dsw-alias-bg-layer-1, #fff)); }
.qbot-ptModCheck > span { font-size: 12.5px; color: var(--dsw-alias-label-secondary, #646a73); }
.qbot-ptModCheck:has(.qbot-checkbox:checked) > span { color: var(--qbot-business); font-weight: 600; }
/* 单选框组：Element UI 风格圆点单选，横排可换行。 */
.qbot-ptModRadioGroup { min-width: 0; display: flex; flex-wrap: wrap; gap: 8px 18px; }
.qbot-ptModRadio { min-width: 0; display: inline-flex; align-items: center; gap: 7px; cursor: pointer; font-size: 12.5px; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-radio { appearance: none; flex: none; width: 16px; height: 16px; margin: 0; border: 1.5px solid var(--dsw-alias-border-l2, #c9cdd4); border-radius: 50%; background: var(--dsw-alias-bg-layer-1, #fff); cursor: pointer; position: relative; transition: border-color .15s ease; }
.qbot-radio:hover { border-color: var(--qbot-business); }
.qbot-radio:checked { border-color: var(--qbot-business); }
.qbot-radio:checked::after { content: ""; position: absolute; inset: 3px; border-radius: 50%; background: var(--qbot-business); }
.qbot-radio:focus-visible { outline: 2px solid color-mix(in srgb, var(--qbot-business) 45%, transparent); outline-offset: 2px; }
.qbot-radio:disabled { cursor: not-allowed; opacity: .55; }
.qbot-ptModStatus { display: inline-flex; align-items: center; gap: 6px; padding: 3px 9px; border-radius: 999px; font-size: 11.5px; font-weight: 600; white-space: nowrap; color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-interactive-bg-hover, #f2f3f5); }
.qbot-ptModStatusDot { flex: none; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.qbot-ptModStatus.is-on { color: var(--dsw-alias-state-success-primary, #20a162); background: color-mix(in srgb, var(--dsw-alias-state-success-primary, #20a162) 12%, transparent); }
/* 规则自测：虚线内嵌卡，输入 + 测试按钮一行，判定结果就地展示（不弹 toast）。 */
.qbot-ptModTest { min-width: 0; display: flex; flex-direction: column; gap: 7px; padding: 9px 10px; border: 1px dashed var(--dsw-alias-border-l2, #dee0e3); border-radius: 9px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-ptModTestTitle { font-size: 11.5px; font-weight: 650; color: var(--dsw-alias-label-secondary, #646a73); }
.qbot-ptModTestRow { min-width: 0; display: flex; align-items: center; gap: 8px; }
.qbot-ptModTestRow .qbot-settingInput { min-width: 0; flex: 1 1 auto; }
.qbot-ptModTestRow .qbot-btn { flex: none; }
.qbot-ptModTestResult { min-width: 0; display: flex; align-items: center; flex-wrap: wrap; gap: 6px; padding: 7px 9px; border-radius: 8px; background: var(--dsw-alias-bg-layer-2, #f7f8fa); }
.qbot-ptModTestResult.is-none { opacity: 0.86; }
.qbot-ptModTestReason { min-width: 0; font-size: 11.5px; color: var(--dsw-alias-label-primary, #1f2329); overflow-wrap: anywhere; }
.qbot-ptModTestChip { flex: none; font-size: 10.5px; color: var(--dsw-alias-label-tertiary, #8f959e); }
/* 叠加惩罚：开启时展开参数卡，关闭时一行说明；预览按前 3 次违规展示效果。 */
.qbot-ptModEsc { min-width: 0; display: flex; flex-direction: column; gap: 8px; padding: 9px 10px; border: 1px dashed var(--dsw-alias-border-l2, #dee0e3); border-radius: 9px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-ptModEsc .qbot-ptField > .qbot-settingInput,
.qbot-ptModEsc .qbot-ptField > .qbot-settingSelect { width: 100%; box-sizing: border-box; }
.qbot-ptModEscOff { min-width: 0; padding: 8px 10px; border-radius: 8px; font-size: 11.5px; line-height: 1.5; color: var(--dsw-alias-label-tertiary, #8f959e); background: var(--dsw-alias-bg-layer-2, #f7f8fa); overflow-wrap: anywhere; }
.qbot-ptModEscPreview { min-width: 0; display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; padding: 7px 9px; border-radius: 8px; background: color-mix(in srgb, var(--qbot-business) 8%, transparent); }
.qbot-ptModEscPreview > span { min-width: 0; font-size: 11px; color: var(--dsw-alias-label-secondary, #646a73); overflow-wrap: anywhere; }
.qbot-ptModEscPreview > strong { min-width: 0; font-size: 11.5px; font-weight: 650; color: var(--qbot-business); overflow-wrap: anywhere; }
.qbot-ptModSaveBar { display: flex; justify-content: flex-end; margin-top: 2px; padding: 11px 12px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 11px; background: var(--dsw-alias-bg-layer-2, #f7f8fa); }
/* 概览统计：固定一行四列，紧凑卡片；数字带语义色。 */
.qbot-ptModStats { min-width: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 7px; }
.qbot-ptModStat { min-width: 0; display: flex; flex-direction: column; gap: 1px; padding: 8px 10px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 9px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-ptModStat strong { font-size: 17px; line-height: 1.15; font-weight: 700; font-variant-numeric: tabular-nums; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-ptModStat span { font-size: 10.5px; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-ptModStat.is-ok strong { color: var(--dsw-alias-state-success-primary, #20a162); }
.qbot-ptModStat.is-esc strong { color: var(--qbot-business); }
.qbot-ptModStat.is-fail strong { color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-ptModLogHead { min-width: 0; display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
.qbot-ptModLogHeadText { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.qbot-ptModLogHeadText strong { font-size: 13px; font-weight: 650; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-ptModLogHeadText span { font-size: 11.5px; color: var(--dsw-alias-label-secondary, #646a73); }
/* 时间线：左侧圆点 + 连接线，右侧记录卡 */
.qbot-ptModTimeline { min-width: 0; display: flex; flex-direction: column; gap: 0; margin-top: 2px; }
.qbot-ptModRec { min-width: 0; position: relative; display: grid; grid-template-columns: 12px minmax(0, 1fr); gap: 6px; padding-bottom: 6px; }
.qbot-ptModRec::before { content: ""; position: absolute; left: 5px; top: 14px; bottom: -1px; width: 1px; background: var(--dsw-alias-border-l2, #e5e6eb); }
.qbot-ptModRec:last-child { padding-bottom: 0; }
.qbot-ptModRec:last-child::before { display: none; }
.qbot-ptModRecDot { position: relative; z-index: 1; width: 11px; height: 11px; margin-top: 4px; border: 2px solid var(--dsw-alias-bg-layer-1, #fff); border-radius: 50%; background: var(--dsw-alias-label-tertiary, #8f959e); box-shadow: 0 0 0 1px var(--dsw-alias-border-l2, #e5e6eb); }
.qbot-ptModRec.is-light .qbot-ptModRecDot { background: #f59e0b; }
.qbot-ptModRec.is-medium .qbot-ptModRecDot { background: var(--qbot-business); }
.qbot-ptModRec.is-severe .qbot-ptModRecDot { background: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-ptModRecCard { min-width: 0; display: flex; flex-direction: column; gap: 4px; padding: 8px 10px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 9px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-ptModRec.is-failed .qbot-ptModRecCard { border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 28%, var(--dsw-alias-border-l1, #eef0f3)); }
.qbot-ptModRecHead { min-width: 0; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.qbot-ptModRecAvatar { flex: none; width: 20px; height: 20px; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; background: linear-gradient(140deg, color-mix(in srgb, var(--qbot-business) 70%, #3d8bff), var(--qbot-business)); color: #fff; font-size: 10px; font-weight: 700; }
.qbot-ptModRecWho { min-width: 0; flex: 1 1 80px; font-size: 12px; font-weight: 600; color: var(--dsw-alias-label-primary, #1f2329); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.qbot-ptModRecTime { flex: none; font-size: 10.5px; color: var(--dsw-alias-label-tertiary, #8f959e); font-variant-numeric: tabular-nums; }
.qbot-ptModLevel { flex: none; padding: 1px 7px; border-radius: 999px; font-size: 10.5px; font-weight: 600; color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-interactive-bg-hover, #f2f3f5); }
.qbot-ptModLevel.is-light { color: #b45309; background: color-mix(in srgb, #f59e0b 16%, transparent); }
.qbot-ptModLevel.is-medium { color: var(--qbot-business); background: color-mix(in srgb, var(--qbot-business) 12%, transparent); }
.qbot-ptModLevel.is-severe { color: var(--dsw-alias-state-error-primary, #d54941); background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 12%, transparent); }
.qbot-ptModRecQuote { min-width: 0; padding: 4px 8px; border-left: 2px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 0 6px 6px 0; background: var(--dsw-alias-bg-layer-2, #f7f8fa); font-size: 11.5px; line-height: 1.45; color: var(--dsw-alias-label-primary, #1f2329); overflow-wrap: anywhere; }
.qbot-ptModRecReason { min-width: 0; display: flex; align-items: baseline; gap: 6px; flex-wrap: wrap; font-size: 11px; line-height: 1.45; color: var(--dsw-alias-label-secondary, #646a73); overflow-wrap: anywhere; }
.qbot-ptModRecReasonTag { flex: none; font-weight: 600; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-ptModRecChips { min-width: 0; display: flex; flex-wrap: wrap; gap: 4px 5px; }
.qbot-ptModChip { display: inline-flex; align-items: center; padding: 1px 7px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 999px; font-size: 10.5px; font-weight: 550; color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-bg-layer-2, #f7f8fa); }
.qbot-ptModChip.is-strike { color: var(--qbot-business); border-color: color-mix(in srgb, var(--qbot-business) 24%, transparent); background: color-mix(in srgb, var(--qbot-business) 8%, transparent); }
.qbot-ptModChip.is-meta { font-weight: 400; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-ptModChip.is-error { color: var(--dsw-alias-state-error-primary, #d54941); border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary) 24%, transparent); background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 8%, transparent); }
.qbot-ptModRecErr { min-width: 0; padding: 5px 8px; border-radius: 7px; font-size: 10.5px; line-height: 1.45; color: var(--dsw-alias-state-error-primary, #d54941); background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 8%, transparent); overflow-wrap: anywhere; }
.qbot-ptModRecErr.is-warn { color: var(--dsw-alias-state-warn-primary, #d97706); background: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 9%, transparent); }
.qbot-ptModLogEmpty { min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 7px; padding: 30px 16px; border: 1px dashed var(--dsw-alias-border-l2, #e5e6eb); border-radius: 12px; text-align: center; }
.qbot-ptModLogEmptyIcon { width: 44px; height: 44px; display: grid; place-items: center; border-radius: 14px; color: var(--qbot-business); background: color-mix(in srgb, var(--qbot-business) 10%, transparent); font-size: 22px; }
.qbot-ptModLogEmpty strong { font-size: 13px; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-ptModLogEmpty span { font-size: 11.5px; color: var(--dsw-alias-label-tertiary, #8f959e); }
/* AI 审核 · 禁言成员：批量操作条 + 成员列表（紧凑卡片）。 */
.qbot-ptMutedOps { min-width: 0; display: flex; flex-direction: column; gap: 9px; padding: 11px 12px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 11px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-ptMutedOpsTop { min-width: 0; display: flex; align-items: center; gap: 9px; }
.qbot-ptMutedOpsSpacer { flex: 1 1 auto; min-width: 8px; }
/* 常驻定宽徽标：勾选数量变化时只换文字，不让整行控件左右跳动。 */
.qbot-ptMutedCount { flex: none; width: 92px; padding: 3px 6px; border-radius: 999px; background: var(--dsw-alias-bg-layer-2, #f7f8fa); color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; font-weight: 600; font-variant-numeric: tabular-nums; text-align: center; white-space: nowrap; }
.qbot-ptMutedCount.is-on { color: var(--qbot-business); background: color-mix(in srgb, var(--qbot-business) 10%, transparent); }
.qbot-ptMutedDuration { flex: none; display: inline-flex; align-items: center; gap: 7px; font-size: 11.5px; color: var(--dsw-alias-label-secondary, #646a73); }
.qbot-ptMutedDuration .qbot-settingSelect { width: 118px; max-width: none; height: 30px; font-size: 12px; }
.qbot-ptMutedOpsActions { min-width: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; padding-top: 9px; border-top: 1px dashed var(--dsw-alias-border-l1, #eef0f3); }
.qbot-btn.qbot-ptMutedBtn { width: 100%; min-width: 0; min-height: 32px; padding: 0 6px; font-size: 12.5px; }
.qbot-ptMutedCheck { min-width: 0; display: inline-flex; align-items: center; gap: 6px; flex: none; font-size: 12px; font-weight: 600; color: var(--dsw-alias-label-primary, #1f2329); cursor: pointer; }
.qbot-ptMutedList { min-width: 0; display: flex; flex-direction: column; gap: 5px; max-height: 340px; overflow-y: auto; padding: 2px; }
.qbot-ptMutedRow { min-width: 0; display: flex; align-items: center; gap: 9px; padding: 8px 10px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-bg-layer-1, #fff); cursor: pointer; transition: border-color .15s ease, background .15s ease; }
.qbot-ptMutedRow:hover { background: var(--dsw-alias-interactive-bg-hover, #f2f3f5); }
.qbot-ptMutedRow.is-on { border-color: color-mix(in srgb, var(--qbot-business) 45%, transparent); background: color-mix(in srgb, var(--qbot-business) 6%, var(--dsw-alias-bg-layer-1, #fff)); }
.qbot-ptMutedAvatar { flex: none; width: 26px; height: 26px; display: inline-flex; align-items: center; justify-content: center; border-radius: 8px; background: linear-gradient(140deg, color-mix(in srgb, var(--qbot-business) 70%, #3d8bff), var(--qbot-business)); color: #fff; font-size: 11px; font-weight: 700; }
.qbot-ptMutedWho { min-width: 0; flex: 1 1 90px; font-size: 12.5px; font-weight: 600; color: var(--dsw-alias-label-primary, #1f2329); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.qbot-ptMutedExpire { flex: none; font-size: 11px; color: var(--dsw-alias-label-secondary, #646a73); font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
.qbot-ptModLogEmpty .qbot-btn { margin-top: 4px; }
.qbot-settingInput { height: 32px; padding: 0 10px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 9px; background: var(--dsw-alias-bg-layer-1, #fff); font: inherit; font-size: 12.5px; color: var(--dsw-alias-label-primary, #1f2329); box-sizing: border-box; min-width: 0; }
.qbot-settingInput:focus { outline: none; border-color: var(--qbot-business); }
.qbot-ptReqRow { min-width: 0; display: flex; align-items: center; gap: 10px; padding: 8px 10px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 9px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-ptReqMain { min-width: 0; flex: 1; display: flex; flex-direction: column; gap: 3px; }
.qbot-ptReqMain > strong { font-size: 13px; color: var(--dsw-alias-label-primary, #1f2329); overflow-wrap: anywhere; }
.qbot-ptReqMain > .qbot-hint { font-size: 11.5px; }
.qbot-ptReqVerify { font-size: 12px; color: var(--dsw-alias-label-secondary, #646a73); overflow-wrap: anywhere; }
.qbot-ptReqRisk { font-size: 11.5px; color: var(--dsw-alias-state-error-primary, #d54941); overflow-wrap: anywhere; }
.qbot-ptReqOps { flex: none; display: flex; gap: 6px; }
/* 入群 AI 自动审批配置卡 */
.qbot-ptJaResult { min-width: 0; display: flex; flex-wrap: wrap; gap: 6px; margin-top: 2px; }
.qbot-ptJaR { display: inline-flex; padding: 3px 9px; border-radius: 999px; font-size: 11px; font-weight: 600; }
.qbot-ptJaR.is-ok { color: var(--dsw-alias-state-success-primary, #20a162); background: color-mix(in srgb, var(--dsw-alias-state-success-primary, #20a162) 12%, transparent); }
.qbot-ptJaR.is-keep { color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-interactive-bg-hover, #f2f3f5); }
.qbot-ptJaR.is-fail { color: var(--dsw-alias-state-error-primary, #d54941); background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 10%, transparent); }
.qbot-ptJaAutoState { min-width: 0; display: inline-flex; align-items: center; gap: 8px; padding: 7px 11px; border-radius: 9px; font-size: 12px; line-height: 1.5; overflow-wrap: anywhere; }
.qbot-ptJaAutoState.is-on { color: var(--dsw-alias-state-success-primary, #20a162); background: color-mix(in srgb, var(--dsw-alias-state-success-primary, #20a162) 10%, transparent); border: 1px solid color-mix(in srgb, var(--dsw-alias-state-success-primary, #20a162) 24%, transparent); }
.qbot-ptJaAutoState.is-off { color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-bg-module-platform, #f7f8fa); border: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
.qbot-ptJaAutoDot { flex: none; width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
.qbot-ptJaEnableCheck { min-width: 0; display: flex; align-items: center; gap: 9px; padding: 9px 11px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-bg-layer-1, #fff); cursor: pointer; }
.qbot-ptJaEnableCheck.is-on { border-color: color-mix(in srgb, var(--qbot-business) 45%, transparent); background: color-mix(in srgb, var(--qbot-business) 6%, var(--dsw-alias-bg-layer-1, #fff)); }
.qbot-ptJaEnableText { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.qbot-ptJaEnableText strong { font-size: 12.5px; font-weight: 650; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-ptJaEnableText span { font-size: 11px; line-height: 1.5; color: var(--dsw-alias-label-tertiary, #8f959e); overflow-wrap: anywhere; }
/* 空介绍处理：两张并列选项卡，选中态有边框/底色/勾选标记，形成层次。 */
.qbot-ptJaEmptyOpts { min-width: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
.qbot-btn.qbot-ptJaEmptyOpt { width: 100%; min-width: 0; height: auto; min-height: 62px; display: flex; align-items: flex-start; gap: 9px; padding: 10px; text-align: left; white-space: normal; border-radius: 10px; }
.qbot-ptJaEmptyOpt:hover:not(:disabled) { border-color: color-mix(in srgb, var(--qbot-business) 38%, var(--dsw-alias-border-l2, #dfe1e5)); }
.qbot-ptJaEmptyOpt.is-on { border-color: var(--qbot-business); background: color-mix(in srgb, var(--qbot-business) 8%, var(--dsw-alias-bg-layer-1, #fff)); box-shadow: 0 0 0 2px color-mix(in srgb, var(--qbot-business) 12%, transparent); }
.qbot-ptJaEmptyIcon { flex: none; width: 26px; height: 26px; display: grid; place-items: center; border-radius: 8px; background: var(--dsw-alias-interactive-bg-hover, #f2f3f5); color: var(--dsw-alias-label-secondary, #646a73); font-size: 13px; }
.qbot-ptJaEmptyOpt.is-on .qbot-ptJaEmptyIcon { background: var(--qbot-business); color: #fff; }
.qbot-ptJaEmptyText { min-width: 0; flex: 1; display: flex; flex-direction: column; gap: 3px; }
.qbot-ptJaEmptyText strong { font-size: 12px; font-weight: 650; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-ptJaEmptyText span { font-size: 11px; line-height: 1.5; color: var(--dsw-alias-label-tertiary, #8f959e); overflow-wrap: anywhere; }
.qbot-ptJaEmptyCheck { flex: none; width: 16px; height: 16px; display: grid; place-items: center; border: 1px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 50%; color: transparent; font-size: 10px; }
.qbot-ptJaEmptyOpt.is-on .qbot-ptJaEmptyCheck { border-color: var(--qbot-business); background: var(--qbot-business); color: #fff; }
/* 审批记录：统计条 + 卡片列表（申请人 / 结果 / 判定理由 / 申请理由）。 */
.qbot-ptJaRecordList { min-width: 0; display: flex; flex-direction: column; gap: 8px; }
.qbot-ptJaRecord { min-width: 0; display: flex; flex-direction: column; gap: 7px; padding: 11px 12px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-left: 3px solid var(--dsw-alias-label-tertiary, #8f959e); border-radius: 10px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-ptJaRecord.is-pass { border-left-color: var(--dsw-alias-state-success-primary, #20a162); }
.qbot-ptJaRecord.is-keep { border-left-color: #d97706; }
.qbot-ptJaRecord.is-decline, .qbot-ptJaRecord.is-error { border-left-color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-ptJaRecordHead { min-width: 0; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.qbot-ptJaRecordAvatar { flex: none; width: 24px; height: 24px; display: grid; place-items: center; border-radius: 7px; background: color-mix(in srgb, var(--qbot-business) 14%, transparent); color: var(--qbot-business); font-size: 11px; font-weight: 700; }
.qbot-ptJaRecordWho { min-width: 0; flex: 1 1 90px; font-size: 12.5px; font-weight: 650; color: var(--dsw-alias-label-primary, #1f2329); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.qbot-ptJaRecordAct { flex: none; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-interactive-bg-hover, #f2f3f5); }
.qbot-ptJaRecordAct.is-pass { color: var(--dsw-alias-state-success-primary, #20a162); background: color-mix(in srgb, var(--dsw-alias-state-success-primary, #20a162) 12%, transparent); }
.qbot-ptJaRecordAct.is-keep { color: #d97706; background: color-mix(in srgb, #d97706 12%, transparent); }
.qbot-ptJaRecordAct.is-decline, .qbot-ptJaRecordAct.is-error { color: var(--dsw-alias-state-error-primary, #d54941); background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 10%, transparent); }
.qbot-ptJaRecordTime { flex: none; font-size: 11px; color: var(--dsw-alias-label-tertiary, #8f959e); font-variant-numeric: tabular-nums; }
.qbot-ptJaRecordRow { min-width: 0; display: flex; align-items: flex-start; gap: 8px; font-size: 11.5px; line-height: 1.55; }
.qbot-ptJaRecordLabel { flex: none; min-width: 52px; color: var(--dsw-alias-label-tertiary, #8f959e); font-weight: 600; }
.qbot-ptJaRecordValue, .qbot-ptJaRecordIntro { min-width: 0; flex: 1; color: var(--dsw-alias-label-secondary, #646a73); overflow-wrap: anywhere; }
.qbot-ptJaRecordIntro { padding: 6px 9px; border-radius: 7px; background: var(--dsw-alias-bg-layer-2, #f7f8fa); color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-ptJaRecordErr { font-size: 11px; color: var(--dsw-alias-state-error-primary, #d54941); overflow-wrap: anywhere; }
.qbot-ptMembers { min-width: 0; display: flex; flex-direction: column; gap: 4px; max-height: 280px; overflow-y: auto; padding: 2px; }
.qbot-ptMemberRow { min-width: 0; display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-radius: 8px; cursor: pointer; }
.qbot-ptMemberRow:hover { background: var(--dsw-alias-interactive-bg-hover, #f2f3f5); }
.qbot-ptMemberName { min-width: 0; flex: 1; font-size: 12.5px; color: var(--dsw-alias-label-primary, #1f2329); overflow-wrap: anywhere; }
.qbot-aboutLink { min-width: 0; color: var(--qbot-blue, #1677ff); font-size: 11.5px; font-weight: 500; line-height: 1.5; text-decoration: none; overflow-wrap: anywhere; }
.qbot-aboutLink:hover { text-decoration: underline; }
.qbot-aboutFoot { padding: 10px 2px 0; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; line-height: 1.7; text-align: center; }

/* 文本输入设置行（textarea）：说明在上、输入框通栏在下，长文本不再被窄框截断 */
.qbot-settingRow.is-wide { grid-template-columns: minmax(0, 1fr); }
.qbot-settingControl.is-wide { width: 100%; min-width: 0; justify-content: stretch; }
.qbot-settingControl.is-wide > .qbot-textarea { width: 100%; }
.qbot-textarea { display: block; width: 100%; min-width: 0; min-height: 56px; max-height: 240px; padding: 8px 11px; border: 1px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 8px; outline: none; resize: vertical; color: var(--dsw-alias-label-primary, #1f2329); background: var(--dsw-alias-bg-layer-1, #fff); font: inherit; font-size: 13px; line-height: 1.6; transition: border-color .16s ease, box-shadow .16s ease; }
.qbot-textarea:focus { border-color: #4e5969; box-shadow: 0 0 0 3px rgb(78 89 105 / 10%); }
.qbot-textarea::placeholder { color: var(--dsw-alias-label-tertiary, #8f959e); font-family: inherit; }

/* ── 按群覆盖弹窗：分组卡片 + 两列字段网格 ──────────────────────────────
   旧版是「标签 / 控件 / 说明」单列竖排、控件固定 260px，右半边全空且纵向过长。
   现在按语义分 4 组浅底卡片，组内两列（窄屏一列）通栏控件，标签与说明都收短。 */
.qbot-ovModal { height: auto; max-height: min(86vh, 800px); }
.qbot-ovModal .qbot-modalHead { padding-bottom: 10px; }
.qbot-ovModal .qbot-modalList { border: 0; border-radius: 0; margin: 0; background: transparent; }
.qbot-ovForm { flex: 1 1 auto; min-width: 0; min-height: 0; display: flex; flex-direction: column; gap: 12px; padding: 2px 20px 16px; overflow-y: auto; overscroll-behavior: contain; }
.qbot-ovGroup { min-width: 0; display: flex; flex-direction: column; gap: 11px; padding: 13px 15px 15px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 12px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-ovGroupHead { display: flex; align-items: center; gap: 7px; }
/* 组名前的品牌色短条：比圆点更「栏目感」，也不抢占视线 */
.qbot-ovGroupDot { flex: none; width: 14px; height: 3px; border-radius: 2px; background: var(--qbot-blue); }
.qbot-ovGroupHead h3 { margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 12.5px; line-height: 1.4; font-weight: 700; letter-spacing: .02em; }
.qbot-ovGrid { min-width: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr)); gap: 12px 16px; align-items: start; }
.qbot-ovField { min-width: 0; display: flex; flex-direction: column; gap: 5px; }
.qbot-ovField.is-wide { grid-column: 1 / -1; }
.qbot-ovLabel { min-width: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; line-height: 1.5; font-weight: 600; }
/* 控件通栏：不再受 .qbot-settingSelect 的 260px 上限，列多宽就多宽 */
.qbot-ovField .qbot-settingSelect { width: 100%; max-width: none; height: 34px; }
.qbot-ovField .qbot-input { height: 34px; }
.qbot-ovHint { min-width: 0; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11.5px; line-height: 1.6; overflow-wrap: anywhere; }
.qbot-ovForm .qbot-textarea { min-height: 52px; background: var(--dsw-alias-bg-layer-1, #fff); }
/* 编辑已有群时 openid 只读：弱化文字但保持可选中复制 */
.qbot-ovModal .qbot-input:read-only { color: var(--dsw-alias-label-secondary, #646a73); }
.qbot-ovModal .qbot-modalFoot { border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); }

/* ── 详情页：工作区卡片 ───────────────────────────────────────────────── */
.qbot-workspaceCard { min-width: 0; display: flex; flex-direction: column; gap: 9px; padding: 13px 14px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-workspaceCardHead { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; column-gap: 16px; row-gap: 8px; }
.qbot-workspacePath { min-width: 0; display: block; padding: 8px 11px; border: 1px dashed var(--dsw-alias-border-l2, #dfe1e5); border-radius: 8px; color: var(--dsw-alias-label-primary, #1f2329); background: var(--dsw-alias-bg-layer-1, #fff); font: 12px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace; overflow-wrap: anywhere; }

/* ── 详情页：运行统计指标卡 ───────────────────────────────────────────── */
.qbot-metricGrid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
.qbot-metric { min-width: 0; min-height: 96px; display: flex; flex-direction: column; gap: 6px; padding: 11px 13px 10px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-left: 3px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 11px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-metric[data-tone="success"] { border-left-color: var(--dsw-alias-state-success-primary, #20a162); }
.qbot-metric[data-tone="warning"] { border-left-color: var(--dsw-alias-state-warn-primary, #d97706); }
.qbot-metric[data-tone="error"] { border-left-color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-metricTop { display: flex; align-items: center; gap: 7px; min-width: 0; }
.qbot-metricIcon { flex: none; width: 18px; height: 18px; display: grid; place-items: center; border-radius: 5px; background: var(--dsw-alias-bg-layer-1, #fff); color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; line-height: 1; }
.qbot-metric[data-tone="success"] .qbot-metricIcon { color: var(--dsw-alias-state-success-primary, #20a162); }
.qbot-metric[data-tone="warning"] .qbot-metricIcon { color: var(--dsw-alias-state-warn-primary, #d97706); }
.qbot-metric[data-tone="error"] .qbot-metricIcon { color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-metricLabel { min-width: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 11px; line-height: normal; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.qbot-metricValue { color: var(--dsw-alias-label-primary, #1f2329); font-size: 21px; line-height: 1.15; font-weight: 700; font-variant-numeric: tabular-nums; }
.qbot-metricSub { min-height: 13px; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 10.5px; line-height: 1.2; }
.qbot-metric[data-tone="error"] .qbot-metricValue { color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-metric[data-tone="warning"] .qbot-metricValue { color: var(--dsw-alias-state-warn-primary, #d97706); }

/* ── openid 可搜索下拉（归档会话候选）────────────────────────────────── */
.qbot-idPicker { position: relative; min-width: 0; }
.qbot-idPickerMenu { position: absolute; z-index: 30; top: calc(100% + 4px); left: 0; right: 0; max-height: 240px; overflow-y: auto; padding: 4px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 10px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 8px 24px rgb(31 35 41 / 12%); }
.qbot-idPickerItem { width: 100%; display: flex; flex-direction: column; gap: 2px; padding: 6px 8px; border: 0; border-radius: 8px; background: transparent; font: inherit; text-align: left; cursor: pointer; }
.qbot-idPickerItem:hover { background: var(--dsw-alias-bg-module-platform, #f2f3f5); }
.qbot-idPickerItem.is-current { background: color-mix(in srgb, var(--qbot-blue, #1677ff) 10%, transparent); }
.qbot-idPickerHead { min-width: 0; display: flex; align-items: center; gap: 6px; }
.qbot-idPickerName { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--dsw-alias-label-primary, #1f2329); font-size: 12px; font-weight: 600; line-height: 1.4; }
.qbot-idPickerId { color: var(--dsw-alias-label-tertiary, #8f959e); font: 500 11px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace; word-break: break-all; }
.qbot-idPickerState { padding: 8px; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 12px; line-height: 1.5; text-align: center; }

/* ── 响应式 ───────────────────────────────────────────────────────────── */
@media (max-width: 900px) {
  .qbot-metricGrid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 760px) {
  .qbot-emptyView { grid-template-columns: 1fr; }
  .qbot-emptyBrand { display: none; }
  .qbot-credentialForm, .qbot-grid, .qbot-switches { grid-template-columns: 1fr; }
  .qbot-detailGrid { grid-template-columns: minmax(0, 1fr); }
  .qbot-heroStatusItem + .qbot-heroStatusItem { padding-left: 0; border-left: 0; }
  .qbot-heroMain { flex-wrap: wrap; }
  .qbot-sectionHead { flex-wrap: wrap; align-items: flex-start; }
  .qbot-settingRow, .qbot-workspaceCardHead { grid-template-columns: minmax(0, 1fr); }
  .qbot-settingControl { justify-content: flex-start; min-width: 0; }
  .qbot-settingSelect { max-width: none; }
}
@media (pointer: coarse) {
  .qbot-segTabs button, .qbot-switchRow { min-height: 44px; }
}

/* ── 定时任务「查看」：执行逻辑流程图 ── */
.qbot-schedDetail { display: flex; flex-direction: column; height: 100%; min-height: 0; box-sizing: border-box; }
.qbot-schedDetailHead { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-bottom: 1px solid var(--dsw-alias-border-l1, #eef0f3); flex: none; }
.qbot-schedDetailHead h3 { margin: 0; font-size: 15px; font-weight: 680; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-schedDetailHead p { margin: 2px 0 0; font-size: 12px; color: var(--dsw-alias-label-secondary, #646a73); }
.qbot-schedDetailBody { flex: 1 1 auto; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 16px 14px 20px; }
.qbot-flow { display: flex; flex-direction: column; align-items: stretch; }
.qbot-flowNode { position: relative; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-left: 3px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 10px; background: var(--dsw-alias-bg-layer-1, #fff); padding: 10px 12px; }
.qbot-flowNode--trigger { border-left-color: var(--qbot-business, #3370ff); }
.qbot-flowNode--action { border-left-color: var(--qbot-business, #3370ff); }
.qbot-flowNode--deliver { border-left-color: var(--dsw-alias-state-success-primary, #20a162); }
.qbot-flowTitle { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 650; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-flowBadge { flex: none; display: inline-flex; align-items: center; justify-content: center; min-width: 18px; height: 18px; padding: 0 5px; border-radius: 999px; font-size: 10px; font-weight: 700; color: #fff; background: var(--qbot-business, #3370ff); }
.qbot-flowDetail { margin-top: 6px; font-size: 12px; line-height: 1.6; color: var(--dsw-alias-label-secondary, #646a73); overflow-wrap: anywhere; white-space: pre-wrap; }
.qbot-flowDetail .qbot-mono, .qbot-flowDetail code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
.qbot-flowConn { width: 2px; height: 16px; margin: 0 auto; background: var(--dsw-alias-border-l2, #dfe1e5); position: relative; }
.qbot-flowConn::after { content: ""; position: absolute; left: 50%; bottom: -1px; transform: translateX(-50%); border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 5px solid var(--dsw-alias-border-l2, #dfe1e5); }
.qbot-flowDecision { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border: 1px solid color-mix(in srgb, var(--dsw-alias-state-warn-primary, #d97706) 40%, transparent); border-radius: 10px; background: color-mix(in srgb, var(--dsw-alias-state-warn-primary, #d97706) 8%, var(--dsw-alias-bg-layer-1, #fff)); }
.qbot-flowQ { flex: none; width: 20px; height: 20px; display: grid; place-items: center; border-radius: 50%; color: var(--dsw-alias-state-warn-primary, #d97706); background: color-mix(in srgb, var(--dsw-alias-state-warn-primary, #d97706) 16%, transparent); font-weight: 700; font-size: 12px; }
.qbot-flowDecisionBody { min-width: 0; flex: 1 1 auto; }
.qbot-flowDecisionQ { font-size: 12.5px; font-weight: 600; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-flowAnswer { display: inline-flex; align-items: center; margin-top: 4px; padding: 1px 9px; border-radius: 999px; font-size: 11px; font-weight: 600; color: var(--dsw-alias-state-success-primary, #20a162); background: color-mix(in srgb, var(--dsw-alias-state-success-primary, #20a162) 12%, transparent); }
.qbot-flowAnswer.is-no { color: var(--dsw-alias-state-error-primary, #d54941); background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 12%, transparent); }
.qbot-flowAnswer.is-warn { color: var(--dsw-alias-state-warn-primary, #d97706); background: color-mix(in srgb, var(--dsw-alias-state-warn-primary, #d97706) 12%, transparent); }

/* ── 宽度自适应（容器查询）─────────────────────────────────────────────────
   右侧面板宽度由用户拖拽决定，视口级 @media 不会随面板变化而触发，
   因此改用容器查询，按「实际可用宽度」响应：
     · qbotpanel  —— 由面板根节点 .qbot-schedPanel 声明，负责面板级留白与字号收敛；
     · schedgroup —— 由分组容器 .qbot-schedGroup 声明，负责单张任务卡内部是并排还是堆叠。
   设置页弹窗（.qbot-modal，固定宽度）未声明容器，保持基础流体布局，
   改用 --qbot-gutter 统一水平留白，因此两种载体下表单与列表的外边缘都对齐。 */
.qbot-schedPanel { container-type: inline-size; container-name: qbotpanel; width: 100%; min-width: 0; }
/* 右侧面板 tab chip 的 QQ 机器人图标：跟随品牌色（已在 :root 定义），深浅色自适应 */
.qbot-panelMark { flex: none; color: var(--qbot-business, #3370ff); }

/* 面板收窄：间距同步收敛，工具条与主操作整行铺满 */
@container qbotpanel (max-width: 460px) {
  .qbot-schedRoot { --qbot-gutter: 10px; }
  .qbot-schedToolbar { padding: 9px 10px; }
  .qbot-fieldInline { flex: 1 1 100%; }
  .qbot-schedToolbar .qbot-settingSelect { flex: 1 1 auto; max-width: none; }
  .qbot-schedRefresh { flex: 1 1 auto; }
  .qbot-schedTabs { padding: 8px 10px 6px; }
  .qbot-schedAdd { flex: 1 1 100%; margin-left: 0; }
  .qbot-schedSection { padding: 12px 10px; border-radius: 10px; }
  .qbot-schedGroup { padding-left: 6px; padding-right: 6px; }
  .qbot-schedMeta { gap: 6px 10px; }
  .qbot-schedDetailHead { flex-wrap: wrap; }
  .qbot-schedDetailBody { padding: 12px 10px 16px; }
  .qbot-flowNode, .qbot-flowDecision { padding: 8px 10px; }
  .qbot-schedPresets { gap: 5px; }
  .qbot-ptMutedOpsTop { flex-wrap: wrap; }
  .qbot-ptMutedOpsSpacer { display: none; }
  .qbot-ptJaEmptyOpts { grid-template-columns: minmax(0, 1fr); }
}
@container qbotpanel (max-width: 320px) {
  .qbot-schedSectionDesc { font-size: 11.5px; }
  .qbot-schedOps { gap: 5px; }
  .qbot-schedOps .qbot-btn { padding: 3px 9px; }
  .qbot-schedMeta { font-size: 11px; }
  .qbot-chip { padding: 1px 7px; font-size: 10.5px; }
}

/* 面板拉宽：内距与行距同步放大，避免卡片被拉长后内边距反而显得局促。
   表单字段不限宽（max-width:100%）——面板多宽字段就铺多宽，与列表容器左右对齐；
   仅流程图保留 720px 上限（流程图是节点串联，超宽后连线过长反而难读）。
   列表保持单列——任务卡是「内容 + 操作」结构，多列会把操作列压回窄缝。 */
@container qbotpanel (min-width: 640px) {
  .qbot-editRow { max-width: 100%; }
  .qbot-flow { max-width: 720px; }
  .qbot-schedGroup { padding: 10px 14px 6px; }
  .qbot-schedRow { padding: 12px 14px; gap: 14px; }
  .qbot-schedMeta { gap: 6px 14px; }
  .qbot-schedSection { padding: 16px clamp(14px, 3%, 18px); }
  .qbot-schedSectionBody { gap: 16px; }
}
@container qbotpanel (min-width: 900px) {
  .qbot-editRow { max-width: 100%; }
}

/* 任务卡自身宽度：正文与操作列并排约需 560px，低于此值改为上下堆叠，
   避免正文被 5 个操作按钮挤成一条窄缝。
   放在面板级查询之后，两种条件同时命中时以「堆叠」为准（更安全的形态）。 */
@container schedgroup (max-width: 560px) {
  .qbot-schedRow { flex-direction: column; align-items: stretch; gap: 8px; }
  .qbot-schedOps { width: 100%; margin-left: 0; justify-content: flex-start; align-self: auto; }
}

/* ── 配置清单（JSON 编辑器弹窗）────────────────────────────────────────── */
.qbot-cmModal { position: relative; width: min(1080px, 100%); height: min(86vh, 820px); }
.qbot-cmBody { flex: 1 1 auto; min-width: 0; min-height: 0; display: grid; grid-template-columns: minmax(0, 1fr) minmax(280px, 34%); gap: 14px; padding: 0 clamp(10px, 2.4%, 20px) 4px; }
.qbot-cmEditorPane, .qbot-cmHelpPane { min-width: 0; min-height: 0; display: flex; flex-direction: column; }
.qbot-cmPaneHead { flex: none; display: flex; align-items: center; justify-content: space-between; gap: 10px; min-height: 28px; }
.qbot-cmPaneHead strong { color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; font-weight: 700; }
.qbot-cmStatus { font-size: 11.5px; font-weight: 600; padding: 2px 9px; border-radius: 999px; white-space: nowrap; }
.qbot-cmStatus.is-ok { color: var(--dsw-alias-state-success-primary, #2ea121); background: color-mix(in srgb, var(--dsw-alias-state-success-primary, #2ea121) 12%, transparent); }
.qbot-cmStatus.is-error { color: var(--dsw-alias-state-error-primary, #d54941); background: var(--dsw-alias-state-error-bg, #fee9e7); }
.qbot-cmHelpCount { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11.5px; }

/* 编辑器：行号槽 + 等宽文本域，二者行高严格一致（20px）。 */
.qbot-cmCodeWrap { flex: 1 1 auto; min-height: 160px; display: flex; margin-top: 8px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 10px; overflow: hidden; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-cmGutter { flex: none; width: 46px; padding: 10px 8px 10px 0; overflow: hidden; text-align: right; background: var(--dsw-alias-bg-module-platform, #f7f8fa); border-right: 1px solid var(--dsw-alias-border-l1, #eef0f3); user-select: none; }
.qbot-cmGutter div { height: 20px; line-height: 20px; font: 12px/20px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-cmGutter div.is-err { color: var(--dsw-alias-state-error-primary, #d54941); font-weight: 700; }
.qbot-cmCode { flex: 1 1 auto; min-width: 0; min-height: 0; resize: none; border: 0; outline: 0; padding: 10px 12px; background: transparent; color: var(--dsw-alias-label-primary, #1f2329); font: 12px/20px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; tab-size: 2; white-space: pre; overflow: auto; }
.qbot-cmCode:focus { outline: 0; }

/* 校验结果列表：贴着编辑器下方，最多 4 行高度，超出滚动。 */
.qbot-cmIssues { flex: none; max-height: 104px; margin-top: 8px; display: flex; flex-direction: column; gap: 4px; overflow-y: auto; padding-right: 2px; }
.qbot-cmIssues.is-empty { max-height: none; color: var(--dsw-alias-state-success-primary, #2ea121); font-size: 12px; padding: 4px 2px; }
.qbot-cmIssue { flex: none; display: flex; align-items: baseline; gap: 8px; width: 100%; text-align: left; padding: 5px 9px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 7px; background: var(--dsw-alias-state-error-bg, #fee9e7); cursor: pointer; }
.qbot-cmIssue:hover { border-color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-cmIssuePath { flex: none; max-width: 45%; color: var(--dsw-alias-state-error-primary, #d54941); font: 11.5px/1.5 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.qbot-cmIssueMsg { min-width: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 11.5px; line-height: 1.5; overflow-wrap: anywhere; }

/* 右侧帮助面板：搜索框 + 可折叠分组。 */
.qbot-cmSearch { flex: none; width: 100%; height: 32px; margin-top: 8px; }
.qbot-cmHelpScroll { flex: 1 1 auto; min-height: 0; margin-top: 8px; overflow-y: auto; overscroll-behavior: contain; padding-right: 4px; display: flex; flex-direction: column; gap: 8px; }
/* flex:none 是关键：若允许收缩，分组卡会被压扁且滚动容器永远不出现滚动条。 */
.qbot-cmHelpGroup { flex: none; min-width: 0; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 9px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); overflow: hidden; }
.qbot-cmHelpGroupHead { display: flex; align-items: center; gap: 7px; width: 100%; padding: 8px 10px; border: 0; background: transparent; cursor: pointer; text-align: left; }
.qbot-cmHelpGroupHead strong { min-width: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 12.5px; font-weight: 700; }
.qbot-cmHelpChevron { flex: none; color: var(--qbot-blue); font-size: 12px; }
.qbot-cmHelpGroupCount { margin-left: auto; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; }
.qbot-cmHelpGroupDesc { margin: 0 10px 4px; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; line-height: 1.5; }
.qbot-cmHelpFields { display: flex; flex-direction: column; gap: 1px; padding: 0 6px 6px; }
.qbot-cmHelpField { flex: none; min-width: 0; padding: 7px 8px; border-radius: 6px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-cmHelpFieldTop { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.qbot-cmHelpKey { min-width: 0; color: var(--qbot-blue); font: 600 11.5px/1.5 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.qbot-cmHelpType { flex: none; color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-bg-module-platform, #f7f8fa); border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 4px; padding: 0 5px; font: 10.5px/1.6 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
.qbot-cmHelpText { margin: 4px 0 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 11.5px; line-height: 1.6; overflow-wrap: anywhere; }
/* 字段帮助：限制 / 示例 / 配错后果，逐行对齐，标签定宽不抖动。 */
.qbot-cmHelpLine { display: flex; align-items: baseline; gap: 6px; margin-top: 5px; min-width: 0; }
.qbot-cmHelpTag { flex: none; padding: 1px 6px; border-radius: 4px; font-size: 10.5px; line-height: 1.6; font-weight: 600; white-space: nowrap; }
.qbot-cmHelpTagRange { color: var(--qbot-blue); background: color-mix(in srgb, var(--qbot-blue) 10%, transparent); }
.qbot-cmHelpTagExample { color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-cmHelpValue { min-width: 0; color: var(--dsw-alias-label-primary, #1f2329); font: 11px/1.6 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; overflow-wrap: anywhere; }
.qbot-cmHelpNote { display: flex; align-items: baseline; gap: 6px; margin-top: 5px; min-width: 0; }
.qbot-cmHelpNoteTag { flex: none; padding: 1px 6px; border-radius: 4px; color: var(--dsw-alias-state-warning-primary, #d98c00); background: color-mix(in srgb, var(--dsw-alias-state-warning-primary, #ffb400) 12%, transparent); font-size: 10.5px; line-height: 1.6; font-weight: 600; white-space: nowrap; }
.qbot-cmHelpNoteText { min-width: 0; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; line-height: 1.6; overflow-wrap: anywhere; }

.qbot-cmFoot { border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
.qbot-cmFootLeft { flex: 1 1 auto; min-width: 0; }
.qbot-footOk { margin: 0; color: var(--dsw-alias-state-success-primary, #2ea121); font-size: 12px; line-height: 1.6; overflow-wrap: anywhere; }
.qbot-cmLoadErr { position: absolute; inset: 0; z-index: 2; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 24px; text-align: center; color: var(--dsw-alias-state-error-primary, #d54941); background: var(--dsw-alias-bg-layer-1, #fff); font-size: 13px; }
.qbot-cmLoadErr p { margin: 0; overflow-wrap: anywhere; }

/* 窄屏：帮助面板移到编辑器下方，各占约一半高度。 */
@media (max-width: 780px) {
  .qbot-cmBody { grid-template-columns: minmax(0, 1fr); grid-template-rows: minmax(200px, 1fr) minmax(180px, 1fr); }
}

/* ── 频道管理弹窗：与平台能力同一外壳，内部竖向 Tab ─────────────────── */
.qbot-sectionIcon[data-tone="info"] { color: var(--qbot-blue, #1677ff); background: color-mix(in srgb, var(--qbot-blue, #1677ff) 12%, transparent); }
.qbot-gvModal { width: min(980px, 100%); height: min(84vh, 800px); }
.qbot-gvBody { flex: 1 1 auto; min-width: 0; min-height: 0; overflow: hidden; display: flex; }
.qbot-gvLayout { flex: 1 1 auto; min-width: 0; min-height: 0; display: flex; }
.qbot-gvNav { flex: none; width: 150px; display: flex; flex-direction: column; gap: 4px; padding: 14px 10px; border-right: 1px solid var(--dsw-alias-border-l1, #eef0f3); background: var(--dsw-alias-bg-module-platform, #f7f8fa); overflow-y: auto; overscroll-behavior: contain; }
.qbot-gvNavItem { flex: none; min-width: 0; display: flex; align-items: center; gap: 8px; padding: 9px 10px; border: 1px solid transparent; border-radius: 9px; color: var(--dsw-alias-label-secondary, #646a73); background: transparent; font: inherit; font-size: 12.5px; text-align: left; cursor: pointer; }
.qbot-gvNavItem:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-gvNavItem.is-active { border-color: color-mix(in srgb, var(--qbot-blue, #1677ff) 32%, transparent); background: var(--dsw-alias-bg-layer-1, #fff); color: var(--qbot-blue, #1677ff); font-weight: 650; }
.qbot-gvNavIcon { flex: none; width: 18px; text-align: center; font-size: 14px; }
.qbot-gvContent { flex: 1 1 auto; min-width: 0; min-height: 0; padding: 16px 20px 20px; overflow-x: hidden; overflow-y: auto; overscroll-behavior: contain; }
.qbot-gvScope { position: sticky; top: -16px; z-index: 3; display: flex; align-items: center; gap: 8px; min-width: 0; margin: -16px -20px 16px; padding: 9px 20px; border-bottom: 1px solid var(--dsw-alias-border-l1, #eef0f3); background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-gvScopeDot { flex: none; width: 7px; height: 7px; border-radius: 50%; background: var(--qbot-blue, #1677ff); }
.qbot-gvScopeName { min-width: 0; max-width: 220px; font-size: 12.5px; font-weight: 650; color: var(--dsw-alias-label-primary, #1f2329); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.qbot-gvScopeId { min-width: 0; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; overflow-wrap: anywhere; }
.qbot-gvPane { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
.qbot-gvPaneHead strong { display: block; color: var(--dsw-alias-label-primary, #1f2329); font-size: 14px; font-weight: 650; }
.qbot-gvPaneHead p { margin: 4px 0 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 1.6; overflow-wrap: anywhere; }
.qbot-gvPaneActions { display: flex; align-items: center; gap: 10px; min-width: 0; flex-wrap: wrap; }
.qbot-gvCount { flex: 1 1 auto; min-width: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; font-variant-numeric: tabular-nums; }
.qbot-gvSearch { flex: 1 1 220px; min-width: 0; max-width: 320px; }
.qbot-gvGuildGrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 230px), 1fr)); gap: 10px; }
.qbot-gvGuildCard { min-width: 0; display: flex; align-items: center; gap: 10px; padding: 12px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 11px; background: var(--dsw-alias-bg-layer-1, #fff); text-align: left; cursor: pointer; transition: border-color .16s ease, background .16s ease; }
.qbot-gvGuildCard:hover { border-color: color-mix(in srgb, var(--qbot-blue, #1677ff) 45%, var(--dsw-alias-border-l2, #e5e6eb)); }
.qbot-gvGuildCard.is-on { border-color: var(--qbot-blue, #1677ff); background: color-mix(in srgb, var(--qbot-blue, #1677ff) 6%, var(--dsw-alias-bg-layer-1, #fff)); }
.qbot-gvGuildAvatar { flex: none; width: 36px; height: 36px; display: grid; place-items: center; border-radius: 9px; background: color-mix(in srgb, var(--qbot-blue, #1677ff) 14%, transparent); color: var(--qbot-blue, #1677ff); font-size: 15px; font-weight: 700; }
.qbot-gvGuildMain { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.qbot-gvGuildMain strong { min-width: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.qbot-gvGuildMain small { color: var(--dsw-alias-label-secondary, #646a73); font-size: 11px; }
.qbot-gvBadge { flex: none; padding: 2px 7px; border-radius: 999px; background: color-mix(in srgb, var(--qbot-blue, #1677ff) 12%, transparent); color: var(--qbot-blue, #1677ff); font-size: 10.5px; }
.qbot-gvEmpty { padding: 22px 12px; border: 1px dashed var(--dsw-alias-border-l2, #e5e6eb); border-radius: 10px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12.5px; line-height: 1.6; text-align: center; overflow-wrap: anywhere; }
/* 频道列表顶部引导：到开发者中心开启公开服务 / 扫码加入频道 */
.qbot-gvSetup { min-width: 0; display: flex; flex-direction: column; gap: 7px; padding: 12px 14px; border: 1px solid color-mix(in srgb, var(--qbot-blue, #1677ff) 26%, transparent); border-radius: 10px; background: color-mix(in srgb, var(--qbot-blue, #1677ff) 6%, var(--dsw-alias-bg-layer-1, #fff)); }
.qbot-gvSetupHead { display: flex; align-items: center; gap: 7px; }
.qbot-gvSetupIcon { flex: none; color: var(--qbot-blue, #1677ff); font-size: 14px; line-height: 1; }
.qbot-gvSetupHead strong { color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; font-weight: 650; }
.qbot-gvSetupSteps { margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 4px; }
.qbot-gvSetupSteps li { min-width: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 1.6; overflow-wrap: anywhere; }
.qbot-gvSetupFoot { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px 12px; }
.qbot-gvSetupFoot > span { min-width: 0; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; line-height: 1.6; overflow-wrap: anywhere; }
.qbot-gvSetupLink { flex: none; color: var(--qbot-blue, #1677ff); font-size: 11.5px; font-weight: 600; text-decoration: none; white-space: nowrap; }
.qbot-gvSetupLink:hover { text-decoration: underline; }
.qbot-gvInfoGrid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr)); gap: 10px; }
.qbot-gvInfoCell { min-width: 0; padding: 10px 12px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 9px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-gvInfoCell.is-wide { grid-column: 1 / -1; }
.qbot-gvInfoLabel { display: block; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; }
.qbot-gvInfoValue { display: block; margin-top: 4px; color: var(--dsw-alias-label-primary, #1f2329); font-size: 12.5px; line-height: 1.5; overflow-wrap: anywhere; }
.qbot-gvList { min-width: 0; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; overflow: hidden; }
.qbot-gvListHead { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 9px 12px; border-bottom: 1px solid var(--dsw-alias-border-l1, #eef0f3); background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-gvListHead strong { color: var(--dsw-alias-label-primary, #1f2329); font-size: 12.5px; }
.qbot-gvRow { min-width: 0; display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 9px 12px; border-bottom: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
.qbot-gvRow:last-child { border-bottom: 0; }
.qbot-gvRow.is-button { width: 100%; border-left: 0; border-right: 0; border-top: 0; background: transparent; font: inherit; text-align: left; cursor: pointer; }
.qbot-gvRow.is-button:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-gvRowMain { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.qbot-gvRowMain strong { min-width: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 12.5px; overflow-wrap: anywhere; }
.qbot-gvRowMain small { min-width: 0; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; overflow-wrap: anywhere; }
.qbot-gvRowOps { flex: none; display: flex; align-items: center; gap: 6px; }
.qbot-gvRowOps .qbot-btn { padding: 4px 9px; font-size: 11.5px; }
.qbot-btnDanger { color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-btnDanger:hover:not(:disabled) { border-color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-gvRowMore { flex: none; color: var(--qbot-blue, #1677ff); font-size: 11.5px; }
.qbot-gvStack { min-width: 0; display: flex; flex-direction: column; gap: 12px; }
.qbot-gvFormRow { min-width: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 150px), 1fr)); gap: 10px; align-items: end; }
.qbot-gvForm { min-width: 0; display: flex; flex-direction: column; gap: 10px; padding: 13px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: color-mix(in srgb, var(--dsw-alias-bg-module-platform, #f7f8fa) 55%, transparent); }
.qbot-gvKwCard { border-color: var(--qbot-blue, #1677ff); border-left-width: 3px; }
.qbot-gvKwCard > .qbot-gvFormHead strong { color: var(--qbot-blue, #1677ff); }
.qbot-gvFormHead strong { color: var(--dsw-alias-label-primary, #1f2329); font-size: 12.5px; }
.qbot-gvField { min-width: 0; display: flex; flex-direction: column; gap: 5px; }
.qbot-gvFieldLabel { color: var(--dsw-alias-label-secondary, #646a73); font-size: 11.5px; font-weight: 600; }
.qbot-gvFieldHint { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 10.5px; line-height: 1.5; }
.qbot-gvField .qbot-input, .qbot-gvField .qbot-settingSelect { width: 100%; min-width: 0; }
.qbot-gvInputShort { max-width: 220px; }
.qbot-gvCheck { min-width: 0; display: flex; align-items: center; gap: 7px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; }
.qbot-gvFormActions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.qbot-gvAiLogs { min-width: 0; display: flex; flex-direction: column; gap: 8px; max-height: 320px; overflow-y: auto; }
.qbot-gvAiLog { flex: none; min-width: 0; display: flex; flex-direction: column; gap: 5px; padding: 10px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 8px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-gvAiLogHead { display: flex; align-items: center; gap: 8px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 11px; }
.qbot-gvAiLevel { flex: none; padding: 1px 7px; border-radius: 6px; background: var(--dsw-alias-interactive-bg-hover, #f2f3f5); color: var(--dsw-alias-label-secondary, #646a73); font-size: 10.5px; font-weight: 600; }
.qbot-gvAiLevel.is-light { color: #b26a00; background: color-mix(in srgb, #ff9f1a 15%, transparent); }
.qbot-gvAiLevel.is-medium { color: var(--qbot-business); background: color-mix(in srgb, var(--qbot-business) 12%, transparent); }
.qbot-gvAiLevel.is-severe { color: #d92b2b; background: color-mix(in srgb, #d92b2b 12%, transparent); }
.qbot-gvAiLogBody { min-width: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 12px; line-height: 1.55; overflow-wrap: anywhere; }
.qbot-gvAiLogMeta { min-width: 0; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 10.5px; line-height: 1.5; overflow-wrap: anywhere; }
.qbot-gvDetail { min-width: 0; padding: 12px; border: 1px solid color-mix(in srgb, var(--qbot-blue, #1677ff) 32%, transparent); border-radius: 10px; background: color-mix(in srgb, var(--qbot-blue, #1677ff) 5%, var(--dsw-alias-bg-layer-1, #fff)); }
.qbot-gvDetailHead { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 10px; }
.qbot-gvDetailHead strong { color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; }
.qbot-gvEventGrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr)); gap: 10px; }
.qbot-gvEventCard { min-width: 0; display: flex; flex-direction: column; gap: 7px; padding: 12px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-gvEventCard strong { color: var(--dsw-alias-label-primary, #1f2329); font-size: 12.5px; }
.qbot-gvEventCard code { color: var(--qbot-blue, #1677ff); font-size: 10.5px; }
.qbot-gvEventFields { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; }
.qbot-gvEventLabel { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 10.5px; }
.qbot-gvEventField { padding: 2px 6px; border-radius: 5px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); color: var(--dsw-alias-label-secondary, #646a73); font-size: 10.5px; }
/* 事件说明页：频道 OpenAPI 全量速查（按用途分组，方法与路径同时展示） */
.qbot-gvDocIntro { min-width: 0; padding: 9px 11px; border: 1px solid color-mix(in srgb, var(--qbot-blue, #1677ff) 24%, transparent); border-radius: 9px; background: color-mix(in srgb, var(--qbot-blue, #1677ff) 5%, var(--dsw-alias-bg-layer-1, #fff)); color: var(--dsw-alias-label-secondary, #646a73); font-size: 11.5px; line-height: 1.6; overflow-wrap: anywhere; }
.qbot-gvDocGroups { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.qbot-gvDocGroup { min-width: 0; padding: 12px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-gvDocGroupHead { display: flex; align-items: center; gap: 8px; min-width: 0; margin-bottom: 10px; }
.qbot-gvDocGroupHead strong { min-width: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 12.5px; font-weight: 650; }
.qbot-gvDocGroupHead span { flex: none; min-width: 20px; padding: 1px 6px; border-radius: 9px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 10px; text-align: center; }
.qbot-gvDocGrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 245px), 1fr)); gap: 8px; min-width: 0; }
.qbot-gvDocCard { min-width: 0; display: flex; flex-direction: column; gap: 6px; padding: 9px 10px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 8px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-gvDocCardTop { display: flex; align-items: flex-start; gap: 7px; min-width: 0; }
.qbot-gvDocMethod { flex: none; min-width: 45px; padding: 2px 4px; border-radius: 4px; font-size: 9.5px; font-weight: 700; line-height: 1.5; text-align: center; letter-spacing: .2px; }
.qbot-gvDocMethod.is-get { color: var(--qbot-blue, #1677ff); background: color-mix(in srgb, var(--qbot-blue, #1677ff) 12%, transparent); }
.qbot-gvDocMethod.is-post { color: var(--qbot-business, #722ed1); background: color-mix(in srgb, var(--qbot-business, #722ed1) 12%, transparent); }
.qbot-gvDocMethod.is-patch { color: #b26a00; background: color-mix(in srgb, #ff9f1a 15%, transparent); }
.qbot-gvDocMethod.is-put { color: #9254de; background: color-mix(in srgb, #9254de 12%, transparent); }
.qbot-gvDocMethod.is-delete { color: #d92b2b; background: color-mix(in srgb, #d92b2b 12%, transparent); }
.qbot-gvDocPath { min-width: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 10.5px; line-height: 1.5; overflow-wrap: anywhere; }
.qbot-gvDocDesc { min-width: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 10.5px; line-height: 1.55; overflow-wrap: anywhere; }
.qbot-gvDocNotes { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; min-width: 0; }
.qbot-gvDocNote { padding: 1px 5px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 4px; background: var(--dsw-alias-bg-layer-1, #fff); color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 9.5px; line-height: 1.5; overflow-wrap: anywhere; }
.qbot-gvDocSectionTitle { min-width: 0; margin-top: 4px; color: var(--dsw-alias-label-primary, #1f2329); font-size: 12.5px; font-weight: 650; }
/* 接口权限：每个接口一行的表格式清单（auth_status=1 才是已授权）。 */
.qbot-gvPermBar { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; min-width: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 11.5px; }
.qbot-gvPermTable { min-width: 0; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; overflow: hidden; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-gvPermHead, .qbot-gvPermRow { display: grid; grid-template-columns: 58px minmax(0, 1.25fr) minmax(0, 1fr) 72px; align-items: center; gap: 10px; min-width: 0; padding: 8px 10px; }
.qbot-gvPermHead { background: var(--dsw-alias-bg-module-platform, #f7f8fa); color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 10.5px; font-weight: 650; }
.qbot-gvPermRow + .qbot-gvPermRow { border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
.qbot-gvPermRow:hover { background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-gvPermPath { min-width: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 10.5px; line-height: 1.5; overflow-wrap: anywhere; }
.qbot-gvPermDesc { min-width: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 11px; line-height: 1.5; overflow-wrap: anywhere; }
.qbot-gvPermState { justify-self: start; flex: none; padding: 2px 7px; border-radius: 999px; font-size: 10.5px; line-height: 1.5; white-space: nowrap; }
.qbot-gvPermState.is-ok { color: var(--dsw-alias-state-success-color, #27855b); background: color-mix(in srgb, var(--dsw-alias-state-success-color, #27855b) 12%, transparent); }
.qbot-gvPermState.is-no { color: var(--dsw-alias-state-error-primary, #d54941); background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 10%, transparent); }
.qbot-gvPermRaw { min-width: 0; }
.qbot-gvPermRaw summary { cursor: pointer; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; }
.qbot-gvPermRaw pre { max-height: 260px; margin: 8px 0 0; padding: 10px; overflow: auto; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 8px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); font-size: 10.5px; line-height: 1.55; }
@media (max-width: 560px) {
  .qbot-gvPermHead, .qbot-gvPermRow { grid-template-columns: 48px minmax(0, 1fr) 68px; }
  .qbot-gvPermHead span:nth-child(3), .qbot-gvPermDesc { display: none; }
}
/* 二级弹窗（子频道 / 身份组编辑）：盖在主弹窗内容之上 */
.qbot-gvSubOverlay { position: fixed; inset: 0; z-index: 10006; display: flex; align-items: center; justify-content: center; padding: 24px; background: rgb(0 0 0 / 42%); }
.qbot-gvSubModal { width: min(520px, 100%); max-height: min(86vh, 720px); overflow-y: auto; overscroll-behavior: contain; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 14px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 12px 40px rgb(0 0 0 / 22%); }
.qbot-gvSubModal > .qbot-modalHead { position: sticky; top: 0; z-index: 2; background: var(--dsw-alias-bg-layer-1, #fff); }
/* 二级弹窗内的吸顶提示：盖在滚动内容之上，5 秒自动消失（由组件定时器控制）。 */
.qbot-gvSubToast { position: sticky; top: 52px; z-index: 3; margin: 0 16px 6px; }
.qbot-gvSubModal > .qbot-gvForm { margin: 16px; }
/* 子 Tab（内容管理 / AI 接管） */
.qbot-gvSubTabs { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; padding: 3px; border-radius: 9px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-gvSubTab { flex: none; padding: 6px 12px; border: 0; border-radius: 7px; background: transparent; color: var(--dsw-alias-label-secondary, #646a73); font: inherit; font-size: 12px; cursor: pointer; }
.qbot-gvSubTab:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-gvSubTab.is-on { background: var(--dsw-alias-bg-layer-1, #fff); color: var(--qbot-blue, #1677ff); font-weight: 650; box-shadow: 0 1px 3px rgb(31 35 41 / 10%); }
/* 颜色选择器 + 十进制 ARGB */
.qbot-gvColorRow { display: flex; align-items: center; gap: 8px; min-width: 0; }
.qbot-gvColorPick { flex: none; width: 44px; height: 34px; padding: 2px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 8px; background: var(--dsw-alias-bg-layer-1, #fff); cursor: pointer; }
.qbot-gvColorNum { flex: 1 1 auto; min-width: 0; }
/* ID 输入框（datalist 下拉 + 手动粘贴） */
.qbot-gvIdInput { min-width: 0; display: flex; flex-direction: column; }
.qbot-gvIdInput .qbot-input { width: 100%; min-width: 0; }
/* 接口返回 JSON 展示框 */
.qbot-gvResult { min-width: 0; max-height: 260px; overflow: auto; overscroll-behavior: contain; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 9px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-gvResult pre { margin: 0; padding: 12px; color: var(--dsw-alias-label-secondary, #646a73); font: 11.5px/1.6 ui-monospace, SFMono-Regular, Menlo, monospace; overflow-wrap: anywhere; }
/* 发消息回执 + 排查说明 */
.qbot-gvReceiptOk, .qbot-gvReceiptWarn { display: flex; flex-direction: column; gap: 4px; font-size: 12px; line-height: 1.6; overflow-wrap: anywhere; }
.qbot-gvReceiptOk code { color: var(--dsw-alias-label-primary, #1f2329); font: 11.5px/1.6 ui-monospace, SFMono-Regular, Menlo, monospace; }
.qbot-gvReceiptOk span { color: var(--dsw-alias-label-secondary, #646a73); }
.qbot-gvReceiptWarn { color: var(--dsw-alias-state-warning-primary, #d8961b); }
.qbot-gvRawDetails { min-width: 0; font-size: 12px; color: var(--dsw-alias-label-secondary, #646a73); }
.qbot-gvRawDetails summary { cursor: pointer; }
.qbot-gvRawDetails pre { margin: 8px 0 0; padding: 12px; border-radius: 8px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); color: var(--dsw-alias-label-secondary, #646a73); font: 11.5px/1.6 ui-monospace, SFMono-Regular, Menlo, monospace; overflow: auto; overflow-wrap: anywhere; }
.qbot-gvTip { background: color-mix(in srgb, var(--dsw-alias-state-info-bg, #e8f3ff) 40%, transparent); }
.qbot-gvTip p { margin: 0; font-size: 12px; line-height: 1.7; color: var(--dsw-alias-label-secondary, #646a73); overflow-wrap: anywhere; }
@media (max-width: 640px) {
  .qbot-gvNav { width: 112px; padding: 10px 6px; }
  .qbot-gvContent { padding: 14px 12px 18px; }
  .qbot-gvScope { margin: -14px -12px 16px; padding: 8px 12px; }
  .qbot-ptNav { width: 130px; padding: 10px 6px; }
  .qbot-ptNavItem { padding: 8px 7px; font-size: 12px; }
  .qbot-ptContent { padding: 14px 12px 18px; }
  .qbot-ptItemGrid { grid-template-columns: minmax(0, 1fr); }
}

/* ── AI 执行记录（群聊管理 / 频道管理共用；触发在 agent 聊天里） ── */
/* 不设固定高度 / 不建嵌套滚动：整块跟着弹窗右侧内容一起滚，避免鼠标停在这里时滚轮被吞。 */
.qbot-aiPanel { display: flex; flex-direction: column; min-width: 0; gap: 12px; }
.qbot-aiHead { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex: none; }
.qbot-aiHead strong { display: block; font-size: 15px; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-aiSub { margin: 3px 0 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 1.5; }
.qbot-aiDisclaimer { flex: none; margin: 0; padding: 8px 12px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 9px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); color: var(--dsw-alias-label-secondary, #646a73); font-size: 11.5px; line-height: 1.55; }
.qbot-aiBody { min-height: 120px; min-width: 0; padding: 14px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 12px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
/* 时间轴：左列时间 → 中间轴线/状态节点 → 右列事件卡（空状态也占一行）。 */
.qbot-aiTimeline { min-width: 0; display: flex; flex-direction: column; gap: 12px; }
.qbot-aiTlRow { min-width: 0; display: grid; grid-template-columns: minmax(74px, 96px) 18px minmax(0, 1fr); align-items: stretch; }
.qbot-aiTlTime { padding-top: 11px; text-align: right; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 10.5px; line-height: 1.45; overflow-wrap: anywhere; }
.qbot-aiTlNode { position: relative; display: flex; justify-content: center; }
.qbot-aiTlNode::before { content: ""; position: relative; z-index: 1; width: 9px; height: 9px; margin-top: 14px; border-radius: 50%; background: var(--dsw-alias-state-success-primary, #27855b); box-shadow: 0 0 0 3px var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-aiTlNode::after { content: ""; position: absolute; top: 21px; bottom: -12px; left: 50%; width: 1px; transform: translateX(-50%); background: var(--dsw-alias-border-l2, #e5e6eb); }
.qbot-aiTlRow:last-child .qbot-aiTlNode::after { display: none; }
.qbot-aiTlRow.is-fail .qbot-aiTlNode::before { background: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-aiTlRow.is-empty .qbot-aiTlNode::before { background: var(--dsw-alias-border-l2, #e5e6eb); }
.qbot-aiTlContent { min-width: 0; }
.qbot-aiEmpty { margin: 0; padding: 16px 14px; border: 1px dashed var(--dsw-alias-border-l2, #e5e6eb); border-radius: 10px; background: var(--dsw-alias-bg-layer-1, #fff); color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 12px; line-height: 1.7; overflow-wrap: anywhere; }
.qbot-aiLog { min-width: 0; display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-left: 3px solid var(--dsw-alias-state-success-primary, #27855b); border-radius: 10px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-aiLog.is-fail { border-left-color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-aiLogHead { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.qbot-aiLogState { margin-left: auto; color: var(--dsw-alias-label-secondary, #646a73); font-size: 11px; font-weight: 650; }
.qbot-aiLog.is-fail .qbot-aiLogState { color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-aiSrc { padding: 1px 6px; border-radius: 4px; font-size: 10px; line-height: 1.5; color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-aiSrc.is-local { color: var(--dsw-alias-state-success-color, #27855b); }
.qbot-aiSrc.is-llm { color: var(--qbot-blue, #1677ff); }
.qbot-aiSrc.is-cache { color: #b06f00; }
.qbot-aiLogAction { color: var(--dsw-alias-label-primary, #1f2329); font-size: 12.5px; font-weight: 650; }
.qbot-aiLogText { color: var(--dsw-alias-label-secondary, #646a73); font-size: 11.5px; line-height: 1.55; overflow-wrap: anywhere; white-space: pre-wrap; }
.qbot-aiBubble { min-width: 0; padding: 8px 10px; border-radius: 8px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); color: var(--dsw-alias-label-primary, #1f2329); font-size: 12px; line-height: 1.6; overflow-wrap: anywhere; white-space: pre-wrap; }
.qbot-aiLogTarget { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 10.5px; overflow-wrap: anywhere; }
.qbot-aiUsage { display: flex; align-items: baseline; gap: 8px; flex: none; padding-top: 8px; border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; }
.qbot-aiUsage > span:first-child { font-weight: 650; }
@media (max-width: 640px) {
  .qbot-aiLogHead { gap: 6px; }
  .qbot-aiTlRow { grid-template-columns: minmax(56px, 72px) 14px minmax(0, 1fr); }
  .qbot-aiTlTime { font-size: 10px; }
}

/* ═══ 机器人管理控制台弹窗（左菜单 + 右内容 + 运营大屏） ═══════════════════ */
.qbot-consoleOverlay { z-index: 9000; backdrop-filter: none; }
/* 弹窗宽高联动缩放：以 1120:860（≈1.3:1）为基准比例，窗口任一维变小时宽高一起等比收小，大屏则封顶不再放大。 */
.qbot-consoleModal { position: relative; width: min(1120px, calc(100vw - 48px), calc((100vh - 48px) * 1.3)); height: min(860px, calc(100vh - 48px), calc((100vw - 48px) / 1.3)); }
/* 顶部悬浮提示：绝对定位、脱离文档流，出现/消失不挤压内容，避免抖动；层级高于内容区与内部弹窗。 */
.qbot-consoleToast { position: absolute; top: 66px; left: 50%; transform: translateX(-50%); z-index: 10020; max-width: min(620px, calc(100% - 48px)); margin: 0; box-shadow: 0 10px 30px rgb(31 35 41 / 20%); animation: none; }
.qbot-consoleBody { flex: 1 1 auto; min-width: 0; min-height: 0; display: flex; overflow: hidden; border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
.qbot-consoleMenu { flex: none; width: 210px; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 10px 9px 16px; border-right: 1px solid var(--dsw-alias-border-l1, #eef0f3); background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-consoleMenuGroup { margin-bottom: 4px; }
.qbot-consoleMenuGroup + .qbot-consoleMenuGroup { margin-top: 8px; padding-top: 10px; border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
/* 一级：分区标题——小号灰字、字距拉开、左侧色条 */
.qbot-consoleMenuGroupTitle { display: flex; align-items: center; gap: 8px; padding: 5px 10px 6px; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 10.5px; font-weight: 700; letter-spacing: .1em; }
.qbot-consoleMenuGroupTitle .qbot-consoleMenuIcon { width: 15px; font-size: 11px; opacity: .75; }
/* 二级：能力项——正常字号、带图标、缩进一级 */
.qbot-consoleMenuItem { width: 100%; display: flex; align-items: center; gap: 9px; padding: 8px 10px 8px 20px; margin: 1px 0; border: 0; border-radius: 8px; background: transparent; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12.5px; text-align: left; cursor: pointer; }
.qbot-consoleMenuItem:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-consoleMenuItem.is-active { background: var(--dsw-alias-bg-layer-1, #fff); color: var(--qbot-blue, #1677ff); font-weight: 650; box-shadow: 0 1px 3px rgb(31 35 41 / 8%); }
.qbot-consoleMenuIcon { flex: none; width: 18px; text-align: center; opacity: .85; }
.qbot-consoleMenuLabel { flex: 1 1 auto; min-width: 0; overflow-wrap: anywhere; }
.qbot-consoleMenuCaret { flex: none; width: 12px; text-align: center; color: var(--dsw-alias-label-tertiary, #8f959e); transition: transform .15s ease; }
/* 三级：子 Tab——再缩进、无图标、圆点连接线、更轻的字号 */
.qbot-consoleSubMenu { margin: 2px 0 5px 36px; padding-left: 11px; border-left: 1px solid var(--dsw-alias-border-l2, #dfe1e5); }
.qbot-consoleSubItem { padding: 5px 9px; font-size: 11.5px; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-consoleSubItem::before { content: ""; display: inline-block; width: 4px; height: 4px; margin-right: 9px; vertical-align: middle; border-radius: 50%; background: var(--dsw-alias-label-placeholder, #bbbfc4); }
.qbot-consoleSubItem:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-consoleSubItem.is-active { background: transparent; color: var(--qbot-blue, #1677ff); font-weight: 600; box-shadow: none; }
.qbot-consoleSubItem.is-active::before { background: var(--qbot-blue, #1677ff); }
.qbot-consoleContent { flex: 1 1 auto; min-width: 0; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 24px 30px 28px; }
/* 运营总览：单屏自适应，压缩留白让所有区块一屏放得下，不出现外层滚动条。 */
.qbot-consoleContent.is-overview { display: flex; flex-direction: column; overflow: hidden; padding: 18px 26px 20px; }
.qbot-consoleContent.is-overview .qbot-consolePaneHead { flex: none; margin-bottom: 12px; }
.qbot-consoleContent.is-overview .qbot-consoleOverview { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; }
/* 归档/配置清单：内容区切换为定高 flex 列，让内嵌弹窗跟随外框高度、内部自行滚动。 */
.qbot-consoleContent.is-fill { display: flex; flex-direction: column; overflow: hidden; }
.qbot-consoleContent.is-fill .qbot-consolePaneBody { flex: 1 1 auto; min-width: 0; min-height: 0; display: flex; flex-direction: column; }
.qbot-consolePaneHead { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; margin-bottom: 16px; }
.qbot-consoleCrumb { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-bottom: 4px; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11.5px; }
.qbot-consoleCrumb i { color: var(--dsw-alias-label-placeholder, #bbbfc4); font-style: normal; }
.qbot-consoleHeadActions { display: flex; align-items: center; gap: 8px; flex: none; }
.qbot-consolePaneHead h3 { margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 16px; font-weight: 650; }
.qbot-consolePaneHead p { margin: 3px 0 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; }
.qbot-consoleMetricGrid { flex: none; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; margin-bottom: 12px; }
.qbot-consoleMetric { min-width: 0; min-height: 92px; display: flex; flex-direction: column; gap: 5px; padding: 10px 13px 9px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-left: 3px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 11px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-consoleMetric[data-tone="success"] { border-left-color: var(--dsw-alias-state-success-primary, #20a162); }
.qbot-consoleMetric[data-tone="warning"] { border-left-color: var(--dsw-alias-state-warn-primary, #d97706); }
.qbot-consoleMetric[data-tone="error"] { border-left-color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-consoleMetricTop { display: flex; align-items: center; gap: 7px; min-width: 0; }
.qbot-consoleMetricIcon { flex: none; width: 18px; height: 18px; display: grid; place-items: center; border-radius: 5px; background: var(--dsw-alias-bg-layer-1, #fff); color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; line-height: 1; }
.qbot-consoleMetric[data-tone="success"] .qbot-consoleMetricIcon { color: var(--dsw-alias-state-success-primary, #20a162); }
.qbot-consoleMetric[data-tone="warning"] .qbot-consoleMetricIcon { color: var(--dsw-alias-state-warn-primary, #d97706); }
.qbot-consoleMetric[data-tone="error"] .qbot-consoleMetricIcon { color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-consoleMetricLabel { min-width: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 11.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.qbot-consoleMetricValue { color: var(--dsw-alias-label-primary, #1f2329); font-size: 21px; line-height: 1.15; font-weight: 700; font-variant-numeric: tabular-nums; }
.qbot-consoleMetricSub { min-height: 13px; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 10.5px; line-height: 1.2; }
.qbot-consoleMetric[data-tone="success"] .qbot-consoleMetricValue { color: var(--dsw-alias-state-success-primary, #20a162); }
.qbot-consoleMetric[data-tone="warning"] .qbot-consoleMetricValue { color: var(--dsw-alias-state-warn-primary, #d97706); }
.qbot-consoleMetric[data-tone="error"] .qbot-consoleMetricValue { color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-consoleCharts { display: grid; grid-template-columns: 1.3fr 1fr 1.15fr; gap: 12px; }
.qbot-consoleOverview > .qbot-consoleCharts:not(.qbot-ovArchive) { flex: 1 1 auto; min-height: 0; grid-template-rows: minmax(0, 1fr) auto; }
.qbot-consoleOverview > .qbot-consoleCharts:not(.qbot-ovArchive) > .qbot-consoleChart { display: flex; flex-direction: column; }
.qbot-consoleChart { min-width: 0; padding: 12px 14px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 12px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-consoleChartTitle { color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; font-weight: 650; margin-bottom: 14px; }
.qbot-consoleBars { display: flex; align-items: flex-end; gap: 10px; height: 150px; }
.qbot-consoleBarCol { flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 6px; height: 100%; }
.qbot-consoleBar { width: 100%; max-width: 42px; min-height: 3px; border-radius: 5px 5px 0 0; background: var(--qbot-blue, #1677ff); transition: height .25s ease; }
.qbot-consoleBarCol span { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 10.5px; font-variant-numeric: tabular-nums; }
.qbot-consoleCompose { display: flex; flex-direction: column; gap: 14px; }
.qbot-consoleComposeBar { display: flex; width: 100%; height: 16px; border-radius: 8px; overflow: hidden; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-consoleComposeBar .is-passive { background: var(--qbot-blue, #1677ff); }
.qbot-consoleComposeBar .is-proactive { background: var(--dsw-alias-state-success-primary, #20a162); }
.qbot-consoleComposeLegend { display: flex; flex-direction: column; gap: 9px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; }
.qbot-consoleComposeLegend span { display: inline-flex; align-items: center; gap: 7px; }
.qbot-consoleComposeLegend i { width: 9px; height: 9px; border-radius: 3px; flex: none; }
.qbot-consoleComposeLegend i.is-passive { background: var(--qbot-blue, #1677ff); }
.qbot-consoleComposeLegend i.is-proactive { background: var(--dsw-alias-state-success-primary, #20a162); }
/* 运营总览：状态横幅 + 带刻度的趋势 + 构成环 + 运行信息，纯查看无操作按钮。 */
.qbot-ovHero { flex: none; display: flex; align-items: center; gap: 18px; min-width: 0; margin-bottom: 12px; padding: 10px 16px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 12px; background: linear-gradient(100deg, rgb(22 119 255 / 8%), transparent 62%), var(--dsw-alias-bg-layer-1, #fff); }
.qbot-ovHeroId { flex: 1 1 auto; min-width: 0; display: flex; align-items: center; gap: 11px; }
.qbot-ovAvatar { flex: none; width: 40px; height: 40px; display: grid; place-items: center; border-radius: 11px; background: var(--qbot-blue, #1677ff); color: #fff; font-size: 18px; box-shadow: 0 3px 10px rgb(22 119 255 / 24%); }
.qbot-ovHeroMeta { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.qbot-ovHeroMeta strong { color: var(--dsw-alias-label-primary, #1f2329); font-size: 14px; font-weight: 650; overflow-wrap: anywhere; }
.qbot-ovHeroMeta span { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; }
.qbot-ovConn { flex: none; display: inline-flex; align-items: center; gap: 7px; padding: 5px 11px; border-radius: 999px; font-size: 11.5px; font-weight: 600; }
.qbot-ovConn i { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.qbot-ovConn.is-success { color: var(--dsw-alias-state-success-primary, #20a162); background: rgb(32 161 98 / 10%); }
.qbot-ovConn.is-warning { color: var(--dsw-alias-state-warn-primary, #d97706); background: rgb(217 119 6 / 10%); }
.qbot-ovConn.is-error { color: var(--dsw-alias-state-error-primary, #d54941); background: rgb(213 73 65 / 10%); }
.qbot-ovConn.is-muted { color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-ovHeroFacts { flex: none; display: flex; align-items: center; }
.qbot-ovHeroFacts > div { min-width: 78px; display: flex; flex-direction: column; gap: 3px; padding: 0 14px; border-left: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
.qbot-ovHeroFacts span { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 10.5px; white-space: nowrap; }
.qbot-ovHeroFacts strong { color: var(--dsw-alias-label-primary, #1f2329); font-size: 16px; font-weight: 650; font-variant-numeric: tabular-nums; }
.qbot-ovChartHead { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 14px; }
.qbot-ovChartHead > div { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.qbot-ovChartHead strong { color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; font-weight: 650; }
.qbot-ovChartHead > div span { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 10.5px; }
.qbot-ovChartTag { flex: none; padding: 4px 9px; border-radius: 6px; background: rgb(22 119 255 / 9%); color: var(--qbot-blue, #1677ff); font-size: 10.5px; font-weight: 650; font-variant-numeric: tabular-nums; }
.qbot-ovBars { position: relative; flex: 1 1 auto; min-height: 118px; }
.qbot-ovBars::before { content: ""; position: absolute; inset: 0 0 17px; pointer-events: none; background: repeating-linear-gradient(to top, var(--dsw-alias-border-l1, #eef0f3) 0 1px, transparent 1px 25%); }
.qbot-ovBarArea { flex: 1 1 auto; width: 100%; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 4px; }
.qbot-ovBarValue { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 10px; font-variant-numeric: tabular-nums; }
.qbot-ovBarArea .qbot-consoleBar { max-width: 34px; }
.qbot-consoleBar.is-today { background: linear-gradient(180deg, #6aa8ff, var(--qbot-blue, #1677ff)); }
.qbot-ovDonutChart, .qbot-ovStatus { display: flex; flex-direction: column; }
.qbot-ovDonutBody { flex: 1 1 auto; display: flex; align-items: center; justify-content: center; gap: 16px; }
.qbot-ovDonut { flex: none; width: 104px; height: 104px; display: grid; place-items: center; border-radius: 50%; }
.qbot-ovDonutInner { width: 72px; height: 72px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; border-radius: 50%; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-ovDonutInner strong { color: var(--dsw-alias-label-primary, #1f2329); font-size: 18px; font-weight: 700; font-variant-numeric: tabular-nums; }
.qbot-ovDonutInner span { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 10px; }
.qbot-ovDonutBody .qbot-consoleComposeLegend { flex: 1 1 auto; min-width: 0; }
.qbot-ovStatusList { flex: 1 1 auto; align-content: center; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 10px; }
.qbot-ovStatusRow { min-width: 0; display: flex; flex-direction: column; gap: 3px; padding: 7px 10px; border-radius: 8px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-ovStatusLabel { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 10.5px; white-space: nowrap; }
.qbot-ovStatusValue { min-width: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 12px; font-weight: 600; overflow-wrap: anywhere; font-variant-numeric: tabular-nums; }
.qbot-ovStatusValue[data-tone="success"] { color: var(--dsw-alias-state-success-primary, #20a162); }
.qbot-ovStatusValue[data-tone="warning"] { color: var(--dsw-alias-state-warn-primary, #d97706); }
.qbot-ovStatusValue[data-tone="error"] { color: var(--dsw-alias-state-error-primary, #d54941); }
/* 运营总览：消息归档分类 / 来源 / 月份分布 */
.qbot-ovArchive { grid-column: 1 / -1; min-height: 0; margin-top: 12px; grid-template-columns: 1.2fr 1fr 1fr; }
.qbot-ovArcBar { display: flex; width: 100%; height: 14px; margin-bottom: 13px; border-radius: 7px; overflow: hidden; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-ovArcBar span { display: block; height: 100%; transition: width .25s ease; }
.qbot-ovArcBar .is-inbound, .qbot-ovArcBar .is-group { background: var(--qbot-blue, #1677ff); }
.qbot-ovArcBar .is-reply { background: var(--dsw-alias-state-success-primary, #20a162); }
.qbot-ovArcBar .is-proactive, .qbot-ovArcBar .is-c2c { background: var(--qbot-business, #9254de); }
.qbot-ovArcLegend { display: flex; flex-direction: column; gap: 8px; }
.qbot-ovArcLegend span { min-width: 0; display: flex; align-items: center; gap: 7px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 11.5px; }
.qbot-ovArcLegend i { flex: none; width: 8px; height: 8px; border-radius: 2px; }
.qbot-ovArcLegend i.is-inbound, .qbot-ovArcLegend i.is-group { background: var(--qbot-blue, #1677ff); }
.qbot-ovArcLegend i.is-reply { background: var(--dsw-alias-state-success-primary, #20a162); }
.qbot-ovArcLegend i.is-proactive, .qbot-ovArcLegend i.is-c2c { background: var(--qbot-business, #9254de); }
.qbot-ovArcLegend b { color: var(--dsw-alias-label-primary, #1f2329); font-weight: 650; font-variant-numeric: tabular-nums; }
.qbot-ovArcLegend em { margin-left: auto; color: var(--dsw-alias-label-tertiary, #8f959e); font-style: normal; font-variant-numeric: tabular-nums; }
.qbot-ovArcMonthList { flex: 1 1 auto; display: flex; flex-direction: column; justify-content: center; gap: 8px; }
.qbot-ovArcMonth { display: flex; align-items: center; gap: 8px; }
.qbot-ovArcMonth > span { flex: none; width: 34px; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 10.5px; font-variant-numeric: tabular-nums; }
.qbot-ovArcMonthTrack { flex: 1 1 auto; min-width: 0; height: 7px; border-radius: 4px; overflow: hidden; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-ovArcMonthTrack i { display: block; height: 100%; border-radius: 4px; background: var(--qbot-blue, #1677ff); }
.qbot-ovArcMonth strong { flex: none; width: 30px; text-align: right; color: var(--dsw-alias-label-secondary, #646a73); font-size: 10.5px; font-weight: 600; font-variant-numeric: tabular-nums; }
.qbot-ovArcEmpty { flex: 1 1 auto; display: grid; place-items: center; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11.5px; }
.qbot-consoleEmbed { min-width: 0; }
.qbot-consoleConfig { max-width: 920px; }
.qbot-consoleConfig > .qbot-section { margin-bottom: 12px; }
/* 配置分区平铺：去掉卡片外壳，表单直接清单显示。 */
.qbot-consoleConfig > .qbot-sectionBody { padding: 2px 0 0; border: 0; background: transparent; }
/* 控制台内嵌的独立弹窗类组件：剥掉自己的遮罩与定高外壳，作为内容区面板留在弹窗内。 */
.qbot-consoleSub { min-width: 0; }
.qbot-consoleSub > .qbot-modalOverlay { position: static; inset: auto; z-index: auto; display: block; padding: 0; background: transparent; backdrop-filter: none; animation: none; }
/* 内容区由左侧菜单切换，内嵌面板自带的关闭按钮一律不显示 */
.qbot-consoleContent .qbot-consoleSub .qbot-modalClose,
.qbot-consoleContent > .qbot-consoleEmbed .qbot-modalClose { display: none !important; }
/* 控制台内弹出的二级弹窗：脱离内容区滚动裁切，层级高于控制台本体 */
.qbot-consoleOverlay .qbot-modalOverlay,
.qbot-consoleOverlay .qbot-gvSubOverlay,
.qbot-consoleOverlay .qbot-confirmOverlay { z-index: 10010; }
.qbot-consoleSub > .qbot-modalOverlay > .qbot-modal,
.qbot-consoleSub > .qbot-modalOverlay > .qbot-modal.qbot-modalWide,
.qbot-consoleSub > .qbot-modalOverlay > .qbot-modal.qbot-cmModal,
.qbot-consoleSub > .qbot-modalOverlay > .qbot-modal.qbot-gvModal { width: 100%; height: auto; max-height: none; margin: 0; border: 0; border-radius: 0; box-shadow: none; background: transparent; overflow: visible; animation: none; }
.qbot-consoleSub > .qbot-modalOverlay > .qbot-modal > .qbot-modalHead { padding: 0 0 12px; }
.qbot-consoleSub > .qbot-modalOverlay > .qbot-modal > .qbot-modalFoot { padding: 12px 0 0; }
.qbot-consoleSub .qbot-modalAlert { margin: 0 0 12px; }
/* fill 模式：外框定高，内嵌弹窗铺满；隐藏自带头部(顶部描述重复)与归档底部按钮，
   让内部列表/编辑器各自滚动，样式与外框一致(去掉卡片边框与圆角)。 */
.qbot-consoleContent.is-fill .qbot-consoleSub,
.qbot-consoleContent.is-fill .qbot-consoleSub > .qbot-modalOverlay { flex: 1 1 auto; min-width: 0; min-height: 0; display: flex; flex-direction: column; }
.qbot-consoleContent.is-fill .qbot-consoleSub > .qbot-modalOverlay { position: relative; inset: auto; z-index: auto; padding: 0; background: transparent; backdrop-filter: none; animation: none; }
.qbot-consoleContent.is-fill .qbot-consoleSub > .qbot-modalOverlay > .qbot-modal { flex: 1 1 auto; min-height: 0; height: auto; max-height: none; border: 0; border-radius: 0; box-shadow: none; background: transparent; overflow: hidden; }
.qbot-consoleContent.is-fill .qbot-consoleSub > .qbot-modalOverlay > .qbot-modal > .qbot-modalHead { display: none; }
.qbot-consoleSubArchive > .qbot-modalOverlay > .qbot-modal > .qbot-modalFoot { display: none; }
.qbot-consoleSubArchive > .qbot-modalOverlay > .qbot-modal > .qbot-modalAlert { margin: 0 0 8px; }
.qbot-consoleContent.is-fill .qbot-consoleSub.qbot-consoleSubArchive .qbot-archSplit { flex: 1 1 auto; min-height: 0; margin: 0; border: 0; border-radius: 0; }
.qbot-consoleContent.is-fill .qbot-consoleSub.qbot-consoleSubManifest .qbot-cmBody { flex: 1 1 auto; min-height: 0; padding: 0 0 4px; }
/* 单一滚动：内容区是唯一滚动容器，内层不再各建滚动区吞掉滚轮。 */
.qbot-consoleContent .qbot-modalListScroll,
.qbot-consoleContent .qbot-modalBody,
.qbot-consoleContent .qbot-modalBody .qbot-editForm,
.qbot-consoleContent .qbot-gvNav,
.qbot-consoleContent .qbot-gvContent,
.qbot-consoleContent .qbot-ptNav,
.qbot-consoleContent .qbot-ptContent,
.qbot-consoleContent .qbot-archSide,
.qbot-consoleContent .qbot-msgList,
.qbot-consoleContent .qbot-cmHelpScroll { overflow: visible !important; overscroll-behavior: auto !important; }
.qbot-consoleContent .qbot-modalList { overflow: visible !important; min-height: 0 !important; }
/* 非 fill 视图：内层任何滚动区都允许滚动链，滚轮滚到边界后交给内容区，避免被 contain 吞掉。 */
.qbot-consoleContent:not(.is-fill) * { overscroll-behavior: auto !important; }
/* 带 max-height 的内部小滚动区（成员/禁言名单、结果区、日志）改为可滚动链，滚轮滚到边界后交给内容区。 */
.qbot-consoleContent .qbot-ptMutedList,
.qbot-consoleContent .qbot-ptMembers,
.qbot-consoleContent .qbot-gvAiLogs,
.qbot-consoleContent .qbot-gvResult,
.qbot-consoleContent .qbot-gvSubModal { overscroll-behavior: auto !important; }
/* fill 模式例外：归档/配置清单在定高容器内自行滚动，恢复其内层的 overflow 与滚动链隔离。 */
.qbot-consoleContent.is-fill .qbot-archSide,
.qbot-consoleContent.is-fill .qbot-msgList { overflow-y: auto !important; overscroll-behavior: contain !important; }
.qbot-consoleContent.is-fill .qbot-cmCode { overflow: auto !important; }
.qbot-consoleContent.is-fill .qbot-cmHelpScroll { overflow-y: auto !important; overscroll-behavior: contain !important; }
.qbot-consoleContent.is-fill .qbot-cmIssues { overflow-y: auto !important; }
/* 内嵌模式下，频道/群聊组件只出内容——导航由控制台左侧唯一的三级树接管。 */
.qbot-consoleContent .qbot-gvLayout.is-embedded .qbot-gvNav,
.qbot-consoleContent .qbot-gvLayout.is-embedded .qbot-gvSubTabs,
.qbot-consoleContent .qbot-ptLayout.is-embedded .qbot-ptNav,
.qbot-consoleContent .qbot-ptLayout.is-embedded .qbot-ptSubNav { display: none !important; }
.qbot-consoleContent .qbot-gvLayout.is-embedded .qbot-gvContent,
.qbot-consoleContent .qbot-ptLayout.is-embedded .qbot-ptContent { padding: 0; }
.qbot-consoleEntry { max-width: 460px; margin: 48px auto; display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center; }
.qbot-consoleEntryIcon { width: 52px; height: 52px; display: grid; place-items: center; border-radius: 14px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); color: var(--qbot-blue, #1677ff); font-size: 22px; }
.qbot-consoleEntry h3 { margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 16px; font-weight: 650; }
.qbot-consoleEntry p { margin: 0 0 4px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12.5px; line-height: 1.6; }
@media (max-width: 720px) {
  .qbot-consoleBody { flex-direction: column; }
  .qbot-consoleMenu { width: 100%; max-height: 30vh; border-right: 0; border-bottom: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
  .qbot-consoleMetricGrid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .qbot-consoleCharts { grid-template-columns: 1fr; }
  .qbot-ovHero { flex-wrap: wrap; gap: 10px; }
  .qbot-ovHeroFacts { width: 100%; justify-content: space-between; padding-top: 10px; border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
  .qbot-ovHeroFacts > div { flex: 1 1 0; padding: 0 10px; }
  .qbot-ovHeroFacts > div:first-child { padding-left: 0; border-left: 0; }
}
`;
