// src/app/(auth)/register/page.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowRight, Sparkles, WalletCards } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api, getApiErrorMessage } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import type { AuthResponse } from '@/types';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: RegisterForm) {
    setFormError('');
    setIsLoading(true);

    try {
      const response = await api.post<AuthResponse>('/auth/register', values);
      setAuth(response.data.accessToken, response.data.user);
      router.push('/dashboard');
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="premium-grid relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020617] px-4 py-10 text-white">
      <div className="auth-orb absolute right-1/3 top-10 h-72 w-72 rounded-full" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.96)_68%)]" />

      <section className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:grid-cols-[1fr_420px]">
        <div className="hidden p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#020617] shadow-2xl">
              <WalletCards className="h-6 w-6" />
            </div>
            <h1 className="mt-8 max-w-md text-4xl font-semibold tracking-tight">
              Create a wallet and start testing real API flows.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
              Registration creates a user and wallet account in PostgreSQL, then logs you in automatically.
            </p>
          </div>

          <div className="grid max-w-md gap-3 text-sm text-slate-300">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <Sparkles className="h-5 w-5 text-blue-300" />
              Transfer categories are handled by the Gemini backed AI flow.
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              For funded testing, use sender@example.com / password123.
            </div>
          </div>
        </div>

        <div className="bg-white p-6 text-[#0f172a] sm:p-8">
          <div className="mx-auto max-w-sm">
            <div className="mb-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0f172a] text-white shadow-xl">
                F
              </div>
              <h2 className="mt-5 text-2xl font-semibold tracking-tight">Create your wallet</h2>
              <p className="mt-2 text-sm leading-6 text-[#64748b]">
                Register a fresh account and go straight to the dashboard.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Alex Morgan" {...register('name')} />
                {errors.name?.message ? (
                  <p className="text-sm text-[#dc2626]">{errors.name.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="alex@example.com"
                  {...register('email')}
                />
                {errors.email?.message ? (
                  <p className="text-sm text-[#dc2626]">{errors.email.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                  {...register('password')}
                />
                {errors.password?.message ? (
                  <p className="text-sm text-[#dc2626]">{errors.password.message}</p>
                ) : null}
              </div>

              {formError ? <p className="text-sm text-[#dc2626]">{formError}</p> : null}

              <Button className="w-full" disabled={isLoading} type="submit">
                {isLoading ? 'Creating account...' : 'Register'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-[#64748b]">
              Already have an account?{' '}
              <Link className="font-semibold text-[#2563eb]" href="/login">
                Login
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
