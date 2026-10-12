import { type InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helper?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, id, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-stone-700 dark:text-stone-300">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        aria-invalid={!!error || undefined}
        aria-describedby={error ? `${id}-error` : helper ? `${id}-helper` : undefined}
        className={`custom-input w-full rounded-[10px] border px-3 py-2 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none ${
          error ? 'border-rose-400 focus:border-rose-500' : 'border-stone-300 dark:border-stone-700 focus:border-brand-600'
        } ${className}`}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="text-xs font-medium text-rose-600 dark:text-rose-400">{error}</p>
      ) : helper ? (
        <p id={`${id}-helper`} className="text-xs text-stone-500 dark:text-stone-400">{helper}</p>
      ) : null}
    </div>
  )
)
Input.displayName = 'Input'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, id, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-stone-700 dark:text-stone-300">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        className={`custom-input w-full rounded-[10px] border px-3 py-2 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none ${
          error ? 'border-rose-400 focus:border-rose-500' : 'border-stone-300 dark:border-stone-700 focus:border-brand-600'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs font-medium text-rose-600 dark:text-rose-400">{error}</p>}
    </div>
  )
)
Textarea.displayName = 'Textarea'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, id, className = '', children, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-stone-700 dark:text-stone-300">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={`custom-input w-full rounded-[10px] border bg-white dark:bg-stone-900 px-3 py-2 text-sm text-stone-900 dark:text-stone-100 focus:outline-none ${
          error ? 'border-rose-400 focus:border-rose-500' : 'border-stone-300 dark:border-stone-700 focus:border-brand-600'
        } ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs font-medium text-rose-600 dark:text-rose-400">{error}</p>}
    </div>
  )
)
Select.displayName = 'Select'
