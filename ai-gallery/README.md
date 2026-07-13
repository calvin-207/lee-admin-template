# 探春风

一个基于 uni-app 的 AI 生成图片欣赏平台，支持**微信、抖音、QQ 小程序**多端运行。采用**自建 HTTP 后端**架构，完全脱离云开发。

## 技术架构

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端 | uni-app (Vue 3) | 一套代码，微信/抖音/QQ/H5 多端运行 |
| 后端 | 自建 HTTP API | RESTful API + JWT 认证 |
| 存储 | 对象存储 (COS/OSS/S3) | 图片文件存储 + CDN 加速 |
| 数据库 | MySQL / PostgreSQL / MongoDB | 业务数据持久化 |
| 缓存 | Redis | 会话、热点数据、计数器 |

## 后端部署前置条件

在开始之前，你需要准备以下后端基础设施：

1. **域名与服务器**: 一台云服务器 + 已备案域名（小程序要求 HTTPS）
2. **对象存储**: 腾讯云 COS / 阿里云 OSS / AWS S3（用于存储图片）
3. **数据库**: MySQL 8.0+ 或 PostgreSQL 14+ 或 MongoDB
4. **内容审核**: 接入腾讯云 IMS / 阿里云内容安全 / 百度 AI 审核（用于图片自动审核）

## 项目结构

```
ai-gallery/
├── manifest.json              # uni-app 多端配置（含微信/抖音/QQ）
├── pages.json                 # 页面路由配置
├── App.vue                    # 根组件（配置后端 API 地址）
├── main.js                    # 入口文件
├── uni.scss                   # 全局样式变量
├── pages/
│   ├── index/index.vue        # 首页 - 瀑布流画廊
│   ├── detail/index.vue       # 图片详情 - AI参数展示
│   ├── search/index.vue       # 搜索页
│   ├── mine/index.vue         # 我的 - 收藏/统计
│   ├── mine/favorites.vue     # 收藏列表页
│   └── upload/index.vue       # 上传图片（HTTP multipart 上传）
├── components/
│   ├── image-card/            # 图片卡片组件
│   ├── empty-state/           # 空状态组件
│   └── skeleton/              # 骨架屏组件
├── utils/
│   ├── api.js                 # API 封装（HTTP RESTful + JWT）
│   ├── platform.js            # 多平台适配层
│   └── util.js                # 工具函数
├── admin/                     # 后台管理系统（独立前端）
│   └── index.html             # 管理后台单页应用
├── API_SPEC.md                # 后端 API 接口规范文档
└── static/                    # 静态资源
```

## 快速开始

### 1. 配置后端地址

打开 `App.vue`，将 `baseUrl` 修改为你的后端 API 地址：

```javascript
globalData: {
  // 开发环境
  baseUrl: 'http://localhost:3000',
  // 生产环境（替换为你的域名）
  // baseUrl: 'https://api.tanchunfeng.com'
}
```

### 2. 安装依赖

使用 HBuilderX 打开本项目，无需额外 npm 依赖。

### 3. 运行预览

HBuilderX → 运行 → 运行到微信开发者工具 / 字节跳动开发者工具 / QQ开发者工具

## 多端部署指南

### 一、微信小程序

