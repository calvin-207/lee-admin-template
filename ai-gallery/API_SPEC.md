# 探春风 - 后端API接口清单

> 本文档供前后端开发人员对接使用。后端请按照以下接口规范实现。

---

## 基础约定

| 项目 | 说明 |
|------|------|
| 协议 | HTTPS |
| 数据格式 | JSON |
| Content-Type | `application/json` |
| 编码 | UTF-8 |
| 统一返回格式 | `{ code, message, data }` |
| 认证方式 | Bearer Token (JWT) |
| 鉴权Header | `Authorization: Bearer <token>` |

## 返回码定义

| code | 含义 |
|------|------|
| 0 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未登录/Token无效 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |
| 1001 | 图片审核未通过 |
| 1002 | 文件上传失败 |
| 1003 | 内容违规 |

## 错误响应示例

```json
{
  "code": 400,
  "message": "缺少必要参数: title",
  "data": null
}
```

---

## 一、认证相关接口

### 1.1 小程序登录

```
POST /api/auth/login
```

**请求参数：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| code | string | 是 | 小程序登录凭证（wx.login / tt.login / qq.login） |
| platform | string | 是 | 平台标识：`weixin` / `douyin` / `qq` |

**响应：**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 86400,
    "userId": "user_xxx",
    "isNewUser": false
  }
}
```

**说明：** 后端用 code 换取 openid/unionid，查询或创建用户，返回 JWT Token。后续所有前端请求需携带此 Token。

---

### 1.2 管理员登录

```
POST /api/admin/auth/login
```

**请求参数：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码（建议 bcrypt 加密存储） |

**响应：**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "adminId": "admin_xxx",
    "role": "super",  // super / reviewer
    "expiresIn": 7200
  }
}
```

---

## 二、图片相关接口（前端 + 后台共用）

### 2.1 获取图片列表

```
GET /api/images
```

**请求参数（Query）：**

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| page | int | 否 | 1 | 页码 |
| pageSize | int | 否 | 20 | 每页数量（最大50） |
| tag | string | 否 | - | 标签筛选 |
| style | string | 否 | - | 风格筛选 |
| sort | string | 否 | latest | 排序：`latest`/`views`/`likes`/`featured` |
| date | string | 否 | - | 日期筛选（YYYY-MM-DD） |

**响应：**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "img_123456",
        "url": "https://cdn.example.com/images/abc.jpg",
        "thumbUrl": "https://cdn.example.com/images/abc_thumb.jpg",
        "title": "春风十里",
        "tags": ["写实", "人像"],
        "style": "写实",
        "likes": 128,
        "views": 3856,
        "isFeatured": true,
        "width": 1024,
        "height": 1024,
        "aspectRatio": 1,
        "publishDate": "2026-07-11T08:00:00Z"
      }
    ],
    "total": 156,
    "page": 1,
    "pageSize": 20,
    "hasMore": true
  }
}
```

---

### 2.2 获取图片详情

```
GET /api/images/:id
```

**请求Header：** `Authorization: Bearer <token>`

**响应：**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "img_123456",
    "url": "https://cdn.example.com/images/abc.jpg",
    "thumbUrl": "https://cdn.example.com/images/abc_thumb.jpg",
    "title": "春风十里",
    "tags": ["写实", "人像"],
    "style": "写实",
    "likes": 128,
    "views": 3856,
    "isFeatured": true,
    "isLiked": true,
    "width": 1024,
    "height": 1024,
    "aspectRatio": 1,
    "prompt": "a portrait of a beautiful woman, golden hour...",
    "negativePrompt": "low quality, blurry...",
    "model": "Stable Diffusion XL",
    "sampler": "DPM++ 2M Karras",
    "steps": 30,
    "cfgScale": 7.5,
    "seed": "345678901",
    "publishDate": "2026-07-11T08:00:00Z",
    "uploaderId": "user_xxx",
    "auditStatus": "approved"   // pending / approved / rejected
  }
}
```

