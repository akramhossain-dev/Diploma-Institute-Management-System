import type { Metadata } from 'next';
import React from 'react';
import { Check, Phone, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import MRIST from '@/config/mrist.config';

export const metadata: Metadata = {
  title: 'Admission — MRIST',
  description: `Apply for admission to ${MRIST.shortName}'s 4-Year Diploma in Engineering programs. Affiliated with BTEB.`,
};

export default function AdmissionPage() {
  const adm = MRIST.admission;

  return (
    <main className="min-h-screen">
      {/* Hero Banner */}
      <section className="bg-[#0F172A] py-14 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-[#059669]/20 border border-[#059669]/30 text-[#6EE7B7] text-xs font-semibold px-3 py-1 rounded-full mb-4">
            <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
            Admission Open — Session 2025–26
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Online Admission</h1>
          <p className="text-[#94A3B8] text-base max-w-2xl mx-auto">{adm.intro}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Link
              href="/admission/apply"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#1D4ED8] text-white text-sm font-bold hover:bg-[#1E40AF] transition-colors"
            >
              Apply Online Now →
            </Link>
            <Link
              href="/admission/status"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-colors"
            >
              Check Application Status
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 space-y-14">

        {/* Available Technologies */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Available Technologies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MRIST.departments.map((dept) => (
              <div
                key={dept.code}
                className={`rounded-xl border p-5 hover:shadow-md transition-all ${dept.bgColor}/20 border-opacity-40`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${dept.bgColor} ${dept.color}`}>
                    {dept.code}
                  </span>
                  <span className="text-sm font-bold text-foreground">{dept.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">{dept.shortDesc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Eligibility */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Eligibility Criteria</h2>
            <div className="space-y-3">
              {adm.eligibility.map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-card border rounded-lg p-4">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#059669]/15 text-[#059669] shrink-0 mt-0.5">
                    <Check className="h-3 w-3" />
                  </div>
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Required Documents</h2>
            <div className="space-y-3">
              {adm.requiredDocuments.map((doc, i) => (
                <div key={i} className="flex items-start gap-3 bg-card border rounded-lg p-4">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#DBEAFE] text-[#1D4ED8] text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <span className="text-sm text-foreground">{doc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Admission Steps */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Admission Process</h2>
          <div className="relative">
            {/* Connector line */}
            <div className="absolute left-6 top-8 bottom-8 w-px bg-border hidden md:block" />
            <div className="space-y-4">
              {adm.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-5 relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1D4ED8] text-white font-black text-sm shrink-0 z-10 border-4 border-background">
                    {step.step}
                  </div>
                  <div className="bg-card border rounded-xl p-5 flex-1">
                    <h3 className="text-sm font-bold text-foreground mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Helpline + Note */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#DBEAFE]/40 border border-[#1D4ED8]/20 rounded-xl p-6">
            <h3 className="text-base font-bold text-[#1D4ED8] mb-2 flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" /> Admission Helpline
            </h3>
            <p className="text-2xl font-black text-foreground mb-1">{MRIST.contact.phone}</p>
            <p className="text-sm text-muted-foreground mb-3">{adm.helpline.split('(')[1]?.replace(')', '') || 'Sun–Thu, 9 AM – 5 PM'}</p>
            <a
              href={`mailto:${MRIST.contact.admissionEmail}`}
              className="text-sm text-[#1D4ED8] font-medium underline"
            >
              {MRIST.contact.admissionEmail}
            </a>
          </div>

          <div className="bg-[#FEF3C7]/40 border border-[#D97706]/20 rounded-xl p-6">
            <h3 className="text-base font-bold text-[#D97706] mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" /> Important Note
            </h3>
            <p className="text-sm text-[#334155] leading-relaxed">{adm.note}</p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-gradient-to-r from-[#1D4ED8] to-[#7C3AED] rounded-xl p-10 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Begin Your Engineering Journey</h2>
          <p className="text-[#BFDBFE] text-sm mb-6 max-w-md mx-auto">
            Submit your application online and take the first step towards a rewarding engineering career.
          </p>
          <Link
            href="/admission/apply"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-white text-[#1D4ED8] text-sm font-bold hover:bg-[#F1F5F9] transition-colors"
          >
            Apply Online Now →
          </Link>
        </section>
      </div>
    </main>
  );
}
