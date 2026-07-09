import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { AdmissionForm } from '@/components/admission/AdmissionForm';
import MRIST from '@/config/mrist.config';

export const metadata: Metadata = {
  title: 'Apply for Admission — MRIST',
  description: `Submit your online admission application for ${MRIST.shortName}'s 4-Year Diploma in Engineering programs. Affiliated with BTEB.`,
};

export default function AdmissionApplyPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* Page Header */}
      <section className="bg-[#0F172A] py-10 px-4">
        <div className="mx-auto max-w-4xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-[#94A3B8] mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/admission" className="hover:text-white transition-colors">Admission</Link>
            <span>/</span>
            <span className="text-[#93C5FD]">Apply Online</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#059669]/20 border border-[#059669]/30 text-[#6EE7B7] text-xs font-semibold px-3 py-1 rounded-full mb-3">
                🟢 Admission Open — Session 2025–26
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Online Admission Application</h1>
              <p className="text-[#94A3B8] text-sm mt-1">
                {MRIST.shortName} · 4-Year Diploma in Engineering · BTEB Affiliated
              </p>
            </div>
            <Link
              href="/admission/status"
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-colors"
            >
              Track Application →
            </Link>
          </div>
        </div>
      </section>

      {/* Guidelines Banner */}
      <div className="bg-[#DBEAFE] border-b border-[#BFDBFE]">
        <div className="mx-auto max-w-4xl px-4 py-3">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-[#1E40AF] font-medium">
            <span>📋 <strong>Eligibility:</strong> SSC / equivalent with GPA 2.0+</span>
            <span>📂 <strong>Required:</strong> SSC marksheet, photo, birth certificate</span>
            <span>📞 <strong>Helpline:</strong> {MRIST.contact.phone} (Sun–Thu, 9 AM–5 PM)</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <AdmissionForm />
      </div>

      {/* Help Footer */}
      <div className="border-t bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xs font-semibold text-muted-foreground mb-1">Admission Helpline</div>
              <div className="text-sm font-bold text-foreground">{MRIST.contact.phone}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-muted-foreground mb-1">Email</div>
              <div className="text-sm font-bold text-foreground">{MRIST.contact.admissionEmail}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-muted-foreground mb-1">Office Hours</div>
              <div className="text-sm font-bold text-foreground">Sun–Thu: 9 AM – 5 PM</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
