# 2026-11-17 核心安全与可靠性改造记录

> 本批修改按维护者要求直接提交到 main。**自动化 CI 通过不等于生产环境已经验收**。

## 已修改

| 模块 | 内容 |
| --- | --- |
| 批量删除 | 使用数据权限过滤后的 QuerySet；整批 ID 校验；全部授权才允许原子删除，最多 100 个，拒绝重复 ID |
| 数据范围过滤 | 无归属字段/无对应 scope 不再隐式放行；缺失自定义部门权限不扩大到本部门 |
| API 权限 | 路径模式转义，仅允许固定的 `{id}` 参数；修正 DB 白名单缓存未命中的处理 |
| 用户账户 | 新建/导入缺失密码时创建不可用密码；限制 `is_superuser` 与 `identity` 的直接写入 |
| Django 生产设置 | 正式运行必须指定 SECRET_KEY；示例限制 ALLOWED_HOSTS；非 DEBUG 的安全 Cookie；HSTS 按验证后配置 |
| Channels | 默认 Redis Channel Layer；仅显式设置环境变量时在 DEBUG 使用内存层 |
| 前端请求 | Token 刷新 single-flight；失败时拒绝等待请求；文件下载错误传播 |
| 审计日志 | 递归遮蔽密码、Access/Refresh Token、密钥等字段，不修改原数据 |
| Excel 导出 | 非超级管理员导出字段必须显式授予 `can_view`，且复用字段权限 Serializer |
| 构建 | 修复大小写敏感的 SvgIcon 导入路径 |
| 测试/CI | 新增 pytest 保护用例；GitHub Actions 检查 Django、pytest、Vue 单元测试和构建 |

## 不兼容行为及升级步骤

1. **数据授权必须重新盘点。** 非超级管理员访问不含 `dept_belong` 的模型会被数据范围过滤器拒绝；此类业务必须显式建模归属字段，或在有充分证据的系统级只读查询上设计受控例外。不要通过删除过滤器恢复全量访问。
2. **缺失 scope 不再按全部数据处理。** 为业务菜单和按钮配置确切 `data_scope` 后再授予普通角色。
3. **Excel 导出按字段级授权。** 需要为导出字段配置 `MenuField` 与角色的 `can_view` 权限；否则非超级管理员无法导出该字段。
4. **创建用户不再使用统一默认密码。** 对无密码账户应通过授权的密码设置/邀请流程激活；在这项流程未实现之前，管理界面应显式输入唯一密码。
5. **多进程 Channels 依赖 Redis。** 请确保 `REDIS_URL` 正确、Redis 服务可访问。仅在本地单进程 DEBUG 试验中使用 `USE_INMEMORY_CHANNEL_LAYER=1`。
6. **生产设置必须配置 `SECRET_KEY`、`ALLOWED_HOSTS`、HTTPS 入站代理和可信域名。** `DJANGO_SECURE_SSL_REDIRECT=true` 和 HSTS 需要在代理证书/头部验证后启用，不应盲目开启。

## 测试命令

```bash
cd backend
cp config.py_template config.py
python manage.py check --settings=test_settings
pytest -q

cd ../frontend
npm install --no-package-lock
npm test
npm run build
```

仓库 [Actions](https://github.com/calvin-207/lee-admin-template/actions) 保留每次构建日志。

## 本轮没有宣称完成的事项

- 未完成真实浏览器、不同角色的端到端回归与生产部署验收。
- 整体 ORM 数据权限模型、字段权限策略与业务数据的逐模块例外仍需要实际业务测试。
- 未替新项目完成 Celery/Agent 任务编排、幂等业务写入、审批执行状态机。
- 前端依赖版本和锁文件策略、WebSocket token handshake 保密性、密钥轮换及业务日志保留策略仍应纳入下一轮发布审核。

**建议：** 将本次修改作为开发基础，先做受限权限角色的真实接口回归后，再将系统接入生产 ERP 数据。
