# -*- coding: utf-8 -*-

"""
@Remark: 小程序装修路由
"""

from django.urls import path
from rest_framework import routers

from apps.leediy.views import (
    DiyPageViewSet,
    DiyRouteViewSet,
    DiyThemeViewSet,
    DiyInitView,
    DiyTemplateView,
    DiyLinkView,
    DiySetUseView,
    DiyApiView,
    DiyThemeApiView,
)

router = routers.SimpleRouter()
# 后台管理接口
router.register(r"page", DiyPageViewSet)
router.register(r"route", DiyRouteViewSet)
router.register(r"theme", DiyThemeViewSet)

urlpatterns = [
    # 装修编辑器辅助接口
    path("init/", DiyInitView.as_view(), name="diy-init"),
    path("template/", DiyTemplateView.as_view(), name="diy-template"),
    path("link/", DiyLinkView.as_view(), name="diy-link"),
    path("use/<int:pk>/", DiySetUseView.as_view(), name="diy-set-use"),
    # 前端/小程序/H5 读取接口（无需登录）
    path("api/diy/", DiyApiView.as_view(), name="diy-api"),
    path("api/theme/", DiyThemeApiView.as_view(), name="diy-api-theme"),
]

urlpatterns += router.urls
