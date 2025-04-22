import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, useScroll, useTransform, useAnimation, MotionValue } from 'framer-motion';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { useDonationStore } from '../store/donationStore';
import { getFundraiser } from '../services/api';
import { Fundraiser } from '../types';
import Container from '../components/common/Container';
import Button from '../components/common/Button';
import FundraiserStats from '../components/ui/FundraiserStats';
import ImageGallery from '../components/ui/ImageGallery';
import AlertDialog from '../components/common/AlertDialog';
import { useInView } from 'react-intersection-observer';

// Define a custom type for the ProgressBar component
interface ProgressBarProps {
  percentage: number;
}

const ProgressBar = ({ percentage }: ProgressBarProps) => {
  // Set up the InView hook with a threshold of 0.1 and triggerOnce true
  // This means the animation will start when 10% of the element is visible
  // and will only trigger once (won't re-animate if scrolled out of view and back)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  return (
    <motion.div
      ref={ref}
      className="absolute h-full bg-gradient-to-r from-primary-400 to-primary-600"
      style={{ width: `${percentage}%` }}
      initial={{ width: 0 }}
      animate={{ width: inView ? `${percentage}%` : 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    />
  );
};

// Define a custom type for the AnimatedCounter component
interface AnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number;
}

const AnimatedCounter = ({ from = 0, to = 0, duration = 1.2 }: AnimatedCounterProps) => {
  const [count, setCount] = useState(from);
  const controls = useAnimation();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3
  });
  const rounded = Math.round;

  useEffect(() => {
    // Only start animation when element is in view
    if (inView) {
      // Create animation that updates our state
      const animation = {
        value: [from, to],
        transition: { duration, ease: 'easeOut' }
      };

      // Start the animation and update the count state during animation
      let cleanup: any;
      controls.start(animation).then(() => setCount(to));
      
      // Use a separate animation to update the count state during the animation
      let startTime = Date.now();
      const updateCount = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / (duration * 1000), 1);
        const currentCount = from + progress * (to - from);
        setCount(currentCount);
        
        if (progress < 1) {
          cleanup = requestAnimationFrame(updateCount);
        }
      };
      
      cleanup = requestAnimationFrame(updateCount);
      
      return () => {
        if (cleanup) cancelAnimationFrame(cleanup);
      };
    }
  }, [from, to, duration, controls, inView]);

  return (
    <motion.span ref={ref} animate={controls}>
      {rounded(count).toLocaleString()}
    </motion.span>
  );
};

