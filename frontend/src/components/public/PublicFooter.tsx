'use client';

import React from 'react';
import Link from 'next/link';
import { publicNavigation } from '@/constants/navigation/public-navigation';
import { LucideIcon } from '../shared/navigation/LucideIcon';

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
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1D4ED8] shadow-[0_0_12px_rgba(29,78,216,0.35)]">
                <span className="text-[11px] font-black text-white">D</span>
              </div>
              <span className="text-[16px] font-bold text-white tracking-tight">DIMS</span>
            </Link>
            <p className="text-sm leading-relaxed text-[#64748B] max-w-[220px]">
              Enterprise Resource Planning and Academic Management for Technical Diploma Institutes.
            </p>
            <div className="flex gap-3">
              {(['Facebook', 'Twitter', 'Linkedin'] as const).map((icon) => (
                <a
                  key={icon}
                  href="#"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#64748B] hover:bg-[#1D4ED8]/20 hover:text-[#93C5FD] transition-all"
                >
                  <LucideIcon name={icon} size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {publicNavigation.map((item) => (
                <li key={item.route}>
                  <Link
                    href={item.route}
                    className="text-sm text-[#64748B] hover:text-[#93C5FD] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/admission/status" className="text-sm text-[#64748B] hover:text-[#93C5FD] transition-colors">
                  Check Admission Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Portal Access */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Portal Access</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Administration', href: '/login/admin' },
                { label: 'Faculty', href: '/login/teacher' },
                { label: 'Student', href: '/login/student' },
                { label: 'Finance & Accounts', href: '/login/accountant' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#64748B] hover:text-[#93C5FD] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Contact Info</h4>
            <div className="space-y-3">
              {[
                { icon: 'MapPin', text: '12/A Academic Avenue, Dhaka, Bangladesh' },
                { icon: 'Phone', text: '+8802-99887766' },
                { icon: 'Mail', text: 'info@ndi.edu.bd' },
                { icon: 'Clock', text: 'Mon–Fri: 8 AM – 5 PM' },
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
          <p>&copy; {new Date().getFullYear()} Diploma Institute Management System (DIMS). All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-[#93C5FD] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#93C5FD] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default PublicFooter;
