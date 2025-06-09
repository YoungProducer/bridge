'use client';

import Image from 'next/image';
import { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '@/lib/firebase';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log(result);
      // Redirect or show success message
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(err.message);
      } else {
        setError('Failed to sign in');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
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
        setError('Failed to sign in with Google');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Sign In</h2>
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500 dark:bg-red-500/10">
            {error}
          </div>
        )}
        <div className="flex flex-col gap-2">
          <label htmlFor="signin-email" className="text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="signin-email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-lg border border-black/[.08] px-4 py-2 text-sm ring-2 focus:ring-black/[.08] focus:outline-none dark:border-white/[.145] dark:focus:ring-white/[.145]"
            placeholder="Enter your email"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="signin-password" className="text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            id="signin-password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-lg border border-black/[.08] px-4 py-2 text-sm ring-2 focus:ring-black/[.08] focus:outline-none dark:border-white/[.145] dark:focus:ring-white/[.145]"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-foreground text-background mt-2 flex h-10 cursor-pointer items-center justify-center rounded-full border border-solid border-transparent px-4 text-sm font-medium transition-colors hover:bg-[#383838] disabled:opacity-50 sm:h-12 sm:px-5 sm:text-base dark:hover:bg-[#ccc]"
        >
          {loading ? 'Signing in...' : 'Sign in'}
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
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-solid border-black/[.08] px-4 text-sm font-medium transition-colors hover:border-transparent hover:bg-[#f2f2f2] sm:h-12 sm:px-5 sm:text-base dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
      >
        <Image src="/google.svg" alt="Google logo" width={20} height={20} />
        Sign in with Google
      </button>
    </div>
  );
}
