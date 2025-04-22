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
  const [showButton, setShowButton] = useState(false);
  
  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
    
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 2000);
    
    return () => clearTimeout(timer);
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
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-200 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0 
            }}
            animate={{ 
              y: [undefined, -20, undefined],
              opacity: [0, 0.6, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Logo Container - Replace gradient and Lotus icon with logo image */}
      <motion.div
        className="relative mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Glowing effect behind the logo */}
        <motion.div 
          className="absolute inset-0 bg-orange-500/20 rounded-full blur-2xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Logo Image */}
        <div className="relative flex justify-center items-center">
          <motion.img 
            src="/Ammucare-Logo-2023-Final.png" 
            alt="Ammucare Logo" 
            className="w-40 h-auto drop-shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        {/* Title - Keep only subtitle to avoid redundancy with logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4"
        >
          <p className="text-orange-100 text-lg">Feed the Soul</p>
        </motion.div>
      </motion.div>
      
      {/* Quote */}
      <motion.div
        className="max-w-md mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <blockquote className="text-2xl italic text-white font-medium drop-shadow-lg">
          "{quote}"
        </blockquote>
      </motion.div>
      
      {/* Button */}
      <AnimatePresence>
        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button 
              variant="primary" 
              size="lg" 
              onClick={handleContinue}
              className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 
                text-white px-8 py-3 text-lg shadow-lg border border-orange-300/20 relative overflow-hidden group"
              animate
            >
              <span className="relative z-10">Begin Your Service</span>
              
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 
                translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
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