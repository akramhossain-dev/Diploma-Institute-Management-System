'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { studentLoginSchema, StudentLoginInput } from '@/types/auth/student-login.schema';
import { studentAuthService } from '@/services/auth/student-auth.service';
import { useStudentAuthStore } from '@/store/auth/studentAuthStore';
import { AppError } from '@/types/shared/api.types';

export default function StudentLoginPage() {
  const router = useRouter();
  const setSession = useStudentAuthStore((state) => state.setSession);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (data: StudentLoginInput) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await studentAuthService.login(data);
      setSession(response.accessToken, response.profile);
      router.replace('/student/dashboard');
    } catch (err: any) {
      const errorObj = err as AppError;
      setErrorMessage(errorObj.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Student Portal Login"
      description="Enter credentials to check profiles, classes, grades, and fee balances."
    >
      <LoginForm
        schema={studentLoginSchema}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        errorMessage={errorMessage}
        identifierLabel="Student Email"
        identifierPlaceholder="student@dims.edu.bd"
      />
    </AuthLayout>
  );
}
