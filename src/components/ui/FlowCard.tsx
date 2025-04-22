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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
    >
      <div className="h-32 md:h-48 overflow-hidden">
        <img 
          src={flow.imageUrl} 
          alt={flow.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-3 md:p-5 text-center">
        <h3 className="text-lg md:text-xl font-semibold text-neutral-800">{flow.name}</h3>
      </div>
    </motion.div>
  );
};

export default FlowCard;