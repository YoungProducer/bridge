'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { auth } from '@/lib/firebase';
import SignInForm from '../components/auth/SignInForm';
import SignUpForm from '../components/auth/SignUpForm';

export default function AuthPage() {
  const [formType, setFormType] = useState<'signin' | 'signup'>('signin');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="grid min-h-screen grid-rows-[1fr_auto_1fr] items-start justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
        <div className="flex w-full max-w-md flex-col gap-8">
          {/* Form Toggle */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setFormType('signin')}
              className={clsx(
                'cursor-pointer text-sm font-medium transition-colors',
                formType === 'signin'
                  ? 'text-black dark:text-white'
                  : 'text-black/[.6] dark:text-white/[.6]'
              )}
            >
              Sign In
            </button>
            <button
              onClick={() => setFormType('signup')}
              className={clsx(
                'cursor-pointer text-sm font-medium transition-colors',
                formType === 'signup'
                  ? 'text-black dark:text-white'
                  : 'text-black/[.6] dark:text-white/[.6]'
              )}
            >
              Sign Up
            </button>
          </div>

          <div className="min-h-[500px]">
            {formType === 'signin' ? <SignInForm /> : <SignUpForm />}
          </div>
        </div>
      </main>
    </div>
  );
}
