# Lee Admin Template

<div align="center">

**Enterprise-Level Full-Stack Admin Management System**

[![Vue](https://img.shields.io/badge/Vue-3.x-brightgreen.svg)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF.svg)](https://vitejs.dev/)
[![Django](https://img.shields.io/badge/Django-5.1-092E20.svg)](https://www.djangoproject.com/)
[![DRF](https://img.shields.io/badge/DRF-3.15-red.svg)](https://www.django-rest-framework.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[Live Demo](#) | [Documentation](#) | [Quick Start](#-quick-start) | [Changelog](#)

</div>

---

## 📖 Introduction

**Lee Admin Template** is a production-ready enterprise-level full-stack admin management system designed for developers who pursue ultimate development experience and page effects. The system adopts a front-end and back-end separation architecture, helping developers quickly build high-quality management systems through carefully designed code structure and comprehensive functional modules.

### ✨ Key Features

- 🚀 **Modern Tech Stack** - Frontend with Vue 3 + Vite 6 + Element Plus, Backend with Django 5.1 + DRF 3.15
- 🔐 **Comprehensive Permission System** - Four-level permission control: menu, button, field, and data permissions
- 🎨 **Beautiful UI Design** - Responsive layout, perfectly adapted for desktop and mobile devices
- 🔌 **WebSocket Support** - Real-time communication powered by Django Channels
- 🏢 **Multi-Tenancy Architecture** - Built-in multi-tenancy support for SaaS applications
- 📦 **Out-of-the-Box** - Zero SQL import, one-command system initialization
- 🌍 **Internationalization** - Multi-language solution based on Vue i18n
- 📱 **Mobile Responsive** - Perfect support for mobile access and operations

---

## 🎯 Live Demo

| Item | Description |
|------|-------------|
| 🌍 **Demo URL** | [https://xxxx.cn](#) |
| 👤 **Username** | `SuperAdmin` |
| 🔑 **Password** | `a123456` |

> 💡 Note: The online demo environment is for experience only, some features may be limited

---

## 🛠️ Tech Stack

### Frontend Technologies

| Technology | Version | Description |
|------------|---------|-------------|
| [Vue](https://vuejs.org/) | 3.x | Progressive JavaScript Framework |
| [Vite](https://vitejs.dev/) | 6.x | Next Generation Frontend Tooling |
| [Element Plus](https://element-plus.org/) | Latest | Vue 3 Component Library |
| [Pinia](https://pinia.vuejs.org/) | Latest | Official Vue State Management |
| [Vue Router](https://router.vuejs.org/) | 4.x | Official Router for Vue.js |
| [Vue i18n](https://vue-i18n.intlify.dev/) | 9.x | Internationalization Plugin |
| [Axios](https://axios-http.com/) | Latest | HTTP Client |

### Backend Technologies

| Technology | Version | Description |
|------------|---------|-------------|
| [Python](https://www.python.org/) | ≥3.11 | Programming Language |
| [Django](https://www.djangoproject.com/) | 5.1 | Python Web Framework |
| [Django REST Framework](https://www.django-rest-framework.org/) | 3.15 | RESTful API Framework |
| [Django Channels](https://channels.readthedocs.io/) | Latest | WebSocket Support |
| [SimpleJWT](https://django-rest-framework-simplejwt.readthedocs.io/) | Latest | JWT Authentication |
| [PostgreSQL](https://www.postgresql.org/) | Latest | Relational Database (Recommended) |
| [Redis](https://redis.io/) | Latest | Cache and Message Queue |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: ≥18.x
- **Python**: ≥3.11
- **PostgreSQL**: ≥12.x (or other databases)
- **Redis**: ≥6.x

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (using Aliyun mirror for faster download in China)
npm install --registry=https://registry.npmmirror.com

# Start development server (default port 8081)
npm start

# Build for production
npm run build

# Build and deploy to backend
npm run build:backend
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies (using Aliyun mirror for faster download in China)
pip install -r requirements.txt -i https://mirrors.aliyun.com/pypi/simple/

# Database migrations
python manage.py makemigrations
python manage.py migrate

# Initialize system data (creates default admin account)
python manage.py init

# Start development server
python manage.py runserver 127.0.0.1:8000

# Or start ASGI server (with WebSocket support)
daphne -b 0.0.0.0 -p 8000 --proxy-headers main.asgi:application
```

### Default Credentials

- **Username**: `SuperAdmin`
- **Password**: `a123456`

---

## 📁 Project Structure

```
lee-admin-template/
├── frontend/                    # Frontend project directory
│   ├── src/
│   │   ├── api/                # API interface definitions
│   │   │   ├── api.js         # Centralized API endpoints
│   │   │   └── request.js     # Axios instance configuration
│   │   ├── assets/            # Static resources
│   │   │   └── lybbn/icons/   # SVG icon library
│   │   ├── components/        # Shared components
│   │   ├── config/            # Configuration files
│   │   │   └── index.js       # Global configuration
│   │   ├── router/            # Router configuration
│   │   │   ├── index.js       # Router instance
│   │   │   ├── routes.js      # Static routes
│   │   │   └── autoBreadcrumb.js  # Auto breadcrumb generation
│   │   ├── store/             # Pinia state management
│   │   │   ├── userState.js   # User state
│   │   │   ├── siteTheme.js   # Theme configuration
│   │   │   ├── tabs.js        # Multi-tab interface
│   │   │   ├── websocket.js   # WebSocket connection
│   │   │   └── routesList.js  # Dynamic routes
│   │   ├── views/             # Page components
│   │   └── main.js            # Application entry
│   ├── package.json
│   └── vite.config.js         # Vite configuration
│
├── backend/                     # Backend project directory
│   ├── main/                   # Django main configuration
│   │   ├── settings.py        # Project settings
│   │   ├── urls.py            # URL routing
│   │   └── asgi.py            # ASGI application
│   ├── system/                 # Core system app
│   │   ├── models/            # Data models
│   │   │   ├── users.py       # User model
│   │   │   ├── roles.py       # Role model
│   │   │   ├── menus.py       # Menu model
│   │   │   └── departments.py # Department model
│   │   ├── views/             # View functions
│   │   │   ├── login.py       # Login authentication
│   │   │   └── wsrouting.py   # WebSocket routing
│   │   ├── serializers/       # Serializers
│   │   └── management/        # Management commands
│   │       └── commands/
│   │           └── init.py    # Initialization command
│   ├── tenants/                # Multi-tenancy app
│   ├── utils/                  # Utility modules
│   │   ├── middleware.py      # Middleware
│   │   ├── permission.py      # Permission checking
│   │   ├── viewset.py         # Custom viewsets
│   │   └── filters.py         # Data filters
│   ├── config.py              # Configuration file
│   ├── manage.py              # Django management script
│   └── requirements.txt       # Python dependencies
│
├── CLAUDE.md                   # Claude Code project guide
├── README.md                   # Project documentation (Chinese)
└── README_EN.md                # Project documentation (English)
```

---

## 🎨 Core Features

### 1. Permission Management System

#### Four-Level Permission Control

- **Menu Permission** - Controls route access, dynamically loads accessible menus for users
- **Button Permission** - Fine-grained control over button display and operation permissions
- **Field Permission** - Controls data field visibility to protect sensitive information
- **Data Permission** - Supports three data scope filters: personal, department, and custom

#### Permission Check Examples

**Backend Permission Check**:
```python
from utils.permission import check_permission

@check_permission('menu:add')
def create(self, request):
    # Implementation logic
    pass
```

**Frontend Permission Check**:
```javascript
import { useUserState } from '@/store/userState'

const userState = useUserState()
if (userState.hasPermission('menu:add')) {
  // Show button or feature
}
```

### 2. Dynamic Menu System

- Menu data stored in database, supports dynamic configuration
- Frontend automatically generates routes based on backend menu tree
- Supports multi-level menu nesting and icon configuration
- Auto-generates breadcrumb navigation

### 3. JWT Authentication System

- Based on `djangorestframework-simplejwt`
- Supports token refresh mechanism
- Login failure limiting (5 attempts, 60-second lockout)
- Supports single sign-on or multi-location login (configurable)

### 4. WebSocket Real-Time Communication

- Implemented with Django Channels
- Redis as channel layer backend
- Supports real-time message push and notifications

### 5. Multi-Tenancy Support

- Built-in `tenants` app module
- Data isolation and tenant identification
- Suitable for building SaaS applications

### 6. Responsive Design

- Perfect adaptation for desktop, tablet, and mobile devices
- Multi-tab management with tab caching
- Customizable theme color (default: #3A7BFF)

---

## 🔧 Configuration

### Frontend Configuration (`frontend/src/config/index.js`)

```javascript
export default {
  apiHost: 'http://127.0.0.1:8000',  // Backend API URL
  themeColor: '#3A7BFF',              // Theme color
  tokenPrefix: 'JWT',                 // Token prefix
  multiTab: true,                     // Enable multi-tab interface
}
```

### Backend Configuration (`backend/config.py`)

- Database connection settings (supports PostgreSQL, MySQL, SQLite)
- Redis connection configuration (cache and WebSocket)
- API logging toggle
- Permission caching options
- Login security settings

---

## 📚 Development Guide

### Adding New API Endpoints

1. Create view in `backend/system/views/` or appropriate app
2. Inherit from `CustomModelViewSet` for standard CRUD operations
3. Add URL pattern to `urls.py`
4. Define API call in `frontend/src/api/api.js`
5. Use in components via the API module

### Adding Custom Icons

1. Place SVG files in `frontend/src/assets/lybbn/icons/svg/`
2. Vite plugin will automatically register icons
3. Use in components: `<svg-icon name="icon-name" />`

### Database Migrations

```bash
# 1. Modify model classes
# 2. Generate migration files
python manage.py makemigrations

# 3. Review migration files
# 4. Execute migrations
python manage.py migrate

# 5. If adding initial data, update system/management/commands/init.py
```

---

## 📊 API Documentation

The system integrates DRF Spectacular for auto-generated API documentation:

- **Swagger UI**: `http://127.0.0.1:8000/api/schema/swagger-ui/`
- **ReDoc**: `http://127.0.0.1:8000/api/schema/redoc/`

> Note: JWT authentication required to access API documentation

---

## 🚢 Deployment Guide

### Frontend Deployment

```bash
# Build for production
npm run build

# Or build and copy to backend static directory
npm run build:backend
```

Build artifacts are located in `frontend/dist/`. Using `build:backend` command automatically copies to `backend/frontend/leeadmin/`.

### Backend Deployment

1. **Configure Production Environment**
   - Modify database and Redis configuration in `config.py`
   - Set `DEBUG = False`
   - Configure `ALLOWED_HOSTS`

2. **Collect Static Files**
   ```bash
   python manage.py collectstatic
   ```

3. **Deploy with Daphne (WebSocket Support)**
   ```bash
   daphne -b 0.0.0.0 -p 8000 --proxy-headers main.asgi:application
   ```

4. **Configure Nginx Reverse Proxy** (Recommended)
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

## 💡 FAQ

### Q: How to add a new menu?

**A**: Add menus in System Management → Menu Management. It's recommended to keep route names and component names consistent with file names. The system will automatically discover and register routes without manually filling in the component path.

### Q: How to switch databases?

**A**: Modify the `DATABASES` configuration in `backend/config.py`. Supports PostgreSQL, MySQL, SQLite, etc. No SQL import needed, just run `python manage.py migrate` and `python manage.py init`.

### Q: How to customize theme color?

**A**: Modify the `themeColor` configuration in `frontend/src/config/index.js`, or dynamically switch in system settings.

### Q: What if WebSocket connection fails?

**A**:
1. Ensure Redis service is running properly
2. Check Redis configuration in `backend/config.py`
3. Use Daphne to start the service instead of `runserver`
4. Check firewall and proxy configurations

### Q: How to disable multi-tab interface?

**A**: Set `multiTab: false` in `frontend/src/config/index.js`.

---

## 🤝 Contributing

Issues and Pull Requests are welcome!

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

Thanks to the following open source projects:

- [Vue.js](https://vuejs.org/)
- [Element Plus](https://element-plus.org/)
- [Django](https://www.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)

---

## 📮 Contact

- **Issues**: [GitHub Issues](#)
- **Email**: your-email@example.com
- **Website**: [https://xxxx.cn](#)

---

<div align="center">

**If this project helps you, please give it a ⭐️ Star!**

Made with ❤️ by Lee Admin Template Team

</div>
