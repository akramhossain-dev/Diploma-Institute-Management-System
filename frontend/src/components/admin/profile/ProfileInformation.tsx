import React from 'react';

interface ProfileInformationProps {
  label: string;
  value?: string | number | null;
}

export function ProfileInformation({ label, value }: ProfileInformationProps) {
  return (
    <div className="space-y-1">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block">
        {label}
      </span>
      <span className="text-sm font-bold text-foreground leading-relaxed block truncate">
        {value !== undefined && value !== null && value !== '' ? value : '-'}
      </span>
    </div>
  );
}
export default ProfileInformation;
