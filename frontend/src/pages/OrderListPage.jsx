import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import Alert from '../components/ui/Alert'
import EmptyState from '../components/ui/EmptyState'
import OrderRow from '../components/orders/OrderRow'
import { listOrders } from '../api/orders'

export default function OrderListPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    listOrders()
      .then((res) => setOrders(res.data))
      .catch(() => setError('Could not load orders. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Orders</h1>
          <p className="text-slate-500 text-sm mt-1">{orders.length} total</p>
        </div>
        <Link to="/orders/new">
          <Button>+ New Order</Button>
        </Link>
      </div>

      {error && (
        <div className="mb-6">
          <Alert variant="error">{error}</Alert>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="Create your first order to see a box recommendation."
          action={
            <Link to="/orders/new">
              <Button>Create New Order</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-2">
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}
