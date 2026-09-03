import { Link } from 'react-router-dom'
import Badge from '../ui/Badge'

export default function OrderRow({ order }) {
  return (
    <Link
      to={`/orders/${order.id}`}
      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/2 hover:bg-white/5 hover:border-white/20 transition-colors p-4"
    >
      <div className="flex items-center gap-4">
        <span className="font-mono text-slate-500 text-sm">#{order.id}</span>
        <div className="flex flex-wrap gap-1.5">
          {order.items.slice(0, 3).map((item) => (
            <span key={item.id} className="text-xs bg-white/5 text-slate-400 px-2 py-1 rounded-md">
              {item.product_detail?.name} ×{item.quantity}
            </span>
          ))}
          {order.items.length > 3 && (
            <span className="text-xs text-slate-600 px-2 py-1">+{order.items.length - 3} more</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {order.recommended_box ? (
          <Badge variant="success">{order.recommended_box.name}</Badge>
        ) : (
          <Badge variant="danger">No box</Badge>
        )}
        <span className="text-slate-600">→</span>
      </div>
    </Link>
  )
}