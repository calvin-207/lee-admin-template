"""
Users 模型测试

覆盖自定义用户管理器的 create_user / create_superuser 逻辑，
以及密码加密、软删除等核心行为。
"""
import pytest
from django.db import IntegrityError

from system.models import Users


@pytest.mark.django_db
class TestCustomUserManager:
    """自定义用户管理器测试"""

    def test_create_user_with_password(self):
        """创建普通用户，密码应被加密存储"""
        user = Users.objects.create_user(
            username="user1",
            password="a123456",
            name="用户一",
        )
        assert user.pk is not None
        assert user.check_password("a123456") is True
        # 密码不能以明文保存
        assert user.password != "a123456"
        # 默认值校验
        assert user.is_active is True
        assert user.is_staff is False
        assert user.is_superuser is False
        assert user.is_delete is False

    def test_create_user_without_password(self):
        """不传密码时，应设置不可用密码"""
        user = Users.objects.create_user(username="nopass", name="无密码用户")
        assert user.has_usable_password() is False

    def test_create_user_empty_username_raises(self):
        """用户名为空时应抛出 ValueError"""
        with pytest.raises(ValueError, match="用户账号不能为空"):
            Users.objects.create_user(username="", password="a123456")

    def test_create_superuser_defaults(self):
        """超级用户应自动设置 staff/superuser/identity"""
        admin = Users.objects.create_superuser(
            username="root",
            password="a123456",
            name="超管",
        )
        assert admin.is_staff is True
        assert admin.is_superuser is True
        assert admin.is_active is True
        assert admin.identity == 0  # 超级管理员身份标识

    def test_username_unique(self):
        """用户名唯一约束生效"""
        Users.objects.create_user(username="dup", password="a123456", name="重复")
        with pytest.raises(IntegrityError):
            Users.objects.create_user(username="dup", password="a123456", name="再次")


@pytest.mark.django_db
class TestUserModel:
    """用户模型字段行为测试"""

    def test_password_can_be_changed(self, normal_user):
        """修改密码后，旧密码失效、新密码生效"""
        old_hash = normal_user.password
        normal_user.set_password("newpass789")
        normal_user.save()
        normal_user.refresh_from_db()

        assert normal_user.password != old_hash
        assert normal_user.check_password("newpass789") is True
        assert normal_user.check_password("a123456") is False

    def test_soft_delete_flag(self, normal_user):
        """软删除标记可正确设置，记录仍存在"""
        normal_user.is_delete = True
        normal_user.save()
        normal_user.refresh_from_db()

        assert normal_user.is_delete is True
        assert Users.objects.filter(pk=normal_user.pk).exists() is True
