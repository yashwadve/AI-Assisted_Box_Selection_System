from django.contrib import admin
from .models import Order, OrderItem
from .services import recommend_and_save


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1


@admin.action(description="Recommend box for selected orders")
def recommend_box_action(modeladmin, request, queryset):
    for order in queryset:
        recommend_and_save(order)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'created_at', 'recommended_box')
    inlines = [OrderItemInline]
    actions = [recommend_box_action]


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity')