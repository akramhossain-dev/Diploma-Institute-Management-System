'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProfileHeaderProps {
  fullName: string;
  role: string;
  idLabel: string;
  idValue: string;
  status: 'active' | 'inactive' | 'suspended';
  photoUrl?: string;
}

export function ProfileHeader({
  fullName,
  role,
  idLabel,
  idValue,
  status,
  photoUrl,
}: ProfileHeaderProps) {
  return (
    <Card className="border shadow-xs overflow-hidden bg-card text-card-foreground">
      <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
        {}
        <div className="h-24 w-24 rounded-full border bg-muted flex items-center justify-center overflow-hidden shrink-0">
          {photoUrl ? (
            <img src={photoUrl} alt={fullName} className="h-full w-full object-cover" />
          ) : (
            <span className="text-3xl font-extrabold text-muted-foreground uppercase">
              {fullName.substring(0, 2)}
            </span>
          )}
        </div>

        {}
        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">{fullName}</h2>
            <Badge className="w-fit self-center sm:self-auto capitalize text-white font-bold" variant="default">
              {role}
            </Badge>
            <Badge
              className={cn('w-fit self-center sm:self-auto capitalize text-white font-bold ml-1', {
                'bg-emerald-500': status === 'active',
                'bg-amber-500': status === 'inactive',
                'bg-destructive': status === 'suspended',
              })}
            >
              {status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground font-semibold">
            {idLabel}: <span className="text-foreground font-bold">{idValue}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
export default ProfileHeader;
