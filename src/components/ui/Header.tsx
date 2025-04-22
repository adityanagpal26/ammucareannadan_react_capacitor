import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { isNativePlatform, isIOS } from '../../utils/capacitor';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  backgroundImage?: string;
  hideLogo?: boolean;
}

const Header = ({
  title,
  showBackButton = true,
  backgroundImage,
  hideLogo = false,
}: HeaderProps) => {
  const navigate = useNavigate();
  const isMobile = isNativePlatform();
  const isIosDevice = isIOS();
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const headerStyle = backgroundImage
    ? {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.3)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : undefined;
  
  const textColor = backgroundImage ? 'text-white' : 'text-neutral-900';
  
  return (
    <motion.header
      className={`relative ${backgroundImage ? 'py-12' : 'py-4'} ${backgroundImage ? 'mb-6' : 'mb-4'} ${isIosDevice ? 'pt-[calc(var(--ion-safe-area-top)+1rem)]' : ''}`}
      style={headerStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center">
          {showBackButton && (
            <button
              onClick={handleGoBack}
              className={`mr-2 p-2 rounded-full ${
                backgroundImage
                  ? 'bg-white/20 text-white hover:bg-white/30'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              } transition-colors tap-highlight-transparent`}
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          
          <h1 className={`text-xl font-semibold ${textColor} ${isMobile ? 'line-clamp-1' : ''}`}>{title}</h1>
          
          {!hideLogo && (
            <div className="ml-auto">
              <img 
                src="/annadaan-logo.svg" 
                alt="Annadaan Logo" 
                className="h-8"
              />
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;