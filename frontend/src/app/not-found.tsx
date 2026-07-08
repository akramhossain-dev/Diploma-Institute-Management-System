import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-10 w-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.042 9.152c.582.448 1.148.89 1.676 1.345m-7.44-3.39a3 3 0 00-5.12 3.08l1.353 3.626a10.9 10.9 0 005.222-5.293L9.5 7.107zm6.757 6.757a3.001 3.001 0 00-3.001-3.001h-2.5v2.5a3.001 3.001 0 003.001 3.001h2.5v-2.5z"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-wider text-primary">404</h1>
          <h2 className="text-2xl font-bold tracking-tight">Page Not Found</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The link you followed may be broken or the URL page has been removed. Check your address.
          </p>
        </div>

        <div className="flex justify-center">
          <Link href="/">
            <Button variant="default">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
