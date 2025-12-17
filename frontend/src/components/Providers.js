"use client";

import { UnreadProvider } from './UnreadContext';

export function Providers({ children }) {
  return (
    <UnreadProvider>
      {children}
    </UnreadProvider>
  );
}
