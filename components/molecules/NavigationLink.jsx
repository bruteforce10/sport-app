import Link from 'next/link';
import { cn } from '@/lib/utils';

const NavigationLink = ({ 
  href, 
  children, 
  isActive, 
  className = "",
  showUnderline = true,
  ...props 
}) => {
  return (
    <Link 
      href={href} 
      className={cn(
        "relative hover:text-black transition-colors duration-200",
        isActive ? 'text-black font-bold' : 'text-gray-500',
        className
      )}
      {...props}
    >
      {children}
      {isActive && showUnderline && (
        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-green-500"></span>
      )}
    </Link>
  );
};

export default NavigationLink;
