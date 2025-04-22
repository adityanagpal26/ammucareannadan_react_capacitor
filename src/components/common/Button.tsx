import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { isNativePlatform } from '../../utils/capacitor';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  animate?: boolean;
}

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className = '',
  icon,
  iconPosition = 'left',
  animate = false,
}: ButtonProps) => {
  const isMobile = isNativePlatform();
  const baseStyles = 'rounded-lg font-medium transition-colors flex items-center justify-center tap-highlight-transparent';
  
  const variantStyles = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700',
    secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 active:bg-secondary-700',
    outline: 'bg-transparent border-2 border-primary-500 text-primary-500 hover:bg-primary-50',
    text: 'bg-transparent text-primary-500 hover:text-primary-600 hover:bg-primary-50',
  };
  
  const sizeStyles = {
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2.5 px-5 text-base',
    lg: 'py-3 px-6 text-lg',
  };
  
  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer';
  
  const widthStyle = fullWidth ? 'w-full' : '';
  
  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${widthStyle} ${className}`;
  
  const iconStyles = 'flex items-center';
  const iconSpacing = iconPosition === 'left' ? 'mr-2' : 'ml-2';
  
  // Only use animation if explicitly requested
  const useAnimation = animate;
  const ButtonComponent = useAnimation ? motion.button : 'button';
  
  // Simplified animation props
  const animationProps = useAnimation
    ? {
        whileTap: { scale: 0.97 },
        transition: { 
          type: 'spring', 
          stiffness: 500, 
          damping: 20
        },
      }
    : {};
  
  const handleClick = (e: React.MouseEvent) => {
    if (onClick && !disabled) {
      onClick();
    }
  };
  
  return (
    <ButtonComponent
      type={type}
      className={buttonStyles}
      onClick={handleClick}
      disabled={disabled}
      {...animationProps}
    >
      {icon && iconPosition === 'left' && (
        <span className={`${iconStyles} ${iconSpacing}`}>{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className={`${iconStyles} ${iconSpacing}`}>{icon}</span>
      )}
    </ButtonComponent>
  );
};

export default Button;