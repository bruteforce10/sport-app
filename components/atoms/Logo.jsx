import Link from 'next/link';
import LogoIcon from '@/public/logo.svg';
import { cn } from '@/lib/utils';

const Logo = ({ 
  href = "/", 
  className = "",
  iconClassName = "",
  showText = false,
  text = "SportApp",
  ...props 
}) => {
  return (
    <Link href={href} className={cn("font-extrabold tracking-wider text-lg", className)} {...props}>
      <LogoIcon className={iconClassName} />
      {showText && (
        <span className="ml-2">{text}</span>
      )}
    </Link>
  );
};

export default Logo;
