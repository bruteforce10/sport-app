import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { useUser } from '@/lib/hooks/useUser';

const UserSection = () => {
  const { user, loading } = useUser();

  return (
    <div className="flex items-center gap-4">
      <SignedOut>
        <SignInButton>
          <button className="text-sm font-medium text-gray-700 hover:underline">
            Login
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        {loading ? (
          <div className="animate-pulse bg-gray-200 rounded-full w-8 h-8"></div>
        ) : user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">
              Hi, {user.name || 'User'}!
            </span>
            <UserButton />
          </div>
        ) : (
          <UserButton />
        )}
      </SignedIn>
    </div>
  );
};

export default UserSection;
