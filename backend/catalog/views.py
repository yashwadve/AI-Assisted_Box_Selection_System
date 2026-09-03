from rest_framework import generics
from .models import Product, Box
from .serializers import ProductSerializer, BoxSerializer


class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class BoxListView(generics.ListAPIView):
    queryset = Box.objects.all()
    serializer_class = BoxSerializer