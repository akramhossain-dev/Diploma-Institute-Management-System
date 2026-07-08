'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PublicContainer } from '@/components/public/PublicContainer';
import { PublicSection } from '@/components/public/PublicSection';
import { useDepartments } from '@/hooks/public/useDepartments';
import { useNotices } from '@/hooks/public/useNotices';
import { LucideIcon } from '@/components/shared/navigation/LucideIcon';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const { data: departments = [], isLoading: deptsLoading } = useDepartments();
  const { data: noticesData, isLoading: noticesLoading } = useNotices({ page: 1, limit: 3 });
  
  const notices = noticesData?.data || [];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-linear-to-r from-primary to-indigo-700 text-primary-foreground py-24 sm:py-32 border-b">
        <PublicContainer className="text-center flex flex-col items-center justify-center">
          <Badge className="bg-white/10 text-white border-white/20 mb-4 px-3 py-1">
            Now Accepting Applications
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mb-6 leading-tight">
            National Engineering Diploma Institute
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl text-indigo-100 mb-8 leading-relaxed">
            Elevating professional vocational capabilities with structured semesters, advanced laboratories practice, and industry-aligned technical skillsets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/admission" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-white text-primary hover:bg-indigo-50 font-bold shadow-md">
                Apply for Admission
              </Button>
            </Link>
            <Link href="/admission/status" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full border-white text-white hover:bg-white/10 font-semibold">
                Track Application
              </Button>
            </Link>
          </div>
        </PublicContainer>
      </section>

      {/* Programs Preview Section */}
      <PublicSection bg="default">
        <PublicContainer>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight">Our Diploma Programs</h2>
            <p className="text-muted-foreground text-sm mt-2">
              4-year Diploma in Engineering qualifications accredited by the Technical Education Board.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {deptsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="border shadow-xs">
                  <CardContent className="pt-6 space-y-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : departments.length > 0 ? (
              departments.slice(0, 3).map((dept) => (
                <Card key={dept._id} className="border shadow-xs hover:shadow-md transition-all">
                  <CardContent className="pt-6 space-y-4">
                    <div className="rounded-full bg-primary/10 text-primary h-12 w-12 flex items-center justify-center">
                      <LucideIcon name="Cpu" size={24} />
                    </div>
                    <h3 className="text-xl font-bold">{dept.name}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{dept.description}</p>
                    <Link href="/departments" className="inline-flex items-center text-sm font-semibold text-primary hover:underline">
                      View Curriculum
                      <LucideIcon name="ArrowRight" size={14} className="ml-1" />
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center text-muted-foreground">No programs found.</div>
            )}
          </div>
        </PublicContainer>
      </PublicSection>

      {/* Latest Notices Preview */}
      <PublicSection bg="muted">
        <PublicContainer>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-5 mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">Latest Announcements</h2>
              <p className="text-muted-foreground text-sm mt-1">Keep updated with recent circulars from the academic board.</p>
            </div>
            <Link href="/notices">
              <Button variant="outline" size="sm">
                View All Circulars
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {noticesLoading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <Card key={i} className="border shadow-xs">
                  <CardContent className="pt-6 space-y-3">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-14 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : notices.length > 0 ? (
              notices.map((notice) => (
                <Card key={notice._id} className="border shadow-xs hover:border-primary/30 transition-all">
                  <CardContent className="pt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="capitalize text-xs">
                          {notice.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{notice.publishDate}</span>
                      </div>
                      <h3 className="text-lg font-bold text-foreground hover:text-primary transition-colors">
                        {notice.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 max-w-4xl">{notice.content}</p>
                    </div>
                    <Link href="/notices" className="shrink-0">
                      <Button size="sm" variant="ghost">Read Notice</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">No notices available.</div>
            )}
          </div>
        </PublicContainer>
      </PublicSection>

      {/* Contact highlight section */}
      <PublicSection bg="default">
        <PublicContainer className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold tracking-tight">Need Assistance?</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions regarding admission requirements, credentials submission, or payment procedures, feel free to visit our campus or contact our help desk directly.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <LucideIcon name="Phone" className="text-primary" />
                <span>+8802-99887766 (Help Desk: 9 AM - 5 PM)</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <LucideIcon name="Mail" className="text-primary" />
                <span>admission@ndi.edu.bd</span>
              </div>
            </div>
            <Link href="/contact">
              <Button>Send Message</Button>
            </Link>
          </div>
          <div className="h-64 border bg-muted/40 rounded-lg flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
            <LucideIcon name="Map" size={40} className="mb-3 text-primary" />
            <span className="font-semibold block text-foreground">Campus Location Map</span>
            <span className="text-xs mt-1">12/A Academic Avenue, Dhaka, Bangladesh</span>
          </div>
        </PublicContainer>
      </PublicSection>
    </div>
  );
}
