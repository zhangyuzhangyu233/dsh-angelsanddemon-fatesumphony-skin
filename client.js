// dsh-angelsanddemon-fatesumphony-skin —— 《弹丸论破：天魔命曲》 Web 皮肤 (Client)
//
// 全新独立实现：仅使用同人游戏素材 + DSH 公开 DOM 钩子，
// 不依赖、不引用任何其他皮肤插件。所有规则挂在 body[data-dsh-tenma] 下，
// 滚动/布局所有权仍归官方。
//
// 素材清单（全部用上）：
//   mouse.cur           页面自定义光标
//   background.jpg      页面壁纸
//   hero.jpg            空会话（hero 态）的角色场景背景
//   leftbar-flush.png   左侧栏贴边蓝条（裁掉原图 4px 软边，无缝贴左）
//   talkingbar.png      输入框对话条
//   talkingbar_buttom.png 底部调用数据条
//   talkingbar_lighter.png 上述两处的底部光效
//   send.png            发送按钮
//   newsession.png      新会话药丸
//   selected.png        选中会话菱形光标
//   next.png            加载更早按钮
//
// 稳定钩子（DSH web）：
//   [data-slot='root'] > :first-child                        AppFrame
//   [data-sidebar-collapsed]                                 侧栏折叠（AppFrame 上）
//   *:has(> [data-slot='sidebar'])                           侧栏列
//   [data-slot='sidebar'] > :first-child                     SidebarRoot
//   [data-slot='sidebar'] [role='treeitem'][aria-selected]   会话/工作区行
//   [data-slot='conversation'] > [data-phase='hero']         空会话（英雄态）
//   [data-composer-seat] / [data-composer-card]              输入区座与卡片
//   [data-slot='conversation.composer.dock'] > *             底部调用数据条目
//   button[aria-label='发送消息'/'Send message']             发送按钮
//   侧栏第二个子元素                                         新会话按钮

