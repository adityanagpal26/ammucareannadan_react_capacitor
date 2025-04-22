import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
  height?: string;
  animate?: boolean;
}

const ProgressBar = ({
  value,
  max,
  label,
  showPercentage = true,
  className = '',
  height = 'h-2',
  animate = true,
}: ProgressBarProps) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  
  return (
    <div className={`w-full ${className}`}>
      {label && <p className="text-sm font-medium text-neutral-600 mb-1">{label}</p>}
      <div className={`w-full bg-neutral-200 rounded-full ${height}`}>
        <motion.div
          className="bg-primary-500 rounded-full h-full"
          style={{ width: `${percentage}%` }}
          initial={animate ? { width: 0 } : { width: `${percentage}%` }}
          animate={animate ? { width: `${percentage}%` } : undefined}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
      {showPercentage && (
        <div className="mt-1 text-xs text-neutral-500 flex justify-between">
          <span>{label ? `${value}/${max} ${label}` : `${value}/${max}`}</span>
          <span>{percentage}%</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;