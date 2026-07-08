import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
}

export function ProfileSection({ title, children }: ProfileSectionProps) {
  return (
    <Card className="border shadow-xs bg-card text-card-foreground">
      <CardHeader className="border-b py-4">
        <CardTitle className="text-sm font-bold tracking-wide uppercase text-primary">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
export default ProfileSection;
