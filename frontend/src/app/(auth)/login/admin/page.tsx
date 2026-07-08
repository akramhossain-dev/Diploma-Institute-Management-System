'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { adminLoginSchema, AdminLoginInput } from '@/types/auth/admin-login.schema';
import { adminAuthService } from '@/services/auth/admin-auth.service';
import { useAdminAuthStore } from '@/store/auth/adminAuthStore';
import { AppError } from '@/types/shared/api.types';

export default function AdminLoginPage() {
  const router = useRouter();
  const setSession = useAdminAuthStore((state) => state.setSession);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (data: AdminLoginInput) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await adminAuthService.login(data);
      setSession(response.accessToken, response.profile);
      router.replace('/admin/dashboard');
    } catch (err: any) {
      const errorObj = err as AppError;
      setErrorMessage(errorObj.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Admin Login"
      description="Enter credentials to access DIMS administrative settings."
    >
      <LoginForm
        schema={adminLoginSchema}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        errorMessage={errorMessage}
        identifierLabel="Admin Email"
        identifierPlaceholder="admin@dims.edu.bd"
      />
    </AuthLayout>
  );
}
