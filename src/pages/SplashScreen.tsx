import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/common/Button';

const quotes = [
  "In the joy of others lies our own.",
  "Service to humanity is service to divinity.",
  "The heart that gives, gathers.",
  "Feed the body to reach the soul.",
  "Serving food is serving the divine.",
];

const SplashScreen = () => {
  const navigate = useNavigate();
  const [quote, setQuote] = useState('');
  const [showQuote, setShowQuote] = useState(false);
  const [showButton, setShowButton] = useState(false);
  
  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
    
    // Stagger showing elements with subtle delays
    const quoteTimer = setTimeout(() => {
      setShowQuote(true);
    }, 600); // Show quote after logo appears
    
    const buttonTimer = setTimeout(() => {
      setShowButton(true);
    }, 1200); // Show button after quote appears
    
    return () => {
      clearTimeout(quoteTimer);
      clearTimeout(buttonTimer);
    };
  }, []);
  
  const handleContinue = () => {
    navigate('/select-flow');
  };
  
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg')`,
      }}
    >
      {/* Logo Container */}
      <motion.div
        className="relative mb-6 md:mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Logo Image */}
        <div className="relative flex justify-center items-center">
          <img 
            src="/Ammucare-Logo-2023-Final.png" 
            alt="Ammucare Logo" 
            className="w-32 md:w-40 h-auto drop-shadow-lg"
          />
        </div>
        
        {/* Title */}
        <div className="mt-3 md:mt-4">
          <p className="text-orange-100 text-base md:text-lg">Feed the Soul</p>
        </div>
      </motion.div>
      
      {/* Quote */}
      <AnimatePresence>
        {showQuote && (
          <motion.div
            className="max-w-xs md:max-w-md mb-8 md:mb-12"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <blockquote className="text-xl md:text-2xl italic text-white font-medium drop-shadow-lg">
              "{quote}"
            </blockquote>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Button */}
      <AnimatePresence>
        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Button 
              variant="primary" 
              size="lg" 
              onClick={handleContinue}
              className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 
                text-white px-6 md:px-8 py-2.5 md:py-3 text-base md:text-lg shadow-lg border border-orange-300/20"
              animate={false}
            >
              Begin Your Service
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Sand texture overlay */}
      <div 
        className="fixed inset-0 pointer-events-none mix-blend-overlay opacity-20"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/7130554/pexels-photo-7130554.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    </div>
  );
};

export default SplashScreen;