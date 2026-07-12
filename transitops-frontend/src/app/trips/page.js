'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import TripKanbanBoard from '../../components/trip-dispatch/TripKanbanBoard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function TripDispatchPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <TripKanbanBoard />
      <Toaster position="bottom-right" />
    </QueryClientProvider>
  );
}
