'use client'

import { useState } from 'react'
import { Eye, EyeSlash } from '@phosphor-icons/react'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  /** Konten tambahan di kanan label (mis. tautan "Lupa kata sandi?"). */
  labelExtra?: React.ReactNode
}

/** Input kata sandi dengan tombol intip, label di atas seperti field lain. */
export function PasswordInput({ id, label, labelExtra, className = '', ...props }: Props) {
  const [lihat, setLihat] = useState(false)

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-semibold text-stone-700 dark:text-stone-300">
          {label}
        </label>
        {labelExtra}
      </div>
      <div className="relative">
        <input
          id={id}
          type={lihat ? 'text' : 'password'}
          className={`custom-input w-full rounded-[10px] border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 px-3 py-2 pr-11 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setLihat((v) => !v)}
          aria-label={lihat ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
          aria-pressed={lihat}
          className="absolute inset-y-0 right-1 inline-flex w-11 items-center justify-center rounded-[10px] text-stone-400 transition-colors hover:text-stone-700 active:scale-[0.98] dark:hover:text-stone-200"
        >
          {lihat ? <EyeSlash size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
        </button>
      </div>
    </div>
  )
}
