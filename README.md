# 《弹丸论破：天魔命曲》主题DSH皮肤插件

> `dsh-angelsanddemon-fatesumphony-skin` · DeepSeek Harness Web 皮肤插件，使用同人游戏《弹丸论破：天魔命曲》(Angels & Demon Fate Symphony) 的游戏素材制作。

> 全新独立实现：**不基于任何其他皮肤插件**，只用游戏素材与 DSH 公开 DOM 钩子完成。

## ✨ 特性

- 🖱️ **自定义光标** —— `mouse.png` 缩制为 14×19 的 `.cur`（热点 2,2），全局生效
- 🖼️ **全屏壁纸** —— `background.png` 等比缩放（`cover`）铺满视口，不变形、不随滚动
- 🔵 **左侧栏梯形条** —— `leftbar.png` 无缝贴左，顶斜帽 78px + 底斜收口 90px，整体约 45% 透明度；展开/折叠渲染不变，折叠时不显示会话光标
- 💬 **输入框对话条** —— `talkingbar.png` 平行四边形边框
- 📊 **底部调用数据区** —— `talkingbar_buttom.png` 两端梯形帽 + `buttom-M.png` 拉长中段：
  - 数据模块单向走马灯：滚动 → 停留 5 秒 → 再滚动，永不回滚
  - 由插件 JS 主时钟驱动（rAF），智能体运行中统计更新导致的节点重建不会打乱相位、不会重叠
  - 鼠标悬停时暂停在当前模块
- ➡️ **发送按钮** —— 使用 `next.png`（蓝 V 箭头）悬浮于输入卡片右侧
- 💊 **新会话药丸** —— `newsession.png`，紧凑不撑满整行，无阴影

## 🧩 素材映射

| 游戏素材 | 打包文件 | 用途 |
| --- | --- | --- |
| `mouse.png` | `mouse-small.cur` | 页面光标 |
| `background.png` | `background.jpg` | 全屏壁纸 |
| `leftbar.png` | `leftbar-flush.png` | 左侧栏梯形条（裁掉原图 4px 软边） |
| `talkingbar.png` | `talkingbar.png` | 输入框对话条 |
| `talkingbar_buttom.png` | `talkingbar_buttom.png` | 底部数据条两端梯形帽 |
| `buttom-M.png` | `buttom-M.png` | 底部数据条中段（横向拉伸） |
| `newsession.png` | `newsession.png` | 新会话按钮 |
| `next.png` | `next.png` | 发送消息按钮 |

> 其余打包素材（`hero.jpg`、`buttom-L/R.png`、`talkingbar_lighter.png`、`send.png`、`selected.png`、`mouse.cur`）随包提供但当前皮肤未引用，保留以便后续迭代。

## 📁 结构

| 面 | 文件 | 说明 |
| --- | --- | --- |
| Host | `host.js` | 提供带内容哈希的不可变资源路由（`/dsh-angelsanddemon-fatesumphony-skin/assets/*`，缓存优先） |
| Client | `client.js` | `__ModuleLoader__` 皮肤包：打 `body[data-dsh-tenma]` 标记、注入 CSS、驱动数据条走马灯 |
| Bundle | `cordis.patch.yml` | dsh bundle layer 挂载声明 |

所有规则都挂在 `body[data-dsh-tenma]` 下；滚动、sticky、布局所有权仍归官方。

## 📦 安装

使用 npm 安装：

```sh
npm install dsh-angelsanddemon-fatesumphony-skin
```

以 `web` profile 为例（`~/.dsh/profiles/web/`），安装后还需：

1. **注册 bundle** —— 在 profile 的 `dsh.profile.bundles` 中加入：
   ```json
   "dsh-angelsanddemon-fatesumphony-skin"
   ```

2. **挂载声明** —— 在 profile 的 `cordis.patch.yml` 中加入：
   ```yaml
   - id: dsh-angelsanddemon-fatesumphony-skin
     name: dsh-angelsanddemon-fatesumphony-skin
   ```

3. **重启 dsh web** 生效

## 🗑️ 卸载

从 profile 的 `package.json` / `dsh.profile.bundles` / `cordis.patch.yml` 中移除
`dsh-angelsanddemon-fatesumphony-skin`，执行 `npm uninstall dsh-angelsanddemon-fatesumphony-skin` 并重启 dsh web。

## 🛠️ 开发

- `host.js` / `client.js` 均为纯 JS 模块，无构建步骤
- 修改 `client.js` 后刷新页面即可生效（资源路由带 `no-cache`）
- 新增/修改 `assets/` 中的素材后需更新 `host.js` 里的哈希并重启 dsh web
- 所有 CSS 选择器均以 `body[data-dsh-tenma]` 为前缀，依赖 DSH web 公开的 `data-slot` / `data-composer-*` / `aria-label` 钩子

## 📜 许可

- **代码**（`host.js`、`client.js`、`cordis.patch.yml` 等）：[MIT](./LICENSE)
- **游戏素材**（`assets/`）：[CC BY-NC 4.0](./LICENSE-ASSETS.md)，归属同人游戏《弹丸论破：天魔命曲》制作组（原作者：冰川蓝蓝）

> 弹丸论破 (Danganronpa) 为 Spike Chunsoft 的注册商标；本插件为同人作品，与官方无关。
