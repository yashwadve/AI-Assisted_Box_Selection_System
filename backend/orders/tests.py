from decimal import Decimal
from django.core.exceptions import ValidationError
from django.test import TestCase

from catalog.models import Product, Box
from orders.models import Order, OrderItem
from orders.services import (
    get_order_total_weight,
    get_order_total_volume,
    can_fit_in_box,
    is_box_suitable,
    get_suitable_boxes,
    recommend_box,
    recommend_and_save,
)


class ModelValidationTestCase(TestCase):

    def test_product_rejects_zero_length(self):
        with self.assertRaises(ValidationError):
            Product.objects.create(name="Bad", length=0, width=10, height=10, weight=1)

    def test_product_rejects_negative_width(self):
        with self.assertRaises(ValidationError):
            Product.objects.create(name="Bad", length=10, width=-5, height=10, weight=1)

    def test_product_rejects_zero_weight(self):
        with self.assertRaises(ValidationError):
            Product.objects.create(name="Bad", length=10, width=10, height=10, weight=0)

    def test_product_allows_valid_values(self):
        product = Product.objects.create(name="Good", length=10, width=10, height=10, weight=1)
        self.assertIsNotNone(product.id)

    def test_box_rejects_zero_internal_dimension(self):
        with self.assertRaises(ValidationError):
            Box.objects.create(
                name="Bad Box", internal_length=0, internal_width=10,
                internal_height=10, max_weight=5, cost=20
            )

    def test_box_rejects_negative_max_weight(self):
        with self.assertRaises(ValidationError):
            Box.objects.create(
                name="Bad Box", internal_length=10, internal_width=10,
                internal_height=10, max_weight=-1, cost=20
            )

    def test_box_rejects_zero_cost(self):
        with self.assertRaises(ValidationError):
            Box.objects.create(
                name="Bad Box", internal_length=10, internal_width=10,
                internal_height=10, max_weight=5, cost=0
            )

    def test_order_item_rejects_zero_quantity(self):
        product = Product.objects.create(name="Item", length=5, width=5, height=5, weight=1)
        order = Order.objects.create()
        with self.assertRaises(ValidationError):
            OrderItem.objects.create(order=order, product=product, quantity=0)

    def test_order_item_rejects_negative_quantity(self):
        product = Product.objects.create(name="Item", length=5, width=5, height=5, weight=1)
        order = Order.objects.create()
        with self.assertRaises(ValidationError):
            OrderItem.objects.create(order=order, product=product, quantity=-2)

    def test_order_item_allows_valid_quantity(self):
        product = Product.objects.create(name="Item", length=5, width=5, height=5, weight=1)
        order = Order.objects.create()
        item = OrderItem.objects.create(order=order, product=product, quantity=3)
        self.assertEqual(item.quantity, 3)


class OrderServicesTestCase(TestCase):

    def setUp(self):
        self.laptop = Product.objects.create(
            name="Laptop", length=30, width=20, height=5, weight=2
        )
        self.mouse = Product.objects.create(
            name="Mouse", length=10, width=6, height=3, weight=Decimal('0.2')
        )

        self.small_box = Box.objects.create(
            name="Small Box", internal_length=30, internal_width=20,
            internal_height=6, max_weight=3, cost=25
        )
        self.medium_box = Box.objects.create(
            name="Medium Box", internal_length=30, internal_width=20,
            internal_height=16, max_weight=8, cost=45
        )
        self.large_box = Box.objects.create(
            name="Large Box", internal_length=60, internal_width=45,
            internal_height=35, max_weight=15, cost=80
        )

    def create_order(self, items):
        order = Order.objects.create()
        for product, quantity in items:
            OrderItem.objects.create(order=order, product=product, quantity=quantity)
        return order

    # ---- Empty order ----
    def test_empty_order_has_zero_weight(self):
        order = self.create_order([])
        self.assertEqual(get_order_total_weight(order), 0)

    def test_empty_order_has_no_suitable_boxes_logic_still_runs(self):
        order = self.create_order([])
        recommended = recommend_box(order)
        self.assertEqual(recommended, self.small_box)

    # ---- Single item fit / no fit ----
    def test_single_item_fits_box(self):
        order = self.create_order([(self.laptop, 1)])
        self.assertTrue(can_fit_in_box(order, self.medium_box))

    def test_single_item_exceeds_box_dimensions(self):
        order = self.create_order([(self.laptop, 1)])
        tiny_box = Box.objects.create(
            name="Tiny Box", internal_length=10, internal_width=10,
            internal_height=10, max_weight=5, cost=10
        )
        self.assertFalse(can_fit_in_box(order, tiny_box))

    # ---- THE KEY CASE: individually fits, combined does not ----
    def test_individual_items_fit_but_combined_quantity_does_not(self):
        single_order = self.create_order([(self.laptop, 1)])
        self.assertTrue(can_fit_in_box(single_order, self.small_box))

        multi_order = self.create_order([(self.laptop, 3)])
        self.assertFalse(can_fit_in_box(multi_order, self.small_box))

        self.assertTrue(can_fit_in_box(multi_order, self.medium_box))

    def test_two_different_products_fit_individually_but_not_together(self):
        exact_box = Box.objects.create(
            name="Exact Box", internal_length=30, internal_width=20,
            internal_height=5, max_weight=10, cost=30
        )
        order = self.create_order([(self.laptop, 1), (self.mouse, 1)])
        self.assertFalse(can_fit_in_box(order, exact_box))

    # ---- Weight limit ----
    def test_box_rejected_when_weight_exceeds_max(self):
        order = self.create_order([(self.laptop, 5)])
        self.assertFalse(is_box_suitable(order, self.medium_box))

    def test_box_accepted_when_weight_within_max(self):
        order = self.create_order([(self.laptop, 2)])
        self.assertTrue(is_box_suitable(order, self.medium_box))

    # ---- Cheapest box selection among multiple valid boxes ----
    def test_recommends_cheapest_among_multiple_suitable_boxes(self):
        order = self.create_order([(self.mouse, 1)])
        suitable = get_suitable_boxes(order)
        self.assertIn(self.small_box, suitable)
        self.assertIn(self.medium_box, suitable)
        self.assertIn(self.large_box, suitable)

        recommended = recommend_box(order)
        self.assertEqual(recommended, self.small_box)

    def test_recommend_box_returns_none_when_nothing_fits(self):
        order = self.create_order([(self.laptop, 20)])
        self.assertIsNone(recommend_box(order))

    def test_recommend_and_save_persists_result(self):
        order = self.create_order([(self.mouse, 1)])
        box = recommend_and_save(order)
        order.refresh_from_db()
        self.assertEqual(order.recommended_box, box)
        self.assertEqual(order.recommended_box, self.small_box)

    def test_recommend_and_save_persists_none_when_no_box_fits(self):
        order = self.create_order([(self.laptop, 20)])
        box = recommend_and_save(order)
        order.refresh_from_db()
        self.assertIsNone(box)
        self.assertIsNone(order.recommended_box)

    def test_total_volume_calculation(self):
        order = self.create_order([(self.laptop, 2)])
        expected = (30 * 20 * 5) * 2
        self.assertEqual(get_order_total_volume(order), expected)