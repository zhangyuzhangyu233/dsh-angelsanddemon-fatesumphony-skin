# dsh-tenma-skin · DSH《天魔命曲》皮肤

基于同人游戏《弹丸论破：天魔命曲》(Angels & Demon Fate Symphony) 素材的
[DeepSeek Harness](https://github.com/deepseek-ai/DeepSeek-Harness) Web 皮肤插件。

全新独立实现：**不基于任何其他皮肤插件**，只用游戏素材与 DSH 公开 DOM 钩子。

## 特性

- 🖱️ 页面自定义光标（`mouse.png` → `mouse-small.cur`，14×19，热点 2,2）
- 🖼️ 全屏壁纸（`background.png` → `background.jpg`，固定不随滚动）
- 🔵 左侧栏蓝条（`leftbar.png` → `leftbar-flush.png`，无缝贴左；展开/折叠渲染不变，折叠时不显示会话光标）
- 💬 输入框对话条（`talkingbar.png`）
- 📊 底部调用数据区（`talkingbar_buttom.png` 梯形帽 + `buttom-M.png` 拉长中段）：
  - 数据模块单向走马灯：滚动 → 停留 5 秒 → 再滚动，永不回滚
  - 鼠标悬停时暂停在当前模块
- ➡️ 发送按钮用 `next.png`（蓝 V 箭头），悬浮于输入卡片右侧
- 💊 新会话药丸（`newsession.png`，紧凑不撑满整行）

## 素材映射

| 游戏素材 | 打包文件 | 用途 |
| --- | --- | --- |
| `mouse.png` | `mouse-small.cur` | 页面光标 |
| `background.png` | `background.jpg` | 壁纸 |
| `leftbar.png` | `leftbar-flush.png` | 左侧栏蓝条（裁掉 4px 软边） |
| `talkingbar.png` | `talkingbar.png` | 输入框对话条 |
| `talkingbar_buttom.png` | `talkingbar_buttom.png` | 底部数据条两端梯形帽 |
| `buttom-M.png` | `buttom-M.png` | 底部数据条中段（横向拉伸） |
| `newsession.png` | `newsession.png` | 新会话按钮 |
| `next.png` | `next.png` | 发送消息按钮 |

> 其余打包素材（`hero.jpg`、`buttom-L/R.png`、`talkingbar_lighter.png`、`send.png`、
> `selected.png`、`mouse.cur`）随包提供但当前皮肤未引用，保留以便后续迭代。

## 结构

| 面 | 文件 | 说明 |
| --- | --- | --- |
| Host | `host.js` | 提供带内容哈希的不可变资源路由（`/dsh-tenma-skin/assets/*`，缓存优先） |
| Client | `client.js` | `__ModuleLoader__` 皮肤包：打 `body[data-dsh-tenma]` 标记并注入 CSS |
| Bundle | `cordis.patch.yml` | dsh bundle layer 挂载声明 |

所有规则都挂在 `body[data-dsh-tenma]` 下；滚动、sticky、布局所有权仍归官方。

## 安装

以 `web` profile 为例（`~/.dsh/profiles/web/`）：

1. 在 `package.json` 的 `dependencies` 中加入：
   ```json
   "dsh-tenma-skin": "link:/绝对/路径/to/dsh-tenma-skin"
   ```
2. 在 profile 的 `dsh.profile.bundles` 中加入 `dsh-tenma-skin`。
3. 在 profile 的 `cordis.patch.yml` 中加入（插件自带的 bundle patch 会自动插入挂载）：
   ```yaml
   - id: dsh-tenma-skin
     name: dsh-tenma-skin
   ```
4. 在 profile 目录执行 `pnpm install`，然后**重启 dsh web**。

> 也可尝试 `dsh plugin --profile web add link:/绝对/路径/to/dsh-tenma-skin`，
> 但 CLI 在某些环境不可靠，推荐手动编辑上述文件。

## 卸载

从 profile 的 `package.json` / `dsh.profile.bundles` / `cordis.patch.yml` 移除
`dsh-tenma-skin`，执行 `pnpm install` 并重启 dsh web。

## 许可

- **代码**（`host.js`、`client.js`、`cordis.patch.yml` 等）：[MIT](./LICENSE)
- **游戏素材**（`assets/`）：[CC BY-NC 4.0](./LICENSE-ASSETS.md)，归属《弹丸论破：天魔命曲》同人游戏制作组

弹丸论破 (Danganronpa) 为 Spike Chunsoft 的注册商标；本插件为同人作品，与官方无关。
