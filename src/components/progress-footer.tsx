import { differenceInYears } from 'date-fns';
import { Clock, Battery, Calendar } from 'lucide-react';
import useUserState from '../hooks/user-user-state';
import { getLifeExpectancy } from '@/src/utils/life-calculator';


export function ProgressFooter() {
  const { userData } = useUserState();

  if (!userData) {
    return (
      <footer className="border-t border-vintage-green px-4 md:px-6 py-4 bg-vintage-cream">
        <div className="grid grid-cols-3 gap-2 md:gap-6 mb-4 md:mb-6">
          <div className="text-center">
            <Calendar className="h-4 w-4 md:h-5 md:w-5 mx-auto mb-1 md:mb-2 text-vintage-green/40" />
            <div className="text-[10px] md:text-xs text-vintage-green/40 uppercase tracking-wide">Current Age</div>
            <div className="font-medium text-sm md:text-2xl text-vintage-green/40">-- years</div>
          </div>

          <div className="text-center">
            <Battery className="h-4 w-4 md:h-5 md:w-5 mx-auto mb-1 md:mb-2 text-vintage-green/40" />
            <div className="text-[10px] md:text-xs text-vintage-green/40 uppercase tracking-wide">Life Progress</div>
            <div className="font-medium text-sm md:text-2xl text-vintage-green/40">--% Complete</div>
          </div>

          <div className="text-center">
            <Clock className="h-4 w-4 md:h-5 md:w-5 mx-auto mb-1 md:mb-2 text-vintage-green/40" />
            <div className="text-[10px] md:text-xs text-vintage-green/40 uppercase tracking-wide">Time Remaining</div>
            <div className="font-medium text-sm md:text-2xl text-vintage-green/40">-- years</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-vintage-cream border border-vintage-green/40 rounded-full mb-4 overflow-hidden">
          <div className="h-full bg-vintage-green/20" style={{ width: '0%' }}></div>
        </div>

        <div className="py-2 text-center text-xs md:text-sm text-vintage-green/50 px-2">
          Complete your profile to see your personalized life expectancy
        </div>
      </footer>
    );
  }

  const lifeExpectancy = getLifeExpectancy(
    userData.nationality,
    userData.healthyFood,
    userData.running,
    userData.alcohol,
    userData.smoking,
  )

  const today = new Date()
  const birthDate = new Date(userData.birthYear, 0, 1)
  const age = differenceInYears(today, birthDate)
  const yearsLeft = lifeExpectancy - age

  const progressPercentage = Math.min(Math.round((age / lifeExpectancy) * 100), 100)

      return (
      <footer className="border-t border-vintage-green px-4 md:px-6 py-4 bg-vintage-cream">
        <div className="grid grid-cols-3 gap-2 md:gap-6 mb-4 md:mb-6">
        <div className="text-center">
          <Calendar className="h-4 w-4 md:h-5 md:w-5 mx-auto mb-1 md:mb-2 text-vintage-green/60" />
          <div className="text-[10px] md:text-xs text-vintage-green/60 uppercase tracking-wide">Current Age</div>
          <div className="font-medium text-sm md:text-2xl text-vintage-green">{age} years</div>
        </div>

        <div className="text-center">
          <Battery className="h-4 w-4 md:h-5 md:w-5 mx-auto mb-1 md:mb-2 text-vintage-green/60" />
          <div className="text-[10px] md:text-xs text-vintage-green/60 uppercase tracking-wide">Life Progress</div>
          <div className="font-medium text-sm md:text-2xl text-vintage-green">{progressPercentage}% Complete</div>
        </div>

        <div className="text-center">
          <Clock className="h-4 w-4 md:h-5 md:w-5 mx-auto mb-1 md:mb-2 text-vintage-green/60" />
          <div className="text-[10px] md:text-xs text-vintage-green/60 uppercase tracking-wide">Time Remaining</div>
          <div className="font-medium text-sm md:text-2xl text-vintage-green">
            {yearsLeft > 0 ? `${yearsLeft} years` : "Extended!"}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-vintage-cream border border-vintage-green rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-vintage-green"
          style={{ width: `${progressPercentage}%` }}
          title={`${progressPercentage}% of life completed`}
        ></div>
      </div>

      <div className="py-2 text-center text-xs md:text-sm text-vintage-green/80 px-2">
        Based on your nationality and lifestyle choices, your estimated life expectancy is {lifeExpectancy} years.
      </div>
    </footer>
  )
}