window.__ModuleLoader__.load({
  id: 'dsh-angelsanddemon-fatesumphony-skin',
  factory: () => {
    var module = { exports: {} }
    var exports = module.exports

    var name = 'dsh-angelsanddemon-fatesumphony-skin'
    var inject = []
    var BODY_ATTR = 'data-dsh-tenma'
    var STYLE_ID = 'dsh-angelsanddemon-fatesumphony-skin/skin.css'
    var A = '/dsh-angelsanddemon-fatesumphony-skin/assets/'

    var U = {
      background: A + 'background.9b11e97f04d82e8a.jpg',
      hero: A + 'hero.825d20941ee9c089.jpg',
      leftbar: A + 'leftbar-flush.6a9d0bd8c91d8b05.png',
      talkingbar: A + 'talkingbar.5b783efc7b169875.png',
      talkingbarButtom: A + 'talkingbar_buttom.5ee681a1fc02ba1b.png',
      buttomL: A + 'buttom-L.9f6ad40f98b56d11.png',
      buttomM: A + 'buttom-M.3f9a7f101f146908.png',
      buttomR: A + 'buttom-R.a3ce29ed8b5c297f.png',
      talkingbarLighter: A + 'talkingbar_lighter.fc7c7bb6ff44cd3d.png',
      send: A + 'send.11e0454b5151acc6.png',
      newsession: A + 'newsession.eb61c51405b8daf8.png',
      selected: A + 'selected.0e38b2e284d6067f.png',
      next: A + 'next.5c63edcfda2d4d8f.png',
      mouse: A + 'mouse-small.ad621940735d7dbd.cur',
    }

    var BLUE = '#0F3EC8'
    var INK = '#12305e'

    var CSS = String.raw`
/* ============ 《天魔命曲》皮肤 ============ */

/* --- 1. 页面光标（mouse.png → .cur，热点 2,2） --- */
body[data-dsh-tenma] { cursor: url('${U.mouse}') 2 2, auto; }
body[data-dsh-tenma] textarea,
body[data-dsh-tenma] input { cursor: text; }

/* --- 2. 壁纸（background.png → jpg）：全局一整张完整显示 ---
   固定定位的独立图层承载（不用 background-attachment:fixed，
   后者在浏览器缩放时会把背景渲染成条块）；100% 拉伸保证整图无裁剪。 */
body[data-dsh-tenma] {
  background: #86a7d6;
}
body[data-dsh-tenma]::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background: url('${U.background}') center / cover no-repeat;
}
body[data-dsh-tenma] [data-slot='root'] > :first-child { background: transparent; }
body[data-dsh-tenma] [data-slot='conversation'] > :first-child {
  background: transparent;
  /* 平行四边形（输入框）调大：放宽聊天内容宽度 */
  --dsh-chat-content-width: 950px;
  --dsh-composer-card-max-width: calc(950px + 32px);
}
/* 右侧详情面板半透明，让壁纸全局透出 */
body[data-dsh-tenma] [data-slot='details'] > :first-child {
  background: rgba(255, 255, 255, 0.82);
}

/* --- 2.5 中和液态玻璃插件的覆盖层 ---
   若同机启用了 dsh-liquid-glass，其壁纸层会盖住本皮肤背景
   （底部白色渐变即其所为），其玻璃岛也会叠在自定义表面上；全部移除。 */
body[data-dsh-tenma] [data-dsh-liquid-glass-wallpaper] {
  display: none !important;
}
body[data-dsh-tenma] [data-slot='sidebar'] > :first-child::before,
body[data-dsh-tenma] [data-slot='conversation'] > :first-child::before {
  display: none !important;
}

/* --- 3. 空会话（hero 态）：跟随全局壁纸（效果图 JPG 仅作参考，不再当背景用） --- */

/* --- 3.5 工作区标题行：右侧三个图标（搜索/状态/添加）移到“工作区”文字下方 --- */
body[data-dsh-tenma] [data-slot='sidebar.workspaces'] > :first-child > :first-child {
  flex-wrap: wrap;
  height: auto;
  justify-content: flex-start;
  row-gap: 2px;
  padding-bottom: 3px;
}
body[data-dsh-tenma] [data-slot='sidebar.workspaces'] > :first-child > :first-child > :first-child {
  flex: 1 0 100%;
  max-width: none !important;
}
body[data-dsh-tenma] [data-slot='sidebar.workspaces'] > :first-child > :first-child > :nth-child(2) {
  margin-left: 0;
}

/* --- 4. 左侧栏：只保留 leftbar 梯形条（顶斜帽 78px + 中段 repeat + 底斜收口 90px），
   其余区域透明透出壁纸；展开/折叠渲染不变 --- */
body[data-dsh-tenma] *:has(> [data-slot='sidebar']) {
  position: relative;
  background: transparent;
  border-right: none;
}
body[data-dsh-tenma] *:has(> [data-slot='sidebar'])::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 137px;
  pointer-events: none;
  opacity: 0.6; /* 素材本身为 75% 白 → 叠加后约 45%，梯形条更透 */
  border: 78px solid transparent;
  border-width: 78px 0 90px 0;
  border-image: url('${U.leftbar}') 78 0 90 0 fill / 78px 0 90px 0 / 0 repeat;
}
body[data-dsh-tenma] [data-slot='sidebar'] > :first-child {
  position: relative;
  z-index: 1;
  background: transparent;
}
body[data-dsh-tenma] [data-slot='sidebar'] {
  --dsw-alias-label-primary: ${INK};
  --dsw-alias-label-secondary: #3a5a8c;
  --dsw-alias-label-tertiary: #5c7ba6;
  --dsw-alias-label-caption: #7d97b8;
  --dsw-alias-interactive-bg-hover: rgba(15, 62, 200, 0.08);
  --dsw-alias-interactive-bg-hover-solid: rgba(15, 62, 200, 0.12);
  --dsw-specific-sidebar-fill: transparent;
  --dsw-alias-border-l1: rgba(15, 62, 200, 0.14);
  --dsw-alias-border-l2: rgba(15, 62, 200, 0.10);
  color: ${INK};
}
/* 会话行：白色药丸（参考图白色菜单面板） */
body[data-dsh-tenma] [data-slot='sidebar'] [role='treeitem'] {
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(15, 62, 200, 0.16);
  border-radius: 10px;
  color: ${INK};
}
body[data-dsh-tenma] [data-slot='sidebar'] [role='treeitem']:hover {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(15, 62, 200, 0.35);
}
body[data-dsh-tenma] [data-slot='sidebar'] [role='treeitem'][aria-selected='true'] {
  background: #ffffff;
  border-color: ${BLUE};
  color: ${BLUE};
  font-weight: 600;
}
/* 选中光标：按需求移除（selected.png 小疙瘩） */
body[data-dsh-tenma] [data-slot='sidebar'] [role='treeitem'] { position: relative; }
body[data-dsh-tenma] [data-slot='sidebar'] [role='treeitem'][aria-selected='true']::before,
body[data-dsh-tenma] [data-sidebar-collapsed] [data-slot='sidebar'] [role='treeitem'][aria-selected='true']::before {
  display: none;
}
/* 设置按钮上移避开底部梯形收口，缩短至与新会话药丸同宽（100px），内容居中 */
body[data-dsh-tenma] [data-slot='sidebar.settings'] > button[aria-haspopup='dialog'] {
  width: 100px !important;
  margin: 4px 2px 100px !important;
  justify-content: center !important;
  padding: 6px 0 !important;
}
body[data-dsh-tenma] [data-sidebar-collapsed] [data-slot='sidebar.settings'] > button[aria-haspopup='dialog'] {
  width: 34px !important;
  padding: 0 !important;
  border-radius: 50% !important;
  margin: 4px 2px 100px !important;
}

/* --- 5. 新会话按钮：newsession 药丸（紧凑；品牌按钮 aria 相同，故用结构定位） --- */
body[data-dsh-tenma] [data-slot='sidebar'] > :first-child > :nth-child(2) {
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: auto !important;
  min-width: 80px;
  max-width: 100px;
  height: 34px !important;
  margin: 2px 0 10px 2px !important;
  padding: 0 6px !important;
  font-size: 12.5px;
  background: #45C4FF url('${U.newsession}') center / 100% 100% no-repeat !important;
  border: none !important;
  border-radius: 17px !important;
  color: #fff !important;
  font-weight: 600;
  box-shadow: none;
}
body[data-dsh-tenma] [data-slot='sidebar'] > :first-child > :nth-child(2) svg { color: #fff; }
/* 折叠态：顶部 logo 行与新会话按钮整体下移一点点 */
body[data-dsh-tenma] [data-sidebar-collapsed] [data-slot='sidebar'] > :first-child > :first-child {
  margin-top: 14px !important;
}
body[data-dsh-tenma] [data-sidebar-collapsed] [data-slot='sidebar'] > :first-child > :nth-child(2) {
  width: 34px !important;
  min-width: 34px;
  max-width: 34px;
  height: 34px !important;
  padding: 0 !important;
  margin: 12px auto 10px !important;
  border-radius: 50% !important;
}

/* --- 6. 输入座白底：移除官方的白色渐变粘性背景 ---
   官方在 active 态的 composerSeat 上画了 transparent→白(36px) 的渐变，
   渐变终点以下整片纯白 —— 即底部白色渐变/白边，整层移除让壁纸透出。 */
body[data-dsh-tenma] [data-composer-seat] {
  background: none !important;
}

/* --- 7. 输入框：talkingbar 原比例 3172:400，宽 980 → 高自动 123.6px --- */
body[data-dsh-tenma] [data-composer-card] {
  width: 100%;
  max-width: 980px !important;
  height: 124px;
  background-color: transparent;
  border: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  padding: 6px 148px;
  gap: 10px;
}
body[data-dsh-tenma] [data-composer-card]::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: url('${U.talkingbar}') center / 100% 100% no-repeat;
  opacity: 0.62;
}
body[data-dsh-tenma] [data-composer-card] > * {
  position: relative;
  z-index: 1;
}
/* 文本输入区：固定卡片高度内的内部滚动区域（高度不被文字影响） */
body[data-dsh-tenma] [data-input-scroll] {
  scrollbar-width: none;
  min-height: 0;
  overflow-y: auto;
  flex: 1 1 auto;
}
body[data-dsh-tenma] [data-input-scroll]::-webkit-scrollbar {
  display: none;
}
body[data-dsh-tenma] [data-composer-card] textarea {
  height: auto !important;
  min-height: 0 !important;
}
/* 工作区标签行：左缘对准 talkingbar 左上角尖点（卡片左缘 446 + 69 ≈ 515） */
body[data-dsh-tenma] [data-slot='conversation.composer'] button[aria-label='选择工作区'] {
  margin-left: 66px;
}
/* 附件轨 → 悬浮窗：内部样式原封不动，只把容器做成浮窗放在卡片正上方 */
body[data-dsh-tenma] [data-composer-card] > :has(img):not([data-input-scroll]) {
  position: absolute;
  left: 148px;
  bottom: calc(100% + 8px);
  z-index: 6;
  max-width: calc(100% - 296px);
  padding: 6px 8px;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.12);
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(9, 20, 60, 0.1);
}

/* --- 8. 底部调用数据区：等比三角形 + 拉长中段 ---
   数据条尺寸不变（748×49 定比）；
   两端三角形从原图等比缩放（115×97 → 58×49，无畸变）；
   中段白色单独横向拉伸。 */
body[data-dsh-tenma] [data-slot='conversation.composer.dock'] > *:has(> span) {
  position: relative;
  display: block;
  width: 100%;
  max-width: 520px;
  aspect-ratio: 1483 / 97;
  box-sizing: border-box;
  padding: 0 67px;
  overflow: hidden;
  background: url('${U.buttomM}') center / calc(100% - 80px) 34px no-repeat;
  color: #16305f;
}
/* 数据文本模块：单向循环走马灯（底部滑入 → 顶部滑出，永不回滚），每模块可见 5 秒。
   动画由插件 JS 主时钟每帧按当前 span 数量与序号重算 translateY ——
   智能体运行中统计更新引发 React 重建节点也不会打乱相位，杜绝重叠。 */
body[data-dsh-tenma] [data-slot='conversation.composer.dock'] > *:has(> span) > span {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 34px;
  line-height: 34px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
}
body[data-dsh-tenma] [data-slot='conversation.composer.dock'] > *:has(> span) > span:nth-child(even) {
  display: none;
}
@media (prefers-reduced-motion: reduce) {
  body[data-dsh-tenma] [data-slot='conversation.composer.dock'] > *:has(> span) > span:nth-child(odd) {
    opacity: 0;
  }
  body[data-dsh-tenma] [data-slot='conversation.composer.dock'] > *:has(> span) > span:nth-child(1) {
    opacity: 1;
  }
}
body[data-dsh-tenma] [data-slot='conversation.composer.dock'] > *:has(> span)::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 40px;
  pointer-events: none;
  background: url('${U.talkingbarButtom}') left center / calc(1483px * 34 / 97) 34px no-repeat;
}
body[data-dsh-tenma] [data-slot='conversation.composer.dock'] > *:has(> span)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 40px;
  pointer-events: none;
  background: url('${U.talkingbarButtom}') right center / calc(1483px * 34 / 97) 34px no-repeat;
}
body[data-dsh-tenma] [data-slot='conversation.composer.dock'] > *:has(> span) > * {
  position: relative;
  z-index: 1;
}
body[data-dsh-tenma] [data-slot='conversation.composer.dock'] > *:not(:has(> span)) {
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(15, 62, 200, 0.22);
  border-radius: 12px;
  color: #16305f;
}
body[data-dsh-tenma] [data-slot='conversation.composer.dock'] > * + * {
  margin-top: 6px;
}
body[data-dsh-tenma] [data-slot='conversation.composer.dock'] > *:not(:has(> span)) > :first-child {
  background: transparent;
}
body[data-dsh-tenma] [data-slot='conversation.composer.dock'] > *:not(:has(> span)) > :first-child::after {
  display: none;
}

/* --- 9. 发送按钮：next 素材（蓝 V 箭头），剥离出卡片悬浮在右侧 --- */
body[data-dsh-tenma] [data-composer-card] button[aria-label='发送消息'],
body[data-dsh-tenma] [data-composer-card] button[aria-label='Send message'] {
  position: absolute;
  left: calc(100% + 19px);
  top: -50%;
  transform: translateY(-50%);
  z-index: 7;
  width: 118px;
  height: 40px;
  padding: 0;
  border: none;
  background: url('${U.next}') center / 30px 26px no-repeat !important;
  color: transparent;
  border-radius: 0 !important;
  box-shadow: none !important;
}
/* 停止按钮：保留浮动坐标（与确认按钮一致），恢复官方原始样式 */
body[data-dsh-tenma] [data-composer-card] button[aria-label='停止生成'],
body[data-dsh-tenma] [data-composer-card] button[aria-label='Stop generating'] {
  position: absolute;
  left: calc(100% + 60px);
  top: -60%;
  transform: translateY(-50%);
  z-index: 7;
}
body[data-dsh-tenma] [data-composer-card] button[aria-label='发送消息'] svg,
body[data-dsh-tenma] [data-composer-card] button[aria-label='Send message'] svg { display: none; }
body[data-dsh-tenma] [data-composer-card] button[aria-label='发送消息']:disabled,
body[data-dsh-tenma] [data-composer-card] button[aria-label='Send message']:disabled {
  opacity: 0.45;
  box-shadow: none;
}

/* 模型/推理/进度条区域小幅右移（负 margin，不动 transform，避免影响按钮定位） */
body[data-dsh-tenma] [data-composer-card] > :last-child > :last-child {
  margin-right: -40px;
}
`

    function apply(ctx) {
      if (typeof document === 'undefined') return
      var body = document.body
      if (body === null) return
      body.setAttribute(BODY_ATTR, '')

      var style = document.createElement('style')
      style.id = STYLE_ID
      style.textContent = CSS
      document.head.appendChild(style)

      // --- 底部数据条走马灯驱动：单一主时钟 + rAF 逐帧定位 ---
      // 之前的做法是每个 span 一条独立 CSS 动画（负 delay 交错）。智能体运行中
      // 统计文本频繁更新，React 重建 span 节点 → 动画各自重启、相位错位，
      // 出现两个模块同时停留在可视槽位的完全重叠。
      // 改为 JS 按主时钟计算绝对位置：节点无论何时重建，下一帧即回到正确相位；
      // 相邻模块间距恒为 49px（进入/滑出两段共用同一缓动，锁定间距），永不重叠。
      var DOCK_SELECTOR = "[data-slot='conversation.composer.dock'] > *:has(> span)"
      var SLOT = 34                          // 数据条模块高度（520×34 等比）
      var HOLD = 5                          // 每模块停留秒数
      var SWING = 2                         // 进入 / 滑出各 2 秒
      var STAGGER = HOLD + SWING            // 相邻模块相位间隔 7s

      // CSS ease-in-out（cubic-bezier(0.42,0,0.58,1)）的 y 分量：牛顿法解 x(t)=u
      function easeInOut(u) {
        if (u <= 0) return 0
        if (u >= 1) return 1
        var t = u
        for (var i = 0; i < 6; i++) {
          var inv = 1 - t
          var x = 3 * inv * inv * t * 0.42 + 3 * inv * t * t * 0.58 + t * t * t
          var dx = 1.26 * (inv * inv - 2 * inv * t) + 1.74 * (2 * t - 3 * t * t) + 3 * t * t
          if (Math.abs(x - u) < 1e-4) break
          t -= (x - u) / dx
        }
        var inv = 1 - t
        return 3 * inv * t * t + t * t * t
      }

      // 相位 p（秒，0..D）→ translateY px：
      //   进入 2s：+49 → 0（缓动）   停留 5s：0
      //   滑出 2s：0 → -49（同缓动） 之后匀速上移 → -(K-1)*49 到周期末
      function statPos(p, K) {
        if (p < SWING) return SLOT * (1 - easeInOut(p / SWING))
        if (p < SWING + HOLD) return 0
        if (p < 2 * SWING + HOLD) return -SLOT * easeInOut((p - SWING - HOLD) / SWING)
        var dur = STAGGER * K - (2 * SWING + HOLD)
        if (dur <= 0) return -SLOT
        var t = p - (2 * SWING + HOLD)
        return -SLOT * (1 + (K - 2) * (t / dur))
      }

      var clockStart = performance.now() - 2000 // 启动即处于模块 1 的停留相位
      var pausedTotal = 0
      var pauseStart = 0
      var rafId = 0
      var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
      var lastTransform = new WeakMap()

      function nowClock() {
        return performance.now() - clockStart - pausedTotal -
          (pauseStart ? performance.now() - pauseStart : 0)
      }

      function setTransform(el, y) {
        var value = y === 0 ? '' : 'translateY(' + y.toFixed(2) + 'px)'
        if (lastTransform.get(el) !== value) {
          lastTransform.set(el, value)
          el.style.transform = value
        }
      }

      function tick() {
        rafId = requestAnimationFrame(tick)
        var root = document.querySelector(DOCK_SELECTOR)
        if (root === null) return
        // 悬停暂停：用 :hover 状态判定，无需事件监听、随节点重建自动适配
        var isHover = root.matches(':hover')
        if (isHover && !pauseStart) pauseStart = performance.now()
        else if (!isHover && pauseStart) {
          pausedTotal += performance.now() - pauseStart
          pauseStart = 0
        }
        var spans = root.children
        var odd = []
        for (var i = 0; i < spans.length; i++) {
          if (i % 2 === 0) odd.push(spans[i])
        }
        var K = odd.length
        var t = nowClock() / 1000 // 秒：与 SWING/HOLD/STAGGER 同单位
        for (var i = 0; i < K; i++) {
          if (K < 2 || reducedMotion.matches) {
            setTransform(odd[i], 0)
          } else {
            var D = STAGGER * K
            var p = ((t - STAGGER * i) % D + D) % D
            setTransform(odd[i], statPos(p, K))
          }
        }
      }

      rafId = requestAnimationFrame(tick)

      ctx.effect(function () {
        return function () {
          cancelAnimationFrame(rafId)
          style.remove()
          body.removeAttribute(BODY_ATTR)
        }
      })
    }

    exports.name = name
    exports.inject = inject
    exports.apply = apply
    return module.exports
  },
})
