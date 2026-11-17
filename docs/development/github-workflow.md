# GitHub 开发、测试与发布流程

这个仓库使用 GitHub Actions 作为 CI。当前没有自动发布到生产环境的权限或动作。

## 1. 推荐开发流程

1. 从最新 `main` 新建 `feat/*`、`fix/*` 或 `chore/*` 分支。
2. 完成修改时同时添加/更新测试；提交到自己的分支。
3. 创建 Pull Request，按模板填写变更范围、测试结果与兼容风险。
4. GitHub Actions 自动运行 Django、pytest、Vitest 和 Vite build。
5. 检查测试报告与构建产物，必要时进行手工浏览器与权限回归。
6. CI 通过后合并 PR；生产部署需要独立发布与人工审批流程。

## 2. 自动化工作流

| 工作流 | 触发 | 工作内容 |
| --- | --- | --- |
| `CI - Django and Vue` | main push、PR、手动 | Django system check、依赖一致性、Python compileall、pytest 覆盖率和 JUnit、Vitest、Vite build |
| `Dependency security audit` | 每周一、手动 | pip-audit 与 npm audit，高风险告警及报告产物 |
| Dependabot | 每周一 | Python、npm、GitHub Actions 依赖更新 PR |

CI 可在 Actions 页面看到每次执行的状态，下载 `backend-test-reports`、`frontend-dist` 等构件。

**安全扫描暂不阻断 CI**：老项目可能有历史漏洞。必须阅读扫描报告，定期修复，然后再升级为强制门禁。不能把绿色审计 Job 视作“没有漏洞”。

## 3. 分支保护（需要仓库管理员在 GitHub 网页设置）

打开 `Settings → Rules → Rulesets`，针对 `main` 配置：

- Require a pull request before merging
- Require status checks: `Backend / Django / pytest`、`Frontend / Vitest / Vite`
- Require branches to be up to date before merging（按团队协作模式选择）
- Block force pushes and deletions
- 如团队多人协作，要求至少一位 Reviewer

设置名称应以实际工作流状态项为准；不建议将安全扫描报告模式的 Job 设为必须成功，因为其成功代表“扫描流程完成”，不代表漏洞已清零。

## 4. 目前需要补齐的工程基础

- `frontend/package-lock.json` 尚未稳定提交，CI 暂用 `npm install --no-package-lock`。建议团队审核一次锁文件后提交，切换为 `npm ci`；这样更可重复、也有利于供应链风险控制。
- 后端 pytest 使用 SQLite 测试设置。应另增加 PostgreSQL + Redis 的真实集成测试，尤其是角色数据权限、Channels WebSocket 跨实例消息。
- 前端的 UI 视觉和响应式仍需真实浏览器测试（可考虑 Playwright）。
- 目前未引入 Ruff/ESLint 强制格式检查，建议先完成历史存量格式整理，再逐步设为强制校验。
- 目前未启用自动生产部署；建议先建立 Docker Compose 测试环境，发布需人工批准。
- `CODEOWNERS`、依赖许可证合规、Secret scanning / CodeQL 可作为下一阶段扩展。

## 5. 后端配置入口

后端统一使用 `backend/config.py_template`：先复制为 `backend/config.py`，再配置数据库、Redis、DEBUG 与 ALLOWED_HOSTS。`main/settings.py` 直接导入 `config.py`，不会自动解析 `.env`；原 `.env.example` 已移除，避免误以为两套配置同时生效。

生产环境建议在启动进程时提供 `DJANGO_SECRET_KEY`，并将 `DEBUG` 设为 `False`。不要将生成的 `config.py` 提交到 Git 仓库。

## 6. 常用命令

```bash
cd backend
cp config.py_template config.py
python -m pip install -r requirements.txt
python manage.py check --settings=test_settings
pytest -q --cov=system --cov=utils --cov=apps --cov-report=term-missing

cd ../frontend
npm install
npm test
npm run build
```

本地开发用配置与生产安全配置应分开，禁止提交真实 Token、密码和私人业务数据。
