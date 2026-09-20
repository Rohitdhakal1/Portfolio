import React from 'react';
import { VisitorCard } from '../components/onboarding/VisitorCard';

export default function OnboardingPage() {
  // In a real app we'd fetch these from the backend or context.
  // We'll mock the nextNumber for now.
  const nextNumber = 42;
  const startColor = 'pink';

  return (
    <main
      className="
        relative
        min-h-dvh
        overflow-hidden
        bg-[var(--color-bg)]
        text-[var(--color-ink)]
      "
    >
      <VisitorCard nextNumber={nextNumber} startColor={startColor} />
    </main>
  );
}
