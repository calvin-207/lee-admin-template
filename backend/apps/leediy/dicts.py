# -*- coding: utf-8 -*-

"""
@Remark: 装修组件/页面模板/链接字典
数据移植自 niucloud 的 app/dict/diy/ 目录。
这些是纯数据定义，前端通过 diy/init 接口获取，用于渲染装修编辑器的组件面板和默认值。
"""

# ========================================================== #
# 页面模板（可装修的页面类型）对应 niucloud TemplateDict
# ========================================================== #
TEMPLATE = {
    "DIY_INDEX": {
        "title": "首页",
        "page": "/app/pages/index/index",
        "action": "decorate",  # 可装修标识
        "type": "index",
    },
    "DIY_MEMBER_INDEX": {
        "title": "个人中心",
        "page": "/app/pages/member/index",
        "action": "decorate",
        "type": "member_index",
    },
    "DIY_PAGE": {
        "title": "自定义微页面",
        "page": "/app/pages/index/diy",
        "action": "",  # 不可装修（仅承载）
        "type": "",
    },
}


# ========================================================== #
# 基础组件定义 对应 niucloud ComponentDict
# key = 组件名(前后端契约), path = 后台编辑面板文件名
# ========================================================== #
COMPONENTS = {
    "BASIC": {
        "title": "基础组件",
        "list": {
            "Text": {
                "title": "标题栏",
                "icon": "iconfont iconbiaotipc",
                "path": "edit-text",
                "support_page": [],
                "uses": 0,
                "sort": 10001,
                "position": "",
                "value": {
                    "style": "style-1",
                    "text": "标题栏",
                    "textColor": "#303133",
                    "fontSize": 16,
                    "fontWeight": "normal",
                    "textAlign": "center",
                    "link": {"name": ""},
                    "subTitle": {
                        "text": "副标题",
                        "color": "#999999",
                        "fontSize": 14,
                        "control": False,
                        "fontWeight": "normal",
                    },
                    "more": {
                        "text": "更多",
                        "control": False,
                        "isShow": True,
                        "link": {"name": ""},
                        "color": "#999999",
                    },
                },
            },
            "ImageAds": {
                "title": "图片广告",
                "icon": "iconfont icontupiandaohangpc",
                "path": "edit-image-ads",
                "support_page": [],
                "uses": 0,
                "sort": 10002,
                "value": {
                    "imageHeight": 180,
                    "isSameScreen": False,
                    "list": [
                        {"link": {"name": ""}, "imageUrl": "", "imgWidth": 0, "imgHeight": 0}
                    ],
                },
            },
            "GraphicNav": {
                "title": "图文导航",
                "icon": "iconfont icontuwendaohangpc",
                "path": "edit-graphic-nav",
                "support_page": [],
                "uses": 0,
                "sort": 10003,
                "value": {
                    "layout": "horizontal",
                    "mode": "graphic",
                    "type": "img",
                    "showStyle": "fixed",
                    "rowCount": 4,
                    "pageCount": 2,
                    "imageSize": 40,
                    "aroundRadius": 25,
                    "font": {"size": 14, "weight": "normal", "color": "#303133"},
                    "list": [
                        {
                            "title": "",
                            "link": {"name": ""},
                            "imageUrl": "",
                            "label": {
                                "control": False,
                                "text": "热门",
                                "textColor": "#FFFFFF",
                                "bgColorStart": "#F83287",
                                "bgColorEnd": "#FE3423",
                            },
                        }
                        for _ in range(4)
                    ],
                    "swiper": {
                        "indicatorColor": "rgba(0, 0, 0, 0.3)",
                        "indicatorActiveColor": "#FF0E0E",
                        "indicatorStyle": "style-1",
                        "indicatorAlign": "center",
                    },
                },
            },
            "Notice": {
                "title": "公告",
                "icon": "iconfont icongonggao",
                "path": "edit-notice",
                "support_page": [],
                "uses": 0,
                "sort": 10004,
                "value": {
                    "noticeType": "text",
                    "scrollWay": "horizontal",
                    "noticeTitle": "公告",
                    "textColor": "#333333",
                    "fontSize": 13,
                    "fontWeight": "normal",
                    "list": [{"text": "这是一条公告信息", "link": {"name": ""}}],
                },
            },
            "RichText": {
                "title": "富文本",
                "icon": "iconfont iconfuwne",
                "path": "edit-rich-text",
                "support_page": [],
                "uses": 0,
                "sort": 10005,
                "value": {
                    "content": "<p>这里是富文本内容</p>",
                    "bgColor": "#FFFFFF",
                },
            },
            "HorzBlank": {
                "title": "辅助空白",
                "icon": "iconfont iconkongbai",
                "path": "edit-horz-blank",
                "support_page": [],
                "uses": 0,
                "sort": 10006,
                "value": {"height": 20, "bgColor": "#FFFFFF"},
            },
            "HorzLine": {
                "title": "辅助线",
                "icon": "iconfont iconfuzhuxian",
                "path": "edit-horz-line",
                "support_page": [],
                "uses": 0,
                "sort": 10007,
                "value": {
                    "lineStyle": "solid",
                    "lineColor": "#E5E5E5",
                    "lineHeight": 1,
                    "paddingBoth": 0,
                },
            },
            "FloatBtn": {
                "title": "悬浮按钮",
                "icon": "iconfont iconxuanfuan",
                "path": "edit-float-btn",
                "support_page": [],
                "uses": 1,
                "sort": 10008,
                "position": "right_fixed",
                "value": {
                    "imageUrl": "",
                    "link": {"name": ""},
                    "isShow": True,
                },
            },
        },
    }
}


