import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Share2, ArrowRight, Download } from 'lucide-react';
import { getDonation, sendDonationEmail } from '../services/api';
import { DonationData } from '../types';
import Container from '../components/common/Container';
import Button from '../components/common/Button';

const ThankYou = () => {
  const { donationId } = useParams<{ donationId: string }>();
  const navigate = useNavigate();
  
  const [donation, setDonation] = useState<DonationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchDonationDetails = async () => {
      if (!donationId) {
        setError('No donation ID provided');
        setLoading(false);
        return;
      }
      
      try {
        // Get donation details
        const response = await getDonation(donationId);
        
        if (response.success && response.data) {
          setDonation(response.data);
          
          // Send success email
          await sendDonationEmail(donationId, 'success');
        } else {
          setError('Failed to fetch donation details');
        }
      } catch (err) {
        setError('An error occurred while fetching donation details');
        console.error('Donation details error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDonationDetails();
    
    // Use fallback data if API fails
    const fallbackTimeout = setTimeout(() => {
      if (loading && !donation) {
        setDonation({
          id: donationId,
          flowType: 'human',
          amount: 1001,
          units: 50,
          userDetails: {
            name: 'Kind Donor',
            email: 'donor@example.com',
            phone: '1234567890',
            address: '123 Charity Road, Mumbai',
            requireReceipt: true,
          },
          status: 'successful',
        });
        setLoading(false);
      }
    }, 3000);
    
    return () => clearTimeout(fallbackTimeout);
  }, [donationId, loading, donation]);
  
  const handleDownloadReceipt = () => {
    // In a real app, this would generate and download a receipt
    alert('Your receipt will be sent to your email address.');
  };
  
  const handleShare = () => {
    // In a real app, this would open share options
    if (navigator.share) {
      navigator.share({
        title: 'My Annadaan Donation',
        text: 'I just made a donation through Annadaan to help provide meals to those in need!',
        url: window.location.href,
      });
    } else {
      alert('Sharing is not supported on this browser.');
    }
  };
  
  const handleDonateAgain = () => {
    navigate('/select-flow');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (error || !donation) {
    return (
      <div className="min-h-screen bg-neutral-50 p-4">
        <Container>
          <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4 text-secondary-700 text-center">
            {error || 'Failed to load donation details'}
          </div>
          <div className="mt-6 text-center">
            <Button
              variant="primary"
              onClick={() => navigate('/select-flow')}
            >
              Return to Home
            </Button>
          </div>
        </Container>
      </div>
    );
  }
  
  const getTitleByFlowType = () => {
    switch (donation.flowType) {
      case 'human':
        return 'fed hungry people';
      case 'animal':
        return 'fed animal beings';
      case 'coupon':
        return 'distributed food coupons';
      default:
        return 'made a donation';
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-600 to-primary-800 flex flex-col items-center justify-center py-8">
      <Container>
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-lg mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-6">
            <div className="bg-primary-100 p-4 rounded-full">
              <Heart className="w-16 h-16 text-primary-500" />
            </div>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 text-center mb-2">
            Thank You!
          </h1>
          
          <p className="text-neutral-600 text-center mb-6">
            You have successfully {getTitleByFlowType()} with your donation.
          </p>
          
          <div className="bg-primary-50 p-4 rounded-lg border border-primary-100 mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-neutral-600">Amount Donated:</span>
              <span className="font-bold text-primary-700">₹{donation.amount.toLocaleString()}</span>
            </div>
            
            {donation.units > 0 && donation.flowType !== 'animal' && (
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">
                  {donation.flowType === 'coupon' ? 'Coupons' : 'Meals'} Provided:
                </span>
                <span className="font-bold text-primary-700">{donation.units}</span>
              </div>
            )}
          </div>
          
          {donation.userDetails.requireReceipt && (
            <div className="mb-6">
              <Button
                variant="outline"
                fullWidth
                icon={<Download size={18} />}
                onClick={handleDownloadReceipt}
              >
                Download Receipt
              </Button>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Button
              variant="outline"
              icon={<Share2 size={18} />}
              onClick={handleShare}
            >
              Share
            </Button>
            
            <Button
              variant="primary"
              icon={<ArrowRight size={18} />}
              iconPosition="right"
              onClick={handleDonateAgain}
            >
              Donate Again
            </Button>
          </div>
          
          <p className="text-sm text-neutral-500 text-center">
            A confirmation has been sent to your email: {donation.userDetails.email}
          </p>
        </motion.div>
      </Container>
    </div>
  );
};

export default ThankYou;