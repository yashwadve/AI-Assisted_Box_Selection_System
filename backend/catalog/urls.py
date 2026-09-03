from django.urls import path
from .views import ProductListView, BoxListView

urlpatterns = [
    path('products/', ProductListView.as_view(), name='api-product-list'),
    path('boxes/', BoxListView.as_view(), name='api-box-list'),
]