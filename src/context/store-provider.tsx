'use client';
import { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { Store } from '@reduxjs/toolkit';
import { makeStore } from '@/lib/store';
import { setUserData } from '@/lib/features/user-slice';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<Store | null>(null);
  
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  // Load persisted data from localStorage only on the client side
  useEffect(() => {
    if (!storeRef.current) return;
    
    try {
      const savedData = localStorage.getItem('lifeVisualizerUserData');
      if (savedData) {
        storeRef.current.dispatch(setUserData(JSON.parse(savedData)));
      }
    } catch (e) {
      console.error('Failed to parse saved user data', e);
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
