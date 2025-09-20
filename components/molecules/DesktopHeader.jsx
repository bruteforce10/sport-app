import Logo from '@/components/atoms/Logo';
import DesktopNavigation from './DesktopNavigation';
import UserSection from './UserSection';

const DesktopHeader = () => {
  return (
    <div className="hidden md:flex items-center justify-between px-6 py-4">
      <Logo iconClassName="w-36" />
      <DesktopNavigation />
      <UserSection />
    </div>
  );
};

export default DesktopHeader;
