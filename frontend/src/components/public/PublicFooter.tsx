'use client';

import React from 'react';
import Link from 'next/link';
import { LucideIcon } from '../shared/navigation/LucideIcon';
import MRIST from '@/config/mrist.config';

export function PublicFooter() {
  return (
    <footer className="bg-[#0F172A] text-[#94A3B8]">
      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#1D4ED8]/60 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1D4ED8] shadow-[0_0_12px_rgba(29,78,216,0.35)]">
                <span className="text-[12px] font-black text-white">M</span>
              </div>
              <span className="text-[17px] font-bold text-white tracking-tight">MRIST</span>
            </Link>
            <p className="text-sm leading-relaxed text-[#64748B] max-w-[240px]">
              {MRIST.fullName}. Affiliated with {MRIST.affiliationShort}, Dhaka, Bangladesh.
            </p>
            <div className="flex gap-3">
              <a
                href={MRIST.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#64748B] hover:bg-[#1D4ED8]/20 hover:text-[#93C5FD] transition-all"
              >
                <LucideIcon name="Facebook" size={15} />
              </a>
              <a
                href={MRIST.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#64748B] hover:bg-[#1D4ED8]/20 hover:text-[#93C5FD] transition-all"
              >
                <LucideIcon name="Youtube" size={15} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', href: '/' },
                { label: 'About MRIST', href: '/about' },
                { label: 'At a Glance', href: '/at-a-glance' },
                { label: 'Departments', href: '/departments' },
                { label: 'Notices', href: '/notices' },
                { label: 'Admission', href: '/admission' },
                { label: 'Contact', href: '/contact' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-[#64748B] hover:text-[#93C5FD] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Portal Access */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Portal Access</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Student Portal', href: '/login/student' },
                { label: 'Faculty Portal', href: '/login/teacher' },
                { label: 'Admin Portal', href: '/login/admin' },
                { label: 'Accounts Portal', href: '/login/accountant' },
                { label: 'Check Admission Status', href: '/admission/status' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#64748B] hover:text-[#93C5FD] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-sm font-semibold text-white mt-6 mb-4">Important Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'BTEB Official Site', href: 'https://bteb.gov.bd', external: true },
                { label: 'Ministry of Education', href: 'https://moedu.gov.bd', external: true },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#64748B] hover:text-[#93C5FD] transition-colors flex items-center gap-1"
                  >
                    {link.label}
                    <LucideIcon name="ExternalLink" size={11} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Contact Info</h4>
            <div className="space-y-3">
              {[
                { icon: 'MapPin', text: MRIST.contact.addressShort },
                { icon: 'Phone', text: MRIST.contact.phone },
                { icon: 'Mail', text: MRIST.contact.email },
                { icon: 'Globe', text: 'mrist.edu.bd' },
                { icon: 'Clock', text: 'Sun–Thu: 8 AM – 5 PM' },
              ].map(({ icon, text }) => (
                <div key={icon} className="flex items-start gap-2.5 text-sm text-[#64748B]">
                  <LucideIcon name={icon} size={14} className="mt-0.5 shrink-0 text-[#1D4ED8]" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#475569]">
          <p>
            &copy; {new Date().getFullYear()} {MRIST.shortName} — {MRIST.fullName}. All rights reserved.
          </p>
          <div className="flex gap-4 items-center">
            <span className="text-[#334155]">Affiliated with</span>
            <a
              href="https://bteb.gov.bd"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#93C5FD] transition-colors font-medium"
            >
              BTEB
            </a>
            <span className="text-[#334155]">·</span>
            <a href="#" className="hover:text-[#93C5FD] transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default PublicFooter;
