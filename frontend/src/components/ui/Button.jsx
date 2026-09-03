export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-40 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-amber-400 text-slate-950 hover:bg-amber-300 active:bg-amber-500 focus:ring-amber-400',
    secondary:
      'bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10 focus:ring-white/20',
    danger:
      'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 focus:ring-rose-400',
    ghost:
      'text-slate-400 hover:text-slate-100 hover:bg-white/5 focus:ring-white/20',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}