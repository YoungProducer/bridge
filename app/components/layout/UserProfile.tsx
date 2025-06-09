'use client';

import { useState, useRef, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useClickOutside from '@/hooks/useClickOutside';

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useClickOutside(menuRef, () => setIsMenuOpen(false));

  useEffect(() => {
    // Set up auth state listener
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = () => {
    router.push('/auth');
  };

  if (!user) {
    return (
      <button
        onClick={handleSignIn}
        className="flex cursor-pointer items-center gap-2 rounded-full border border-black/[.08] px-4 py-1.5 text-sm font-medium transition-colors hover:bg-black/[.05] dark:border-white/[.145] dark:hover:bg-white/[.05]"
      >
        Sign in
      </button>
    );
  }

  return (
    <div className="user-profile-menu relative" ref={menuRef}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex cursor-pointer items-center gap-2 rounded-full p-1 transition-colors hover:bg-black/[.05] dark:hover:bg-white/[.05]"
        disabled={isLoading}
      >
        {user.photoURL ? (
          <Image
            src={user.photoURL}
            alt={user.displayName || 'User avatar'}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-medium text-white">
            {user.displayName?.[0] || user.email?.[0] || '?'}
          </div>
        )}
        <span className="max-w-[120px] truncate text-sm font-medium">
          {user.displayName || user.email?.split('@')[0]}
        </span>
      </button>

      {isMenuOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 rounded-lg border border-black/[.08] bg-white py-1 shadow-lg dark:border-white/[.145] dark:bg-[#1a1a1a]">
          <div
            className="truncate px-4 py-2 text-sm text-black/[.6] dark:text-white/[.6]"
            title={user.email || ''}
          >
            {user.email}
          </div>
          <button
            onClick={handleSignOut}
            disabled={isLoading}
            className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            {isLoading ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
      )}
    </div>
  );
}
