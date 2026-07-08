import React from 'react';

interface AmountDisplayProps {
  amount: number;
  currency?: string;
  className?: string;
}

export function AmountDisplay({ amount, currency = 'BDT', className }: AmountDisplayProps) {
  const formatted = new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return (
    <span className={`font-mono font-semibold ${className}`}>
      {formatted}
    </span>
  );
}
export default AmountDisplay;
