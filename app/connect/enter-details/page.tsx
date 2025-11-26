'use client';

import { Suspense } from 'react';
import EnterDetailsPageContext from './EntiredetailsContext';

export default function EnterDetailsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading wallet details...</p>
        </div>
      </div>
    }>
      <EnterDetailsPageContext />
    </Suspense>
  );
}