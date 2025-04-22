import { ReactNode } from 'react';
import { motion } from 'framer-motion';

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
  const baseStyles = 'rounded-lg font-medium transition-colors flex items-center justify-center';
  
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
  
  const ButtonComponent = animate ? motion.button : 'button';
  
  const animationProps = animate
    ? {
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.97 },
        transition: { type: 'spring', stiffness: 400, damping: 17 },
      }
    : {};
  
  return (
    <ButtonComponent
      type={type}
      className={buttonStyles}
      onClick={onClick}
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