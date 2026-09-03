import Badge from '../ui/Badge'

export default function BoxResultCard({ box, totalWeight }) {
  if (!box) {
    return (
      <div className="rounded-2xl border border-rose-400/20 bg-rose-400/5 p-6 text-center">
        <div className="text-2xl mb-2">⚠️</div>
        <h3 className="text-rose-300 font-semibold mb-1">No Suitable Box Available</h3>
        <p className="text-rose-400/70 text-sm">
          This order doesn't fit within any available box's dimensions or weight limit.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-amber-400/30 bg-linear-to-br from-amber-400/10 to-transparent p-6">
      <div className="flex items-center justify-between mb-4">
        <Badge variant="success">Recommended Box</Badge>
        <span className="font-mono text-amber-400 text-lg font-semibold">₹{box.cost}</span>
      </div>

      <h3 className="text-2xl font-semibold text-slate-100 mb-4">{box.name}</h3>

      <div className="grid grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Dimensions</p>
          <p className="font-mono text-slate-200">
            {box.internal_length}×{box.internal_width}×{box.internal_height}cm
          </p>
        </div>
        <div>
          <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Max Weight</p>
          <p className="font-mono text-slate-200">{box.max_weight}kg</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Order Weight</p>
          <p className="font-mono text-slate-200">{totalWeight}kg</p>
        </div>
      </div>
    </div>
  )
}