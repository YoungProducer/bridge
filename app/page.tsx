'use client';

import { useState } from 'react';
import clsx from 'clsx';
import SignInForm from './components/SignInForm';
import SignUpForm from './components/SignUpForm';

export default function Home() {
  const [formType, setFormType] = useState<'signin' | 'signup'>('signin');

  return (
    <div className="grid min-h-screen grid-rows-[1fr_auto_1fr] items-start justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
        <div className="flex w-full max-w-md flex-col gap-8">
          {/* Form Toggle */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setFormType('signin')}
              className={clsx(
                'text-sm font-medium transition-colors',
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
                'text-sm font-medium transition-colors',
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
