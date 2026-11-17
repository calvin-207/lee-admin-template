"""Audit redaction and export authorization regression tests."""
from types import SimpleNamespace
from unittest.mock import Mock

import pytest
from rest_framework.exceptions import PermissionDenied

from utils.middleware import ApiLoggingMiddleware
from utils.viewset import CustomModelViewSet


def test_sensitive_audit_data_is_redacted_recursively():
    middleware = ApiLoggingMiddleware(lambda request: None)
    payload = {
        "username": "alice",
        "password": "plain",
        "data": {
            "access": "access-jwt",
            "refresh": "refresh-jwt",
            "items": [{"client_secret": "secret"}, {"name": "OK"}],
        },
    }
    result = middleware._mask_sensitive_data(payload)
    assert result["username"] == "alice"
    assert result["password"] == "***"
    assert result["data"]["access"] == "***"
    assert result["data"]["refresh"] == "***"
    assert result["data"]["items"][0]["client_secret"] == "***"
    assert result["data"]["items"][1]["name"] == "OK"
    assert payload["password"] == "plain"  # must not mutate original


@pytest.mark.django_db
def test_export_fails_closed_for_unconfigured_field_permissions(normal_user):
    view = CustomModelViewSet()
    view.export_field_dict = {"name": "姓名", "mobile": "手机号"}
    view.get_field_permissions = lambda request: {"name": {"can_view": True}}
    view.get_export_queryset = Mock(side_effect=AssertionError("Unauthorized export must not query data"))
    request = SimpleNamespace(data={"export_fields": view.export_field_dict}, user=normal_user)
    with pytest.raises(PermissionDenied):
        view.export_data(request)
    view.get_export_queryset.assert_not_called()


def test_registered_field_defaults_to_denied_without_role_grant():
    from unittest.mock import patch
    from utils.field_permission import FieldPermissionMixin

    with (
        patch("utils.field_permission.MenuField.objects.filter") as fields,
        patch("utils.field_permission.FieldPermission.objects.filter") as grants,
    ):
        fields.return_value.values_list.return_value = ["mobile", "email"]
        grants.return_value.values.return_value = [
            {"field_name": "email", "can_view": True, "can_create": False, "can_update": False}
        ]
        result = FieldPermissionMixin().query_database_permissions("Users", (1,))
    assert result["mobile"] == {
        "can_view": False, "can_create": False, "can_update": False
    }
    assert result["email"]["can_view"] is True
