import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play } from 'lucide-react';
import Button from '../components/common/Button';

// Updated to use the YouTube URL you specified
const videoUrl = 'https://www.youtube.com/shorts/ZXTyTXA53EU?feature=share';

const VideoScreen = () => {
  const { flowType } = useParams<{ flowType: string }>();
  const navigate = useNavigate();
  const [showOverlay, setShowOverlay] = useState(true);
  
  useEffect(() => {
    // Auto-hide overlay after a delay
    const timer = setTimeout(() => {
      setShowOverlay(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleContinue = () => {
    if (flowType === 'animal') {
      // For animal flow, navigate to details page of a default/fixed animal location
      navigate(`/location/animal-1/${flowType}`);
    } else {
      navigate(`/locations/${flowType}`);
    }
  };
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const getContent = () => {
    switch (flowType) {
      case 'human':
        return {
          title: 'Feed Hungry People',
          description: 'Your contribution brings warmth and nourishment to those in need. Every meal served is a blessing shared.',
        };
      case 'animal':
        return {
          title: 'Feed Animal Beings',
          description: 'Show compassion to our animal friends. Your kindness nurtures all forms of life.',
        };
      case 'coupon':
        return {
          title: 'Distribute Annadaan Coupons',
          description: 'Empower others with dignity through food coupons. A small gesture that creates ripples of hope.',
        };
      default:
        return {
          title: 'Annadaan',
          description: 'Choose your path of service.',
        };
    }
  };
  
  const { title, description } = getContent();
  
  // Function to extract YouTube video ID
  const getYouTubeEmbedUrl = (url: string) => {
    // For YouTube shorts
    const shortsRegex = /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/;
    const shortsMatch = url.match(shortsRegex);
    
    if (shortsMatch && shortsMatch[1]) {
      return `https://www.youtube.com/embed/${shortsMatch[1]}?autoplay=1&mute=1&controls=0&loop=1&playlist=${shortsMatch[1]}`;
    }
    
    // For regular YouTube videos
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&controls=0&loop=1&playlist=${match[1]}`;
    }
    
    return url;
  };
  
  const embedUrl = getYouTubeEmbedUrl(videoUrl);
  
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Video Container */}
      <div className="absolute inset-0">
        <iframe
          src={embedUrl}
          className="w-full h-full object-cover"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none" />
      </div>
      
      {/* Back Button */}
      <button
        className="absolute top-4 md:top-6 left-4 md:left-6 z-20 p-1.5 md:p-2 rounded-full bg-black/30 backdrop-blur-sm 
          text-white hover:bg-black/50 transition-colors"
        onClick={handleBack}
      >
        <ArrowLeft size={18} />
      </button>
      
      {/* Content Overlay */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-4 md:p-8">
        <motion.div
          className="max-w-md md:max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-lg md:text-2xl font-bold text-white mb-1.5 md:mb-3">{title}</h1>
          <p className="text-sm md:text-base text-white/90 mb-4 md:mb-6">{description}</p>
          
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleContinue}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 
              hover:to-orange-700 shadow-xl backdrop-blur-sm text-sm md:text-base py-2.5 md:py-3"
            animate={false}
          >
            Begin Your Service
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default VideoScreen;