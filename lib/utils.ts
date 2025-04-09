import { clsx, type ClassValue } from "clsx"
import { format } from "date-fns";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
}

// generate (consistent)color from name
export function getColorFromName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colors = [
    'bg-red-500', 'bg-orange-500', 'bg-amber-500',
    'bg-yellow-500', 'bg-lime-500', 'bg-green-500',
    'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500',
    'bg-sky-500', 'bg-blue-500', 'bg-indigo-500',
    'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500',
    'bg-pink-500', 'bg-rose-500'
  ];

  return colors[Math.abs(hash) % colors.length];
}

export function formatDate(date: Date) {
  return format(date, 'MMMM d, yyyy');
}

export function getPriorityColor(priority: string) {
  switch (priority) {
    case "high":
      return "text-red-600 dark:text-red-400"
    case "medium":
      return "text-yellow-600 dark:text-yellow-400"
    case "low":
      return "text-green-600 dark:text-green-400"
    default:
      return "text-gray-600 dark:text-gray-400"
  }
}