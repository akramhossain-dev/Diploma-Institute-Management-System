import React from 'react';
import { Badge } from '@/components/ui/badge';

interface PaymentStatusBadgeProps {
  status: 'paid' | 'partial' | 'unpaid' | 'overdue' | string;
  className?: string;
}

export function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
  const normStatus = status.toLowerCase();

  let variant: 'success' | 'warning' | 'destructive' | 'secondary' | 'default' = 'default';
  let label = status;

  if (normStatus === 'paid') {
    variant = 'success';
    label = 'Paid';
  } else if (normStatus === 'partial' || normStatus === 'partially_paid') {
    variant = 'warning';
    label = 'Partial';
  } else if (normStatus === 'unpaid') {
    variant = 'secondary';
    label = 'Unpaid';
  } else if (normStatus === 'overdue') {
    variant = 'destructive';
    label = 'Overdue';
  }

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}
export default PaymentStatusBadge;
