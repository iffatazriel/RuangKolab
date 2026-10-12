interface BadgeProps {
  children: React.ReactNode
  color?: 'gray' | 'indigo' | 'green' | 'yellow' | 'red' | 'blue'
}

const colorClass: Record<string, string> = {
  gray: 'bg-gray-100 text-gray-700',
  indigo: 'bg-indigo-100 text-indigo-700',
  green: 'bg-green-100 text-green-700',
  yellow: 'bg-yellow-100 text-yellow-800',
  red: 'bg-red-100 text-red-700',
  blue: 'bg-blue-100 text-blue-700',
}

export function Badge({ children, color = 'gray' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass[color]}`}>
      {children}
    </span>
  )
}
