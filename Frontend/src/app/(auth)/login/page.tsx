// src/app/(auth)/login/page.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api, getApiErrorMessage } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import type { AuthResponse } from '@/types';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const id = useId();
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: LoginForm) {
    setFormError('');
    setIsLoading(true);

    try {
      const response = await api.post<AuthResponse>('/auth/login', values);
      setAuth(response.data.accessToken, response.data.user);
      router.push('/dashboard');
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center overflow-x-hidden bg-[var(--app-bg)] px-4 py-10">
      <section className="w-full min-w-0 max-w-[420px] rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-[var(--app-shadow)] sm:p-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[var(--app-surface-strong)] text-[var(--app-primary-contrast)] shadow-sm"
            aria-hidden="true"
          >
            <svg
              className="stroke-white"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />
            </svg>
          </div>

          <div>
            <h1 className="text-lg font-semibold tracking-tight text-[var(--app-text)]">
              Welcome back
            </h1>
            <p className="mt-1 text-sm leading-6 text-[var(--app-muted)]">
              Enter your credentials to login to your account.
            </p>
          </div>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${id}-email`}>Email</Label>
              <Input
                id={`${id}-email`}
                placeholder="name@domain.com"
                type="email"
                autoComplete="email"
                {...register('email')}
              />
              {errors.email?.message ? (
                <p className="text-sm text-[var(--app-error)]">{errors.email.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${id}-password`}>Password</Label>
              <Input
                id={`${id}-password`}
                placeholder="Enter your password"
                type="password"
                autoComplete="current-password"
                {...register('password')}
              />
              {errors.password?.message ? (
                <p className="text-sm text-[var(--app-error)]">{errors.password.message}</p>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id={`${id}-remember`} defaultChecked />
            <Label
              htmlFor={`${id}-remember`}
              className="font-normal text-[var(--app-muted)]"
            >
              Remember me
            </Label>
          </div>

          {formError ? <p className="text-sm text-[var(--app-error)]">{formError}</p> : null}

          <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--app-muted)]">
          Do not have an account?{' '}
          <Link className="font-semibold text-[var(--app-primary)]" href="/register">
            Register
          </Link>
        </p>
      </section>
    </main>
  );
}
