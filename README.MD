# Lee Admin Template

<div align="center">

**企业级全栈后台管理系统解决方案**

[![Vue](https://img.shields.io/badge/Vue-3.x-brightgreen.svg)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF.svg)](https://vitejs.dev/)
[![Django](https://img.shields.io/badge/Django-5.1-092E20.svg)](https://www.djangoproject.com/)
[![DRF](https://img.shields.io/badge/DRF-3.15-red.svg)](https://www.django-rest-framework.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[在线预览](#) | [官方文档](#) | [快速开始](#快速开始) | [更新日志](#)

</div>

---

## 📖 项目简介

**Lee Admin Template** 是一套开箱即用的企业级全栈后台管理系统解决方案，专为追求极致开发体验和页面效果的开发者设计。系统采用前后端分离架构，通过精心设计的代码结构和完善的功能模块，帮助开发者快速构建高质量的管理系统。

### ✨ 核心特性

- 🚀 **现代化技术栈** - 前端采用 Vue 3 + Vite 6 + Element Plus，后端基于 Django 5.1 + DRF 3.15
- 🔐 **完善的权限系统** - 支持菜单权限、按钮权限、字段权限和数据权限四级权限控制
- 🎨 **精美的界面设计** - 响应式布局，完美适配桌面端和移动端
- 🔌 **WebSocket 支持** - 基于 Django Channels 的实时通信能力
- 🏢 **多租户架构** - 内置多租户支持，满足 SaaS 应用需求
- 📦 **开箱即用** - 零 SQL 导入，一键初始化系统数据
- 🌍 **国际化支持** - 基于 Vue i18n 的多语言解决方案
- 📱 **移动端适配** - 完美支持手机端访问和操作

---

## 🎯 在线体验

| 项目 | 说明 |
|------|------|
| 🌍 **访问地址** | [https://xxxx.cn](#) |
| 👤 **测试账号** | `SuperAdmin` |
| 🔑 **登录密码** | `a123456` |

> 💡 提示：在线演示环境仅供体验，部分功能可能受限

---

## 🛠️ 技术栈

### 前端技术

| 技术 | 版本 | 说明 |
|------|------|------|
| [Vue](https://vuejs.org/) | 3.x | 渐进式 JavaScript 框架 |
| [Vite](https://vitejs.dev/) | 6.x | 下一代前端构建工具 |
| [Element Plus](https://element-plus.org/) | Latest | 基于 Vue 3 的组件库 |
| [Pinia](https://pinia.vuejs.org/) | Latest | Vue 官方状态管理库 |
| [Vue Router](https://router.vuejs.org/) | 4.x | Vue 官方路由管理器 |
| [Vue i18n](https://vue-i18n.intlify.dev/) | 9.x | Vue 国际化插件 |
| [Axios](https://axios-http.com/) | Latest | HTTP 客户端 |

### 后端技术

| 技术 | 版本 | 说明 |
|------|------|------|
| [Python](https://www.python.org/) | ≥3.11 | 编程语言 |
| [Django](https://www.djangoproject.com/) | 5.1 | Python Web 框架 |
| [Django REST Framework](https://www.django-rest-framework.org/) | 3.15 | RESTful API 框架 |
| [Django Channels](https://channels.readthedocs.io/) | Latest | WebSocket 支持 |
| [SimpleJWT](https://django-rest-framework-simplejwt.readthedocs.io/) | Latest | JWT 认证 |
| [PostgreSQL](https://www.postgresql.org/) | Latest | 关系型数据库（推荐） |
| [Redis](https://redis.io/) | Latest | 缓存和消息队列 |

---

## 🚀 快速开始

### 环境要求

- **Node.js**: ≥18.x
- **Python**: ≥3.11
- **PostgreSQL**: ≥12.x（或其他数据库）
- **Redis**: ≥6.x

### 前端安装

```bash
# 进入前端目录
cd frontend

# 安装依赖（使用阿里云镜像加速）
npm install --registry=https://registry.npmmirror.com

# 启动开发服务器（默认端口 8081）
npm start

# 构建生产版本
npm run build

# 构建并部署到后端
npm run build:backend
```

### 后端安装

```bash
# 进入后端目录
cd backend

# 安装依赖（使用阿里云镜像加速）
pip install -r requirements.txt -i https://mirrors.aliyun.com/pypi/simple/

# 数据库迁移
python manage.py makemigrations
python manage.py migrate

# 初始化系统数据（创建默认管理员账号）
python manage.py init

# 启动开发服务器
python manage.py runserver 127.0.0.1:8000

# 或启动 ASGI 服务器（支持 WebSocket）
daphne -b 0.0.0.0 -p 8000 --proxy-headers main.asgi:application
```

### 默认账号

- **用户名**: `SuperAdmin`
- **密码**: `a123456`

---

## 📁 项目结构

```
lee-admin-template/
├── frontend/                    # 前端项目目录
│   ├── src/
│   │   ├── api/                # API 接口定义
│   │   │   ├── api.js         # 集中式 API 端点
│   │   │   └── request.js     # Axios 实例配置
│   │   ├── assets/            # 静态资源
│   │   │   └── lybbn/icons/   # SVG 图标库
│   │   ├── components/        # 公共组件
│   │   ├── config/            # 配置文件
│   │   │   └── index.js       # 全局配置
│   │   ├── router/            # 路由配置
│   │   │   ├── index.js       # 路由实例
│   │   │   ├── routes.js      # 静态路由
│   │   │   └── autoBreadcrumb.js  # 面包屑自动生成
│   │   ├── store/             # Pinia 状态管理
│   │   │   ├── userState.js   # 用户状态
│   │   │   ├── siteTheme.js   # 主题配置
│   │   │   ├── tabs.js        # 多标签页
│   │   │   ├── websocket.js   # WebSocket 连接
│   │   │   └── routesList.js  # 动态路由
│   │   ├── views/             # 页面组件
│   │   └── main.js            # 应用入口
│   ├── package.json
│   └── vite.config.js         # Vite 配置
│
├── backend/                     # 后端项目目录
│   ├── main/                   # Django 主配置
│   │   ├── settings.py        # 项目设置
│   │   ├── urls.py            # 路由配置
│   │   └── asgi.py            # ASGI 应用
│   ├── system/                 # 系统核心应用
│   │   ├── models/            # 数据模型
│   │   │   ├── users.py       # 用户模型
│   │   │   ├── roles.py       # 角色模型
│   │   │   ├── menus.py       # 菜单模型
│   │   │   └── departments.py # 部门模型
│   │   ├── views/             # 视图函数
│   │   │   ├── login.py       # 登录认证
│   │   │   └── wsrouting.py   # WebSocket 路由
│   │   ├── serializers/       # 序列化器
│   │   └── management/        # 管理命令
│   │       └── commands/
│   │           └── init.py    # 初始化命令
│   ├── tenants/                # 多租户应用
│   ├── utils/                  # 工具模块
│   │   ├── middleware.py      # 中间件
│   │   ├── permission.py      # 权限检查
│   │   ├── viewset.py         # 自定义视图集
│   │   └── filters.py         # 数据过滤器
│   ├── config.py              # 配置文件
│   ├── manage.py              # Django 管理脚本
│   └── requirements.txt       # Python 依赖
│
├── CLAUDE.md                   # Claude Code 项目指南
└── README.md                   # 项目说明文档
```

---

## 🎨 核心功能

### 1. 权限管理系统

#### 四级权限控制

- **菜单权限** - 控制路由访问权限，动态加载用户可访问的菜单
- **按钮权限** - 细粒度控制页面内按钮的显示和操作权限
- **字段权限** - 控制数据字段的可见性，保护敏感信息
- **数据权限** - 支持个人、部门、自定义三种数据范围过滤

#### 权限检查示例

**后端权限检查**：
```python
from utils.permission import check_permission

@check_permission('menu:add')
def create(self, request):
    # 实现逻辑
    pass
```

**前端权限检查**：
```javascript
import { useUserState } from '@/store/userState'

const userState = useUserState()
if (userState.hasPermission('menu:add')) {
  // 显示按钮或功能
}
```

### 2. 动态菜单系统

- 菜单数据存储在数据库中，支持动态配置
- 前端自动根据后端返回的菜单树生成路由
- 支持多级菜单嵌套和图标配置
- 自动生成面包屑导航

### 3. JWT 认证系统

- 基于 `djangorestframework-simplejwt` 实现
- 支持 Token 刷新机制
- 登录失败限制（5次尝试，60秒锁定）
- 支持单点登录或多终端登录（可配置）

### 4. WebSocket 实时通信

- 基于 Django Channels 实现
- Redis 作为消息通道层
- 支持实时消息推送和通知

### 5. 多租户支持

- 内置 `tenants` 应用模块
- 数据隔离和租户识别
- 适合构建 SaaS 应用

### 6. 响应式设计

- 完美适配桌面端、平板和移动端
- 多标签页管理，支持标签缓存
- 主题色自定义（默认 #3A7BFF）

---

## 🔧 配置说明

### 前端配置 (`frontend/src/config/index.js`)

```javascript
export default {
  apiHost: 'http://127.0.0.1:8000',  // 后端 API 地址
  themeColor: '#3A7BFF',              // 主题色
  tokenPrefix: 'JWT',                 // Token 前缀
  multiTab: true,                     // 启用多标签页
}
```

### 后端配置 (`backend/config.py`)

- 数据库连接配置（支持 PostgreSQL、MySQL、SQLite）
- Redis 连接配置（缓存和 WebSocket）
- API 日志开关
- 权限缓存选项
- 登录安全设置

---

## 📚 开发指南

### 添加新的 API 端点

1. 在 `backend/system/views/` 或相应应用中创建视图
2. 继承 `CustomModelViewSet` 实现标准 CRUD 操作
3. 在 `urls.py` 中添加 URL 路由
4. 在 `frontend/src/api/api.js` 中定义 API 调用
5. 在组件中通过 API 模块使用

### 添加自定义图标

1. 将 SVG 文件放入 `frontend/src/assets/lybbn/icons/svg/`
2. Vite 插件会自动注册图标
3. 在组件中使用：`<svg-icon name="icon-name" />`

### 数据库迁移

```bash
# 1. 修改模型类
# 2. 生成迁移文件
python manage.py makemigrations

# 3. 查看迁移文件
# 4. 执行迁移
python manage.py migrate

# 5. 如需添加初始数据，更新 system/management/commands/init.py
```

---

## 📊 API 文档

系统集成了 DRF Spectacular，提供自动生成的 API 文档：

- **Swagger UI**: `http://127.0.0.1:8000/api/schema/swagger-ui/`
- **ReDoc**: `http://127.0.0.1:8000/api/schema/redoc/`

> 注意：访问 API 文档需要 JWT 认证

---

## 🚢 部署指南

### 前端部署

```bash
# 构建生产版本
npm run build

# 或直接构建并复制到后端静态目录
npm run build:backend
```

构建产物位于 `frontend/dist/`，使用 `build:backend` 命令会自动复制到 `backend/frontend/leeadmin/`。

### 后端部署

1. **配置生产环境**
   - 修改 `config.py` 中的数据库和 Redis 配置
   - 设置 `DEBUG = False`
   - 配置 `ALLOWED_HOSTS`

2. **收集静态文件**
   ```bash
   python manage.py collectstatic
   ```

3. **使用 Daphne 部署（支持 WebSocket）**
   ```bash
   daphne -b 0.0.0.0 -p 8000 --proxy-headers main.asgi:application
   ```

4. **配置 Nginx 反向代理**（推荐）
   ```nginx
   upstream django {
       server 127.0.0.1:8000;
   }

   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://django;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }

       location /ws/ {
           proxy_pass http://django;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
       }

       location /static/ {
           alias /path/to/backend/static/;
       }

       location /media/ {
           alias /path/to/backend/media/;
       }
   }
   ```

---

## 💡 常见问题

### Q: 如何添加新菜单？

**A**: 在系统管理 → 菜单管理中添加菜单。建议路由名称和组件名称与文件名保持一致，系统会自动发现并注册路由，无需手动填写组件路径。

### Q: 如何切换数据库？

**A**: 修改 `backend/config.py` 中的 `DATABASES` 配置，支持 PostgreSQL、MySQL、SQLite 等。无需导入 SQL 文件，直接运行 `python manage.py migrate` 和 `python manage.py init` 即可。

### Q: 如何自定义主题色？

**A**: 修改 `frontend/src/config/index.js` 中的 `themeColor` 配置，或在系统设置中动态切换。

### Q: WebSocket 连接失败怎么办？

**A**:
1. 确保 Redis 服务正常运行
2. 检查 `backend/config.py` 中的 Redis 配置
3. 使用 Daphne 启动服务而非 `runserver`
4. 检查防火墙和代理配置

### Q: 如何禁用多标签页？

**A**: 在 `frontend/src/config/index.js` 中设置 `multiTab: false`。

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

---

## 📄 开源协议

本项目基于 [MIT License](LICENSE) 开源协议。

---

## 🙏 致谢

感谢以下开源项目：

- [Vue.js](https://vuejs.org/)
- [Element Plus](https://element-plus.org/)
- [Django](https://www.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)

---

## 📮 联系方式

- **Issues**: [GitHub Issues](#)
- **Email**: your-email@example.com
- **官网**: [https://xxxx.cn](#)

---

<div align="center">

**如果这个项目对你有帮助，请给一个 ⭐️ Star 支持一下！**

Made with ❤️ by Lee Admin Template Team

</div>
