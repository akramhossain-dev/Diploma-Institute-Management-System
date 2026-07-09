import type { Metadata } from 'next';
import React from 'react';
import MRIST from '@/config/mrist.config';

export const metadata: Metadata = {
  title: 'About MRIST',
  description: `Learn about ${MRIST.fullName} — our history, mission, vision, and institutional values.`,
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Banner */}
      <section className="bg-[#0F172A] py-14 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-[#1D4ED8]/20 border border-[#1D4ED8]/30 text-[#93C5FD] text-xs font-semibold px-3 py-1 rounded-full mb-4">
            Established {MRIST.established} · {MRIST.affiliationShort} Affiliated
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">About MRIST</h1>
          <p className="text-[#94A3B8] text-base leading-relaxed max-w-2xl mx-auto">
            {MRIST.about.intro}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 space-y-14">

        {/* Institute Overview */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Institute Overview</h2>
            <div className="space-y-3 text-[#475569] leading-relaxed text-sm">
              <p><strong className="text-foreground">{MRIST.fullName}</strong> ({MRIST.shortName}) is one of the leading polytechnic institutes in Dhaka, Bangladesh. Established in {MRIST.established}, MRIST is fully affiliated with the <strong className="text-foreground">Bangladesh Technical Education Board (BTEB)</strong> under the Ministry of Education, Government of Bangladesh.</p>
              <p>MRIST offers a comprehensive <strong className="text-foreground">4-Year Diploma in Engineering</strong> program across five technologies: Computer Science and Technology (CST), Electrical Technology (ET), Civil Technology (CT), Mechanical Technology (MT), and Automobile Technology (AT).</p>
              <p>The institute is committed to developing skilled engineers, technicians, and entrepreneurs who can contribute meaningfully to Bangladesh's growing technological and industrial landscape.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Established', value: MRIST.established },
              { label: 'Affiliation', value: MRIST.affiliationShort },
              { label: 'Program', value: '4-Year Diploma' },
              { label: 'Departments', value: '5 Technologies' },
              { label: 'Location', value: 'Jatrabari, Dhaka' },
              { label: 'Students', value: '1,000+' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-card border rounded-lg p-4 text-center">
                <div className="text-lg font-bold text-[#1D4ED8]">{value}</div>
                <div className="text-xs text-muted-foreground mt-1">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* History */}
        <section id="history" className="bg-card border rounded-xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <span className="text-[#1D4ED8]">📖</span> History of MRIST
          </h2>
          <p className="text-[#475569] leading-relaxed text-sm">{MRIST.about.history}</p>
        </section>

        {/* Mission & Vision */}
        <section id="mission-vision" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#DBEAFE]/40 border border-[#1D4ED8]/20 rounded-xl p-8">
            <h2 className="text-xl font-bold text-[#1D4ED8] mb-4 flex items-center gap-2">
              <span>🎯</span> Our Mission
            </h2>
            <p className="text-[#334155] leading-relaxed text-sm">{MRIST.about.mission}</p>
          </div>
          <div className="bg-[#EDE9FE]/40 border border-[#7C3AED]/20 rounded-xl p-8">
            <h2 className="text-xl font-bold text-[#7C3AED] mb-4 flex items-center gap-2">
              <span>🌟</span> Our Vision
            </h2>
            <p className="text-[#334155] leading-relaxed text-sm">{MRIST.about.vision}</p>
          </div>
        </section>

        {/* Values */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Institutional Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MRIST.about.values.map((value, i) => (
              <div key={i} className="flex items-center gap-3 bg-card border rounded-lg px-5 py-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#DBEAFE] text-[#1D4ED8] shrink-0">
                  <span className="text-sm font-bold">{i + 1}</span>
                </div>
                <span className="text-sm font-medium text-foreground">{value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Affiliation */}
        <section className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-3">Affiliation & Recognition</h2>
          <p className="text-[#94A3B8] text-sm max-w-xl mx-auto mb-6">
            MRIST is affiliated with the <strong className="text-white">Bangladesh Technical Education Board (BTEB)</strong> under the Ministry of Education, Government of Bangladesh. All diploma programs are nationally recognized and BTEB-approved.
          </p>
          <div className="inline-flex items-center gap-6 flex-wrap justify-center">
            <div className="text-center">
              <div className="text-[#93C5FD] font-bold text-lg">BTEB</div>
              <div className="text-[#64748B] text-xs">Bangladesh Technical Education Board</div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <div className="text-[#93C5FD] font-bold text-lg">MoE</div>
              <div className="text-[#64748B] text-xs">Ministry of Education, Bangladesh</div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-6">
          <h2 className="text-xl font-bold text-foreground mb-3">Ready to Join MRIST?</h2>
          <p className="text-muted-foreground text-sm mb-6">Apply for admission to our 4-Year Diploma in Engineering programs.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/admission"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#1D4ED8] text-white text-sm font-semibold hover:bg-[#1E40AF] transition-colors"
            >
              Apply for Admission
            </a>
            <a
              href="/departments"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border border-border text-sm font-semibold hover:bg-muted transition-colors"
            >
              View Departments
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
