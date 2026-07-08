'use client';

import React from 'react';
import Link from 'next/link';
import { publicNavigation } from '@/constants/navigation/public-navigation';
import { LucideIcon } from '../shared/navigation/LucideIcon';

export function PublicFooter() {
  return (
    <footer className="border-t bg-card text-card-foreground py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-extrabold tracking-wider text-primary">DIMS</span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Enterprise Resource Planning and Academic Management platform optimized for Technical and Engineering Diploma Institutes.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <LucideIcon name="Facebook" size={18} />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <LucideIcon name="Twitter" size={18} />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <LucideIcon name="Linkedin" size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div>
          <h4 className="text-md font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {publicNavigation.map((item) => (
              <li key={item.route}>
                <Link href={item.route} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/admission/status" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Check Admission Status
              </Link>
            </li>
          </ul>
        </div>

        {/* Portals Access Column */}
        <div>
          <h4 className="text-md font-bold mb-4">Portals Select</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/login/admin" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Administration Workspace
              </Link>
            </li>
            <li>
              <Link href="/login/teacher" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Faculty Workspace
              </Link>
            </li>
            <li>
              <Link href="/login/student" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Student Workspace
              </Link>
            </li>
            <li>
              <Link href="/login/accountant" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Finance Workspace
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info Column */}
        <div className="space-y-3">
          <h4 className="text-md font-bold mb-4">Contact Info</h4>
          <div className="flex items-start space-x-3 text-sm text-muted-foreground">
            <LucideIcon name="MapPin" size={18} className="shrink-0 text-primary mt-0.5" />
            <span>12/A Academic Avenue, Dhaka, Bangladesh</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
            <LucideIcon name="Phone" size={18} className="shrink-0 text-primary" />
            <span>+8802-99887766</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
            <LucideIcon name="Mail" size={18} className="shrink-0 text-primary" />
            <span>info@ndi.edu.bd</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Diploma Institute Management System (DIMS). All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
export default PublicFooter;
