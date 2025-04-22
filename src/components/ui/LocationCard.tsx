import { motion } from 'framer-motion';
import { Location } from '../../types';

interface LocationCardProps {
  location: Location;
  onClick: () => void;
}

const LocationCard = ({ location, onClick }: LocationCardProps) => {
  return (
    <motion.div
      className="relative h-64 rounded-xl overflow-hidden shadow-md"
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <img 
        src={location.imageUrl} 
        alt={location.name} 
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
      
      <div className="absolute bottom-0 left-0 p-4 text-white">
        <h3 className="text-xl font-semibold mb-1">{location.name}</h3>
        <p className="text-sm text-white/80">{location.city}, {location.state}</p>
      </div>
    </motion.div>
  );
};

export default LocationCard;