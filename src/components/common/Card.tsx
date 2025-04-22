import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  animate?: boolean;
}

const Card = ({
  children,
  className = '',
  onClick,
  animate = false,
}: CardProps) => {
  const baseStyles = 'bg-white rounded-xl shadow-md overflow-hidden';
  const clickableStyles = onClick ? 'cursor-pointer' : '';
  
  const cardStyles = `${baseStyles} ${clickableStyles} ${className}`;
  
  const CardComponent = animate ? motion.div : 'div';
  
  const animationProps = animate
    ? {
        whileHover: { y: -5, transition: { duration: 0.2 } },
        whileTap: { scale: 0.98 },
      }
    : {};
  
  return (
    <CardComponent
      className={cardStyles}
      onClick={onClick}
      {...animationProps}
    >
      {children}
    </CardComponent>
  );
};

export default Card;