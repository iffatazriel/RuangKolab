import { type InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-slate-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`custom-input w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none ${
          error ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-indigo-600'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
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
        <label htmlFor={id} className="text-xs font-semibold text-slate-700">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        className={`custom-input w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none ${
          error ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-indigo-600'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
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
        <label htmlFor={id} className="text-xs font-semibold text-slate-700">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={`custom-input w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none ${
          error ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-indigo-600'
        } ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
    </div>
  )
)
Select.displayName = 'Select'
