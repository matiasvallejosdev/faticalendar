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
      // Find the root app container that includes header, main, and footer
      let targetElement: HTMLElement | null = null;
      
      // Look for the main app container (the flex flex-col h-screen element from LifeApp)
      const appContainer = document.querySelector('div.flex.flex-col.h-screen.w-screen') as HTMLElement;
      if (appContainer) {
        targetElement = appContainer;
      } else {
        // Fallback to body or a parent that contains header, main, and footer
        targetElement = document.body;
      }

      if (!targetElement) {
        throw new Error('Could not find suitable element to capture');
      }

      // Wait a moment for any animations to settle
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a temporary style element to ensure proper vintage colors and layout
      const tempStyle = document.createElement('style');
      tempStyle.innerHTML = `
        /* Preserve vintage colors */
        .text-vintage-green { color: #164e2d !important; }
        .text-vintage-green\\/60 { color: rgba(22, 78, 45, 0.6) !important; }
        .text-vintage-green\\/70 { color: rgba(22, 78, 45, 0.7) !important; }
        .text-vintage-green\\/80 { color: rgba(22, 78, 45, 0.8) !important; }
        .bg-vintage-cream { background-color: #f5e9c9 !important; }
        .bg-vintage-green { background-color: #164e2d !important; }
        .border-vintage-green { border-color: #164e2d !important; }
        
        /* Ensure full page is visible */
        body, html {
          overflow: visible !important;
          background-color: #f5e9c9 !important;
        }
        /* Make sure the app container shows its full height */
        .flex.flex-col.h-screen {
          height: auto !important;
          min-height: 100vh !important;
        }
        /* Ensure main content doesn't get cut off */
        main.flex-1 {
          flex: none !important;
          height: auto !important;
        }
        /* Hide share dialogs and modals */
        [role="dialog"], .fixed.inset-0 {
          display: none !important;
        }
      `;
      document.head.appendChild(tempStyle);

      // Get the full dimensions of the content
      const rect = targetElement.getBoundingClientRect();
      const scrollHeight = targetElement.scrollHeight;
      const scrollWidth = targetElement.scrollWidth;

      const canvas = await html2canvas(targetElement, {
        backgroundColor: '#f5e9c9', // vintage-cream background
        scale: 1.5, // Good resolution without being too heavy
        useCORS: true,
        allowTaint: true,
        logging: false,
        height: Math.max(scrollHeight, window.innerHeight, rect.height),
        width: Math.max(scrollWidth, window.innerWidth, rect.width),
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0,
        foreignObjectRendering: true,
        onclone: (clonedDoc, element) => {
          // Ensure vintage design is preserved in the clone
          const clonedBody = clonedDoc.body;
          if (clonedBody) {
            clonedBody.style.overflow = 'visible';
            clonedBody.style.height = 'auto';
            clonedBody.style.backgroundColor = '#f5e9c9'; // vintage-cream
          }
          
          // Apply vintage colors to all elements in clone
          const allElements = clonedDoc.querySelectorAll('*');
          allElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            const classList = htmlEl.classList;
            
            // Apply vintage colors based on classes
            if (classList.contains('text-vintage-green')) {
              htmlEl.style.color = '#164e2d';
            }
            if (classList.contains('bg-vintage-cream')) {
              htmlEl.style.backgroundColor = '#f5e9c9';
            }
            if (classList.contains('bg-vintage-green')) {
              htmlEl.style.backgroundColor = '#164e2d';
            }
            if (classList.contains('border-vintage-green')) {
              htmlEl.style.borderColor = '#164e2d';
            }
            
            // Handle opacity variants - safe string check
            const classNameStr = htmlEl.className?.toString() || '';
            if (classNameStr.includes('text-vintage-green/60')) {
              htmlEl.style.color = 'rgba(22, 78, 45, 0.6)';
            }
            if (classNameStr.includes('text-vintage-green/70')) {
              htmlEl.style.color = 'rgba(22, 78, 45, 0.7)';
            }
            if (classNameStr.includes('text-vintage-green/80')) {
              htmlEl.style.color = 'rgba(22, 78, 45, 0.8)';
            }
            
            // Ensure visibility
            if (htmlEl.style.overflow === 'hidden') {
              htmlEl.style.overflow = 'visible';
            }
          });
          
          // Hide any share dialogs or modals in the clone
          const dialogs = clonedDoc.querySelectorAll('[role="dialog"], .fixed.inset-0');
          dialogs.forEach(dialog => {
            (dialog as HTMLElement).style.display = 'none';
          });
        },
        ignoreElements: (element) => {
          // Skip elements that might cause issues but keep structural elements
          return element.tagName === 'SCRIPT' ||
                 element.classList.contains('html2canvas-ignore') ||
                 // Skip dialogs/modals that might be open  
                 element.getAttribute('role') === 'dialog' ||
                 element.classList.contains('fixed') && element.classList.contains('inset-0');
        }
      });

      // Remove the temporary style
      document.head.removeChild(tempStyle);

      const imageData = canvas.toDataURL('image/png', 0.9);
      setCapturedImage(imageData);
      return imageData;
      
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

  // Check if Web Share API is supported and can handle images
  const canShareFiles = () => {
    return 'share' in navigator && 'canShare' in navigator;
  };

  const shareWithNativeAPI = async () => {
    if (!capturedImage) {
      toast.error('Please wait for image to be captured first.');
      return;
    }

    try {
      // Convert base64 to blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const file = new File([blob], `life-visualization-${progressPercentage}%.png`, { type: 'image/png' });

      const shareData = {
        title: 'My Life Visualization',
        text: shareText,
        url: shareUrl,
        files: [file]
      };

      // Check if we can share files
      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast.success('Shared successfully!');
      } else {
        // Fallback to sharing without image
        await navigator.share({
          title: 'My Life Visualization',
          text: shareText,
          url: shareUrl,
        });
        toast.success('Shared! You can download the image separately to attach it.');
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Error sharing:', error);
        toast.error('Failed to share. Please try downloading the image instead.');
      }
    }
  };

  const shareToTwitter = () => {
    if (!capturedImage) {
      toast.error('Please wait for image to be captured first.');
      return;
    }

    // First download the image automatically
    downloadImage();

    // Then open Twitter
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(tweetUrl, '_blank');

    toast.success('Image downloaded! Now attach it to your X (Twitter) post.', {
      description: 'Check your downloads folder',
      duration: 5000,
    });
  };

  const shareToWhatsApp = () => {
    if (!capturedImage) {
      toast.error('Please wait for image to be captured first.');
      return;
    }

    // First download the image automatically
    downloadImage();

    // Then open WhatsApp
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.open(whatsappUrl, '_blank');

    toast.success('Image downloaded! Now attach it to your WhatsApp message.', {
      description: 'Check your downloads folder',
      duration: 5000,
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
      <DialogContent className="w-[95vw] max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-xl bg-vintage-cream border-vintage-green text-vintage-green max-h-[90vh] overflow-y-auto rounded-lg sm:rounded-xl">
        <DialogHeader>
          <DialogTitle className="vintage-title">SHARE YOUR LIFE PROGRESS</DialogTitle>
          <div className="vintage-divider"></div>
          <DialogDescription className="text-vintage-green/80">
            Share your life visualization with friends and family.
          </DialogDescription>
        </DialogHeader>

        <div className="my-2 sm:my-4 flex justify-center px-2">
          {isCapturing ? (
            <div className="flex items-center justify-center h-32 sm:h-48 md:h-64 w-full border border-vintage-green rounded-md bg-vintage-cream/50">
              <div className="text-vintage-green text-sm sm:text-base text-center px-4">Capturing your life visualization...</div>
            </div>
          ) : capturedImage ? (
            <div className="w-full overflow-hidden border border-vintage-green rounded-md bg-vintage-cream">
              <Image
                src={capturedImage}
                alt="Life Visualization"
                className="w-full h-auto object-contain"
                width={800}
                height={600}
                style={{
                  maxHeight: '250px',
                  width: '100%',
                  height: 'auto'
                }}
                sizes="(max-width: 640px) 90vw, (max-width: 768px) 80vw, (max-width: 1024px) 70vw, 60vw"
              />
              <style jsx>{`
                @media (min-width: 640px) {
                  img {
                    max-height: 300px !important;
                  }
                }
                @media (min-width: 768px) {
                  img {
                    max-height: 400px !important;
                  }
                }
                @media (min-width: 1024px) {
                  img {
                    max-height: 500px !important;
                  }
                }
              `}</style>
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 sm:h-48 md:h-64 w-full border border-vintage-green rounded-md bg-vintage-cream/50">
              <div className="text-vintage-green text-sm sm:text-base text-center px-4">Preparing image...</div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:gap-4 mt-3 sm:mt-4 px-2">
          {/* Native share button (appears first if supported) */}
          {canShareFiles() && (
            <Button
              onClick={shareWithNativeAPI}
              className="bg-vintage-green hover:bg-vintage-green/80 text-vintage-cream w-full h-10 sm:h-11 text-sm sm:text-base"
              disabled={isCapturing || !capturedImage}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share with Image
            </Button>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Button
              onClick={shareToTwitter}
              className="bg-[#000000] hover:bg-[#333333] text-white w-full h-10 sm:h-11 text-sm sm:text-base"
              disabled={isCapturing || !capturedImage}
            >
              <Twitter className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Share on </span>X
            </Button>

            <Button
              onClick={shareToWhatsApp}
              className="bg-[#25D366] hover:bg-[#22c55e] text-white w-full h-10 sm:h-11 text-sm sm:text-base"
              disabled={isCapturing || !capturedImage}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
          </div>

          <Button
            onClick={downloadImage}
            variant="outline"
            className="border-vintage-green text-vintage-green hover:bg-vintage-green hover:text-vintage-cream w-full h-10 sm:h-11 text-sm sm:text-base"
            disabled={isCapturing || !capturedImage}
          >
            Download Image
          </Button>

          {!canShareFiles() && (
            <p className="text-xs sm:text-sm text-vintage-green/70 text-center px-2">
              💡 Tip: The image will be downloaded automatically when you click X or WhatsApp - just attach it to your post!
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
