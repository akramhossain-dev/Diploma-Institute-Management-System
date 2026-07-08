'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { accountantLoginSchema, AccountantLoginInput } from '@/types/auth/accountant-login.schema';
import { accountantAuthService } from '@/services/auth/accountant-auth.service';
import { useAccountantAuthStore } from '@/store/auth/accountantAuthStore';
import { AppError } from '@/types/shared/api.types';

export default function AccountantLoginPage() {
  const router = useRouter();
  const setSession = useAccountantAuthStore((state) => state.setSession);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (data: AccountantLoginInput) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await accountantAuthService.login(data);
      setSession(response.accessToken, response.profile);
      router.replace('/accountant/dashboard');
    } catch (err: any) {
      const errorObj = err as AppError;
      setErrorMessage(errorObj.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Finance Workspace Login"
      description="Enter credentials to manage ledgers and billing calculations."
    >
      <LoginForm
        schema={accountantLoginSchema}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        errorMessage={errorMessage}
        identifierLabel="Accountant Email"
        identifierPlaceholder="accounts@dims.edu.bd"
      />
    </AuthLayout>
  );
}
