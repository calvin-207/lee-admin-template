# -*- coding: utf-8 -*-

"""
@Remark: 小程序装修模型
参照 niucloud 装修系统的数据结构，适配到 lee-admin-template 的 CoreModel 体系。
核心思想：装修结果是 JSON 数据，存储在 value 字段，后端只做存取转发，不解析内容。
"""

from django.db import models
from utils.models import CoreModel


class DiyPage(CoreModel):
    """
    自定义装修页面
    对应 niucloud 的 diy_page 表。
    一个装修页面 = 页面元信息 + value(组件JSON)
    """
    PAGE_TYPE_CHOICES = (
        ('DIY_INDEX', '首页'),
        ('DIY_MEMBER_INDEX', '个人中心'),
        ('DIY_PAGE', '自定义微页面'),
    )
    MODE_CHOICES = (
        ('diy', '自定义'),
        ('fixed', '固定'),
    )

    title = models.CharField(max_length=100, verbose_name="页面标题", help_text="前台展示标题")
    page_title = models.CharField(max_length=100, default='', blank=True, verbose_name="后台标题", help_text="后台展示标题")
    name = models.CharField(max_length=50, default='', blank=True, verbose_name="页面标识", help_text="如 DIY_INDEX")
    template = models.CharField(max_length=50, default='', blank=True, verbose_name="页面模板")
    type = models.CharField(max_length=50, default='DIY_PAGE', choices=PAGE_TYPE_CHOICES, verbose_name="页面类型")
    mode = models.CharField(max_length=20, default='diy', choices=MODE_CHOICES, verbose_name="展示模式")

    # 核心：装修组件数据 JSON 字符串 {global: {...}, value: [组件数组]}
    value = models.TextField(default='', blank=True, verbose_name="页面数据", help_text="组件JSON数据")

    is_default = models.BooleanField(default=False, verbose_name="是否默认页面")
    is_change = models.BooleanField(default=False, verbose_name="是否修改过")
    share = models.TextField(default='', blank=True, verbose_name="分享配置", help_text="分享JSON")
    visit_count = models.IntegerField(default=0, verbose_name="访问量")
    sort = models.IntegerField(default=0, verbose_name="排序")

    class Meta:
        db_table = 'leeadmin_diy_page'
        verbose_name = '装修页面'
        verbose_name_plural = verbose_name
        ordering = ('-update_datetime',)

    def __str__(self):
        return self.title


class DiyRoute(CoreModel):
    """
    自定义页面路由
    对应 niucloud 的 diy_route 表，管理装修页面的访问路径和分享。
    """
    title = models.CharField(max_length=100, verbose_name="页面名称")
    name = models.CharField(max_length=50, verbose_name="页面标识", help_text="唯一标识")
    page = models.CharField(max_length=200, default='', blank=True, verbose_name="页面路径")
    is_share = models.BooleanField(default=True, verbose_name="是否支持分享")
    share = models.TextField(default='', blank=True, verbose_name="分享内容JSON")

    class Meta:
        db_table = 'leeadmin_diy_route'
        verbose_name = '装修路由'
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.title


class DiyTheme(CoreModel):
    """
    主题配色
    对应 niucloud 的 diy_theme 表。
    """
    THEME_TYPE_CHOICES = (
        ('default', '默认'),
        ('diy', '自定义'),
    )

    type = models.CharField(max_length=20, default='app', verbose_name="类型")
    addon = models.CharField(max_length=50, default='app', verbose_name="所属应用")
    title = models.CharField(max_length=100, verbose_name="主题名称")
    theme = models.TextField(default='', verbose_name="主题配色JSON")
    default_theme = models.TextField(default='', blank=True, verbose_name="默认主题JSON")
    new_theme = models.TextField(default='', blank=True, verbose_name="新主题JSON")
    theme_type = models.CharField(max_length=20, default='default', choices=THEME_TYPE_CHOICES, verbose_name="主题类型")
    is_selected = models.BooleanField(default=False, verbose_name="是否选中")

    class Meta:
        db_table = 'leeadmin_diy_theme'
        verbose_name = '主题配色'
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.title
