import { motion } from 'framer-motion';

interface HowItWorksProps {
  steps?: string[];
}

const HowItWorks = ({ steps = [] }: HowItWorksProps) => {
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
  
  // Don't render the component if steps array is empty
  if (!steps || steps.length === 0) {
    return null;
  }
  
  return (
    <motion.div
      className="mt-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <h2 className="text-xl font-semibold text-neutral-800 mb-4">How It Works</h2>
      
      <motion.div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="flex items-start"
            variants={item}
          >
            <div className="flex-shrink-0 w-8 h-8 bg-primary-500 rounded-full text-white flex items-center justify-center mr-3">
              {index + 1}
            </div>
            <div className="pt-1">
              <p className="text-neutral-700">{step}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default HowItWorks;