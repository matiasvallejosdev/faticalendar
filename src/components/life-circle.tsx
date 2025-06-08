'use client';
import { lifeEvents } from '@/data/life';
import { addMonths, format, differenceInYears, differenceInMonths } from 'date-fns';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface LifeCircleProps {
  monthIndex: number;
  dotSize: number;
  birthDate: Date;
  today: Date;
  monthsLived: number;
  totalMonths: number;
  lifestyleImpact: Array<{
    factor: string;
    impact: string;
    positive: boolean;
  }>;
}

export function LifeCircle({
  monthIndex,
  dotSize,
  birthDate,
  today,
  monthsLived,
  totalMonths,
  lifestyleImpact
}: LifeCircleProps) {
  const isPast = monthIndex < monthsLived;
  const isCurrentMonth = monthIndex === monthsLived;
  const hasEvent = lifeEvents[monthIndex] !== undefined;

  const getMonthInfo = () => {
    const monthDate = addMonths(birthDate, monthIndex);
    const monthName = format(monthDate, 'MMMM');
    const year = format(monthDate, 'yyyy');
    const age = Math.floor(monthIndex / 12);
    const monthOfYear = (monthIndex % 12) + 1;
    
    // Check if this month has a special event
    const event = lifeEvents[monthIndex];
    
    let timeContext = "";
    if (isCurrentMonth) {
      timeContext = "Current month";
    } else if (isPast) {
      const yearDiff = differenceInYears(today, monthDate);
      if (yearDiff > 0) {
        timeContext = `${yearDiff} ${yearDiff === 1 ? 'year' : 'years'} ago`;
      } else {
        const monthDiff = differenceInMonths(today, monthDate);
        timeContext = monthDiff > 0 ? `${monthDiff} ${monthDiff === 1 ? 'month' : 'months'} ago` : 'Recently';
      }
    } else {
      const yearDiff = differenceInYears(monthDate, today);
      if (yearDiff > 0) {
        timeContext = `in ${yearDiff} ${yearDiff === 1 ? 'year' : 'years'}`;
      } else {
        const monthDiff = differenceInMonths(monthDate, today);
        timeContext = monthDiff > 0 ? `in ${monthDiff} ${monthDiff === 1 ? 'month' : 'months'}` : 'Soon';
      }
    }

    return {
      monthName,
      year,
      age,
      monthOfYear,
      fullDate: format(monthDate, 'MMMM yyyy'),
      isPast,
      event,
      timeContext,
      isCurrentMonth,
      monthIndex
    };
  };

  const monthInfo = getMonthInfo();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          style={{
            width: `${dotSize}px`,
            height: `${dotSize}px`,
            borderRadius: '50%',
            backgroundColor: isCurrentMonth 
              ? '#ff6b6b' 
              : (isPast ? '#164e2d' : 'transparent'),
            border: isPast 
              ? (hasEvent ? `2px solid #ffd166` : 'none') 
              : `1px solid #164e2d`,
            cursor: 'pointer',
            animation: isCurrentMonth ? 'pulse 2s infinite' : 'none',
          }}
        />
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="bg-vintage-cream border border-vintage-green text-vintage-green p-3 rounded-md shadow-md max-w-xs"
      >
        <div className="space-y-2">
          <div className="text-center border-b border-vintage-green/30 pb-2">
            <div className="font-bold text-lg">{monthInfo.fullDate}</div>
            <div>Age: {monthInfo.age} years, {monthInfo.monthOfYear} months</div>
          </div>
          
          {monthInfo.event && (
            <div className="bg-vintage-green/10 p-2 rounded text-center font-medium">
              Event: {monthInfo.event}
            </div>
          )}
          
          <div className="text-center font-medium">
            <span className={monthInfo.isCurrentMonth ? "text-red-600" : 
              monthInfo.isPast ? "text-vintage-green" : "text-vintage-green/70"}>
              {monthInfo.timeContext}
            </span>
          </div>
          
          <div className="text-sm">
            <div className="flex justify-center w-full">
              <span>Month {monthIndex + 1} of {totalMonths}</span>
            </div>
            <div className="w-full bg-vintage-green/20 h-1 mt-1 rounded-full overflow-hidden">
              <div 
                className="bg-vintage-green h-full rounded-full"
                style={{ width: `${((monthIndex + 1) / totalMonths) * 100}%` }}
              />
            </div>
          </div>
          
          {monthInfo.isCurrentMonth && lifestyleImpact.length > 0 && (
            <div className="mt-2 pt-2 border-t border-vintage-green/30">
              <div className="text-sm font-semibold">Lifestyle Factors:</div>
              <div className="grid grid-cols-1 gap-1 text-xs mt-1">
                {lifestyleImpact.map((impact, idx) => (
                  <div 
                    key={idx} 
                    className={`flex justify-between ${impact.positive ? 'text-green-600' : 'text-red-600'}`}
                  >
                    <span>{impact.factor}:</span>
                    <span className="font-medium">{impact.impact}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
} 