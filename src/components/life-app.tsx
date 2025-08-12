'use client';
import { LifeGrid } from "@/components/life-grid"
import { InitialForm } from '@/components/initial-form';
import { ProgressHeader } from '@/components/progress-header';
import useUserState from '../hooks/user-user-state';
import { ProgressFooter } from './progress-footer';
import { useState, useEffect } from 'react';
import { AppLoader } from './app-loader';

export function LifeApp() {
  const { userData } = useUserState();
  const [isLoading, setIsLoading] = useState(true);

  // Wait for initial state to load to prevent form flash
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Show loading while checking user state
  if (isLoading) {
    return <AppLoader message="Preparing your life calendar..." fullScreen={true} />;
  }

  // If no userData, show only the form
  if (!userData) {
    return (
      <div className="flex items-start sm:items-center justify-center min-h-screen w-screen bg-vintage-cream px-4 py-6">
        <InitialForm />
      </div>
    );
  }


  // If userData exists, show the full app
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-vintage-cream text-vintage-green">
      <ProgressHeader />
      <main className="flex-1 overflow-hidden p-6 flex flex-col">
        <div className="flex-1 flex border border-vintage-green rounded-md overflow-hidden">
          <LifeGrid />
        </div>
      </main>
      <ProgressFooter />
    </div>
  );
}
