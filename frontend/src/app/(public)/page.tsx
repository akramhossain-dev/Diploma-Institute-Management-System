import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-[70vh]">
      {/* Hero Section */}
      <section className="relative bg-linear-to-r from-primary to-indigo-700 text-white py-20 px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mb-6 leading-tight">
          Diploma Institute Management System
        </h1>
        <p className="text-lg sm:text-xl max-w-2xl text-indigo-100 mb-8">
          An enterprise administration portal designed specifically for Diploma Institutes, structuring academic modules, attendance tracking, exams, and financials.
        </p>
        <div className="flex gap-4">
          <Link href="/login">
            <Button size="lg" className="bg-white text-primary hover:bg-indigo-50 font-semibold shadow-md">
              Go to Portal Login
            </Button>
          </Link>
          <Link href="/admission">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold">
              Apply for Admission
            </Button>
          </Link>
        </div>
      </section>

      {/* Info Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <div className="rounded-full bg-primary/10 text-primary h-12 w-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84a50.58 50.58 0 00-2.657.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Academics</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Define departments, semesters, theory and practical courses, and structure class batches seamlessly.
            </p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <div className="rounded-full bg-primary/10 text-primary h-12 w-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Tracking & Grades</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Track daily student attendance session-by-session, enter exam marks, and publish grades transparently.
            </p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <div className="rounded-full bg-primary/10 text-primary h-12 w-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.214.19A3.64 3.64 0 0012 16.5c2.185 0 3.963-1.662 3.963-3.712 0-2.05-1.778-3.712-3.963-3.712-.132 0-.263.007-.393.02a4.011 4.011 0 01-1.895-.772L9.5 8.182m0 9a3 3 0 01-3-3V12M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Financial Records</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Manage student fee ledgers, process partial payments, and pull structured financial collections reports.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
