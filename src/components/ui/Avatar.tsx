interface Props {
  nama: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/** Avatar inisial dari nama. Latar netral, tanpa warna acak. */
export function Avatar({ nama, size = 'md', className = '' }: Props) {
  const inisial = nama
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
  const dims =
    size === 'lg' ? 'h-14 w-14 text-lg' : size === 'sm' ? 'h-8 w-8 text-xs' : 'h-10 w-10 text-sm'
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-stone-200 font-bold text-stone-700 dark:bg-stone-700 dark:text-stone-200 ${dims} ${className}`}
    >
      {inisial || '?'}
    </span>
  )
}
