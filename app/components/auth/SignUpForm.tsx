'use client';

import Image from 'next/image';
import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '@/lib/firebase';
import EmailVerificationScreen from './EmailVerificationScreen';

export default function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Send verification email
      await sendEmailVerification(result.user);
      setVerificationSent(true);
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(err.message);
      } else {
        setError('Failed to create account');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      // Redirect or show success message
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(err.message);
      } else {
        setError('Failed to sign up with Google');
      }
    } finally {
      setLoading(false);
    }
  };

  if (verificationSent) {
    return <EmailVerificationScreen email={email} />;
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Sign Up</h2>
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500 dark:bg-red-500/10">
            {error}
          </div>
        )}
        <div className="flex flex-col gap-2">
          <label htmlFor="signup-email" className="text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="signup-email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-lg border border-black/[.08] px-4 py-2 text-sm ring-2 focus:ring-black/[.08] focus:outline-none dark:border-white/[.145] dark:focus:ring-white/[.145]"
            placeholder="Enter your email"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="signup-password" className="text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            id="signup-password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="rounded-lg border border-black/[.08] px-4 py-2 text-sm ring-2 focus:ring-black/[.08] focus:outline-none dark:border-white/[.145] dark:focus:ring-white/[.145]"
            placeholder="Create a password"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="confirm-password" className="text-sm font-medium">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            className="rounded-lg border border-black/[.08] px-4 py-2 text-sm ring-2 focus:ring-black/[.08] focus:outline-none dark:border-white/[.145] dark:focus:ring-white/[.145]"
            placeholder="Confirm your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-foreground text-background mt-2 flex h-10 cursor-pointer items-center justify-center rounded-full border border-solid border-transparent px-4 text-sm font-medium transition-colors hover:bg-[#383838] disabled:opacity-50 sm:h-12 sm:px-5 sm:text-base dark:hover:bg-[#ccc]"
        >
          {loading ? 'Creating account...' : 'Sign up'}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-black/[.08] dark:border-white/[.145]"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-2 text-black/[.6] dark:text-white/[.6]">
            Or continue with
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignUp}
        disabled={loading}
        className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-solid border-black/[.08] px-4 text-sm font-medium transition-colors hover:border-transparent hover:bg-[#f2f2f2] sm:h-12 sm:px-5 sm:text-base dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
      >
        <Image src="/google.svg" alt="Google logo" width={20} height={20} />
        Sign up with Google
      </button>
    </div>
  );
}
