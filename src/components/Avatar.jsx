// components/Avatar.js
const colors = [
  'bg-red-500', 
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-yellow-500',
  'bg-pink-500',
  'bg-indigo-500'
];

const getColorFromName = (name) => {
  if (!name) return colors[0];
  const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  return colors[hash % colors.length];
};

export default function Avatar({ name = '', size = 'md', className = '' }) {
  const initials = name 
    ? name.split(' ').map(part => part[0]).join('').toUpperCase()
    : '?';
  
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base'
  };

  return (
    <div 
      className={`${sizeClasses[size]} ${getColorFromName(name)} rounded-full flex items-center justify-center text-white font-medium ${className}`}
      title={name}
    >
      {initials}
    </div>
  );
}