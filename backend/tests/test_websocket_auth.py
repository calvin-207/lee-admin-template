"""Regression tests for WebSocket JWT and handshake security.

Run from backend/: pytest tests/test_websocket_auth.py -q
"""
from asgiref.sync import async_to_sync
from unittest.mock import AsyncMock, patch

import pytest
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from utils.middleware import JwtAuthMiddleware


def invoke_handshake(token, *, prefix=b"JWTLEEADMIN", authprefix=b"JWTlee", user=None, allowed=True):
    delivered = []
    called = []

    async def app(scope, receive, send):
        called.append(scope.get("user"))
        await send({"type": "websocket.accept", "subprotocol": "JWTLEEADMIN"})

    async def receive():
        return {"type": "websocket.connect"}

    async def send(event):
        delivered.append(event)

    scope = {
        "type": "websocket",
        "path": "/ws/msg/",
        "headers": [(b"sec-websocket-protocol", prefix + b", " + authprefix + str(token).encode())],
    }
    middleware = JwtAuthMiddleware(app)
    with (
        patch("utils.middleware.get_user", new_callable=AsyncMock, return_value=user),
        patch("utils.middleware.has_permission", new_callable=AsyncMock, return_value=allowed),
    ):
        async_to_sync(middleware)(scope, receive, send)
    return delivered, called


@pytest.mark.django_db
def test_access_token_accepted_for_authorized_user(admin_user):
    events, called = invoke_handshake(AccessToken.for_user(admin_user), user=admin_user)
    assert events == [{"type": "websocket.accept", "subprotocol": "JWTLEEADMIN"}]
    assert called == [admin_user]


@pytest.mark.django_db
def test_refresh_token_rejected_even_when_cryptographically_valid(admin_user):
    events, called = invoke_handshake(RefreshToken.for_user(admin_user), user=admin_user)
    assert events == [{"type": "websocket.close", "code": 4401}]
    assert called == []


@pytest.mark.django_db
def test_wrong_protocol_rejected(admin_user):
    events, called = invoke_handshake(
        AccessToken.for_user(admin_user), user=admin_user, prefix=b"WRONG"
    )
    assert events[0]["type"] == "websocket.close"
    assert called == []


@pytest.mark.django_db
def test_permission_denied_rejects_connection(admin_user):
    events, called = invoke_handshake(
        AccessToken.for_user(admin_user), user=admin_user, allowed=False
    )
    assert events[0]["type"] == "websocket.close"
    assert called == []


@pytest.mark.django_db
def test_inactive_user_rejected(inactive_user):
    events, called = invoke_handshake(
        AccessToken.for_user(inactive_user), user=inactive_user
    )
    assert events[0]["type"] == "websocket.close"
    assert called == []
