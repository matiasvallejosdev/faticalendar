"use client";

import useUserState from "../hooks/user-user-state"
import { AnimatedQuote } from "./animated-quote"
import { ShareButton } from "./share-button"
import { Share2 } from "lucide-react"

export function ProgressHeader() {
  const { userData } = useUserState();

  // Helper function to render health indicator
  const HealthIndicator = ({ 
    active, 
    label, 
    positive = true 
  }: { 
    active: boolean; 
    label: string; 
    positive?: boolean 
  }) => (
    <span 
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs mr-1.5 mb-1 font-medium
        ${active === positive 
          ? 'bg-vintage-lightgreen text-vintage-cream border border-vintage-green shadow-sm' 
          : 'bg-transparent text-gray-500 border border-gray-400'}`}
      title={`${label}: ${active ? 'Yes' : 'No'}`}
    >
      {label}
    </span>
  )

  return (
    <header className="px-4 sm:px-6 py-3 sm:py-4 border-b border-vintage-green bg-vintage-cream">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-xl sm:text-2xl font-bold text-vintage-green vintage-title">
              {userData?.name ? `${userData.name}'s LIFE` : 'YOUR LIFE'}
            </h1>
            {userData && (
              <ShareButton 
                trigger={
                  <Share2 className="h-5 w-5 text-vintage-green/40 hover:text-vintage-green/60 transition-colors cursor-pointer" />
                }
              />
            )}
          </div>
          <div className="flex flex-wrap gap-x-0 gap-y-1">
            {userData ? (
              <>
                <HealthIndicator active={userData.healthyFood} label="Healthy Diet" />
                <HealthIndicator active={userData.running} label="Exercise" />
                <HealthIndicator active={!userData.alcohol} label="No Alcohol" positive={false} />
                <HealthIndicator active={!userData.smoking} label="No Smoking" positive={false} />
              </>
            ) : (
              <div className="text-vintage-green/50 text-sm">
                Complete setup to see your lifestyle factors
              </div>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 self-start lg:self-center">
          <AnimatedQuote />
        </div>
      </div>
    </header>
  )
}
