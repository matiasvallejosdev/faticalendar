interface AppLoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export function AppLoader({ message = "Loading...", fullScreen = false }: AppLoaderProps) {
  const containerClass = fullScreen 
    ? "flex items-center justify-center min-h-screen w-screen bg-vintage-cream"
    : "w-full h-full flex items-center justify-center bg-vintage-cream rounded-lg";

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center space-y-4">
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-4 h-4 bg-vintage-green rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
        <div className="text-vintage-green/70 text-base font-medium">
          {message}
        </div>
      </div>
    </div>
  );
}