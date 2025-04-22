import { motion } from 'framer-motion';
import { Users, Calendar, Home } from 'lucide-react';
import { FundraiserStats as StatsType } from '../../types';

interface FundraiserStatsProps {
  stats?: StatsType;
  locationName?: string;
}

const FundraiserStats = ({ stats, locationName }: FundraiserStatsProps) => {
  // Add default empty stats when the stats prop is undefined
  const { totalMeals = 0, totalDays = 0, totalDonors = 0 } = stats || {};
  
  const statItems = [
    {
      icon: <Users size={18} className="text-primary-500" />,
      label: 'Total Donors',
      value: Number(totalDonors).toLocaleString(),
    },
    {
      icon: <Calendar size={18} className="text-primary-500" />,
      label: 'Days Served',
      value: Number(totalDays).toLocaleString(),
    },
  ];
  
  if (locationName) {
    statItems.push({
      icon: <Home size={18} className="text-primary-500" />,
      label: 'Location',
      value: locationName,
    });
  }
  
  return (
    <motion.div
      className="mt-4 md:mt-6 mb-6 md:mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-primary-50 p-3 md:p-4 rounded-lg border border-primary-100 mb-3 md:mb-4">
        <div className="flex items-center">
          <div className="p-1.5 md:p-2 bg-primary-100 rounded-full mr-2 md:mr-3">
            <span className="text-primary-500">🍲</span>
          </div>
          <div>
            <h3 className="text-neutral-700 font-medium text-xs md:text-sm">Total Meals Served</h3>
            <p className="text-lg md:text-xl font-bold text-primary-700">{Number(totalMeals).toLocaleString()}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4">
        {statItems.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-3 md:p-4 rounded-lg border border-neutral-200"
          >
            <div className="flex items-center">
              <div className="p-1.5 md:p-2 bg-primary-50 rounded-full mr-2 md:mr-3">
                {stat.icon}
              </div>
              <div>
                <h3 className="text-neutral-600 font-medium text-xs md:text-sm">{stat.label}</h3>
                <p className="text-base md:text-lg font-bold text-neutral-800">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default FundraiserStats;