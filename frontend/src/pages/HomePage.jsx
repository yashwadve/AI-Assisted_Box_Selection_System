import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import StatCard from '../components/orders/StatCard'

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 text-amber-400 text-sm font-medium mb-4">
          <span className="text-lg">▣</span> BoxFit
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold text-slate-100 tracking-tight mb-4">
          The right box for every order,
          <br />
          <span className="text-slate-500">picked automatically.</span>
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto mb-8">
          Enter what's in an order and BoxFit runs a real 3D packing check against
          your box inventory — then recommends the cheapest one that actually fits.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/orders/new">
            <Button size="lg">Create New Order</Button>
          </Link>
          <Link to="/orders">
            <Button variant="secondary" size="lg">View All Orders</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
        <StatCard icon="📦" label="Products & quantities" value="1" />
        <StatCard icon="🧮" label="3D packing + weight check" value="2" />
        <StatCard icon="✅" label="Cheapest box, guaranteed to fit" value="3" />
      </div>

      <Card>
        <h2 className="text-slate-200 font-semibold mb-3">How the recommendation works</h2>
        <ol className="space-y-2 text-sm text-slate-400 list-decimal list-inside">
          <li>Every item's real dimensions are combined — not checked one at a time.</li>
          <li>Boxes that can't hold the total weight or volume are rejected instantly.</li>
          <li>Remaining candidates go through actual 3D placement, with rotation.</li>
          <li>The cheapest box that survives placement is recommended.</li>
        </ol>
      </Card>
    </div>
  )
}