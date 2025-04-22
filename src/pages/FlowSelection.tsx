import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getFlows } from '../services/api';
import { Flow } from '../types';
import { useDonationStore } from '../store/donationStore';
import Container from '../components/common/Container';

const FlowSelection = () => {
  const navigate = useNavigate();
  const setFlowType = useDonationStore((state) => state.setFlowType);
  const [flows, setFlows] = useState<Flow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchFlows = async () => {
      try {
        const response = await getFlows();
        if (response.success && response.data) {
          console.log('Fetched donation flows:', response.data);
          setFlows(response.data);
        } else {
          setError('Failed to fetch donation flows');
        }
      } catch (err) {
        setError('An error occurred while fetching donation flows');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFlows();
    
    const fallbackTimeout = setTimeout(() => {
      if (loading && flows.length === 0) {
        setFlows([
          {
            id: 1,
            fundraiserType: "human",
            name: "Feed Hungry People",
            label: "For Humans",
            imageUrl: "https://media.annadaan.ammucare.org/flows/humans.jpg",
            coupon: false,
            locationsEnabled: true
          },
          {
            id: 2,
            fundraiserType: "animal",
            name: "Feed Animal Beings",
            label: "For Animals",
            imageUrl: "https://media.annadaan.ammucare.org/flows/animals.jpg",
            coupon: false,
            locationsEnabled: false
          },
          {
            id: 3,
            fundraiserType: "human",
            name: "Distribute Annadaan Coupons",
            label: "Annadaan Coupons",
            imageUrl: "https://media.annadaan.ammucare.org/flows/coupons.jpg",
            coupon: true,
            locationsEnabled: true
          }
        ]);
        setLoading(false);
      }
    }, 3000);
    
    return () => clearTimeout(fallbackTimeout);
  }, [loading, flows.length]);
  
  const handleFlowSelect = (flow: Flow) => {
    // Use fundraiserType instead of type property
    setFlowType(flow.fundraiserType);
    
    // Always navigate to video screen first regardless of flow type
    navigate(`/video/${flow.fundraiserType}`);
  };
  
  return (
    <div 
      className="min-h-screen py-12 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(255, 248, 240, 0.9), rgba(255, 237, 213, 0.95)), url('https://images.pexels.com/photos/7130554/pexels-photo-7130554.jpeg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <Container>
        <motion.div
          className="flex flex-col items-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-6">
            <img 
              src="/Ammucare-Logo-2023-Final.png" 
              alt="Ammucare Logo" 
              className="w-24 h-auto drop-shadow-lg"
            />
          </div>
          
          <h1 className="text-3xl font-bold text-neutral-800 text-center mb-3">
            Choose Your Path of Service
          </h1>
          <p className="text-neutral-600 text-center max-w-xl text-lg">
            Every act of giving is a step towards divine grace. Select how you wish to serve today.
          </p>
        </motion.div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : error ? (
          <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4 text-secondary-700 text-center">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {flows.map((flow) => (
              <motion.div
                key={flow.id}
                className="group relative h-96 rounded-2xl overflow-hidden shadow-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                onClick={() => handleFlowSelect(flow)}
                style={{ cursor: 'pointer' }}
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url(${flow.imageUrl})`,
                    cursor: 'default'
                  }}
                />
                
                {/* Gradient Overlay */}
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
                  style={{ pointerEvents: 'none' }}
                />
                
                {/* Flow Name */}
                <div 
                  className="absolute bottom-0 left-0 right-0 p-6"
                  style={{ pointerEvents: 'none' }}
                >
                  <h3 className="text-3xl font-bold text-white">
                    {flow.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default FlowSelection;