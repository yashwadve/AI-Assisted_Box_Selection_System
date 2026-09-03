from django.core.validators import MinValueValidator
from django.db import models
from catalog.models import Product, Box


class Order(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    recommended_box = models.ForeignKey(
        Box, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='orders'
    )

    def __str__(self):
        return f"Order #{self.id}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(
        validators=[MinValueValidator(1, message="Quantity must be at least 1.")],
    )

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"