import type { Metadata } from 'next';
import React from 'react';
import MRIST from '@/config/mrist.config';

export const metadata: Metadata = {
  title: 'At a Glance — MRIST',
  description: `Quick facts and overview of ${MRIST.fullName}. Established ${MRIST.established}, affiliated with ${MRIST.affiliationShort}.`,
};

export default function AtAGlancePage() {
  const g = MRIST.atAGlance;

  return (
    <main className="min-h-screen">
      {/* Hero Banner */}
      <section className="bg-[#0F172A] py-14 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-[#1D4ED8]/20 border border-[#1D4ED8]/30 text-[#93C5FD] text-xs font-semibold px-3 py-1 rounded-full mb-4">
            MRIST At a Glance
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Institute At a Glance</h1>
          <p className="text-[#94A3B8] text-base max-w-2xl mx-auto">
            Key facts, facilities, and highlights of Dr. Mahbubur Rahman Mollah Institute of Science and Technology.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 space-y-14">

        {/* Quick Stats Grid */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Quick Facts</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { icon: '🏛️', label: 'Institute Name', value: MRIST.shortName },
              { icon: '📅', label: 'Established', value: g.established },
              { icon: '🎓', label: 'Affiliation', value: g.affiliation },
              { icon: '📚', label: 'Programs', value: g.programs },
              { icon: '🏫', label: 'Departments', value: `${g.departments} Technologies` },
              { icon: '👥', label: 'Total Students', value: g.totalStudents },
              { icon: '👨‍🏫', label: 'Faculty Members', value: g.totalFaculty },
              { icon: '🏠', label: 'Classrooms', value: g.classrooms },
            ].map(({ icon, label, value }) => (
              <div key={label} className="bg-card border rounded-xl p-5 text-center hover:border-[#1D4ED8]/40 transition-colors">
                <div className="text-2xl mb-2">{icon}</div>
                <div className="text-[15px] font-bold text-foreground">{value}</div>
                <div className="text-xs text-muted-foreground mt-1">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Departments / Technologies */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Diploma Technologies Offered</h2>
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-[#F8FAFC] border-b">
                <tr>
                  <th className="px-5 py-3 text-left font-semibold text-foreground">Technology</th>
                  <th className="px-5 py-3 text-left font-semibold text-foreground">Code</th>
                  <th className="px-5 py-3 text-left font-semibold text-foreground">Duration</th>
                  <th className="px-5 py-3 text-left font-semibold text-foreground">Affiliation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {MRIST.departments.map((dept) => (
                  <tr key={dept.code} className="hover:bg-muted/40 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-foreground">{dept.name}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#DBEAFE] text-[#1D4ED8]">
                        {dept.code}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">4 Years</td>
                    <td className="px-5 py-3.5 text-muted-foreground">BTEB</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Facilities */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Campus Facilities</h2>
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-[#F8FAFC] border-b">
                <tr>
                  <th className="px-5 py-3 text-left font-semibold text-foreground">Facility</th>
                  <th className="px-5 py-3 text-left font-semibold text-foreground">Details</th>
                  <th className="px-5 py-3 text-left font-semibold text-foreground">Available</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { name: 'Engineering Laboratories', detail: `${g.labs} equipped labs across all departments`, available: true },
                  { name: 'Classrooms', detail: `${g.classrooms} modern classrooms`, available: true },
                  { name: 'Central Library', detail: 'Technical books, journals, digital resources', available: g.library },
                  { name: 'Computer / Digital Lab', detail: 'High-speed internet, modern workstations', available: g.digitalLab },
                  { name: 'Seminar Hall', detail: `${g.seminarHall} seminar hall`, available: true },
                  { name: 'Conference Hall', detail: `${g.conferenceHall} conference hall`, available: true },
                  { name: 'Institute Bus', detail: 'Daily transport for students and staff', available: g.institutesBus },
                  { name: 'Canteen', detail: 'Healthy meals at affordable prices', available: g.canteen },
                ].map(({ name, detail, available }) => (
                  <tr key={name} className="hover:bg-muted/40 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-foreground">{name}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{detail}</td>
                    <td className="px-5 py-3.5">
                      {available ? (
                        <span className="inline-flex items-center gap-1.5 text-[#059669] font-medium text-xs">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
                          Available
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Clubs */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Student Clubs & Activities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {g.clubs.map((club) => (
              <div
                key={club}
                className="bg-card border rounded-lg px-4 py-3 text-center text-sm font-medium text-foreground hover:border-[#1D4ED8]/40 hover:bg-[#DBEAFE]/20 transition-all"
              >
                {club}
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-[#1D4ED8] to-[#1E40AF] rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Start Your Journey at MRIST</h2>
          <p className="text-[#BFDBFE] text-sm mb-6 max-w-md mx-auto">
            Join hundreds of students who are building their careers at one of Dhaka&apos;s best polytechnic institutes.
          </p>
          <a
            href="/admission"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-white text-[#1D4ED8] text-sm font-bold hover:bg-[#F1F5F9] transition-colors"
          >
            Apply for Admission
          </a>
        </section>
      </div>
    </main>
  );
}
