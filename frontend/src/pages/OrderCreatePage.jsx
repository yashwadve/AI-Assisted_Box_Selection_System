import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Alert from '../components/ui/Alert'
import Spinner from '../components/ui/Spinner'
import OrderItemRow from '../components/orders/OrderItemRow'
import { listProducts } from '../api/catalog'
import { createOrder } from '../api/orders'

const emptyItem = () => ({ product: '', quantity: 1 })

export default function OrderCreatePage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [items, setItems] = useState([emptyItem()])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    listProducts()
      .then((res) => setProducts(res.data))
      .catch(() => setError('Could not load products. Is the backend running?'))
      .finally(() => setLoadingProducts(false))
  }, [])

  const handleItemChange = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    )
  }

  const handleAddRow = () => setItems((prev) => [...prev, emptyItem()])

  const handleRemoveRow = (index) =>
    setItems((prev) => prev.filter((_, i) => i !== index))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    const validItems = items
      .filter((item) => item.product && Number(item.quantity) > 0)
      .map((item) => ({ product: Number(item.product), quantity: Number(item.quantity) }))

    if (validItems.length === 0) {
      setError('Please select at least one product with a valid quantity.')
      return
    }

    setSubmitting(true)
    try {
      const res = await createOrder(validItems)
      navigate(`/orders/${res.data.id}`)
    } catch (err) {
      const data = err.response?.data
      const message =
        typeof data === 'object'
          ? Object.values(data).flat().join(' ')
          : 'Something went wrong creating the order.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold text-slate-100 mb-1">Create New Order</h1>
      <p className="text-slate-500 text-sm mb-8">
        Add products and quantities — we'll figure out the box.
      </p>

      {error && (
        <div className="mb-6">
          <Alert variant="error" onDismiss={() => setError(null)}>
            {error}
          </Alert>
        </div>
      )}

      {loadingProducts ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <Card className="mb-4">
            <div className="space-y-3">
              {items.map((item, index) => (
                <OrderItemRow
                  key={index}
                  item={item}
                  index={index}
                  products={products}
                  onChange={handleItemChange}
                  onRemove={handleRemoveRow}
                  canRemove={items.length > 1}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddRow}
              className="mt-4 text-sm text-amber-400 hover:text-amber-300 font-medium transition-colors"
            >
              + Add another product
            </button>
          </Card>

          <div className="flex gap-3">
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? <Spinner size="sm" /> : 'Create Order & Recommend Box'}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}