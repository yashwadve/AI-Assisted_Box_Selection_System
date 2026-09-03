from itertools import permutations
from catalog.models import Box


class Space:
    __slots__ = ('x', 'y', 'z', 'length', 'width', 'height')

    def __init__(self, x, y, z, length, width, height):
        self.x = x
        self.y = y
        self.z = z
        self.length = length
        self.width = width
        self.height = height

    @property
    def volume(self):
        return self.length * self.width * self.height

    def is_valid(self):
        return self.length > 0 and self.width > 0 and self.height > 0


def _get_rotations(dims):
    return list(set(permutations(dims)))


def _fits(item_dims, space):
    il, iw, ih = item_dims
    return il <= space.length and iw <= space.width and ih <= space.height


def _split_space(space, placed_dims):
    il, iw, ih = placed_dims
    x, y, z = space.x, space.y, space.z
    L, W, H = space.length, space.width, space.height

    candidates = [
        Space(x + il, y, z, L - il, W, H),
        Space(x, y + iw, z, il, W - iw, H),
        Space(x, y, z + ih, il, iw, H - ih),
    ]
    return [s for s in candidates if s.is_valid()]


def can_pack_items(item_dims_list, box_length, box_width, box_height):
    items = sorted(
        item_dims_list,
        key=lambda d: d[0] * d[1] * d[2],
        reverse=True,
    )

    free_spaces = [Space(0, 0, 0, box_length, box_width, box_height)]

    for item_dims in items:
        placed = False
        candidate_spaces = sorted(free_spaces, key=lambda s: s.volume)

        for space in candidate_spaces:
            for rotation in _get_rotations(item_dims):
                if _fits(rotation, space):
                    free_spaces.remove(space)
                    free_spaces.extend(_split_space(space, rotation))
                    placed = True
                    break
            if placed:
                break

        if not placed:
            return False

    return True


def get_order_total_weight(order):
    total = 0
    for item in order.items.select_related('product').all():
        total += item.product.weight * item.quantity
    return total


def get_order_total_volume(order):
    total = 0
    for item in order.items.select_related('product').all():
        p = item.product
        total += (p.length * p.width * p.height) * item.quantity
    return total


def get_expanded_order_items(order):
    expanded = []
    for item in order.items.select_related('product').all():
        p = item.product
        expanded.extend([(p.length, p.width, p.height)] * item.quantity)
    return expanded


def can_fit_in_box(order, box):
    total_volume = get_order_total_volume(order)
    box_volume = box.internal_length * box.internal_width * box.internal_height

    if total_volume > box_volume:
        return False

    items = get_expanded_order_items(order)
    return can_pack_items(
        items,
        box.internal_length,
        box.internal_width,
        box.internal_height,
    )


def is_box_suitable(order, box):
    if get_order_total_weight(order) > box.max_weight:
        return False

    if not can_fit_in_box(order, box):
        return False

    return True


def get_suitable_boxes(order):
    return [box for box in Box.objects.all() if is_box_suitable(order, box)]


def recommend_box(order):
    suitable_boxes = get_suitable_boxes(order)

    if not suitable_boxes:
        return None

    return min(suitable_boxes, key=lambda box: box.cost)


def recommend_and_save(order):
    box = recommend_box(order)
    order.recommended_box = box
    order.save(update_fields=['recommended_box'])
    return box