**说明：** 后端收到请求后需将 views +1。

---

### 2.3 上传图片

```
POST /api/images/upload
```

**请求Header：** `Authorization: Bearer <token>`

**请求参数（multipart/form-data）：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| file | File | 是 | 图片文件（最大10MB） |
| title | string | 否 | 标题 |
| prompt | string | 否 | 正向提示词 |
| negativePrompt | string | 否 | 反向提示词 |
| model | string | 否 | AI模型 |
| sampler | string | 否 | 采样器 |
| steps | int | 否 | 步数 |
| cfgScale | float | 否 | CFG值 |
| seed | string | 否 | Seed |
| width | int | 否 | 图片宽度 |
| height | int | 否 | 图片高度 |
| tags | string[] | 否 | 标签数组 |
| style | string | 否 | 风格 |

**响应：**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "img_123456",
    "url": "https://cdn.example.com/images/abc.jpg",
    "thumbUrl": "https://cdn.example.com/images/abc_thumb.jpg",
    "title": "春风十里",
    "auditStatus": "pending"
  }
}
```

**说明：** 上传后图片默认进入 `pending` 待审核状态，后台审核通过后前台才可展示。

---

### 2.4 搜索图片

```
GET /api/images/search
```

**请求参数（Query）：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 是 | 搜索关键词 |
| page | int | 否 | 1 |
| pageSize | int | 否 | 20 |

**响应：** 同 2.1

---

### 2.5 获取推荐图片

```
GET /api/images/related/:id
```

**响应：**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      { "id": "...", "url": "...", "thumbUrl": "...", "title": "..." }
    ]
  }
}
```

---

## 三、内容安全审核接口

### 3.1 图片内容安全预审核

前端上传图片前，先调用此接口进行内容安全预检查。后端应接入第三方内容审核服务（如腾讯云 IMS、阿里云绿网）。

```
POST /api/content/check
```

**请求方式：** `multipart/form-data`

**请求Header：** `Authorization: Bearer <token>`（可选，根据业务需要）

**请求参数：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| file | file | 是 | 图片文件（二进制） |

**响应：**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "safe": true,
    "confidence": 0.99,
    "labels": [],
    "suggestion": "pass"
  }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| safe | boolean | `true` = 安全，`false` = 违规 |
| confidence | float | 置信度 0~1 |
| labels | array | 命中标签，如 `["porn", "violence"]` |
| suggestion | string | `pass` / `block` / `review` |

**错误响应：**

```json
{
  "code": 1003,
  "message": "内容违规，请更换图片",
  "data": {
    "safe": false,
    "labels": ["porn"],
    "suggestion": "block"
  }
}
```

**后端实现建议：**

1. 接收图片文件，保存到临时目录
2. 调用腾讯云 IMS `ImageModeration` 接口进行审核
3. 根据审核结果返回 `safe` 字段
4. 无论审核结果如何，删除临时文件
5. 审核阈值建议：涉黄 ≥ 0.8 拦截，涉暴 ≥ 0.7 拦截

---

## 四、收藏相关接口

### 4.1 切换收藏

```
POST /api/favorites/toggle
```

**请求Header：** `Authorization: Bearer <token>`

**请求参数：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| imageId | string | 是 | 图片ID |

**响应：**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "isLiked": true
  }
}
```

---

### 4.2 获取收藏列表

```
GET /api/favorites
```

**请求Header：** `Authorization: Bearer <token>`

**请求参数（Query）：** 同 2.1（page, pageSize）

**响应：**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "img_123456",
        "url": "...",
        "thumbUrl": "...",
        "title": "...",
        "favoriteDate": "2026-07-11T10:00:00Z"
      }
    ],
    "total": 15,
    "hasMore": false
  }
}
```

---

## 五、标签接口

### 5.1 获取标签列表

```
GET /api/tags
```

