export default function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-2xl font-semibold text-slate-100 font-mono">{value}</p>
      <p className="text-slate-500 text-sm mt-1">{label}</p>
    </div>
  )
}