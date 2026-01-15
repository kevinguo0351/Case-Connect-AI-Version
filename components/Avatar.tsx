
import React from 'react';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ name, size = 'md', className = '' }) => {
  const getInitials = (n: string) => {
    return n.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2);
  };

  const sizeClasses = {
    sm: 'size-8 text-[10px]',
    md: 'size-10 text-xs',
    lg: 'size-14 text-sm',
    xl: 'size-20 text-lg'
  };

  const colors = [
    'bg-indigo-500', 'bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 
    'bg-rose-500', 'bg-amber-500', 'bg-cyan-500'
  ];
  
  // Deterministic color based on name
  const colorIndex = name.length % colors.length;
  const bgColor = colors[colorIndex];

  return (
    <div className={`${sizeClasses[size]} rounded-full ${bgColor} text-white font-bold flex items-center justify-center border-2 border-white shadow-sm overflow-hidden ${className}`}>
      {getInitials(name)}
    </div>
  );
};
