from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

from catalog.models import Product, Box
from orders.models import Order


class OrderAPITestCase(APITestCase):

    def setUp(self):
        self.product = Product.objects.create(
            name="Laptop", length=30, width=20, height=5, weight=2
        )
        self.small_box = Box.objects.create(
            name="Small Box", internal_length=30, internal_width=20,
            internal_height=6, max_weight=3, cost=25
        )
        self.medium_box = Box.objects.create(
            name="Medium Box", internal_length=30, internal_width=20,
            internal_height=16, max_weight=8, cost=45
        )

    def test_product_list_endpoint(self):
        url = reverse('api-product-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_box_list_endpoint(self):
        url = reverse('api-box-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_create_order_returns_recommended_box(self):
        url = reverse('api-order-list-create')
        payload = {"items": [{"product": self.product.id, "quantity": 1}]}
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIsNotNone(response.data['recommended_box'])
        self.assertEqual(response.data['recommended_box']['name'], 'Small Box')

    def test_create_order_with_quantity_bumps_to_bigger_box(self):
        url = reverse('api-order-list-create')
        payload = {"items": [{"product": self.product.id, "quantity": 3}]}
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['recommended_box']['name'], 'Medium Box')

    def test_create_order_empty_items_rejected(self):
        url = reverse('api-order-list-create')
        response = self.client.post(url, {"items": []}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('items', response.data)

    def test_create_order_invalid_quantity_rejected(self):
        url = reverse('api-order-list-create')
        payload = {"items": [{"product": self.product.id, "quantity": 0}]}
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_order_detail_endpoint(self):
        order = Order.objects.create()
        from orders.models import OrderItem
        OrderItem.objects.create(order=order, product=self.product, quantity=1)
        from orders.services import recommend_and_save
        recommend_and_save(order)

        url = reverse('api-order-detail', kwargs={'pk': order.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total_weight', response.data)
        self.assertEqual(len(response.data['items']), 1)

    def test_order_not_found_returns_404(self):
        url = reverse('api-order-detail', kwargs={'pk': 9999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)