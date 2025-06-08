'use client';

import * as React from 'react';
import { LifeGrid } from "@/components/life-grid"
import { InitialForm } from '@/components/initial-form';
import { ProgressHeader } from '@/components/progress-header';
import useUserState from '../hooks/user-user-state';
import { useEffect, useState } from 'react';
import { ProgressFooter } from './progress-footer';

export function LifeApp() {
  const { userData } = useUserState();
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // When the component mounts or userData changes, update loading state
  useEffect(() => {
    // Add a small delay to show loading state briefly when data is available
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsInitialLoad(false);
    }, userData ? 200 : 100);

    return () => clearTimeout(timer);
  }, [userData]);

  // Initial loading screen
  const InitialLoadingScreen = () => (
    <div className="flex items-center justify-center min-h-screen w-screen bg-vintage-cream">
      <div className="flex flex-col items-center space-y-4">
        {/* Animated loading circles */}
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-4 h-4 bg-vintage-green rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1.5s'
              }}
            />
          ))}
        </div>
        
        {/* Loading text */}
        <div className="text-vintage-green/70 text-base font-medium">
          Loading your life calendar...
        </div>
      </div>
    </div>
  );

  // Show loading screen during initial load
  if (isInitialLoad) {
    return <InitialLoadingScreen />;
  }

  // If no userData after initial load, show only the form
  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen w-screen bg-vintage-cream">
        <InitialForm />
      </div>
    );
  }

  // Loading component for the main content area
  const LoadingContent = () => (
    <div className="flex-1 flex border border-vintage-green rounded-md overflow-hidden bg-vintage-cream">
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          {/* Animated loading circles */}
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-4 h-4 bg-vintage-green rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1.5s'
                }}
              />
            ))}
          </div>
          
          {/* Loading text */}
          <div className="text-vintage-green/70 text-base font-medium">
            Calculating your life journey...
          </div>
          
          {/* Subtle progress indicator */}
          <div className="w-40 h-2 bg-vintage-green/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-vintage-green/40 rounded-full animate-pulse"
              style={{ width: '60%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  // If userData exists, show the full app
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-vintage-cream text-vintage-green">
      <ProgressHeader />
      <main className="flex-1 overflow-hidden p-6 flex flex-col">
        {isLoading ? (
          <LoadingContent />
        ) : (
          <div className="flex-1 flex border border-vintage-green rounded-md overflow-hidden">
            <LifeGrid />
          </div>
        )}
      </main>
      <ProgressFooter />
    </div>
  );
}
