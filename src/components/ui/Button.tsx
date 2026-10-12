import { type ButtonHTMLAttributes, forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const variantClass: Record<Variant, string> = {
  primary: 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 active:scale-[0.98] disabled:bg-indigo-300',
  secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 active:scale-[0.98]',
  danger: 'bg-rose-600 text-white shadow-sm hover:bg-rose-700 active:scale-[0.98]',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
}
// Target sentuh minimal 44px di semua ukuran; satu skala radius (lg) untuk kontrol
const sizeClass: Record<Size, string> = {
  sm: 'min-h-[44px] px-3.5 py-2 text-xs rounded-lg',
  md: 'min-h-[44px] px-4 py-2 text-sm rounded-lg',
  lg: 'min-h-[48px] px-5 py-2.5 text-sm font-semibold rounded-lg',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, children, disabled, className = '', ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-medium transition-[background-color,border-color,color,transform,box-shadow] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed ${variantClass[variant]} ${sizeClass[size]} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {children}
    </button>
  )
)
Button.displayName = 'Button'
