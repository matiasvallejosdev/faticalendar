"use client";

import useUserState from "../hooks/user-user-state"
import { ShareButton } from "./share-button"
import { Share2, Trash2 } from "lucide-react"
import { useAppDispatch } from "@/lib/redux"
import { setUserData } from "@/lib/features/user-slice"
import { useState } from "react"
import { toast } from "sonner"

export function ProgressHeader() {
  const { userData } = useUserState();
  const dispatch = useAppDispatch();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteData = async () => {
    if (!userData) return;
    
    // Confirmation before deletion
    if (!confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    
    try {
      // Clear Redux state
      dispatch(setUserData(null));
      
      // Clear localStorage
      localStorage.removeItem('lifeVisualizerUserData');
      
      toast.success('All data has been deleted successfully');
    } catch (error) {
      console.error('Error deleting data:', error);
      toast.error('Failed to delete data. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

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
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs mr-1.5 mb-1 font-medium
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
      <div className="flex flex-col gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-xl sm:text-2xl font-bold text-vintage-green vintage-title">
              {userData?.name ? `${userData.name}'s LIFE` : 'YOUR LIFE'}
            </h1>
            {userData && (
              <div className="flex items-center gap-2">
                <ShareButton 
                  trigger={
                    <Share2 className="h-5 w-5 text-vintage-green/40 hover:text-vintage-green/60 transition-colors cursor-pointer" />
                  }
                />
                <button
                  onClick={handleDeleteData}
                  disabled={isDeleting}
                  className="p-1 text-vintage-green/40 hover:text-vintage-green/60 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete all data"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
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
      </div>
    </header>
  )
}
