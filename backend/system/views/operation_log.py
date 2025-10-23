# -*- coding: utf-8 -*-

"""
@Remark: 操作日志管理
"""

from rest_framework import serializers
from system.models import OperationLog
from utils.serializers import CustomModelSerializer
from utils.viewset import CustomModelViewSet
from utils.jsonResponse import SuccessResponse, ErrorResponse
import django_filters


class OperationLogTimeFilter(django_filters.rest_framework.FilterSet):
    """
    日志管理 简单过滤器
    """

    # 开始时间
    beginAt = django_filters.DateTimeFilter(
        field_name="create_datetime", lookup_expr="gte"
    )
    # 结束时间
    endAt = django_filters.DateTimeFilter(
        field_name="create_datetime", lookup_expr="lte"
    )
    # 模糊搜索
    req_modular = django_filters.CharFilter(
        field_name="req_modular", lookup_expr="icontains"
    )
    # 模糊搜索
    req_path = django_filters.CharFilter(field_name="req_path", lookup_expr="icontains")
    # 模糊搜索
    req_ip = django_filters.CharFilter(field_name="req_ip", lookup_expr="icontains")
    req_os = django_filters.CharFilter(field_name="req_os", lookup_expr="icontains")
    req_body = django_filters.CharFilter(field_name="req_body", lookup_expr="icontains")
    req_method = django_filters.CharFilter(
        field_name="re_method", lookup_expr="icontains"
    )

    class Meta:
        model = OperationLog
        fields = [
            "beginAt",
            "endAt",
            "req_modular",
            "req_path",
            "req_ip",
            "req_os",
            "req_body",
            "req_method",
        ]


class OperationLogSerializer(CustomModelSerializer):
    """
    操作日志-序列化器
    """

    class Meta:
        model = OperationLog
        fields = "__all__"
        read_only_fields = ["id"]


class OperationLogViewSet(CustomModelViewSet):
    """
    操作日志接口
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """

    queryset = OperationLog.objects.all().order_by("-create_datetime")
    serializer_class = OperationLogSerializer
    # filterset_fields = '__all__'
    filterset_class = OperationLogTimeFilter
    search_fields = (
        "req_modular",
        "req_path",
        "req_ip",
        "req_os",
        "req_body",
        "creator_name",
    )

    def getOwnerLogs(self, request, *args, **kwargs):
        user = request.user
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.filter(creator=user)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True, request=request)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True, request=request)
        return SuccessResponse(data=serializer.data, msg="获取成功")

    def deletealllogs(self, request):
        user = request.user
        if user.is_superuser:
            OperationLog.objects.all().delete()
            return SuccessResponse(msg="清空成功")
        return ErrorResponse(msg="您没有权限执行此操作，需要超级管理员权限")
