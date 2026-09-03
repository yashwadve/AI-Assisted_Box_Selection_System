export default function Badge({ children, variant = 'neutral' }) {
  const variants = {
    neutral: 'bg-white/5 text-slate-300 border-white/10',
    success: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
    danger: 'bg-rose-400/10 text-rose-400 border-rose-400/20',
    amber: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${variants[variant]}`}
    >
      {children}
    </span>
  )
}