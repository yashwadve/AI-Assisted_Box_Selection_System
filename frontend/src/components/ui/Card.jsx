export default function Card({ children, className = '', hover = false }) {
    return (
        <div
            className={`rounded-2xl border border-white/10 bg-white/3 backdrop-blur-sm p-6 ${hover ? 'transition-colors hover:bg-white/6 hover:border-white/20' : ''
                } ${className}`}
        >
            {children}
        </div>
    )
}