import { motion } from 'framer-motion';
import { Flow } from '../../types';

interface FlowCardProps {
  flow: Flow;
  onClick: () => void;
}

const FlowCard = ({ flow, onClick }: FlowCardProps) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={flow.imageUrl} 
          alt={flow.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-5 text-center">
        <h3 className="text-xl font-semibold text-neutral-800">{flow.name}</h3>
      </div>
    </motion.div>
  );
};

export default FlowCard;