**响应：**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      { "id": "tag_1", "name": "写实", "type": "style", "count": 45, "sortOrder": 0 },
      { "id": "tag_2", "name": "二次元", "type": "style", "count": 38, "sortOrder": 1 }
    ]
  }
}
```

---

## 七、后台管理接口

### 7.1 仪表盘统计

```
GET /api/admin/dashboard
```

**请求Header：** `Authorization: Bearer <admin_token>`

**响应：**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "totalImages": 156,
    "totalUsers": 328,
    "totalViews": 15847,
    "totalLikes": 892,
    "pendingAudit": 12,
    "rejectedCount": 3,
    "todayUploads": 8,
    "todayViews": 1247,
    "todayNewUsers": 15,
    "weeklyTrend": [
      { "date": "07-05", "uploads": 5, "views": 800, "users": 8 },
      { "date": "07-06", "uploads": 7, "views": 950, "users": 10 }
    ]
  }
}
```

---

### 7.2 图片审核列表

```
GET /api/admin/images
```

**请求Header：** `Authorization: Bearer <admin_token>`

**请求参数（Query）：**

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| page | int | 否 | 1 | |
| pageSize | int | 否 | 20 | |
| auditStatus | string | 否 | - | `pending`/`approved`/`rejected` |
| keyword | string | 否 | - | 搜索关键词 |

**响应：**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "img_123456",
        "url": "https://cdn.example.com/images/abc.jpg",
        "thumbUrl": "...",
        "title": "春风十里",
        "prompt": "a portrait of...",
        "uploaderId": "user_xxx",
        "uploaderNickname": "用户昵称",
        "auditStatus": "pending",
        "auditReason": "",
        "uploadDate": "2026-07-11T08:00:00Z",
        "views": 0,
        "likes": 0
      }
    ],
    "total": 156,
    "stats": {
      "pending": 12,
      "approved": 140,
      "rejected": 4
    }
  }
}
```

---

### 7.3 审核图片

```
POST /api/admin/images/:id/audit
```

**请求Header：** `Authorization: Bearer <admin_token>`

**请求参数：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| status | string | 是 | `approved` 或 `rejected` |
| reason | string | 否 | 拒绝原因（status=rejected时必填） |

**响应：**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "img_123456",
    "auditStatus": "approved",
    "auditTime": "2026-07-11T09:00:00Z",
    "auditorId": "admin_xxx"
  }
}
```

---

### 7.4 批量审核

```
POST /api/admin/images/batch-audit
```

**请求Header：** `Authorization: Bearer <admin_token>`

**请求参数：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| ids | string[] | 是 | 图片ID数组 |
| status | string | 是 | `approved` 或 `rejected` |
| reason | string | 否 | 拒绝原因 |

---

### 7.5 删除图片

```
DELETE /api/admin/images/:id
```

**请求Header：** `Authorization: Bearer <admin_token>`

---

### 7.6 用户列表

```
GET /api/admin/users
```

**请求Header：** `Authorization: Bearer <admin_token>`

**请求参数（Query）：**

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| page | int | 否 | 1 | |
| pageSize | int | 否 | 20 | |
| keyword | string | 否 | - | 搜索昵称/openid |

