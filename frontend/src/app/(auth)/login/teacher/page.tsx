'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { teacherLoginSchema, TeacherLoginInput } from '@/types/auth/teacher-login.schema';
import { teacherAuthService } from '@/services/auth/teacher-auth.service';
import { useTeacherAuthStore } from '@/store/auth/teacherAuthStore';
import { AppError } from '@/types/shared/api.types';

export default function TeacherLoginPage() {
  const router = useRouter();
  const setSession = useTeacherAuthStore((state) => state.setSession);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (data: TeacherLoginInput) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await teacherAuthService.login(data);
      setSession(response.accessToken, response.profile);
      router.replace('/teacher/dashboard');
    } catch (err: any) {
      const errorObj = err as AppError;
      setErrorMessage(errorObj.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Faculty Portal Login"
      description="Enter credentials to access class schedules and evaluate grading records."
    >
      <LoginForm
        schema={teacherLoginSchema}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        errorMessage={errorMessage}
        identifierLabel="Teacher Email"
        identifierPlaceholder="faculty@dims.edu.bd"
      />
    </AuthLayout>
  );
}
