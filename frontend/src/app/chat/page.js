"use client"

import { useSearchParams, useRouter } from 'next/navigation';

export default function ChatPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const classCode = searchParams.get('class');

  return (
    <div>
      <h1>{classCode}</h1>
    </div>
  );
}