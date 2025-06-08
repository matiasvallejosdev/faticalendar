'use client';
import { getLifeExpectancy } from '@/utils/life-calculator';
import useUserState from '@/hooks/user-user-state';
import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { differenceInMonths } from 'date-fns';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LifeCircle } from './life-circle';

export function LifeGrid() {
  const { userData } = useUserState();
  const [mounted, setMounted] = useState(false);
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

    // Apply consistent padding for visual spacing
    const padding = 4;
    const availableWidth = width - padding * 2;
    const availableHeight = height - padding * 2;
    const { totalMonths } = basicData;

    // Calculate optimal grid dimensions to fill space evenly
    const containerAspectRatio = availableWidth / availableHeight;
    
    // Try different column counts to find the best fit
    let bestConfig = { numColumns: 1, numRows: totalMonths, dotSize: 1, gap: 1 };
    let bestDotSize = 0;
    
    for (let cols = Math.ceil(Math.sqrt(totalMonths * 0.5)); cols <= Math.ceil(Math.sqrt(totalMonths * 2)); cols++) {
      const rows = Math.ceil(totalMonths / cols);
      const gap = 2;
      
      const maxDotWidth = (availableWidth - (cols - 1) * gap) / cols;
      const maxDotHeight = (availableHeight - (rows - 1) * gap) / rows;
      const dotSize = Math.min(maxDotWidth, maxDotHeight);
      
      if (dotSize > bestDotSize && dotSize >= 3) {
        bestDotSize = dotSize;
        bestConfig = { numColumns: cols, numRows: rows, dotSize: Math.floor(dotSize), gap };
      }
    }
    
    const { numColumns, numRows, dotSize, gap } = bestConfig;

    // Recalculate with final dot size to center properly
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

  // Optimized resize handler
  const updateSize = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      // Only update if we have actual dimensions and the element is visible
      if (rect.width > 0 && rect.height > 0 && rect.width < window.innerWidth && rect.height < window.innerHeight) {
        setContainerSize({
          width: rect.width,
          height: rect.height,
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

    // Use ResizeObserver for better performance
    let resizeObserver: ResizeObserver | null = null;
    
    if (containerRef.current && 'ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(updateSize);
      resizeObserver.observe(containerRef.current);
    } else {
      // Fallback to window resize
      window.addEventListener('resize', updateSize);
    }

    return () => {
      clearTimeout(timeoutId);
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener('resize', updateSize);
      }
    };
  }, [updateSize]);

  // Show minimal loading state if essential data is missing
  if (!userData || !basicData || !gridConfig || !mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-vintage-cream rounded-lg">
        <div className="text-vintage-green/70 text-base font-medium">
          Preparing your life calendar...
        </div>
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
              gap: `${gridConfig.gap}px`,
              width: `${gridConfig.totalGridWidth}px`,
              height: `${gridConfig.totalGridHeight}px`,
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
