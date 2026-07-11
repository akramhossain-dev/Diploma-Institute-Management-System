'use client';

import React from 'react';
import Link from 'next/link';
import { LucideIcon } from '@/components/shared/navigation/LucideIcon';

export default function PortalSelectorPage() {
  const portals = [
    {
      id: 'admin',
      title: 'Administrator Portal',
      description: 'Manage departments, courses, admissions, teachers, and institute-wide controls.',
      route: '/login/admin',
      icon: 'ShieldAlert',
      gradient: 'from-[#FEF2F2] to-[#FFF7F7]',
      iconBg: 'bg-[#FEE2E2]',
      iconColor: 'text-[#DC2626]',
      accent: 'border-[#DC2626]/20 hover:border-[#DC2626]/40',
      ctaColor: 'bg-[#DC2626] hover:bg-[#B91C1C] text-white',
    },
    {
      id: 'teacher',
      title: 'Faculty Portal',
      description: 'Mark attendance, enter examination grades, coordinate courses, and manage your schedule.',
      route: '/login/teacher',
      icon: 'GraduationCap',
      gradient: 'from-[#EEF2FF] to-[#F5F3FF]',
      iconBg: 'bg-[#E0E7FF]',
      iconColor: 'text-[#4338CA]',
      accent: 'border-[#6366F1]/20 hover:border-[#6366F1]/40',
      ctaColor: 'bg-[#6366F1] hover:bg-[#4338CA] text-white',
    },
    {
      id: 'student',
      title: 'Student Portal',
      description: 'View your academic syllabus, check attendance, pull grade results, and verify invoices.',
      route: '/login/student',
      icon: 'User',
      gradient: 'from-[#F0FDF4] to-[#F0FDFA]',
      iconBg: 'bg-[#D1FAE5]',
      iconColor: 'text-[#059669]',
      accent: 'border-[#10B981]/20 hover:border-[#10B981]/40',
      ctaColor: 'bg-[#10B981] hover:bg-[#059669] text-white',
    },
    {
      id: 'accountant',
      title: 'Finance & Accounts',
      description: 'Process fee payments, run collection reports, and manage financial notices.',
      route: '/login/accountant',
      icon: 'Wallet',
      gradient: 'from-[#FFFBEB] to-[#FEFCE8]',
      iconBg: 'bg-[#FEF3C7]',
      iconColor: 'text-[#D97706]',
      accent: 'border-[#F59E0B]/20 hover:border-[#F59E0B]/40',
      ctaColor: 'bg-[#F59E0B] hover:bg-[#D97706] text-white',
    },
  ];

  return (
    <div className="aurora-hero min-h-screen flex flex-col items-center justify-center p-6">
      {}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1D4ED8] via-[#6366F1] to-[#06B6D4]" />

      <div className="w-full max-w-4xl space-y-10 animate-fade-in-up">
        {}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1D4ED8] shadow-[0_0_20px_rgba(29,78,216,0.35)]">
              <span className="text-sm font-black text-white">D</span>
            </div>
            <div className="text-left">
              <div className="text-lg font-bold text-foreground tracking-tight leading-none">DIMS</div>
              <div className="text-[10px] text-muted-foreground leading-none">Institute ERP Portal</div>
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
            Select Your Workspace Portal
          </h1>
          <p className="text-[#64748B] text-sm max-w-sm mx-auto">
            Choose your corresponding entity department portal. All access events are logged.
          </p>
        </div>

        {}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {portals.map((portal, i) => (
            <div
              key={portal.id}
              className={`group rounded-2xl border bg-gradient-to-br ${portal.gradient} ${portal.accent} p-6 transition-all duration-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 animate-fade-in-up`}
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${portal.iconBg} ${portal.iconColor}`}>
                  <LucideIcon name={portal.icon} size={24} />
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-[#0F172A] leading-snug">{portal.title}</h2>
                  <p className="text-[13px] text-[#64748B] mt-1 leading-relaxed">{portal.description}</p>
                </div>
              </div>
              <div className="flex justify-end">
                <Link href={portal.route}>
                  <button
                    className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${portal.ctaColor} shadow-sm hover:shadow-md`}
                  >
                    Access Portal
                    <LucideIcon name="ChevronRight" size={14} />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/" className="text-sm text-[#64748B] hover:text-[#1D4ED8] transition-colors inline-flex items-center gap-1.5">
            <LucideIcon name="ArrowLeft" size={13} />
            Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
