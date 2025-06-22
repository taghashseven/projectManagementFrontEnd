export default function Spinner({ size = 'md', color = 'blue' }) {
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-b-2',
    lg: 'h-12 w-12 border-b-4',
  }

  const colorClasses = {
    blue: 'border-blue-500',
    gray: 'border-gray-500',
    white: 'border-white',
    red: 'border-red-500',
    green: 'border-green-500',
  }

  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}
      ></div>
    </div>
  )
}