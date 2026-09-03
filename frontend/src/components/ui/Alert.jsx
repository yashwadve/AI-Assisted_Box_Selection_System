export default function Alert({ variant = 'info', children, onDismiss }) {
  const variants = {
    info: 'bg-sky-400/10 border-sky-400/20 text-sky-300',
    success: 'bg-emerald-400/10 border-emerald-400/20 text-emerald-300',
    error: 'bg-rose-400/10 border-rose-400/20 text-rose-300',
  }

  return (
    <div
      className={`flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${variants[variant]}`}
    >
      <span>{children}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="opacity-60 hover:opacity-100 transition-opacity leading-none"
        >
          ✕
        </button>
      )}
    </div>
  )
}