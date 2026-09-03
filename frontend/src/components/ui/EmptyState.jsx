export default function EmptyState({ icon = '📦', title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="text-4xl mb-4 opacity-60">{icon}</div>
      <h3 className="text-slate-200 font-semibold text-lg mb-1">{title}</h3>
      {description && (
        <p className="text-slate-500 text-sm max-w-sm mb-6">{description}</p>
      )}
      {action}
    </div>
  )
}