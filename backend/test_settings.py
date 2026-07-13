"""
测试专用配置

继承主 settings，将缓存切换为内存 LocMemCache，
使测试无需依赖真实 Redis 服务。

使用方式（已在 pytest.ini 中通过环境变量覆盖）：
    DJANGO_SETTINGS_MODULE=test_settings pytest
"""
import os

# 先设为正式 settings，再在其基础上覆盖
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "main.settings")

from main.settings import *  # noqa: F401,F403,E402

# 测试环境使用内存缓存，避免依赖 Redis
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "test-cache",
    },
    "authapi": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "test-authapi",
    },
    "singletoken": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "test-singletoken",
    },
    "password": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "test-password",
    },
}

# 测试时使用最快的密码哈希器，加速测试
PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.MD5PasswordHasher",
]

# 测试默认使用 SQLite（已在 config.py 中配置，此处显式声明）
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
        "OPTIONS": {"timeout": 20},
    }
}
