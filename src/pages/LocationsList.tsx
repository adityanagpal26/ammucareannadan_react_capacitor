import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, Search } from 'lucide-react';
import { getLocations } from '../services/api';
import { Location } from '../types';
import { useDonationStore } from '../store/donationStore';
import Container from '../components/common/Container';
import Header from '../components/ui/Header';
import LocationCard from '../components/ui/LocationCard';

const LocationsList = () => {
  const { flowType } = useParams<{ flowType: string }>();
  const navigate = useNavigate();
  const setLocationId = useDonationStore((state) => state.setLocationId);
  
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await getLocations();
        if (response.success && response.data) {
          console.log('Fetched locations:', response.data);
          setLocations(response.data);
          setFilteredLocations(response.data);
        } else {
          setError('Failed to fetch locations');
        }
      } catch (err) {
        setError('An error occurred while fetching locations');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLocations();
    
    const fallbackTimeout = setTimeout(() => {
      if (loading && locations.length === 0) {
        // This is a simplified fallback data structure
        // Adjust as needed based on your app's requirements
        const fallbackLocations = [
          {
            id: 1,
            name: 'Tiruvannamalai',
            hasCoupons: true,
            imageUrl: 'https://media.annadaan.ammucare.org/locations/tiruvannamalai.png',
            city: 'Tiruvannamalai',
            state: 'Tamil Nadu',
            photo: {
              id: 1,
              photoUrl: 'https://media.annadaan.ammucare.org/locations/tiruvannamalai.png',
              thumbnailUrl: 'https://media.annadaan.ammucare.org/locations/tiruvannamalai-thumb.jpg'
            }
          },
          {
            id: 2,
            name: 'Shirdi',
            hasCoupons: true,
            imageUrl: 'https://media.annadaan.ammucare.org/locations/shirdi.png',
            city: 'Shirdi',
            state: 'Maharashtra',
            photo: {
              id: 2,
              photoUrl: 'https://media.annadaan.ammucare.org/locations/shirdi.png',
              thumbnailUrl: 'https://media.annadaan.ammucare.org/locations/shirdi-thumb.jpg'
            }
          }
        ];
        
        setLocations(fallbackLocations);
        setFilteredLocations(fallbackLocations);
        setLoading(false);
      }
    }, 3000);
    
    return () => clearTimeout(fallbackTimeout);
  }, [loading, locations.length]);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredLocations(locations);
    } else {
      const filtered = locations.filter(
        (location) =>
          (location.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      );
      setFilteredLocations(filtered);
    }
  }, [searchTerm, locations]);
  
  const handleLocationSelect = (location: Location) => {
    setLocationId(location.id.toString());
    navigate(`/location/${location.id}/${flowType || 'default'}`);
  };
  
  const getTitle = () => {
    switch (flowType) {
      case 'human':
        return 'Feed Hungry People';
      case 'coupon':
        return 'Distribute Annadaan Coupons';
      default:
        return 'Select Location';
    }
  };
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };
  
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header
        title={getTitle()}
        showBackButton={true}
      />
      
      <Container>
        <div className="mb-6 md:mb-8">
          <div className="flex items-center space-x-2 mb-4 md:mb-6">
            <div className="bg-primary-100 p-1.5 md:p-2 rounded-full">
              <Map size={20} className="text-primary-500" />
            </div>
            <h2 className="text-lg md:text-2xl font-semibold text-neutral-800">Select a Location</h2>
          </div>
          
          <div className="relative mb-6 md:mb-8">
            <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
              <Search size={18} className="text-neutral-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2.5 md:py-3 border-2 border-neutral-200 rounded-lg md:rounded-xl 
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-300
                transition-all duration-300 shadow-sm text-sm md:text-base"
              placeholder="Search by location name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-8 md:py-12">
              <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : error ? (
            <div className="bg-secondary-50 border border-secondary-200 rounded-xl p-4 md:p-6 text-secondary-700 text-center text-sm md:text-base">
              {error}
            </div>
          ) : filteredLocations.length === 0 ? (
            <motion.div 
              className="bg-neutral-100 rounded-xl p-6 md:p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-neutral-600 text-sm md:text-lg">No locations found matching your search.</p>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredLocations.map((location) => (
                <motion.div 
                  key={location.id} 
                  variants={item}
                  className="group"
                >
                  <div 
                    className="relative h-44 sm:h-48 md:h-64 rounded-lg md:rounded-xl overflow-hidden shadow-md md:shadow-lg border border-neutral-200/50
                      transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                      cursor-pointer"
                    onClick={() => handleLocationSelect(location)}
                  >
                    {/* Background Image with Gradient */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url(${location.photo.photoUrl})` }}
                    />
                    
                    {/* Gradient Overlay 
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" /> */}
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 md:p-4 text-white">
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-0.5 sm:mb-1 line-clamp-2">{location.name}</h3>
                      {location.hasCoupons && (
                        <p className="text-xs md:text-sm bg-primary-500 text-white px-1.5 py-0.5 rounded-full inline-block font-medium whitespace-nowrap">
                          Coupons Available
                        </p>
                      )}
                    </div>
                    
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                      bg-gradient-to-r from-primary-500/0 via-primary-500/10 to-primary-500/0" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default LocationsList;