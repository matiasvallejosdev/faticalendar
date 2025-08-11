'use client';
import { getLifeExpectancy } from '@/utils/life-calculator';
import useUserState from '@/hooks/user-user-state';
import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { differenceInMonths } from 'date-fns';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LifeCircle } from './life-circle';
import { AppLoader } from './app-loader';

export function LifeGrid() {
  const { userData } = useUserState();
  const [mounted, setMounted] = useState(false);
  const [isGridReady, setIsGridReady] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  // Memoize basic calculations
  const basicData = useMemo(() => {
    if (!userData) return null;
    
    const lifeExpectancy = getLifeExpectancy(
      userData.nationality,
      userData.healthyFood,
      userData.running,
      userData.alcohol,
      userData.smoking,
    );
    
    // Ensure life expectancy is a reasonable number
    let normalizedLifeExpectancy = lifeExpectancy;
    
    // Check if the value is reasonable
    if (!normalizedLifeExpectancy || normalizedLifeExpectancy < 60 || normalizedLifeExpectancy > 120 || isNaN(normalizedLifeExpectancy)) {
      console.warn('Invalid life expectancy value:', lifeExpectancy, 'using default 80');
      normalizedLifeExpectancy = 80;
    }
    
    const birthDate = new Date(userData.birthYear, 0, 1);
    const today = new Date();
    const monthsLived = differenceInMonths(today, birthDate);
    let totalMonths = normalizedLifeExpectancy * 12;
    
    // Additional safety check for totalMonths
    if (!totalMonths || totalMonths < 600 || totalMonths > 1440 || isNaN(totalMonths)) {
      console.warn('Invalid totalMonths value:', totalMonths, 'using default 960');
      totalMonths = 960; // 80 years * 12 months
    }
    
    const lifeProgressPercent = Math.round((monthsLived / totalMonths) * 100);
    
    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Life Expectancy Debug:', {
        originalLifeExpectancy: lifeExpectancy,
        normalizedLifeExpectancy,
        totalMonths,
        monthsLived,
        lifeProgressPercent,
        userData: {
          nationality: userData.nationality,
          healthyFood: userData.healthyFood,
          running: userData.running,
          alcohol: userData.alcohol,
          smoking: userData.smoking,
          birthYear: userData.birthYear
        }
      });
    }

    return {
      lifeExpectancy: normalizedLifeExpectancy,
      birthDate,
      today,
      monthsLived,
      totalMonths,
      lifeProgressPercent
    };
  }, [userData]);

  // Calculate lifestyle impact summary
  const lifestyleImpact = useMemo(() => {
    if (!userData) return [];
    
    const impacts = [];
    if (userData.healthyFood) impacts.push({ factor: "Healthy Diet", impact: "+2 years", positive: true });
    if (userData.running) impacts.push({ factor: "Regular Exercise", impact: "+3 years", positive: true });
    if (userData.alcohol) impacts.push({ factor: "Alcohol Consumption", impact: "-2 years", positive: false });
    if (userData.smoking) impacts.push({ factor: "Smoking", impact: "-5 years", positive: false });
    
    return impacts;
  }, [userData]);

  // Memoize grid calculations
  const gridConfig = useMemo(() => {
    if (!basicData) {
      return null;
    }

    // Use fallback dimensions if container size isn't available yet
    const fallbackWidth = 800;
    const fallbackHeight = 600;
    const width = containerSize.width > 0 ? containerSize.width : fallbackWidth;
    const height = containerSize.height > 0 ? containerSize.height : fallbackHeight;

    // Apply responsive padding - less on mobile, more on desktop
    const padding = width < 768 ? 8 : width < 1024 ? 12 : 20;
    const availableWidth = width - padding * 2;
    const availableHeight = height - padding * 2;
    const { totalMonths } = basicData;

    // Calculate approximate square root to get starting dimensions
    const approxSide = Math.sqrt(totalMonths);
    
    // Try different column counts around the square root to find the best fit
    let bestConfig = { numColumns: 1, numRows: totalMonths, dotSize: 1, gap: 1 };
    let bestDotSize = 0;
    
    // Test column counts in a reasonable range
    const minCols = Math.max(10, Math.floor(approxSide * 0.5));
    const maxCols = Math.min(100, Math.ceil(approxSide * 2));
    
    for (let cols = minCols; cols <= maxCols; cols++) {
      const rows = Math.ceil(totalMonths / cols);
      const gap = Math.max(1, Math.floor(Math.min(availableWidth, availableHeight) / 200));
      
      // Calculate maximum dot size that fits in container
      const maxDotWidth = (availableWidth - (cols - 1) * gap) / cols;
      const maxDotHeight = (availableHeight - (rows - 1) * gap) / rows;
      const dotSize = Math.min(maxDotWidth, maxDotHeight);
      
      // Prefer configurations that give larger dots and reasonable aspect ratios
      if (dotSize > bestDotSize && dotSize >= 2) {
        bestDotSize = dotSize;
        bestConfig = { numColumns: cols, numRows: rows, dotSize: Math.floor(dotSize), gap };
      }
    }
    
    const { numColumns, numRows, dotSize, gap } = bestConfig;

    // Calculate final grid dimensions
    const totalGridWidth = numColumns * dotSize + (numColumns - 1) * gap;
    const totalGridHeight = numRows * dotSize + (numRows - 1) * gap;

    return {
      numColumns,
      numRows,
      dotSize,
      gap,
      totalGridWidth,
      totalGridHeight,
      padding
    };
  }, [basicData, containerSize]);

  // Optimized resize handler with debouncing
  const updateSize = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      // Only update if we have actual dimensions and the element is visible
      if (rect.width > 0 && rect.height > 0 && rect.width < window.innerWidth && rect.height < window.innerHeight) {
        setContainerSize(prevSize => {
          // Only update if dimensions actually changed to prevent unnecessary re-renders
          if (Math.abs(prevSize.width - rect.width) > 5 || Math.abs(prevSize.height - rect.height) > 5) {
            return {
              width: rect.width,
              height: rect.height,
            };
          }
          return prevSize;
        });
      }
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    
    // Use setTimeout to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      updateSize();
    }, 100);

    // Mark grid as ready after initial mount and sizing
    const gridReadyTimeout = setTimeout(() => {
      setIsGridReady(true);
    }, 200);


    // Use ResizeObserver for better performance with debouncing
    let resizeObserver: ResizeObserver | null = null;
    let debounceTimeout: NodeJS.Timeout | null = null;
    
    if (containerRef.current && 'ResizeObserver' in window) {
      const debouncedUpdate = () => {
        if (debounceTimeout) {
          clearTimeout(debounceTimeout);
        }
        debounceTimeout = setTimeout(() => {
          updateSize();
        }, 100);
      };
      
      resizeObserver = new ResizeObserver(debouncedUpdate);
      resizeObserver.observe(containerRef.current);
    } else {
      // Fallback to window resize with debouncing
      const debouncedUpdate = () => {
        if (debounceTimeout) {
          clearTimeout(debounceTimeout);
        }
        debounceTimeout = setTimeout(() => {
          updateSize();
        }, 100);
      };
      window.addEventListener('resize', debouncedUpdate, { passive: true });
      
      // Store the cleanup function
      const cleanup = () => {
        clearTimeout(timeoutId);
        if (debounceTimeout) {
          clearTimeout(debounceTimeout);
        }
        window.removeEventListener('resize', debouncedUpdate);
      };
      
      return cleanup;
    }

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(gridReadyTimeout);
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [updateSize]);

  // Always render container for proper sizing, but show loading until everything is ready
  if (!userData || !mounted || !basicData || !gridConfig || !isGridReady) {
    return (
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center bg-vintage-cream rounded-lg"
      >
        <AppLoader message="Preparing your life calendar..." />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="life-grid-container w-full h-full max-w-full max-h-full overflow-hidden bg-vintage-cream rounded-lg shadow-md relative"
    >
      <div 
        className="w-full h-full flex items-center justify-center"
        style={{ padding: `${gridConfig.padding}px` }}
      >
        <TooltipProvider delayDuration={100}>
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${gridConfig.numColumns}, ${gridConfig.dotSize}px)`,
              gridAutoFlow: 'row',
              gap: `${gridConfig.gap}px`,
              width: `${gridConfig.totalGridWidth}px`,
              height: `${gridConfig.totalGridHeight}px`,
              placeItems: 'center',
            }}
          >
            {Array.from({ length: Math.max(600, Math.min(1440, basicData.totalMonths || 960)) }, (_, i) => (
              <LifeCircle
                key={i}
                monthIndex={i}
                dotSize={gridConfig.dotSize}
                birthDate={basicData.birthDate}
                today={basicData.today}
                monthsLived={basicData.monthsLived}
                totalMonths={basicData.totalMonths}
                lifestyleImpact={lifestyleImpact}
              />
            ))}
          </div>
        </TooltipProvider>
      </div>
      
      <style jsx global>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.6); }
          70% { box-shadow: 0 0 0 4px rgba(255, 107, 107, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 107, 107, 0); }
        }
      `}</style>
    </div>
  );
}
