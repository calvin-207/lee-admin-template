"""
ASGI config for application project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "main.settings")
django.setup()

from django.core.asgi import get_asgi_application

from utils.middleware import JwtAuthMiddleware
from channels.routing import ProtocolTypeRouter, URLRouter
from system.views.wsrouting import websocket_urlpatterns


# application = get_asgi_application()

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": JwtAuthMiddleware(URLRouter(websocket_urlpatterns)),
    }
)
