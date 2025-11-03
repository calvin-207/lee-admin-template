# lee-admin-template 介绍

[在线预览]
[官网文档]

## 简介

**lee-admin-template** 是专为追求页面极致效果的开发者设计的一套后台模板。通过大量重构架构，去除了无用冗余代码，力求做到小而精。前端采用 **Vite + Vue 3 + Element Plus**，支持适配手机端，助力快速开发项目及提升项目质量！

## 在线体验

<div style="border-left: 4px solid #3498db; padding-left: 1em; margin: 1em 0;">
  <table>
    <tr>
      <td><strong>🌍 访问地址</strong></td>
      <td><a href="#" target="_blank" rel="noreferrer">https://xxxx.cn</a></td>
    </tr>
    <tr>
      <td><strong>👤 测试账号</strong></td>
      <td><code>SuperAdmin</code></td>
    </tr>
    <tr>
      <td><strong>🔑 登录密码</strong></td>
      <td><code>abcd1234</code></td>
    </tr>
  </table>
</div>

## 交流



## 主要特性：

- **前端技术栈**：Vue 3 + Setup JS + Pinia + Element Plus
- **后端技术栈**：Python 语言 Django 框架以及强大的 [Django REST Framework](https://pypi.org/project/djangorestframework)
- **认证系统**：使用 [Django REST Framework SimpleJWT](https://pypi.org/project/djangorestframework-simplejwt)，支持多终端认证系统
- **权限管理**：支持加载动态权限菜单，提供多种方式轻松实现权限控制
- **列权限管控**：全新的列权限管理机制，粒度细化到每一列
- **CRUD增强**：全新设计CRUD页面，适合快速开发CRUD页面，喜欢基于配置或深度自定义的页面的小伙伴
---

##  技术栈

### 前端

- **构建工具**：[Vite（极速构建）](https://vitejs.dev/)
- **框架**：[Vue 3（组合式 API）](https://vuejs.org/)
- **UI 组件库**：[Element Plus （企业级 UI）](https://element-plus.org/)
- **编程模式**：JavaScript Setup 语法糖

### 后端

- **Python**：>=Python3.11.x
- **Django**：>=Django4.x
- **DRF**：Django REST Framework
- **JWT**：Django REST Framework SimpleJWT

---

## 核心优势

1. **页面简洁美观** - 极致的设计理念，带来清爽的视觉体验，搜索框多行默认显示一行，然后手动展开和收起，避免搜索暂用过多。
2. **响应式设计** - 完美适配手机端，随时随地高效工作。
3. **代码精简高效** - 开发项目时基本无需再删减代码，专注于业务逻辑。
4. **更全的注释** - 前后端更多的代码注释，帮助你快速了解和修改代码功能。
5. **适配大多数据库** - 无需导入sql文件，直接init命令初始化数据，可自由更换数据库类型。
---

## 常见问题解答


### 添加菜单注意事项？

**答**：添加菜单时路由和组件名称最好与新建的菜单文件名一致，会自动发现并注册路由，无需填写【组件路径】，否则需填写此项！！！


### 目录介绍

```
backend/                # 后端代码目录
frontend/               # 前端代码目录
```

## 演示图

![登录]
![首页]
![个人中心]
![用户管理]
![菜单管理]
![权限管理]
![操作日志]
![系统配置]
![字典管理]
