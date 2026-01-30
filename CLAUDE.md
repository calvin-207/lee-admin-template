# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lee Admin Template is a full-stack admin management system combining Vue 3 + Vite frontend with Django REST Framework backend. It features JWT authentication, role-based access control (RBAC), WebSocket support, and multi-tenancy capabilities.

**Tech Stack:**
- Frontend: Vue 3, Vite 6, Element Plus, Pinia, Vue Router, Vue i18n
- Backend: Django 5.1, DRF 3.15, Channels (WebSocket), PostgreSQL, Redis
- Authentication: JWT with djangorestframework-simplejwt

## Common Commands

### Frontend Development
```bash
# Install dependencies (uses Aliyun mirror)
npm install --registry=https://registry.npmmirror.com

# Start dev server on port 8081
npm start

# Build for production
npm run build

# Build and deploy to backend (copies dist/ to backend/frontend/leeadmin/)
npm run build:backend
```

### Backend Development
```bash
# Install dependencies (uses Aliyun mirror)
pip install -r requirements.txt -i https://mirrors.aliyun.com/pypi/simple/

# Database operations
python manage.py makemigrations
python manage.py migrate

# Initialize system data (creates default admin user)
python manage.py init

# Run development server
python manage.py runserver 127.0.0.1:8000

# Run ASGI server with WebSocket support
daphne -b 0.0.0.0 -p 8000 --proxy-headers main.asgi:application
```

**Default Credentials:** SuperAdmin / a123456

## Architecture

### Frontend Architecture (`frontend/src/`)

**State Management (Pinia):**
- `store/userState.js` - User authentication, permissions, menu data
- `store/siteTheme.js` - Theme customization (default: #3A7BFF)
- `store/tabs.js` - Multi-tab interface state
- `store/keepAlive.js` - Component caching for tab navigation
- `store/cancelRequest.js` - Automatic request cancellation on route change
- `store/websocket.js` - WebSocket connection management
- `store/routesList.js` - Dynamic route generation from backend menu data

**Routing System:**
- `router/index.js` - Main router with navigation guards for authentication
- `router/routes.js` - Static route definitions
- `router/autoBreadcrumb.js` - Automatic breadcrumb generation from route meta
- Dynamic routes loaded from backend menu API and registered at runtime

**API Layer:**
- `api/request.js` - Axios instance with interceptors for JWT tokens, error handling, and request cancellation
- `api/api.js` - Centralized API endpoint definitions
- Token format: `JWT <token>` (prefix configured in `config/index.js`)
- Request timeout: 100000ms

**Key Configuration (`config/index.js`):**
- `apiHost` - Backend API base URL
- `themeColor` - Primary theme color
- `tokenPrefix` - JWT token prefix
- `multiTab` - Enable/disable multi-tab interface

### Backend Architecture (`backend/`)

**Core System App (`system/`):**
- Custom user model: `system.Users` (replaces Django's default User)
- Models: Users, Roles, Menus, Departments, Permissions
- Multi-level permission system:
  - Menu permissions (route access)
  - Button permissions (action-level)
  - Field permissions (data visibility)
  - Data scope permissions (personal, department, custom)

**Authentication Flow:**
- `system/views/login.py` - JWT token generation with login error limiting (5 attempts, 60s timeout)
- `utils/middleware.py` - Custom JWT authentication middleware
- `utils/permission.py` - Permission checking utilities
- Supports single token or multi-location login (configurable in `config.py`)

**API Views Structure:**
- Uses custom viewsets from `utils/viewset.py` with built-in filtering, pagination, and soft delete
- `utils/filters.py` - Data scope filtering based on user permissions
- All viewsets inherit from `CustomModelViewSet` for consistent behavior

**WebSocket Support:**
- `system/views/wsrouting.py` - WebSocket routing configuration
- `main/asgi.py` - ASGI application with Channels integration
- Redis backend for channel layers (configured in `config.py`)

**Configuration (`backend/config.py`):**
- Database settings (PostgreSQL default)
- Redis connection for caching and WebSocket
- API logging toggle
- Permission caching options
- Data filtering behavior
- Login security settings

### Multi-Tenancy

The `tenants/` app provides multi-tenancy support. When working with tenant-specific features, ensure proper tenant isolation in queries and data access.

### Custom Icons

SVG icons are stored in `frontend/src/assets/lybbn/icons/svg/` and automatically registered via Vite plugin. To add new icons, place SVG files in this directory and use `<svg-icon name="icon-name" />` in components.

## Important Patterns

### Adding New API Endpoints

1. Create view in `backend/system/views/` or appropriate app
2. Inherit from `CustomModelViewSet` for standard CRUD operations
3. Add URL pattern to `urls.py`
4. Define API call in `frontend/src/api/api.js`
5. Use in components via the API module

### Permission Checking

Backend uses decorator-based permission checking:
```python
from utils.permission import check_permission

@check_permission('menu:add')
def create(self, request):
    # Implementation
```

Frontend checks permissions via Pinia store:
```javascript
import { useUserState } from '@/store/userState'
const userState = useUserState()
if (userState.hasPermission('menu:add')) {
  // Show button/feature
}
```

### Dynamic Menu System

Menus are stored in the database (`system.Menus` model) and loaded dynamically:
1. Backend returns menu tree via `/api/system/menu/` endpoint
2. Frontend stores in `userState.menuList`
3. Routes generated and registered in `router/index.js`
4. Breadcrumbs auto-generated from route hierarchy

### Data Scope Filtering

The system supports three data scope levels:
- **Personal**: User sees only their own data
- **Department**: User sees department data
- **Custom**: User sees data from specified departments

Filtering is applied automatically in `utils/filters.py` based on user role settings.

## Database Migrations

When modifying models:
1. Make changes to model classes
2. Run `python manage.py makemigrations`
3. Review generated migration files
4. Run `python manage.py migrate`
5. If adding new system data, update `system/management/commands/init.py`

## API Documentation

Swagger UI available at `/api/schema/swagger-ui/` (requires JWT authentication). API schema generated via DRF Spectacular.

## Deployment Notes

- Frontend builds to `dist/`, use `npm run build:backend` to deploy to Django static files
- Django serves frontend from `backend/frontend/leeadmin/`
- Use Daphne for production ASGI deployment with WebSocket support
- Configure `config.py` for production (disable DEBUG, set proper database credentials)
- Static files collected to `backend/static/`
- Media files uploaded to `backend/media/`
