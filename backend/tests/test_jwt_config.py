"""
JWT 配置测试

验证 Access Token / Refresh Token 有效期符合安全策略，
以及 Refresh Token 轮转和黑名单机制正常工作。
"""
from datetime import timedelta

import pytest
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken

from system.models import Users


@pytest.mark.django_db
class TestJWTLifetime:
    """JWT 有效期策略测试"""

    def test_access_token_is_short_lived(self):
        """Access Token 有效期不应超过 60 分钟（默认 30 分钟）"""
        lifetime = settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"]
        assert lifetime <= timedelta(minutes=60), "Access Token 有效期过长，存在泄露风险"

    def test_access_token_default_30_minutes(self):
        """默认配置下 Access Token 为 30 分钟"""
        lifetime = settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"]
        assert lifetime == timedelta(minutes=30)

    def test_refresh_token_is_long_lived(self):
        """Refresh Token 有效期应大于 Access Token"""
        access_life = settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"]
        refresh_life = settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"]
        assert refresh_life > access_life

    def test_refresh_token_default_7_days(self):
        """默认配置下 Refresh Token 为 7 天"""
        lifetime = settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"]
        assert lifetime == timedelta(days=7)

    def test_rotation_and_blacklist_enabled(self):
        """轮转和黑名单机制应启用"""
        assert settings.SIMPLE_JWT["ROTATE_REFRESH_TOKENS"] is True
        assert settings.SIMPLE_JWT["BLACKLIST_AFTER_ROTATION"] is True


@pytest.mark.django_db
class TestJWTTokenGeneration:
    """JWT 生成与刷新行为测试"""

    def test_access_token_contains_user_id(self, normal_user):
        """生成的 Access Token 应携带正确的用户 ID"""
        token = AccessToken.for_user(normal_user)
        assert token["user_id"] == normal_user.pk  # simplejwt 将 user_id 存为与主键相同的类型

    def test_refresh_token_rotation_blacklists_old(self, normal_user):
        """旧 Refresh Token 调用 blacklist() 后应被加入黑名单"""
        refresh = RefreshToken.for_user(normal_user)
        old_jti = refresh["jti"]

        # blacklist() 是 BLACKLIST_AFTER_ROTATION 的核心行为
        # 将该 token 加入 OutstandingToken 并标记为黑名单
        refresh.blacklist()

        from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken
        assert BlacklistedToken.objects.filter(token__jti=old_jti).exists() is True
