import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Spinner from '../components/ui/Spinner'
import Alert from '../components/ui/Alert'
import BoxResultCard from '../components/orders/BoxResultCard'
import { getOrder } from '../api/orders'

export default function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getOrder(id)
      .then((res) => setOrder(res.data))
      .catch(() => setError('Order not found.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Alert variant="error">{error || 'Something went wrong.'}</Alert>
        <Link to="/orders" className="inline-block mt-4">
          <Button variant="secondary">← Back to Orders</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-slate-500 text-sm font-mono">ORDER</p>
          <h1 className="text-2xl font-semibold text-slate-100">#{order.id}</h1>
        </div>
        <Link to="/orders">
          <Button variant="secondary" size="sm">← Back</Button>
        </Link>
      </div>

      <Card className="mb-4">
        <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-4">
          Products
        </h2>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
            >
              <span className="text-slate-200">{item.product_detail?.name}</span>
              <span className="font-mono text-slate-500 text-sm">×{item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
          <span className="text-slate-400 text-sm">Total Weight</span>
          <span className="font-mono text-slate-200">{order.total_weight}kg</span>
        </div>
      </Card>

      <BoxResultCard box={order.recommended_box} totalWeight={order.total_weight} />
    </div>
  )
}