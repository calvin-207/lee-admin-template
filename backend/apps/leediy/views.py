# -*- coding: utf-8 -*-

"""
@Remark: 小程序装修接口
参照 niucloud 装修接口契约，实现：
1. 后台装修管理（CRUD + 初始化数据 + 设为默认）
2. 前端/H5/小程序 装修页面数据读取
"""

import json

from django.db import transaction
from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication

from apps.leediy.models import DiyPage, DiyRoute, DiyTheme
from apps.leediy.dicts import (
    get_components,
    get_template,
    get_links,
    get_default_page_value,
)
from utils.jsonResponse import SuccessResponse, DetailResponse, ErrorResponse
from utils.serializers import CustomModelSerializer
from utils.viewset import CustomModelViewSet
from utils.common import get_parameter_dic


# ========================================================== #
# 装修页面序列化器
# ========================================================== #
class DiyPageSerializer(CustomModelSerializer):
    class Meta:
        model = DiyPage
        read_only_fields = ["id"]
        fields = "__all__"


class DiyPageCreateSerializer(CustomModelSerializer):
    """新建页面时，自动填充默认 value"""

    class Meta:
        model = DiyPage
        read_only_fields = ["id"]
        fields = "__all__"


class DiyRouteSerializer(CustomModelSerializer):
    class Meta:
        model = DiyRoute
        read_only_fields = ["id"]
        fields = "__all__"


class DiyThemeSerializer(CustomModelSerializer):
    class Meta:
        model = DiyTheme
        read_only_fields = ["id"]
        fields = "__all__"


# ========================================================== #
# 后台装修管理接口
# ========================================================== #
class DiyPageViewSet(CustomModelViewSet):
    """
    装修页面管理接口
    - list:   GET    /api/leediy/page/            装修页面列表
    - create: POST   /api/leediy/page/            新建装修页面
    - retrieve:GET   /api/leediy/page/{id}/       装修页面详情（含 value JSON）
    - update: PUT    /api/leediy/page/{id}/       编辑（保存装修结果）
    - destroy:DELETE /api/leediy/page/{id}/       删除
    """
    queryset = DiyPage.objects.all()
    serializer_class = DiyPageSerializer
    create_serializer_class = DiyPageCreateSerializer
    update_serializer_class = DiyPageCreateSerializer
    filterset_fields = ("title", "name", "type", "mode", "is_default")
    search_fields = ("title", "page_title", "name")

    def perform_create(self, serializer):
        """新建页面时，若未提供 value，自动填充默认组件数据"""
        validated = serializer.validated_data
        if not validated.get("value"):
            default_value = get_default_page_value(validated.get("type", "DIY_PAGE"))
            validated["value"] = json.dumps(default_value, ensure_ascii=False)
        super().perform_create(serializer)


class DiyRouteViewSet(CustomModelViewSet):
    """装修路由管理接口"""
    queryset = DiyRoute.objects.all()
    serializer_class = DiyRouteSerializer
    filterset_fields = ("title", "name")
    search_fields = ("title", "name")


class DiyThemeViewSet(CustomModelViewSet):
    """主题配色管理接口"""
    queryset = DiyTheme.objects.all()
    serializer_class = DiyThemeSerializer
    filterset_fields = ("title", "type", "addon")


# ========================================================== #
# 装修初始化接口（编辑器加载组件库、模板、链接）
# ========================================================== #
class DiyInitView(APIView):
    """
    get: 装修编辑器初始化数据
    返回组件列表、页面模板、链接列表
    GET /api/leediy/init/?type=DIY_INDEX
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        page_type = get_parameter_dic(request).get("type", "")
        data = {
            "component": get_components(),
            "template": get_template({"action": "decorate"}),
            "link": get_links(),
        }
        return DetailResponse(data=data, msg="success")


class DiyTemplateView(APIView):
    """
    get: 获取可装修的页面模板列表
    GET /api/leediy/template/
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        params = get_parameter_dic(request)
        data = get_template(params)
        return DetailResponse(data=data, msg="success")


class DiyLinkView(APIView):
    """
    get: 获取自定义链接列表（组件跳转目标）
    GET /api/leediy/link/
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        params = get_parameter_dic(request)
        data = get_links(params)
        return DetailResponse(data=data, msg="success")


class DiySetUseView(APIView):
    """
    put: 将指定装修页面设为默认（启用）
    PUT /api/leediy/use/{id}/
    同 name 的页面只有一个为默认
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def put(self, request, pk):
        try:
            page = DiyPage.objects.get(id=pk)
        except DiyPage.DoesNotExist:
            return ErrorResponse(msg="页面不存在")
        with transaction.atomic():
            # 同 name 的其他页面取消默认
            if page.name:
                DiyPage.objects.filter(name=page.name).update(is_default=False)
            page.is_default = True
            page.save()
        return DetailResponse(data={"id": page.id}, msg="设置成功")


# ========================================================== #
# 前端/小程序/H5 装修数据读取接口（uni-app 端调用）
# ========================================================== #
class DiyApiView(APIView):
    """
    get: 获取装修页面数据（供 uni-app 前端渲染）
    GET /api/leediy/api/diy/?name=DIY_INDEX  按标识获取默认页
    GET /api/leediy/api/diy/?id=1            按ID获取指定页

    返回 value 为 JSON 字符串，前端自行 JSON.parse
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        params = get_parameter_dic(request)
        page_id = params.get("id")
        name = params.get("name")

        page = None
        # id 为空或 "0" 时忽略，按 name 查询默认页
        if page_id and str(page_id) not in ("0", ""):
            page = DiyPage.objects.filter(id=page_id).first()
        elif name:
            # 优先取默认页
            page = (
                DiyPage.objects.filter(name=name, is_default=True).first()
                or DiyPage.objects.filter(name=name).first()
            )

        if not page:
            # 无数据时返回默认页面结构
            default_value = get_default_page_value(name or "DIY_INDEX")
            return DetailResponse(
                data={
                    "id": 0,
                    "title": name or "",
                    "name": name or "",
                    "type": name or "",
                    "mode": "diy",
                    "value": json.dumps(default_value, ensure_ascii=False),
                    "is_default": 1,
                    "share": "",
                    "visit_count": 0,
                },
                msg="success",
            )

        # 访问量 +1（异步场景可改为 F 表达式或队列）
        DiyPage.objects.filter(id=page.id).update(visit_count=page.visit_count + 1)

        return DetailResponse(
            data={
                "id": page.id,
                "site_id": 0,
                "title": page.title,
                "name": page.name,
                "type": page.type,
                "mode": page.mode,
                "value": page.value,
                "is_default": int(page.is_default),
                "share": page.share,
                "visit_count": page.visit_count + 1,
            },
            msg="success",
        )


class DiyThemeApiView(APIView):
    """
    get: 获取当前选中的主题配色（供 uni-app 前端）
    GET /api/leediy/api/theme/
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        themes = DiyTheme.objects.filter(is_selected=True).values(
            "id", "addon", "title", "theme", "new_theme"
        )
        data = {t["addon"]: t for t in themes}
        return DetailResponse(data=data, msg="success")
