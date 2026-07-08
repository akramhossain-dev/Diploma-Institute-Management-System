import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  // Let nested pages determine title/description via layout wrapper
  return <div className="min-h-screen bg-background">{children}</div>;
}
