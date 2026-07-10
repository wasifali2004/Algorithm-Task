// src/app/(auth)/register/page.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api, getApiErrorMessage } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import type { Account, AuthResponse } from '@/types';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const id = useId();
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

      await api.get<Account>('/accounts/me', {
        headers: {
          Authorization: `Bearer ${response.data.accessToken}`,
        },
      });

      router.push('/dashboard');
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f7fb] px-4 py-10">
      <section className="w-full max-w-[420px] rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.10)] sm:p-7">
        <div className="flex flex-col items-center gap-2 text-center">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[#e2e8f0] bg-white shadow-sm"
            aria-hidden="true"
          >
            <svg
              className="stroke-[#0f172a]"
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
            <h1 className="text-lg font-semibold tracking-tight text-[#0f172a]">
              Create account
            </h1>
            <p className="mt-1 text-sm leading-6 text-[#64748b]">
              Register a wallet account and continue to the dashboard.
            </p>
          </div>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${id}-name`}>Name</Label>
              <Input
                id={`${id}-name`}
                placeholder="Alex Morgan"
                autoComplete="name"
                {...register('name')}
              />
              {errors.name?.message ? (
                <p className="text-sm text-[#dc2626]">{errors.name.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${id}-email`}>Email</Label>
              <Input
                id={`${id}-email`}
                placeholder="alex@example.com"
                type="email"
                autoComplete="email"
                {...register('email')}
              />
              {errors.email?.message ? (
                <p className="text-sm text-[#dc2626]">{errors.email.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${id}-password`}>Password</Label>
              <Input
                id={`${id}-password`}
                placeholder="At least 8 characters"
                type="password"
                autoComplete="new-password"
                {...register('password')}
              />
              {errors.password?.message ? (
                <p className="text-sm text-[#dc2626]">{errors.password.message}</p>
              ) : null}
            </div>
          </div>

          {formError ? <p className="text-sm text-[#dc2626]">{formError}</p> : null}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Register'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[#64748b]">
          Already have an account?{' '}
          <Link className="font-semibold text-[#2563eb]" href="/login">
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}
