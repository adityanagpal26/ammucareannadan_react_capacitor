import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDonationStore } from '../store/donationStore';
import { 
  getDonation, 
  createTransaction, 
  generatePaymentUrl, 
  updateDonationStatus 
} from '../services/api';
import Container from '../components/common/Container';
import Header from '../components/ui/Header';
import Button from '../components/common/Button';

const PaymentGateway = () => {
  const { donationId } = useParams<{ donationId: string }>();
  const navigate = useNavigate();
  
  const { setTransactionId } = useDonationStore((state) => ({
    setTransactionId: state.setTransactionId,
  }));
  
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showingIframe, setShowingIframe] = useState(false);
  
  useEffect(() => {
    const initializePayment = async () => {
      if (!donationId) {
        setError('No donation ID provided');
        setLoading(false);
        return;
      }
      
      try {
        // Get donation details
        const donationResponse = await getDonation(donationId);
        
        if (!donationResponse.success || !donationResponse.data) {
          setError('Failed to fetch donation details');
          setLoading(false);
          return;
        }
        
        const donation = donationResponse.data;
        setAmount(donation.amount);
        
        // Create transaction
        const transactionResponse = await createTransaction(donationId, donation.amount);
        
        if (!transactionResponse.success || !transactionResponse.data) {
          setError('Failed to create transaction');
          setLoading(false);
          return;
        }
        
        const transaction = transactionResponse.data;
        setTransactionId(transaction.id);
        
        // Generate payment URL
        const paymentResponse = await generatePaymentUrl(transaction.id);
        
        if (!paymentResponse.success || !paymentResponse.data) {
          setError('Failed to generate payment URL');
          setLoading(false);
          return;
        }
        
        setPaymentUrl(paymentResponse.data.url);
      } catch (err) {
        setError('An error occurred while initializing payment');
        console.error('Payment initialization error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    initializePayment();
    
    // Use fallback URL for demo purposes
    const fallbackTimeout = setTimeout(() => {
      if (loading && !paymentUrl) {
        // This is just for demo - in production, we'd use the real URL
        setPaymentUrl(`https://api-staging.annadaan.ammucare.org/payment-gateway?donationId=${donationId}`);
        setAmount(1001);
        setLoading(false);
      }
    }, 3000);
    
    return () => clearTimeout(fallbackTimeout);
  }, [donationId, setTransactionId, loading, paymentUrl]);
  
  const handlePaymentSuccess = async () => {
    if (!donationId) return;
    
    try {
      // Update donation status to successful
      await updateDonationStatus(donationId, 'successful');
      
      // Navigate to thank you page
      navigate(`/thank-you/${donationId}`);
    } catch (err) {
      console.error('Error updating donation status:', err);
      setError('Failed to update donation status');
    }
  };
  
  const handlePaymentFailure = async () => {
    if (!donationId) return;
    
    try {
      // Update donation status to failure
      await updateDonationStatus(donationId, 'failure');
      
      // Navigate to error page
      navigate('/error/payment');
    } catch (err) {
      console.error('Error updating donation status:', err);
      navigate('/error/payment');
    }
  };
  
  const handleStartPayment = () => {
    setShowingIframe(true);
    // In a real implementation:
    // 1. We'd redirect to paymentUrl or show it in an iframe
    // 2. Handle the redirect back from payment gateway
    
    // For demo purposes, we'll simulate a successful payment after 3 seconds
    setTimeout(() => {
      handlePaymentSuccess();
    }, 3000);
  };
  
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header title="Payment" showBackButton={true} />
      
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : error ? (
            <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4 text-secondary-700 text-center mb-6">
              {error}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-semibold text-neutral-800 mb-4">Complete Your Donation</h2>
              
              <div className="mb-6">
                <div className="flex justify-between items-center py-3 border-b border-neutral-200">
                  <span className="text-neutral-600">Donation Amount:</span>
                  <span className="font-semibold text-neutral-800">₹{amount.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-neutral-200">
                  <span className="text-neutral-600">Payment Gateway:</span>
                  <span className="font-medium text-neutral-800">PayU Money</span>
                </div>
                
                <div className="flex justify-between items-center py-3">
                  <span className="text-neutral-600">Status:</span>
                  <span className="font-medium text-primary-500">Ready to proceed</span>
                </div>
              </div>
              
              <div className="bg-primary-50 p-4 rounded-lg border border-primary-100 mb-6">
                <p className="text-primary-700 text-sm">
                  <span className="font-medium">Important:</span> Only Indian payment methods are supported. International cards may not work with this payment gateway.
                </p>
              </div>
              
              {showingIframe ? (
                <div>
                  <div className="w-full h-96 bg-neutral-100 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                      <p className="text-neutral-600">Processing your payment...</p>
                    </div>
                  </div>
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleStartPayment}
                  animate
                >
                  Proceed to Payment
                </Button>
              )}
            </div>
          )}
          
          <div className="text-center text-neutral-500 text-sm">
            <p>Your donation is secure and encrypted.</p>
            <p className="mt-1">
              By proceeding, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default PaymentGateway;