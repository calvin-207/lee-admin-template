# 后端测试说明

## 环境准备

```bash
cd backend

# 1. 安装测试依赖（已包含在 requirements.txt 中）
pip install -r requirements.txt

# 2. 复制配置模板（首次运行）
cp config.py_template config.py
# 根据实际情况修改 config.py 中的数据库/Redis 配置
# 测试默认使用 SQLite，无需额外数据库

# 3. 创建测试数据库表（使用 SQLite 时会自动创建）
python manage.py migrate
```

## 运行测试

```bash
# 运行所有测试
pytest

# 运行单个测试文件
pytest tests/test_user_model.py

# 运行指定的测试类/方法
pytest tests/test_login_view.py::TestLoginView::test_login_success

# 查看详细输出
pytest -v -s

# 生成覆盖率报告（需先 pip install pytest-cov）
pytest --cov=system --cov=utils --cov-report=term-missing
```

## 测试结构

```
tests/
├── conftest.py              # 公共 fixtures（admin_user、api_client 等）
├── test_user_model.py       # 用户模型：创建、密码加密、软删除
├── test_jwt_config.py       # JWT 配置：有效期策略、轮转黑名单
└── test_login_view.py       # 登录接口：成功/失败/禁用/验证码等场景
```

## 编写新测试

1. 在 `tests/` 下新建 `test_xxx.py`
2. 使用 `@pytest.mark.django_db` 标记需要数据库的测试
3. 复用 `conftest.py` 中的 fixtures 避免重复造数据
4. 对外部依赖（Redis、第三方 API）使用 `unittest.mock` 隔离

## 测试原则

- **隔离性**：不依赖真实 Redis / 邮件 / 第三方服务
- **确定性**：每次运行结果一致，不依赖执行顺序
- **快速**：使用 SQLite + `--reuse-db` 加速