1. **注册账号**: 前往 [微信公众平台](https://mp.weixin.qq.com/) 注册小程序
2. **配置服务器域名**: 登录小程序后台 → 开发 → 开发设置 → 服务器域名
   - `request合法域名`: 添加你的后端 API 域名（如 `https://api.tanchunfeng.com`）
   - `uploadFile合法域名`: 添加你的对象存储上传域名
   - `downloadFile合法域名`: 添加你的图片 CDN 域名
3. **配置项目**: 在 `manifest.json` 中填入 `mp-weixin.appid`
4. **运行预览**: HBuilderX → 运行 → 运行到微信开发者工具

### 二、抖音小程序

1. **注册账号**: 前往 [抖音开放平台](https://developer.open-douyin.com/) 注册（**仅支持企业主体**）
2. **配置服务器域名**: 抖音小程序后台 → 开发 → 开发设置 → 服务器域名（配置同上）
3. **配置项目**: 在 `manifest.json` 中填入 `mp-toutiao.appid`
4. **运行预览**: HBuilderX → 运行 → 运行到字节跳动开发者工具

> **注意**: 抖音小程序需要企业主体认证，个人开发者无法发布。

### 三、QQ 小程序

1. **注册账号**: 前往 [QQ小程序开放平台](https://q.qq.com/) 注册
2. **配置服务器域名**: QQ小程序后台 → 开发设置 → 服务器域名（配置同上）
3. **配置项目**: 在 `manifest.json` 中填入 `mp-qq.appid`
4. **运行预览**: HBuilderX → 运行 → 运行到QQ开发者工具

### 四、H5 (Web)

1. 确认 `App.vue` 中 `baseUrl` 已配置
2. HBuilderX → 运行 → 运行到浏览器
3. 或发行 H5 上传到静态托管服务

## 后端开发对接

### 必读文档

- **[API_SPEC.md](./API_SPEC.md)** — 完整的后端 API 接口规范，包含：
  - 认证接口（登录、用户信息）
  - 图片接口（列表、详情、搜索、上传）
  - 收藏接口（切换、列表）
  - 标签接口
  - 埋点分析接口
  - 管理后台接口（审核、统计、用户管理）
  - 内容安全审核接口
  - 数据库表结构设计
  - 响应格式规范

### 核心对接要点

1. **统一响应格式**
   ```json
   {
     "code": 0,
     "message": "success",
     "data": { ... }
   }
   ```

2. **JWT 认证**
   - 登录接口返回 `access_token`
   - 后续请求在 Header 中携带: `Authorization: Bearer <token>`
   - Token 过期返回 HTTP 401

3. **图片上传流程**
   ```
   用户选择图片 → 前端调用 /api/content/check 预审核
   → 审核通过 → 前端 multipart 上传到 /api/images/upload
   → 后端存储到对象存储 → 返回图片 URL
   → 后端设置状态为 pending → 等待人工审核
   ```

4. **图片状态流转**
   ```
   pending(待审核) → approved(已通过) → 前端展示
                 → rejected(已拒绝) → 前端隐藏
   ```

5. **内容安全审核**
   - 自动审核：接入腾讯云 IMS / 阿里云绿网进行图片鉴黄、鉴暴
   - 人工审核：管理后台 `admin/index.html` 提供审核界面
   - 审核结果回调：通过后更新 `auditStatus` 字段

## 多端适配说明

### 已处理的平台差异

| 差异点 | 适配方案 |
|--------|----------|
| 抖音默认 page 边距 | 全局 `page { margin: 0 !important }`（条件编译） |
| 抖音 fixed 定位异常 | `transform: translateZ(0)` 触发硬件加速 |
| 登录方式差异 | `platform.js` 统一封装 `uni.login` |
| 分享参数差异 | `shareApp()` 适配各平台参数 |
| 剪贴板差异 | `setClipboardData()` 适配各平台 API |
| 文件上传 | 统一使用 `uni.uploadFile` 进行 HTTP 上传 |

## 核心功能

- 双列瀑布流画廊（标签筛选、排序、骨架屏）
- 图片详情（AI参数面板、复制Prompt、收藏、分享、保存）
- 关键词搜索（搜索历史、热门标签）
- 上传管理（Prompt/参数填写、标签管理、风格选择、内容安全预审核）
- 收藏系统（收藏夹、取消收藏）
- 管理后台（图片审核、用户管理、数据统计、标签管理）

## 安全与审核

- **自动审核**: 上传时调用后端内容安全接口进行预检
- **人工审核**: 所有上传图片默认进入 `pending` 状态，需后台审核后才能展示
- **Token 安全**: JWT 过期自动清除，重新登录获取
- **HTTPS 强制**: 所有请求必须使用 HTTPS（小程序要求）

## 后续规划

- [ ] 以图搜图功能
- [ ] 图片系列/主题集合
- [ ] 日历视图回顾
- [ ] AI风格自动标签
- [ ] 深色模式
- [ ] 抖音端视频展示适配
- [ ] QQ端分享到QQ空间适配

## License

MIT
