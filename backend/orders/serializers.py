from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction
from rest_framework import serializers

from catalog.serializers import ProductSerializer, BoxSerializer
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    product_detail = ProductSerializer(source='product', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_detail', 'quantity']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    recommended_box = BoxSerializer(read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'created_at', 'items', 'recommended_box']
        read_only_fields = ['id', 'created_at', 'recommended_box']

    def validate_items(self, items):
        if not items:
            raise serializers.ValidationError("An order must contain at least one item.")
        return items

    def create(self, validated_data):
        items_data = validated_data.pop('items')

        try:
            with transaction.atomic():
                order = Order.objects.create()
                for item_data in items_data:
                    OrderItem.objects.create(order=order, **item_data)
        except DjangoValidationError as e:
            raise serializers.ValidationError(e.message_dict if hasattr(e, 'message_dict') else e.messages)

        return order