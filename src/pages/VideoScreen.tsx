import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play } from 'lucide-react';
import Button from '../components/common/Button';

const videoSources = {
  human: 'https://assets.mixkit.co/videos/preview/mixkit-serving-food-to-a-man-on-the-street-40597-large.mp4',
  animal: 'https://assets.mixkit.co/videos/preview/mixkit-little-girl-feeding-a-horse-hay-41886-large.mp4',
  coupon: 'https://assets.mixkit.co/videos/preview/mixkit-people-serving-food-to-a-family-40591-large.mp4',
};

const VideoScreen = () => {
  const { flowType } = useParams<{ flowType: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  
  useEffect(() => {
    if (videoRef.current) {
      const timer = setTimeout(() => {
        videoRef.current?.play();
        setIsPlaying(true);
        setShowOverlay(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const handleContinue = () => {
    if (flowType === 'animal') {
      // For animal flow, navigate to details page of a default/fixed animal location
      navigate(`/location/animal-1/${flowType}`);
    } else {
      navigate(`/locations/${flowType}`);
    }
  };
  
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
      setShowOverlay(!showOverlay);
    }
  };
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const videoSource = flowType ? videoSources[flowType as keyof typeof videoSources] : videoSources.human;
  
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
  
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Video Container */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          src={videoSource}
          className="w-full h-full object-cover"
          playsInline
          muted
          loop
          onClick={togglePlay}
        />
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />
        
        {showOverlay && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <button
              className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
              onClick={togglePlay}
            >
              <Play size={40} className="text-white ml-2" />
            </button>
          </div>
        )}
      </div>
      
      {/* Back Button */}
      <button
        className="absolute top-6 left-6 z-20 p-2 rounded-full bg-black/30 backdrop-blur-sm 
          text-white hover:bg-black/50 transition-colors"
        onClick={handleBack}
      >
        <ArrowLeft size={24} />
      </button>
      
      {/* Content Overlay */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-8">
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-white mb-4">{title}</h1>
          <p className="text-lg text-white/90 mb-8">{description}</p>
          
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleContinue}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 
              hover:to-orange-700 shadow-xl backdrop-blur-sm"
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