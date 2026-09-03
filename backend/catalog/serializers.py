from rest_framework import serializers
from .models import Product, Box


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'length', 'width', 'height', 'weight']


class BoxSerializer(serializers.ModelSerializer):
    class Meta:
        model = Box
        fields = [
            'id', 'name',
            'internal_length', 'internal_width', 'internal_height',
            'max_weight', 'cost',
        ]