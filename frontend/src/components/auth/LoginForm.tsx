'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PasswordInput } from './PasswordInput';
import { AuthErrorMessage } from './AuthErrorMessage';
import { AuthLoadingButton } from './AuthLoadingButton';
import { Input } from '@/components/ui/input';

interface LoginFormProps {
  schema: z.ZodType<any, any, any>;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  errorMessage: string | null;
  identifierLabel: string;
  identifierPlaceholder: string;
}

export function LoginForm({
  schema,
  onSubmit,
  isLoading,
  errorMessage,
  identifierLabel,
  identifierPlaceholder,
}: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Global API error display */}
      <AuthErrorMessage message={errorMessage} />

      {/* Email / Identifier Input */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-foreground">{identifierLabel}</label>
        <Input
          type="email"
          placeholder={identifierPlaceholder}
          error={errors.email?.message as string}
          disabled={isLoading}
          {...register('email')}
        />
      </div>

      {/* Password Input */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-foreground">Password</label>
        <PasswordInput
          placeholder="••••••••"
          error={errors.password?.message as string}
          disabled={isLoading}
          {...register('password')}
        />
      </div>

      {/* Submit Action */}
      <AuthLoadingButton isLoading={isLoading} label="Sign In" disabled={isLoading} />
    </form>
  );
}
export default LoginForm;