# ========================================================== #
# 系统链接（组件点击跳转目标）对应 niucloud LinkDict
# ========================================================== #
LINKS = {
    "SYSTEM_BASE_LINK": {
        "title": "系统页面",
        "addon_info": {"title": "系统", "key": "app"},
        "type": "folder",
        "child_list": [
            {
                "name": "INDEX",
                "title": "首页",
                "url": "/app/pages/index/index",
                "is_share": 1,
            },
            {
                "name": "MEMBER",
                "title": "个人中心",
                "url": "/app/pages/member/index",
                "is_share": 1,
            },
        ],
    }
}


# ========================================================== #
# 默认页面初始数据（新建页面时使用）
# 对应 niucloud PagesDict，结构为 {global: {...}, value: [...]}
# ========================================================== #
DEFAULT_INDEX_VALUE = {
    "global": {
        "title": "首页",
        "pageStartBgColor": "#F7F8FA",
        "pageEndBgColor": "",
        "pageGradientAngle": "to bottom",
        "bgUrl": "",
        "bgHeightScale": 0,
        "topStatusBar": {
            "style": "style-1",
            "isShow": True,
            "bgColor": "#FFFFFF",
            "textColor": "#303133",
            "textAlign": "center",
            "imgUrl": "",
        },
        "popWindow": {"show": False},
        "bottomTabBar": {
            "control": True,
            "isShow": True,
            "designNav": {"title": "", "key": ""},
        },
        "copyright": {
            "control": True,
            "isShow": False,
            "textColor": "#ccc",
        },
    },
    "value": [
        {
            "componentName": "GraphicNav",
            "id": "init_graphic_nav",
            "pageStartBgColor": "",
            "pageEndBgColor": "",
            "pageGradientAngle": "to bottom",
            "componentBgUrl": "",
            "componentBgAlpha": 2,
            "componentStartBgColor": "rgba(255,255,255,1)",
            "componentEndBgColor": "",
            "componentGradientAngle": "to bottom",
            "topRounded": 9,
            "bottomRounded": 9,
            "elementBgColor": "",
            "topElementRounded": 0,
            "bottomElementRounded": 0,
            "margin": {"top": 6, "bottom": 12, "both": 10},
            "list": [],
        }
    ],
}


def get_components():
    """获取组件列表"""
    return COMPONENTS


def get_template(params=None):
    """获取页面模板"""
    params = params or {}
    if params.get("action") == "decorate":
        return {k: v for k, v in TEMPLATE.items() if v.get("action") == "decorate"}
    return TEMPLATE


def get_links(params=None):
    """获取链接列表"""
    return LINKS


def get_default_page_value(page_type="DIY_INDEX"):
    """获取页面默认初始数据"""
    import copy
    return copy.deepcopy(DEFAULT_INDEX_VALUE)