**响应：**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "user_xxx",
        "openid": "wx_openid_xxx",
        "platform": "weixin",
        "nickname": "用户昵称",
        "avatar": "https://...",
        "uploadCount": 5,
        "favoriteCount": 12,
        "lastLogin": "2026-07-11T10:00:00Z",
        "createdAt": "2026-07-01T08:00:00Z",
        "isBanned": false
      }
    ],
    "total": 328
  }
}
```

---

### 7.7 封禁/解封用户

```
POST /api/admin/users/:id/ban
```

**请求Header：** `Authorization: Bearer <admin_token>`

**请求参数：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| isBanned | boolean | 是 | true=封禁, false=解封 |
| reason | string | 否 | 封禁原因 |

---

### 7.8 标签管理

```
GET /api/admin/tags
```
**POST /api/admin/tags** — 创建标签
**PUT /api/admin/tags/:id** — 修改标签
**DELETE /api/admin/tags/:id** — 删除标签

---

## 六、埋点分析接口

### 6.1 记录浏览事件

```
POST /api/analytics/view
```

**请求Header：** `Authorization: Bearer <token>`

**请求参数：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| imageId | string | 是 | 图片ID |
| source | string | 否 | 来源页面：home/detail/search |

### 6.2 记录分享事件

```
POST /api/analytics/share
```

**请求参数：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| imageId | string | 是 | 图片ID |
| platform | string | 否 | 分享平台 |

---

## 七、文件存储建议

### 图片存储方案

推荐接入对象存储服务，后端收到上传文件后：

1. 保存原图到对象存储（如 腾讯云COS / 阿里云OSS / AWS S3）
2. 自动生成缩略图（推荐尺寸：列表 400px，详情 1024px）
3. 生成 CDN URL 返回给前端

### 存储路径规范

```
images/original/2026/07/img_xxx.jpg      # 原图
images/thumb/2026/07/img_xxx_400.jpg      # 列表缩略图
images/webp/2026/07/img_xxx_1024.webp     # WebP压缩图
```

---

## 八、数据库表结构建议

### users 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string PK | 用户ID |
| openid | string | 平台openid |
| unionid | string | 平台unionid（跨应用识别） |
| platform | string | weixin / douyin / qq |
| nickname | string | 昵称 |
| avatar | string | 头像URL |
| created_at | datetime | 注册时间 |
| last_login | datetime | 最后登录时间 |
| is_banned | boolean | 是否封禁 |

### images 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string PK | 图片ID |
| url | string | 原图URL |
| thumb_url | string | 缩略图URL |
| title | string | 标题 |
| prompt | text | 正向提示词 |
| negative_prompt | text | 反向提示词 |
| model | string | AI模型 |
| sampler | string | 采样器 |
| steps | int | 步数 |
| cfg_scale | float | CFG值 |
| seed | string | Seed |
| width | int | 宽度 |
| height | int | 高度 |
| tags | json | 标签数组 |
| style | string | 风格 |
| is_featured | boolean | 是否精选 |
| audit_status | enum | pending/approved/rejected |
| audit_reason | string | 审核拒绝原因 |
| audited_at | datetime | 审核时间 |
| auditor_id | string | 审核人ID |
| views | int | 浏览量 |
| likes | int | 收藏数 |
| uploader_id | string FK | 上传者ID |
| created_at | datetime | 上传时间 |
| updated_at | datetime | 更新时间 |

### favorites 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int PK auto | |
| user_id | string FK | |
| image_id | string FK | |
| created_at | datetime | |

### tags 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string PK | |
| name | string | 标签名（唯一） |
| type | string | style/subject/other |
| count | int | 使用次数 |
| sort_order | int | 排序权重 |

### admins 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string PK | |
| username | string | 用户名（唯一） |
| password_hash | string | bcrypt哈希 |
| role | enum | super/reviewer |
| created_at | datetime | |

---

## 九、内容安全审核建议

### 审核流程

1. 用户上传图片 → 后端保存到临时目录
2. 调用第三方内容安全API（推荐腾讯云IMS图片审核）
3. 审核通过 → 保存正式目录，状态设为 `pending`
4. 后台管理员二次审核 → `approved` / `rejected`
5. 仅 `approved` 状态的图片在小程序前端展示

### 腾讯云IMS接口参考

```
POST https://ims.tencentcloudapi.com/
Action: ImageModeration
Version: 2020-12-29
Region: ap-guangzhou
```

检测维度：涉黄、暴恐、广告、违法、政治敏感、AI生成图片识别

---

*文档版本: v1.0 | 更新日期: 2026-07-11*
