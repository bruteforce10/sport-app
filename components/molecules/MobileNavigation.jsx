import { SlidersHorizontal } from "lucide-react";
import Logo from '@/components/atoms/Logo';
import SearchForm from './SearchForm';

const MobileNavigation = () => {
  return (
    <div className="md:hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <Logo 
          iconClassName="w-10 h-10"
        />
        <div className="flex-1">
          <SearchForm />
        </div>
        <button
          type="button"
          aria-label="Filter"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default MobileNavigation;
