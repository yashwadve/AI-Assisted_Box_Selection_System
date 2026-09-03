from rest_framework import generics, status
from rest_framework.response import Response

from .models import Order
from .serializers import OrderSerializer
from .services import recommend_and_save, get_order_total_weight


class OrderListCreateView(generics.ListCreateAPIView):
    queryset = Order.objects.select_related('recommended_box').prefetch_related('items__product').all()
    serializer_class = OrderSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()

        recommend_and_save(order)
        order.refresh_from_db()

        response_serializer = self.get_serializer(order)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class OrderDetailView(generics.RetrieveAPIView):
    queryset = Order.objects.select_related('recommended_box').prefetch_related('items__product').all()
    serializer_class = OrderSerializer

    def retrieve(self, request, *args, **kwargs):
        order = self.get_object()
        serializer = self.get_serializer(order)
        data = serializer.data
        data['total_weight'] = get_order_total_weight(order)
        return Response(data)