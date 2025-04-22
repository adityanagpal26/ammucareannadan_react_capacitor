import { useEffect, useState } from 'react';
import { isNativePlatform } from '../../utils/capacitor';

interface AppInitializerProps {
  children: React.ReactNode;
}

/**
 * A component that handles mobile-specific app initialization
 * and provides a smooth transition between web and mobile
 */
const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    // Set up mobile-specific initialization here
    const handleAppInit = async () => {
      // Wait a bit to allow the app to stabilize
      setTimeout(() => {
        setInitialized(true);
      }, 300);
    };
    
    handleAppInit();
    
    // Clean up
    return () => {
      // Any cleanup code here
    };
  }, []);
  
  // If not initialized yet and running on mobile, show a loading screen
  if (!initialized && isNativePlatform()) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="text-center">
          <img 
            src="/Ammucare-Logo-2023-Final.png" 
            alt="Ammucare Logo" 
            className="w-32 h-32 mx-auto animate-pulse"
          />
          <p className="mt-4 text-lg font-medium text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
};

export default AppInitializer;