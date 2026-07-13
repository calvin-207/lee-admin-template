# -*- coding: utf-8 -*-
"""
@Remark: leeapp 装修 H5 端页面部署
将 leeapp/dist 的构建产物通过 Django 提供访问
"""
import os
from django.http import HttpResponse, Http404
from django.conf import settings

# leeapp 构建产物目录
LEEAPP_DIST = os.path.join(settings.BASE_DIR, '..', 'leeapp', 'dist')


def leeapp_index(request, extra=None):
    """leeapp H5 入口页 (extra 兜底 vue-router history 路由)"""
    index_path = os.path.join(LEEAPP_DIST, 'index.html')
    if not os.path.exists(index_path):
        return HttpResponse(
            'leeapp 尚未构建，请在 leeapp/ 目录执行 <code>npm run build</code>',
            status=503
        )
    with open(index_path, 'r', encoding='utf-8') as f:
        html = f.read()
    return HttpResponse(html, content_type='text/html; charset=utf-8')


def leeapp_static(request, path):
    """leeapp 静态资源"""
    static_path = os.path.join(LEEAPP_DIST, 'static', path)
    if not os.path.exists(static_path):
        raise Http404('文件不存在')
    ext = path.rsplit('.', 1)[-1].lower() if '.' in path else ''
    content_types = {
        'js': 'application/javascript',
        'css': 'text/css',
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'svg': 'image/svg+xml',
        'ico': 'image/x-icon',
        'woff': 'font/woff',
        'woff2': 'font/woff2',
        'ttf': 'font/ttf',
        'map': 'application/json',
    }
    with open(static_path, 'rb') as f:
        return HttpResponse(
            f.read(),
            content_type=content_types.get(ext, 'application/octet-stream')
        )
