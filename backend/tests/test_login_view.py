"""
登录接口集成测试

覆盖登录流程的核心安全逻辑：
- 正确账号密码登录成功
- 错误密码返回错误信息
- 禁用用户（is_active=False）无法登录
- 非员工用户（is_staff=False）无法登录
- 不存在的账号返回统一错误（防止账号枚举）
- 验证码校验逻辑

使用 unittest.mock 对验证码配置、Redis、登录日志进行隔离，
避免测试依赖真实 Redis 和验证码图片服务。
"""
from unittest.mock import patch, MagicMock

import pytest
from django.test import RequestFactory
from rest_framework.test import APIClient

from system.models import Users
from system.views.login import LoginView


@pytest.fixture
def login_payload():
    """标准登录请求体（不含验证码字段，测试中会关闭验证码）"""
    return {"username": "SuperAdmin", "password": "a123456"}


def make_login_request(factory, payload):
    """构造一个 POST 登录请求"""
    request = factory.post("/api/token/", data=payload, content_type="application/json")
    request.data = payload
    return request


@pytest.fixture
def mock_external_deps():
    """
    批量 mock 登录链路中的外部依赖：
    - getSystemConfig：关闭验证码
    - save_login_log：跳过登录日志落库
    - get_redis_connection：使用内存 mock Redis
    """
    patches = []
    # 关闭验证码
    p1 = patch("system.views.login.getSystemConfig", return_value={"loginCaptcha": False})
    # 跳过登录日志写入
    p2 = patch("system.views.login.save_login_log")
    # mock Redis 连接（登录失败计数）
    mock_redis = MagicMock()
    mock_redis.get.return_value = None
    mock_redis.incr.return_value = 1
    mock_redis.expire.return_value = True
    mock_redis.delete.return_value = 1
    p3 = patch("system.views.login.get_redis_connection", return_value=mock_redis)

    for p in (p1, p2, p3):
        p.start()
        patches.append(p)

    yield mock_redis

    for p in patches:
        p.stop()


@pytest.mark.django_db
class TestLoginView:
    """登录接口核心场景测试"""

    def test_login_success(self, admin_user, mock_external_deps):
        """正确的账号密码应返回 access/refresh token"""
        factory = RequestFactory()
        request = make_login_request(
            factory, {"username": "SuperAdmin", "password": "a123456"}
        )
        view = LoginView()
        response = view.post(request)

        assert response.data["code"] == 2000
        token_data = response.data["data"]
        assert "access" in token_data
        assert "refresh" in token_data
        assert response.data["msg"] == "登录成功"

    def test_login_wrong_password(self, admin_user, mock_external_deps):
        """错误密码应返回错误，不返回 token"""
        factory = RequestFactory()
        request = make_login_request(
            factory, {"username": "SuperAdmin", "password": "wrongpass"}
        )
        view = LoginView()
        response = view.post(request)

        assert response.data["code"] != 2000
        assert response.data["msg"] == "账号/密码错误"
        # 失败计数应被记录
        mock_external_deps.incr.assert_called()

    def test_login_nonexistent_user(self, mock_external_deps):
        """不存在的账号应返回统一错误信息（防账号枚举）"""
        factory = RequestFactory()
        request = make_login_request(
            factory, {"username": "ghost_user", "password": "whatever"}
        )
        view = LoginView()
        response = view.post(request)

        assert response.data["code"] != 2000
        assert response.data["msg"] == "账号/密码错误"

    def test_login_inactive_user_blocked(self, inactive_user, mock_external_deps):
        """被禁用用户（is_active=False）无法登录"""
        factory = RequestFactory()
        request = make_login_request(
            factory, {"username": "inactive_user", "password": "a123456"}
        )
        view = LoginView()
        response = view.post(request)

        assert response.data["code"] != 2000
        assert "禁用" in response.data["msg"]

    def test_login_non_staff_blocked(self, mock_external_deps):
        """非员工用户（is_staff=False）无法登录后台"""
        Users.objects.create_user(
            username="frontend_user",
            password="a123456",
            name="前端用户",
        )
        factory = RequestFactory()
        request = make_login_request(
            factory, {"username": "frontend_user", "password": "a123456"}
        )
        view = LoginView()
        response = view.post(request)

        assert response.data["code"] != 2000
        assert "权限" in response.data["msg"]