const LocationDetails = () => {
  const { locationId, flowType } = useParams<{ locationId: string; flowType?: string }>();
  const navigate = useNavigate();
  const setFundraiserId = useDonationStore((state) => state.setFundraiserId);
  const { scrollY } = useScroll();

  const [fundraiser, setFundraiser] = useState<Fundraiser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  const imageScale = useTransform(scrollY, [0, 200], [1.1, 1]);
  const imageOpacity = useTransform(scrollY, [0, 200], [1, 0.6]);
  const titleY = useTransform(scrollY, [0, 200], [0, 20]);

  useEffect(() => {
    if (!flowType) navigate('/error', { state: { message: 'Invalid donation flow type.' } });
  }, [flowType, navigate]);

  useEffect(() => {
    const fetchFundraiser = async () => {
      if (!locationId || !flowType) return;
      try {
        const res = await getFundraiser(locationId);
        if (res.success && res.data) {
          console.log('Fetched fundraiser details:', res.data);
          setFundraiser(res.data);
          // Ensure we're converting to string if required by the donation store
          setFundraiserId(typeof res.data.id === 'number' ? res.data.id.toString() : res.data.id);
        } else setError('Failed to fetch fundraiser details');
      } catch {
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchFundraiser();
  }, [locationId, flowType, setFundraiserId]);

  const handleDonate = () => {
    // Show alert instead of navigating directly
    setShowAlert(true);
  };
  
  const handleConfirmDonate = () => {
    // Close the alert and navigate to the next page
    setShowAlert(false);
    if (fundraiser && flowType) {
      navigate(`/donate/${flowType}/${locationId}`);
    }
  };
  
  const handleCancelDonate = () => {
    // Just close the alert
    setShowAlert(false);
  };
  
  const handleBack = () => navigate(-1);
  const getUnitType = () => fundraiser?.unitType || 'meals';

  // Define hardcoded steps for How It Works section
  const howItWorksSteps = [
    "Choose the number of plates you wish to serve",
    "Fill out your details",
    "Pay with your Indian cards (debit/credit), UPI or net banking",
    "Allow us to serve the needy on your behalf"
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF8F3]">
        <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-primary-500" />
      </div>
    );
  }

  if (error || !fundraiser) {
    return (
      <div className="min-h-screen bg-[#FDF8F3] p-6 flex justify-center items-center">
        <div className="bg-white p-6 rounded-xl shadow text-center text-neutral-600">
          {error || 'Unable to load data'}
        </div>
      </div>
    );
  }

  // Extract photo URLs from fundraiserPhotos array
  const photoUrls = fundraiser.fundraiserPhotos
    ? fundraiser.fundraiserPhotos
        .filter(fp => fp.visible)
        .map(fp => fp.photo.photoUrl)
    : [];
  
  // Use coverPhoto if available, fallback to first fundraiserPhoto or default
  const headerImage = fundraiser.coverPhoto?.photo?.photoUrl || 
                     (photoUrls.length > 0 ? photoUrls[0] : '/fallback.jpg');
  
  const progressPercentage = fundraiser.percentageCompleted || 
                             Math.round(((fundraiser.totalFundraiserDonations || 0) / (fundraiser.target || 1)) * 100);

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      {/* Hero Image with Overlay */}
      <div className="relative h-[240px] md:h-[280px] overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale: imageScale }}>
          <motion.div
            className="w-full h-full bg-center bg-cover"
            style={{
              backgroundImage: `url(${headerImage})`,
              opacity: imageOpacity,
            }}
          />
        {/*  <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" /> */}
        </motion.div>

        <button
          onClick={handleBack}
          className="absolute top-4 md:top-6 left-4 md:left-6 z-10 p-1.5 md:p-2 rounded-full bg-black/40 text-white hover:bg-black/60"
        >
          <ArrowLeft size={18} className="md:size-22" />
        </button>

        <Container className="relative h-full flex flex-col justify-end pb-4 md:pb-6">
          <motion.h1 className="text-white text-xl md:text-3xl font-bold" style={{ y: titleY }}>
            {fundraiser.name}
          </motion.h1>
        </Container>
      </div>

      {/* Main Content */}
      <div>
        <Container>
          <motion.div
            className="bg-white rounded-t-2xl md:rounded-t-3xl shadow-md pt-5 md:pt-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Description Section */}
            <div className="px-4 md:px-6 pb-5 md:pb-6 border-b border-neutral-100">
              <p className="text-sm md:text-base text-neutral-700 leading-relaxed">{fundraiser.description}</p>
            </div>

            {/* Progress Section */}
              <div className="px-4 md:px-6 py-5 md:py-6 border-b border-neutral-100 bg-white z-10 relative">
                <div className="flex justify-between items-center mb-3 md:mb-4">
                  <h2 className="text-lg md:text-xl font-semibold">Campaign Progress</h2>
                  <motion.span
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-primary-600 font-medium text-sm md:text-base"
                  >
                    {progressPercentage}% Complete
                  </motion.span>
                </div>

                {/* Animated ProgressBar with InView */}
                <div className="relative w-full h-2 md:h-3 rounded-full bg-gray-200 overflow-hidden">
                  <ProgressBar percentage={progressPercentage} />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 md:gap-4 mt-5 md:mt-6">
                  <div className="bg-primary-50 rounded-lg p-3 md:p-4">
                    <p className="text-neutral-500 text-xs md:text-sm">Raised</p>
                    <p className="text-lg md:text-2xl font-bold text-primary-700">
                      <AnimatedCounter to={fundraiser.totalFundraiserDonations || 0} /> {getUnitType()}
                    </p>
                  </div>
                  <div className="bg-primary-50 rounded-lg p-3 md:p-4">
                    <p className="text-neutral-500 text-xs md:text-sm">Goal</p>
                    <p className="text-lg md:text-2xl font-bold text-primary-700">
                      <AnimatedCounter to={fundraiser.target || 0} /> {getUnitType()}
                    </p>
                  </div>
                </div>
              </div>

            {/* Stats */}
            <div className="px-4 md:px-6 pb-5 md:pb-6 border-b border-neutral-100">
              <FundraiserStats 
                stats={{
                  totalMeals: fundraiser.mealsDonated || 0,
                  totalDays: fundraiser.totalDays || 0,
                  totalDonors: fundraiser.donors || 0
                }} 
              />
            </div>

            {/* How It Works - Moved above Gallery */}
            <div className="px-4 md:px-6 py-5 md:py-6 border-b border-neutral-100">
              <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">How It Works</h2>
              <div className="space-y-3 md:space-y-4">
                {howItWorksSteps.map((step, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 bg-primary-100 rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center mr-2 md:mr-3">
                      <span className="text-primary-700 font-semibold text-xs md:text-sm">{index + 1}</span>
                    </div>
                    <div className="bg-neutral-50 rounded-lg p-2 md:p-3 flex-grow">
                      <p className="text-neutral-700 text-xs md:text-sm">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Donate Button - Moved above Gallery */}
            <div className="p-4 md:p-6 bg-neutral-50 border-b border-neutral-100">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleDonate}
                className="bg-gradient-to-r from-primary-500 to-primary-600 relative overflow-hidden text-sm md:text-base py-2.5 md:py-3"
              >
                <span className="relative z-10">Contribute Now</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 animate-[shine_2s_infinite]" />
              </Button>
            </div>

            {/* Gallery - Now after How It Works and Donate button */}
            {photoUrls.length > 0 && (
              <div className="px-4 md:px-6 py-5 md:py-6">
                <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Gallery</h2>
                <ImageGallery images={photoUrls} />
              </div>
            )}

          </motion.div>
        </Container>
      </div>
      
      {/* Alert Dialog for Indian Bank Account */}
      <AlertDialog
        isOpen={showAlert}
        onClose={handleCancelDonate}
        onConfirm={handleConfirmDonate}
        title="Donation Notice"
        message={
          <p className="text-sm md:text-base">
            Right now, Ammucare accepts donations only from Indian Bank Accounts. 
            If you have an Indian bank account, please proceed.
          </p>
        }
        cancelText="Cancel"
        confirmText="Continue"
        icon={<AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-amber-500" />}
      />
    </div>
  );
};

export default LocationDetails;
