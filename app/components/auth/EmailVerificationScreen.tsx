'use client';

import { sendEmailVerification } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '@/lib/firebase';
import { useState } from 'react';

interface EmailVerificationScreenProps {
  email: string;
}

export default function EmailVerificationScreen({ email }: EmailVerificationScreenProps) {
  const [error, setError] = useState('');

  const handleResendVerification = async () => {
    if (!auth.currentUser) return;

    try {
      await sendEmailVerification(auth.currentUser);
      setError('Verification email resent!');
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(err.message);
      } else {
        setError('Failed to resend verification email');
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold text-black dark:text-white">Verify your email</h2>
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500 dark:bg-red-500/10">
          {error}
        </div>
      )}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 text-base text-blue-800 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
        <p className="mb-4">We&apos;ve sent a verification email to:</p>
        <p className="mb-4 font-medium">{email}</p>
        <p>Please check your inbox and click the verification link to continue.</p>
      </div>
      <button
        onClick={handleResendVerification}
        className="cursor-pointer text-base font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      >
        Resend verification email
      </button>
    </div>
  );
}
