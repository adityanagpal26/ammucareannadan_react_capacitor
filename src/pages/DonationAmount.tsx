import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDonationStore } from '../store/donationStore';
import { getFundraiser } from '../services/api';
import { Fundraiser } from '../types';
import Container from '../components/common/Container';
import Header from '../components/ui/Header';
import Button from '../components/common/Button';
import AmountSelector from '../components/ui/AmountSelector';

const DonationAmount = () => {
  const { flowType, locationId } = useParams<{ flowType: string; locationId?: string }>();
  const navigate = useNavigate();
  const { setAmount, setUnits } = useDonationStore((state) => ({
    setAmount: state.setAmount,
    setUnits: state.setUnits,
  }));
  
  const [fundraiser, setFundraiser] = useState<Fundraiser | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect to error page if flowType is undefined
  useEffect(() => {
    if (!flowType) {
      navigate('/error');
      return;
    }
  }, [flowType, navigate]);
  
  useEffect(() => {
    const fetchFundraiserDetails = async () => {
      if (!locationId && flowType !== 'animal') {
        setError('No location selected');
        setLoading(false);
        return;
      }
      
      // For animal flow, we don't need fundraiser details
      if (flowType === 'animal') {
        setLoading(false);
        return;
      }
      
      try {
        // In a real app, we would fetch based on location and flow type
        // Here we're just fetching by ID for simplicity
        if (locationId) {
          const response = await getFundraiser(locationId);
          
          if (response.success && response.data) {
            setFundraiser(response.data);
          } else {
            setError('Failed to fetch fundraiser details');
          }
        }
      } catch (err) {
        setError('An error occurred while fetching fundraiser details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFundraiserDetails();
    
    // Use fallback data if API fails
    const fallbackTimeout = setTimeout(() => {
      if (loading && !fundraiser && flowType !== 'animal') {
        const isCoupon = flowType === 'coupon';
        
        const fallbackFundraiser: Fundraiser = {
          id: locationId || '1',
          name: isCoupon ? 'Annadaan Coupon Distribution' : 'Food for All',
          description: isCoupon
            ? 'Help distribute food coupons to those in need'
            : 'Providing nutritious meals to hungry individuals',
          locationId: locationId || '1',
          fundraiserType: flowType || 'human',
          isCoupon,
          goalAmount: isCoupon ? 10000 : 100000,
          raisedAmount: isCoupon ? 6500 : 75000,
          stats: {
            totalMeals: isCoupon ? 6500 : 75000,
            totalDays: 365,
            totalDonors: 1250,
          },
          howItWorks: [],
          images: [],
          pricePerUnit: isCoupon ? 50 : 20,
        };
        
        setFundraiser(fallbackFundraiser);
        setLoading(false);
      }
    }, 3000);
    
    return () => clearTimeout(fallbackTimeout);
  }, [locationId, flowType, loading, fundraiser]);
  
  const handleAmountChange = (amount: number) => {
    setSelectedAmount(amount);
    
    if (flowType === 'animal') {
      // For animal donations, amount is direct money value
      setAmount(amount);
      setUnits(1); // Units is 1 for direct money donations
    } else if (fundraiser) {
      // For meal/coupon donations, calculate based on price per unit
      setUnits(amount);
      setAmount(amount * fundraiser.pricePerUnit);
    }
  };
  
  const handleContinue = () => {
    if (selectedAmount <= 0 || !flowType) {
      return;
    }
    
    // Navigate to user details page with required flowType
    navigate(`/user-details/${flowType}/${locationId || ''}/${selectedAmount}`);
  };
  
  const getTitle = () => {
    switch (flowType) {
      case 'human':
        return 'Feed Hungry People';
      case 'animal':
        return 'Feed Animal Beings';
      case 'coupon':
        return 'Distribute Annadaan Coupons';
      default:
        return 'Donation Amount';
    }
  };
  
  const getAmountOptions = () => {
    if (flowType === 'animal') {
      // Direct money donation options
      return [501, 1001, 2001, 5001, 10001];
    } else {
      // Meal/coupon options
      return [11, 21, 51, 101, 201, 501];
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (error && flowType !== 'animal') {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header title="Error" showBackButton={true} />
        <Container>
          <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4 text-secondary-700 text-center">
            {error}
          </div>
        </Container>
      </div>
    );
  }
  
  const unitType = flowType === 'animal' ? 'amount' : flowType === 'coupon' ? 'coupons' : 'meals';
  const pricePerUnit = fundraiser?.pricePerUnit || 0;
  const minAmount = flowType === 'animal' ? 100 : 11;
  
  return (
    <div className="min-h-screen bg-neutral-50 pb-8">
      <Header
        title={getTitle()}
        showBackButton={true}
      />
      
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-2">
              {flowType === 'animal'
                ? 'Choose Your Donation Amount'
                : fundraiser?.isCoupon
                  ? 'Choose Number of Coupons'
                  : 'Choose Number of Meals'}
            </h2>
            <p className="text-neutral-600">
              {flowType === 'animal'
                ? 'Your contribution helps provide food and care for stray and abandoned animals.'
                : fundraiser?.isCoupon
                  ? 'Each coupon helps someone in need access a nutritious meal.'
                  : 'Your donation will help provide nutritious meals to those in need.'}
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <AmountSelector
              options={getAmountOptions()}
              unitType={unitType}
              pricePerUnit={pricePerUnit}
              onChange={handleAmountChange}
              minAmount={minAmount}
              allowCustomAmount={true}
            />
          </div>
          
          <div className="mt-6">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleContinue}
              disabled={selectedAmount <= 0}
              animate
            >
              Continue
            </Button>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default DonationAmount;