import { type ButtonHTMLAttributes, forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const variantClass: Record<Variant, string> = {
  primary: 'bg-brand-600 text-white shadow-sm hover:bg-brand-700 active:scale-[0.98] disabled:bg-brand-300',
  secondary: 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-900 hover:border-stone-400 active:scale-[0.98]',
  danger: 'bg-rose-600 text-white shadow-sm hover:bg-rose-700 active:scale-[0.98]',
  ghost: 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100',
}
// Target sentuh minimal 40px (navbar) / 44px (konten); tombol berbentuk pill
const sizeClass: Record<Size, string> = {
  sm: 'min-h-[40px] px-3.5 py-2 text-xs rounded-full',
  md: 'min-h-[44px] px-5 py-2 text-sm rounded-full',
  lg: 'min-h-[48px] px-6 py-2.5 text-sm font-semibold rounded-full',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, children, disabled, className = '', ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-medium transition-[background-color,border-color,color,transform,box-shadow] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed ${variantClass[variant]} ${sizeClass[size]} ${className}`}
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
