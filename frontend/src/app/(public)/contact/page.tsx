import type { Metadata } from 'next';
import React from 'react';
import { MapPin, Phone, Mail, Globe, Clock, Megaphone, Map } from 'lucide-react';
import MRIST from '@/config/mrist.config';

export const metadata: Metadata = {
  title: 'Contact MRIST',
  description: `Contact ${MRIST.shortName} — Address: ${MRIST.contact.addressShort}. Phone: ${MRIST.contact.phone}. Email: ${MRIST.contact.email}.`,
};

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      {}
      <section className="bg-[#0F172A] py-14 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Contact MRIST</h1>
          <p className="text-[#94A3B8] text-base max-w-xl mx-auto">
            We&apos;re here to help. Reach out to us for admissions, academic queries, or general information.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Get in Touch</h2>
              <div className="space-y-4">
                {[
                  {
                    icon: <MapPin className="h-5 w-5 text-[#1D4ED8]" />,
                    label: 'Campus Address',
                    value: MRIST.contact.address,
                  },
                  {
                    icon: <Phone className="h-5 w-5 text-[#1D4ED8]" />,
                    label: 'Phone',
                    value: `${MRIST.contact.phone}\n${MRIST.contact.phone2}`,
                  },
                  {
                    icon: <Mail className="h-5 w-5 text-[#1D4ED8]" />,
                    label: 'Email',
                    value: MRIST.contact.email,
                  },
                  {
                    icon: <Globe className="h-5 w-5 text-[#1D4ED8]" />,
                    label: 'Website',
                    value: 'mrist.edu.bd',
                  },
                  {
                    icon: <Clock className="h-5 w-5 text-[#1D4ED8]" />,
                    label: 'Office Hours',
                    value: 'Sunday – Thursday: 8:00 AM – 5:00 PM',
                  },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4 bg-card border rounded-xl p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#DBEAFE]/50 text-center shrink-0">{icon}</div>
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{label}</div>
                      <div className="text-sm font-medium text-foreground whitespace-pre-line">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {}
            <div className="bg-[#DBEAFE]/40 border border-[#1D4ED8]/20 rounded-xl p-6">
              <h3 className="text-base font-bold text-[#1D4ED8] mb-2 flex items-center gap-2">
                <Megaphone className="h-5 w-5 shrink-0" /> Admission Helpline
              </h3>
              <p className="text-sm text-[#334155]">
                For admission-related queries, call our helpline or email{' '}
                <a href={`mailto:${MRIST.contact.admissionEmail}`} className="text-[#1D4ED8] font-medium underline">
                  {MRIST.contact.admissionEmail}
                </a>
              </p>
              <p className="text-sm font-semibold text-foreground mt-2">{MRIST.contact.phone}</p>
              <p className="text-xs text-muted-foreground">Available: 9 AM – 5 PM, Sun–Thu</p>
            </div>

            {}
            <div className="bg-card border rounded-xl p-5 space-y-3">
              <h3 className="text-base font-bold text-foreground">Follow Us</h3>
              <div className="flex gap-3">
                <a
                  href={MRIST.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1877F2]/10 text-[#1877F2] text-sm font-medium hover:bg-[#1877F2]/20 transition-colors"
                >
                  <span>Facebook</span>
                </a>
                <a
                  href={MRIST.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FF0000]/10 text-[#FF0000] text-sm font-medium hover:bg-[#FF0000]/20 transition-colors"
                >
                  <span>YouTube</span>
                </a>
              </div>
            </div>
          </div>

          {}
          <div className="space-y-6">
            {}
            <div className="rounded-xl overflow-hidden border h-[320px] bg-[#F1F5F9] flex items-center justify-center">
              <div className="text-center text-muted-foreground p-6">
                <Map className="h-10 w-10 text-muted-foreground/70 mx-auto mb-3" />
                <p className="text-sm font-medium">Matuail, Demra Road, Jatrabari, Dhaka-1362</p>
                <p className="text-xs mt-1">
                  <a
                    href="https://maps.google.com/?q=Jatrabari,Dhaka,Bangladesh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1D4ED8] underline"
                  >
                    Open in Google Maps
                  </a>
                </p>
              </div>
            </div>

            {}
            <div className="bg-card border rounded-xl p-6 space-y-4">
              <h3 className="text-base font-bold text-foreground">Send a Message</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Your Name</label>
                  <input
                    type="text"
                    placeholder="Full name"
                    className="w-full px-3 py-2.5 rounded-lg border border-border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email Address</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-3 py-2.5 rounded-lg border border-border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8]"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Subject</label>
                <input
                  type="text"
                  placeholder="How can we help?"
                  className="w-full px-3 py-2.5 rounded-lg border border-border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Message</label>
                <textarea
                  rows={4}
                  placeholder="Write your message..."
                  className="w-full px-3 py-2.5 rounded-lg border border-border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 focus:border-[#1D4ED8] resize-none"
                />
              </div>
              <button
                type="button"
                className="w-full py-2.5 px-4 rounded-lg bg-[#1D4ED8] text-white text-sm font-semibold hover:bg-[#1E40AF] transition-colors"
              >
                Send Message
              </button>
              <p className="text-xs text-muted-foreground text-center">We typically respond within 1–2 business days.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
