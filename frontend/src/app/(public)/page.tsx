'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PublicContainer } from '@/components/public/PublicContainer';
import { PublicSection } from '@/components/public/PublicSection';
import { useDepartments } from '@/hooks/public/useDepartments';
import { useNotices } from '@/hooks/public/useNotices';
import { LucideIcon } from '@/components/shared/navigation/LucideIcon';
import { Skeleton } from '@/components/ui/skeleton';
import MRIST from '@/config/mrist.config';

export default function HomePage() {
  const { data: departments = [], isLoading: deptsLoading } = useDepartments();
  const { data: noticesData, isLoading: noticesLoading } = useNotices({ page: 1, limit: 3 });
  const notices = noticesData?.data || [];

  return (
    <div className="flex flex-col">

      {/* ── AURORA HERO ─────────────────────────────────────────────────── */}
      <section className="aurora-hero py-24 sm:py-32 border-b border-border/60">
        <PublicContainer className="flex flex-col items-center text-center gap-8">
          {/* Eyebrow badge */}
          <Badge variant="soft-primary" className="px-4 py-1.5 text-[12px] font-semibold rounded-full shadow-sm animate-fade-in flex items-center gap-1.5">
            <LucideIcon name="GraduationCap" size={14} />
            Now Accepting Applications — Session 2025–26
          </Badge>

          {/* Hero title */}
          <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-extrabold tracking-tight text-[#0F172A] max-w-4xl leading-[1.1] animate-fade-in-up stagger-1">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-[#1D4ED8] via-[#6366F1] to-[#06B6D4] bg-clip-text text-transparent">
              MRIST
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-[#64748B] max-w-2xl leading-relaxed animate-fade-in-up stagger-2">
            {MRIST.about.intro}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up stagger-3">
            <Link href="/admission">
              <Button size="lg" className="px-8 font-bold shadow-[0_4px_14px_rgba(29,78,216,0.3)] hover:shadow-[0_6px_20px_rgba(29,78,216,0.4)]">
                Apply for Admission
                <LucideIcon name="ArrowRight" size={16} />
              </Button>
            </Link>
            <Link href="/admission/status">
              <Button size="lg" variant="outline" className="px-8 font-semibold">
                Track Application
              </Button>
            </Link>
          </div>

          {/* Hero stat cards — subtle glass treatment */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl animate-fade-in-up stagger-4">
            {[
              { label: 'Students Enrolled', value: MRIST.atAGlance.totalStudents, icon: 'Users', color: 'text-[#1D4ED8]', bg: 'bg-[#DBEAFE]' },
              { label: 'Faculty Members', value: MRIST.atAGlance.totalFaculty, icon: 'GraduationCap', color: 'text-[#059669]', bg: 'bg-[#D1FAE5]' },
              { label: 'Technologies', value: `${MRIST.atAGlance.departments}`, icon: 'BookOpen', color: 'text-[#7C3AED]', bg: 'bg-[#EDE9FE]' },
            ].map((stat) => (
              <div key={stat.label} className="glass-card rounded-2xl p-5 flex items-center gap-4 text-left">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
                  <LucideIcon name={stat.icon} size={20} />
                </div>
                <div>
                  <div className="text-[22px] font-bold text-[#0F172A] leading-tight">{stat.value}</div>
                  <div className="text-[12px] text-[#64748B]">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </PublicContainer>
      </section>

      {/* ── PROGRAMS ────────────────────────────────────────────────────── */}
      <PublicSection bg="default">
        <PublicContainer>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="soft-primary" className="mb-3">Our Technologies</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
              Diploma Engineering Technologies
            </h2>
            <p className="text-[#64748B] text-base mt-3 leading-relaxed">
              MRIST offers 5 specialized 4-Year Diploma in Engineering technologies, fully affiliated with BTEB.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {deptsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-6 space-y-4">
                  <Skeleton className="h-11 w-11 rounded-xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))
            ) : departments.length > 0 ? (
              departments.slice(0, 3).map((dept, i) => (
                <div
                  key={dept._id}
                  className="group rounded-2xl border border-border bg-card p-6 space-y-4 hover:shadow-[0_8px_24px_rgba(29,78,216,0.08)] hover:border-[#BFDBFE] transition-all duration-200 animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="rounded-xl bg-[#DBEAFE] text-[#1D4ED8] h-11 w-11 flex items-center justify-center">
                    <LucideIcon name="Cpu" size={22} />
                  </div>
                  <h3 className="text-[18px] font-bold text-[#0F172A]">{dept.name}</h3>
                  <p className="text-[#64748B] text-sm leading-relaxed line-clamp-3">{dept.description}</p>
                  <Link
                    href="/departments"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[#1D4ED8] hover:gap-2 transition-all"
                  >
                    View Curriculum
                    <LucideIcon name="ArrowRight" size={13} />
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center text-muted-foreground py-12">No programs found.</div>
            )}
          </div>
        </PublicContainer>
      </PublicSection>

      {/* ── LATEST NOTICES ──────────────────────────────────────────────── */}
      <PublicSection bg="muted">
        <PublicContainer>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
            <div>
              <Badge variant="soft-primary" className="mb-2">Latest Updates</Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
                Announcements & Circulars
              </h2>
              <p className="text-[#64748B] text-sm mt-1">Keep updated with recent circulars from the academic board.</p>
            </div>
            <Link href="/notices" className="shrink-0">
              <Button variant="outline" size="sm" className="font-semibold">
                View All
                <LucideIcon name="ChevronRight" size={14} />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {noticesLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))
            ) : notices.length > 0 ? (
              notices.map((notice, i) => (
                <div
                  key={notice._id}
                  className="group rounded-xl border border-border bg-card p-5 hover:border-[#BFDBFE] hover:shadow-[0_4px_12px_rgba(29,78,216,0.06)] transition-all duration-200 animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-[#DBEAFE] text-[#1D4ED8] px-2.5 py-0.5 text-[11px] font-semibold capitalize">
                          {notice.category}
                        </span>
                        <span className="text-xs text-[#94A3B8]">{notice.publishDate}</span>
                      </div>
                      <h3 className="text-[15px] font-semibold text-[#0F172A] group-hover:text-[#1D4ED8] transition-colors leading-snug">
                        {notice.title}
                      </h3>
                      <p className="text-sm text-[#64748B] line-clamp-2 max-w-3xl leading-relaxed">{notice.content}</p>
                    </div>
                    <Link href="/notices" className="shrink-0">
                      <Button size="sm" variant="ghost" className="font-semibold text-[#1D4ED8] hover:bg-[#DBEAFE]">
                        Read
                        <LucideIcon name="ArrowRight" size={13} />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-12 rounded-xl border border-border bg-card">
                No notices available.
              </div>
            )}
          </div>
        </PublicContainer>
      </PublicSection>

      {/* ── WHY DIMS / FEATURES ─────────────────────────────────────────── */}
      <PublicSection bg="default">
        <PublicContainer>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="soft-primary" className="mb-3">Why Choose MRIST</Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#0F172A]">
              Why Choose MRIST?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MRIST.whyChoose.map(({ title, desc }, i) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-card p-6 hover:shadow-[0_8px_24px_rgba(29,78,216,0.06)] hover:border-[#BFDBFE] transition-all duration-200 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DBEAFE] text-[#1D4ED8] mb-4">
                  <LucideIcon name="CheckCircle" size={20} />
                </div>
                <h3 className="text-[15px] font-bold text-[#0F172A] mb-1.5">{title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </PublicContainer>
      </PublicSection>

      {/* ── ADMISSION CTA ────────────────────────────────────────────────── */}
      <section className="aurora-section py-20 border-y border-border">
        <PublicContainer className="flex flex-col items-center text-center gap-6">
          <Badge variant="soft-primary">Open Enrollment</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A] max-w-2xl leading-snug">
            Ready to Start Your Engineering Journey at MRIST?
          </h2>
          <p className="text-[#64748B] text-base max-w-xl leading-relaxed">
            Join hundreds of students who chose MRIST for a structured, industry-aligned diploma engineering education affiliated with BTEB.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/admission">
              <Button size="lg" className="px-8 font-bold shadow-[0_4px_14px_rgba(29,78,216,0.25)]">
                Start Application
                <LucideIcon name="ArrowRight" size={16} />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="px-8 font-semibold">
                Learn More
              </Button>
            </Link>
          </div>
        </PublicContainer>
      </section>

      {/* ── CONTACT HIGHLIGHT ────────────────────────────────────────────── */}
      <PublicSection bg="default">
        <PublicContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <Badge variant="soft-primary">Get in Touch</Badge>
              <h2 className="text-3xl font-extrabold tracking-tight text-[#0F172A]">
                Need Assistance?
              </h2>
              <p className="text-[#64748B] leading-relaxed text-base">
                Questions about admission requirements, credentials, or payment procedures? Visit our campus or contact our help desk.
              </p>
              <div className="space-y-3">
                {[
                  { icon: 'Phone', text: `${MRIST.contact.phone} (9 AM – 5 PM)` },
                  { icon: 'Mail', text: MRIST.contact.admissionEmail },
                  { icon: 'MapPin', text: MRIST.contact.addressShort },
                ].map(({ icon, text }) => (
                  <div key={icon} className="flex items-center gap-3 text-sm text-[#64748B]">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#DBEAFE] text-[#1D4ED8] shrink-0">
                      <LucideIcon name={icon} size={15} />
                    </div>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
              <Link href="/contact">
                <Button className="font-semibold mt-2">
                  Send a Message
                  <LucideIcon name="ArrowRight" size={14} />
                </Button>
              </Link>
            </div>
            <div className="h-64 border border-border bg-[#F8FAFC] rounded-2xl flex flex-col items-center justify-center text-muted-foreground gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DBEAFE] text-[#1D4ED8]">
                <LucideIcon name="Map" size={28} />
              </div>
              <span className="font-semibold text-foreground text-sm">Campus Location</span>
              <span className="text-xs text-muted-foreground">Matuail, Jatrabari, Dhaka-1362</span>
              <a href="/contact" className="text-xs text-[#1D4ED8] underline">View Full Contact Info →</a>
            </div>
          </div>
        </PublicContainer>
      </PublicSection>
    </div>
  );
}
