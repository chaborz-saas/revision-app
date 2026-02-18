'use client';

import { ReactNode } from 'react';
import Sidebar from '@/components/ui/Sidebar';
import { ToastProvider } from '@/components/ui/Toast';
import ChatPanel from '@/components/ChatPanel';

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          {children}
        </main>
      </div>
      <ChatPanel />
    </ToastProvider>
  );
}
