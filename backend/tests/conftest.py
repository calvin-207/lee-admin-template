"""
测试公共 fixtures

为所有测试提供可复用的数据准备逻辑，避免每个测试文件重复造数据。
运行测试需先安装：pip install pytest pytest-django
"""
import pytest
from django.test import Client
from rest_framework.test import APIClient

from system.models import Users


@pytest.fixture
def admin_user(db):
    """创建一个超级管理员用户，用于需要后台权限的测试"""
    return Users.objects.create_superuser(
        username="SuperAdmin",
        password="a123456",
        name="超级管理员",
    )


@pytest.fixture
def normal_user(db):
    """创建一个普通员工用户"""
    return Users.objects.create_user(
        username="testuser",
        password="a123456",
        name="测试用户",
    )


@pytest.fixture
def inactive_user(db):
    """创建一个被禁用的员工用户，用于测试登录拦截"""
    user = Users.objects.create_user(
        username="inactive_user",
        password="a123456",
        name="禁用用户",
    )
    # 必须同时是员工(is_staff=True)，否则登录时先命中"没有权限"而非"已禁用"
    user.is_staff = True
    user.is_active = False
    user.save()
    return user


@pytest.fixture
def api_client():
    """DRF API 测试客户端"""
    return APIClient()


@pytest.fixture
def authenticated_client(api_client, admin_user):
    """已认证的 API 客户端（携带 admin 的 JWT）"""
    from rest_framework_simplejwt.tokens import RefreshToken

    refresh = RefreshToken.for_user(admin_user)
    api_client.credentials(HTTP_AUTHORIZATION=f"JWT {refresh.access_token}")
    return api_client
