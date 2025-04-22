import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FileText } from 'lucide-react';
import { useDonationStore } from '../store/donationStore';
import { createDonation } from '../services/api';
import { DonationFormData } from '../types';
import Container from '../components/common/Container';
import Header from '../components/ui/Header';
import Button from '../components/common/Button';
import FormInput from '../components/common/FormInput';

const UserDetails = () => {
  const { flowType, locationId, amount } = useParams<{
    flowType: string;
    locationId?: string;
    amount: string;
  }>();
  const navigate = useNavigate();
  
  // Redirect to error page if flowType is undefined
  useEffect(() => {
    if (!flowType) {
      navigate('/error');
      return;
    }
  }, [flowType, navigate]);
  
  const { currentDonation, setUserDetails, setDonationId } = useDonationStore(
    (state) => ({
      currentDonation: state.currentDonation,
      setUserDetails: state.setUserDetails,
      setDonationId: state.setDonationId,
    })
  );
  
  const [requireReceipt, setRequireReceipt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DonationFormData>({
    defaultValues: {
      name: currentDonation.userDetails?.name || '',
      email: currentDonation.userDetails?.email || '',
      phone: currentDonation.userDetails?.phone || '',
      address: currentDonation.userDetails?.address || '',
      pan: currentDonation.userDetails?.pan || '',
      reason: currentDonation.userDetails?.reason || '',
      requireReceipt: currentDonation.userDetails?.requireReceipt || false,
    },
  });
  
  const onSubmit = async (data: DonationFormData) => {
    // Prevent submission if flowType is undefined
    if (!flowType) {
      setError('Invalid donation type');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      data.requireReceipt = requireReceipt;
      
      setUserDetails(data);
      
      const donationData = {
        flowType,
        locationId: locationId || undefined,
        amount: parseFloat(amount || '0'),
        units: currentDonation.units || 0,
        userDetails: data,
      };
      
      const response = await createDonation(donationData);
      if (response.success && response.data) {
        setDonationId(response.data.id);
        alert('Please note that only Indian payment methods are supported.');
        navigate(`/payment/${response.data.id}`);
      } else {
        setError('Failed to create donation');
      }
    } catch (err) {
      setError('An error occurred while processing your donation');
      console.error('Donation creation error:', err);
    } finally {
      setIsSubmitting(false);
    }
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
        return 'Your Details';
    }
  };
  
  return (
    <div className="min-h-screen bg-neutral-50 pb-6 md:pb-8">
      <Header title={getTitle()} showBackButton={true} />
      
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-5 md:mb-8">
            <h2 className="text-lg md:text-2xl font-semibold text-neutral-800 mb-2">
              Complete Your Donation
            </h2>
            <div className="h-1 w-16 md:w-20 bg-gradient-to-r from-primary-500 to-primary-300 rounded-full" />
          </div>
          
          {error && (
            <motion.div 
              className="bg-secondary-50 border border-secondary-200 rounded-lg md:rounded-xl p-3 md:p-4 text-secondary-700 mb-4 md:mb-6 text-sm md:text-base"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {error}
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm p-4 md:p-6 mb-4 md:mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-6">
                <FormInput
                  label="Full Name"
                  register={register}
                  error={errors.name}
                  required
                  placeholder="Your full name"
                  icon="name"
                  {...register('name', {
                    required: 'Name is required',
                  })}
                />
                
                <FormInput
                  label="Email"
                  register={register}
                  error={errors.email}
                  required
                  type="email"
                  placeholder="Your email address"
                  icon="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
                
                <FormInput
                  label="Phone Number"
                  register={register}
                  error={errors.phone}
                  required
                  type="tel"
                  placeholder="Your phone number"
                  icon="phone"
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Please enter a valid 10-digit phone number',
                    },
                  })}
                />
                
                <FormInput
                  label="Address"
                  register={register}
                  error={errors.address}
                  required
                  placeholder="Your address"
                  icon="address"
                  {...register('address', {
                    required: 'Address is required',
                  })}
                />
              </div>
              
              <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-neutral-200">
                <label className="flex items-center">
                  <motion.input
                    type="checkbox"
                    className="rounded-lg border-2 border-neutral-300 text-primary-500 focus:ring-primary-500 h-4 w-4 md:h-5 md:w-5 transition-all duration-300"
                    checked={requireReceipt}
                    onChange={(e) => setRequireReceipt(e.target.checked)}
                    whileTap={{ scale: 0.9 }}
                  />
                  <span className="ml-2 md:ml-3 text-neutral-700 text-xs md:text-sm">
                    I want a tax receipt (80G)
                  </span>
                </label>
              </div>
              
              {requireReceipt && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 md:mt-6"
                >
                  <FormInput
                    label="PAN Number"
                    register={register}
                    error={errors.pan}
                    required={requireReceipt}
                    placeholder="Your PAN number"
                    icon="pan"
                    {...register('pan', {
                      required: requireReceipt ? 'PAN number is required for tax receipt' : false,
                      pattern: {
                        value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                        message: 'Please enter a valid PAN number',
                      },
                    })}
                  />
                </motion.div>
              )}
              
              <div className="mt-4 md:mt-6">
                <label className="block text-xs md:text-sm font-medium text-neutral-700 mb-1 md:mb-2 flex items-center">
                  <span className="mr-1.5 md:mr-2 text-primary-500">
                    <FileText size={16} />
                  </span>
                  Reason for Donation (Optional)
                </label>
                <textarea
                  className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-neutral-200 rounded-lg md:rounded-xl shadow-sm 
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-300
                    transition-all duration-300 resize-none text-sm md:text-base"
                  rows={3}
                  placeholder="Share why you're making this donation..."
                  {...register('reason')}
                />
              </div>
            </div>
            
            <motion.div 
              className="mt-5 md:mt-8"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Button
                variant="primary"
                size="lg"
                fullWidth
                type="submit"
                disabled={isSubmitting}
                className={`
                  relative overflow-hidden text-sm md:text-base py-2.5 md:py-3
                  ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
                `}
                animate
              >
                <span className="relative z-10">
                  {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                </span>
                {!isSubmitting && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-200/0 via-primary-200/30 to-primary-200/0 animate-[shine_2s_infinite]" />
                )}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </Container>
    </div>
  );
};

export default UserDetails;