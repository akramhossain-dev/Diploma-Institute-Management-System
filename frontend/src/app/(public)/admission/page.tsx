import React from 'react';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AdmissionPage() {
  return (
    <PageContainer>
      <SectionHeader
        title="Online Admission Application"
        description="Submit your application for admission to our Diploma in Engineering programs."
      />
      <div className="max-w-2xl mx-auto">
        <Card className="border shadow-md">
          <CardHeader>
            <CardTitle>Admission Application Form</CardTitle>
            <CardDescription>Fill out all required details accurately. Form submissions are verified by administrators.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-foreground">First Name</label>
                <Input placeholder="Enter first name" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-foreground">Last Name</label>
                <Input placeholder="Enter last name" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-foreground">Email Address</label>
              <Input type="email" placeholder="example@domain.com" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-foreground">Phone Number</label>
              <Input placeholder="e.g., +8801700000000" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-foreground">SSC GPA</label>
              <Input type="number" step="0.01" placeholder="e.g. 5.00" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-foreground">Preferred Department</label>
              <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring">
                <option value="">Select program...</option>
                <option value="CST">Computer Science & Technology (CST)</option>
                <option value="ENT">Electronics Technology (ENT)</option>
                <option value="CE">Civil Technology (CE)</option>
                <option value="ME">Mechanical Technology (ME)</option>
              </select>
            </div>
            <Button className="w-full mt-4 font-semibold" disabled>
              Submit Application (F1 Placeholder)
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
