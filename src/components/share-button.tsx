'use client';

import { useState, useEffect } from 'react';
import { Share2, Twitter, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import useUserState from '../hooks/user-user-state';
import { differenceInYears } from 'date-fns';

// Simplified life expectancy calculation
const getLifeExpectancy = (
  nationality: string,
  healthyFood: boolean,
  running: boolean,
  alcohol: boolean,
  smoking: boolean,
) => {
  let baseExpectancy = 80; // Default

  // Adjust based on nationality
  switch (nationality) {
    case 'jp': // Japan
      baseExpectancy = 84;
      break;
    case 'us': // United States
      baseExpectancy = 78;
      break;
    case 'es': // Spain
      baseExpectancy = 83;
      break;
    // Add more countries as needed
    default:
      baseExpectancy = 80;
  }

  // Adjust for lifestyle factors (simplified model)
  if (healthyFood) baseExpectancy += 2;
  if (running) baseExpectancy += 3;
  if (alcohol) baseExpectancy -= 2;
  if (smoking) baseExpectancy -= 5;

  return baseExpectancy;
};

interface ShareButtonProps {
  trigger?: React.ReactNode;
}

export function ShareButton({ trigger }: ShareButtonProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { userData } = useUserState();

  if (!userData) return null;

  const lifeExpectancy = getLifeExpectancy(
    userData.nationality,
    userData.healthyFood,
    userData.running,
    userData.alcohol,
    userData.smoking,
  );

  const today = new Date();
  const birthDate = new Date(userData.birthYear, 0, 1);
  const age = differenceInYears(today, birthDate);
  const progressPercentage = Math.min(Math.round((age / lifeExpectancy) * 100), 100);

  const shareText = `I've lived ${progressPercentage}% of my life according to Life Visualizer. Check out your own life progress!`;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const captureScreenshot = async () => {
    setIsCapturing(true);
    try {
      // Find the life grid element with multiple selector options
      let gridElement = document.querySelector('.life-grid-container');
      
      // Fallback selectors if primary doesn't work
      if (!gridElement) {
        gridElement = document.querySelector('main div[class*="border-vintage-green"]');
      }
      
      if (!gridElement) {
        // Try to find the main content area
        gridElement = document.querySelector('main');
      }

      if (gridElement) {
        // Wait a moment for any animations to settle
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const canvas = await html2canvas(gridElement as HTMLElement, {
          backgroundColor: '#f5e9c9', // vintage-cream background
          scale: 2, // Higher resolution
          useCORS: true,
          allowTaint: true,
          logging: false, // Disable console logs
          height: Math.min(gridElement.scrollHeight, window.innerHeight * 2),
          width: Math.min(gridElement.scrollWidth, window.innerWidth * 2),
        });

        const imageData = canvas.toDataURL('image/png');
        setCapturedImage(imageData);
        return imageData;
      } else {
        console.error('Could not find any suitable element to capture');
        toast.error('Could not find the life grid to capture. Please try again.');
        return null;
      }
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      toast.error('Failed to capture screenshot. Please try again.');
      return null;
    } finally {
      setIsCapturing(false);
    }
  };

  // Automatically capture image when dialog opens
  useEffect(() => {
    if (isOpen && !capturedImage && !isCapturing) {
      captureScreenshot();
    }
  }, [isOpen, capturedImage, isCapturing]);

  const shareToTwitter = () => {
    if (!capturedImage) {
      toast.error('Please wait for image to be captured first.');
      return;
    }

    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(tweetUrl, '_blank');

    toast.success('Redirected to X (Twitter). Save and attach the captured image to your tweet!', {
      description: 'Image ready for sharing',
    });
  };

  const shareToWhatsApp = () => {
    if (!capturedImage) {
      toast.error('Please wait for image to be captured first.');
      return;
    }

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.open(whatsappUrl, '_blank');

    toast.success('Redirected to WhatsApp. Save and attach the captured image to your message!', {
      description: 'Image ready for sharing',
    });
  };

  const downloadImage = () => {
    if (!capturedImage) {
      toast.error('No image to download. Please wait for capture to complete.');
      return;
    }

    // Create a temporary link to download the image
    const link = document.createElement('a');
    link.href = capturedImage;
    link.download = `life-visualization-${progressPercentage}%.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Image downloaded successfully!');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <button className="h-10 px-4 rounded-md border border-vintage-green bg-transparent text-vintage-green flex items-center hover:bg-vintage-green hover:text-vintage-cream transition-colors">
            <Share2 className="h-5 w-5 mr-2" />
            Share
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-vintage-cream border-vintage-green text-vintage-green">
        <DialogHeader>
          <DialogTitle className="vintage-title">SHARE YOUR LIFE PROGRESS</DialogTitle>
          <div className="vintage-divider"></div>
          <DialogDescription className="text-vintage-green/80">
            Share your life visualization with friends and family.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 flex justify-center">
          {isCapturing ? (
            <div className="flex items-center justify-center h-40 border border-vintage-green rounded-md bg-vintage-cream/50">
              <div className="text-vintage-green">Capturing your life visualization...</div>
            </div>
          ) : capturedImage ? (
            <Image
              src={capturedImage}
              alt="Life Visualization"
              className="max-w-full max-h-60 border border-vintage-green rounded-md"
              width={300}
              height={200}
            />
          ) : (
            <div className="flex items-center justify-center h-40 border border-vintage-green rounded-md bg-vintage-cream/50">
              <div className="text-vintage-green">Preparing image...</div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={shareToTwitter}
              className="bg-[#000000] hover:bg-[#333333] text-white"
              disabled={isCapturing || !capturedImage}
            >
              <Twitter className="h-4 w-4 mr-2" />
              Share on X
            </Button>

            <Button
              onClick={shareToWhatsApp}
              className="bg-[#25D366] hover:bg-[#22c55e] text-white"
              disabled={isCapturing || !capturedImage}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
          </div>

          <Button
            onClick={downloadImage}
            variant="outline"
            className="border-vintage-green text-vintage-green hover:bg-vintage-green hover:text-vintage-cream"
            disabled={isCapturing || !capturedImage}
          >
            Download Image
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
