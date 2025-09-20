import { usePathname } from "next/navigation";
import { NAVIGATION_ITEMS } from '@/lib/constants/navigation';
import NavigationLink from './NavigationLink';

const DesktopNavigation = () => {
  const pathname = usePathname();

  const isActive = (path) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <nav aria-label="Primary Navigation">
      <ul className="flex items-center gap-6 text-sm font-medium text-gray-700">
        {NAVIGATION_ITEMS.map((item) => (
          <li key={item.id}>
            <NavigationLink
              href={item.href}
              isActive={item.isActive ? isActive(item.href) : false}
            >
              {item.label}
            </NavigationLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default DesktopNavigation;
