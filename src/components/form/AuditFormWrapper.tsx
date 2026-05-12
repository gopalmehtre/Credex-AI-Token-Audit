'use client';
import dynamic from 'next/dynamic';

const AuditForm = dynamic(() => import('@/components/form/AuditForm'), {
  ssr: false,
});

export default function AuditFormWrapper() {
  return <AuditForm />;
}
