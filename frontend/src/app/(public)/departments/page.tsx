import type { Metadata } from 'next';
import React from 'react';
import MRIST from '@/config/mrist.config';

export const metadata: Metadata = {
  title: 'Departments — MRIST',
  description: 'Explore the 5 engineering technologies offered at MRIST: CST, Electrical Technology, Civil Technology, Mechanical Technology, and Automobile Technology.',
};

// Icon map using emoji as fallback (avoids lucide import complexity in server component)
const deptIcons: Record<string, string> = {
  CST: '💻',
  ET:  '⚡',
  CT:  '🏗️',
  MT:  '⚙️',
  AT:  '🚗',
};

export default function DepartmentsPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Banner */}
      <section className="bg-[#0F172A] py-14 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-[#1D4ED8]/20 border border-[#1D4ED8]/30 text-[#93C5FD] text-xs font-semibold px-3 py-1 rounded-full mb-4">
            BTEB Affiliated · 4-Year Diploma in Engineering
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Departments & Technologies</h1>
          <p className="text-[#94A3B8] text-base max-w-2xl mx-auto">
            MRIST offers 5 comprehensive Diploma in Engineering technologies, equipping students with practical skills for today&apos;s industry.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 space-y-12">

        {/* Department Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {MRIST.departments.map((dept) => (
            <div
              key={dept.code}
              className="bg-card border rounded-xl overflow-hidden hover:border-[#1D4ED8]/40 hover:shadow-md transition-all group"
            >
              {/* Card Header */}
              <div className="flex items-start gap-4 p-6 border-b">
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${dept.bgColor} shrink-0 text-2xl`}>
                  {deptIcons[dept.code] || '🎓'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-bold text-foreground">{dept.name}</h2>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${dept.bgColor} ${dept.color}`}>
                      {dept.code}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{dept.shortDesc}</p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                <p className="text-sm text-[#475569] leading-relaxed">{dept.description}</p>

                {/* Key Areas */}
                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Key Learning Areas</div>
                  <div className="flex flex-wrap gap-2">
                    {dept.keyAreas.map((area) => (
                      <span
                        key={area}
                        className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-muted/60 text-foreground border"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Program Info */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-muted/40 rounded-lg p-3 text-center">
                    <div className="text-sm font-bold text-foreground">4 Years</div>
                    <div className="text-xs text-muted-foreground">Duration</div>
                  </div>
                  <div className="bg-muted/40 rounded-lg p-3 text-center">
                    <div className="text-sm font-bold text-foreground">BTEB</div>
                    <div className="text-xs text-muted-foreground">Affiliation</div>
                  </div>
                </div>

                {/* CTA */}
                <a
                  href="/admission"
                  className="mt-2 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-[#1D4ED8]/30 text-[#1D4ED8] text-sm font-semibold hover:bg-[#DBEAFE]/40 transition-colors"
                >
                  Apply for {dept.code} →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Program Info Banner */}
        <section className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-black text-white mb-1">5</div>
              <div className="text-[#93C5FD] text-sm font-medium">Engineering Technologies</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white mb-1">4</div>
              <div className="text-[#93C5FD] text-sm font-medium">Year Diploma Program</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white mb-1">BTEB</div>
              <div className="text-[#93C5FD] text-sm font-medium">Nationally Recognized</div>
            </div>
          </div>
        </section>

        {/* Admission CTA */}
        <section className="text-center py-4">
          <h2 className="text-xl font-bold text-foreground mb-3">Ready to Enroll?</h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
            Choose your technology and apply online. Merit-based admission open for SSC pass students.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/admission"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-[#1D4ED8] text-white text-sm font-semibold hover:bg-[#1E40AF] transition-colors"
            >
              Start Online Admission
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg border border-border text-sm font-semibold hover:bg-muted transition-colors"
            >
              Ask a Question
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
