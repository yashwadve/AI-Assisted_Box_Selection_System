export default function OrderItemRow({ item, index, products, onChange, onRemove, canRemove }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/2 p-3">
      <span className="text-xs font-mono text-slate-600 w-6">{String(index + 1).padStart(2, '0')}</span>

      <select
        value={item.product}
        onChange={(e) => onChange(index, 'product', e.target.value)}
        className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
      >
        <option value="">Select a product…</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} ({p.length}×{p.width}×{p.height}cm, {p.weight}kg)
          </option>
        ))}
      </select>

      <input
        type="number"
        min="1"
        value={item.quantity}
        onChange={(e) => onChange(index, 'quantity', e.target.value)}
        className="w-20 bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-amber-400/50"
      />

      <button
        type="button"
        onClick={() => onRemove(index)}
        disabled={!canRemove}
        className="text-slate-600 hover:text-rose-400 disabled:opacity-20 disabled:hover:text-slate-600 transition-colors px-2"
      >
        ✕
      </button>
    </div>
  )
}