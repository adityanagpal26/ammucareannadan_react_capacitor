import { motion } from 'framer-motion';

interface HowItWorksProps {
  steps?: string[];
}

const HowItWorks = ({ steps = [] }: HowItWorksProps) => {
  // Don't render the component if steps array is empty
  if (!steps || steps.length === 0) {
    return null;
  }
  
  return (
    <motion.div
      className="mt-6 md:mt-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-lg md:text-xl font-semibold text-neutral-800 mb-3 md:mb-4">How It Works</h2>
      
      <div className="space-y-3 md:space-y-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex items-start"
          >
            <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 bg-primary-500 rounded-full text-white flex items-center justify-center mr-2 md:mr-3 text-sm md:text-base">
              {index + 1}
            </div>
            <div className="pt-0.5 md:pt-1">
              <p className="text-sm md:text-base text-neutral-700">{step}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default HowItWorks;