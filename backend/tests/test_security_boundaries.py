"""Security regression coverage for scoped bulk writes and auth defaults.

Execute from backend/: pytest tests/test_security_boundaries.py -q
"""
from types import SimpleNamespace
from unittest.mock import Mock

import pytest
from django.db import transaction
from rest_framework.exceptions import PermissionDenied
from rest_framework.test import APIRequestFactory
from rest_framework.request import Request
from rest_framework.parsers import JSONParser

from system.models import Users
from system.views.user import UserCreateSerializer, UserImportSerializer
from utils.viewset import CustomModelViewSet
from utils.permission import APIPermissionValidator


@pytest.mark.django_db
def test_bulk_delete_refuses_mixed_authorized_and_unauthorized_ids():
    owned = Users.objects.create_user(username="owned-test", password="Strong#Pass123")
    foreign = Users.objects.create_user(username="foreign-test", password="Strong#Pass123")
    view = CustomModelViewSet()
    view.get_queryset = lambda: Users.objects.all()
    view.filter_queryset = lambda qs: qs.filter(pk=owned.pk)
    request = Request(APIRequestFactory().delete(
        "/api/users/multiple_delete/",
        {"keys": [owned.pk, foreign.pk]},
        format="json",
    ), parsers=[JSONParser()])
    with pytest.raises(PermissionDenied):
        view.multiple_delete(request)
    assert Users.objects.filter(pk=owned.pk).exists()
    assert Users.objects.filter(pk=foreign.pk).exists()


@pytest.mark.django_db
def test_bulk_delete_allows_only_fully_scoped_ids():
    owned = Users.objects.create_user(username="owned-only", password="Strong#Pass123")
    foreign = Users.objects.create_user(username="foreign-only", password="Strong#Pass123")
    view = CustomModelViewSet()
    view.get_queryset = lambda: Users.objects.all()
    view.filter_queryset = lambda qs: qs.filter(pk=owned.pk)
    request = Request(APIRequestFactory().delete(
        "/api/users/multiple_delete/", {"keys": [owned.pk]}, format="json"
    ), parsers=[JSONParser()])
    view.multiple_delete(request)
    assert not Users.objects.filter(pk=owned.pk).exists()
    assert Users.objects.filter(pk=foreign.pk).exists()


@pytest.mark.parametrize("ids", [[], "1,2", None, [1] * 101])
def test_bulk_delete_rejects_invalid_id_lists(ids):
    view = CustomModelViewSet()
    view.get_queryset = Mock(side_effect=AssertionError("Must not query for invalid keys"))
    request = Request(APIRequestFactory().delete(
        "/api/users/multiple_delete/", {"keys": ids}, format="json"
    ), parsers=[JSONParser()])
    response = view.multiple_delete(request)
    assert response.data["code"] != 2000


@pytest.mark.parametrize("serializer", [UserCreateSerializer, UserImportSerializer])
def test_user_serializers_have_no_shared_default_password(serializer):
    from rest_framework.fields import empty
    field = serializer().fields["password"]
    assert field.default is empty
    assert field.write_only


def test_permission_patterns_are_literal_except_id_placeholder():
    validate = APIPermissionValidator.validate_api_path
    assert validate("/api/orders/42/", "/api/orders/{id}/")
    assert not validate("/api/orders/42/extra/", "/api/orders/{id}/")
    assert not validate("/api/orders/42/sub", "/api/orders/{id}/")
    assert not validate("/apiXorders/42/", "/api.orders/{id}/")
    assert not validate("/api/orders//", "/api/orders/{id}/")
