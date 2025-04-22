import { InputHTMLAttributes, useState } from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, MapPin, CreditCard, FileText } from 'lucide-react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  required?: boolean;
  className?: string;
  icon?: string;
}

const FormInput = ({
  label,
  name,
  register,
  error,
  required = false,
  className = '',
  icon,
  ...rest
}: FormInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const getIcon = () => {
    switch (icon || name) {
      case 'name':
        return <User size={16} />;
      case 'email':
        return <Mail size={16} />;
      case 'phone':
        return <Phone size={16} />;
      case 'address':
        return <MapPin size={16} />;
      case 'pan':
        return <CreditCard size={16} />;
      case 'reason':
        return <FileText size={16} />;
      default:
        return null;
    }
  };
  
  const IconComponent = getIcon();
  
  // Get the register props separately
  const registerProps = register(name);
  
  return (
    <div className={`mb-4 md:mb-6 ${className}`}>
      <label 
        htmlFor={name} 
        className="block text-xs md:text-sm font-medium text-neutral-700 mb-1 md:mb-2 flex items-center"
      >
        {IconComponent && (
          <span className={`mr-1.5 md:mr-2 ${error ? 'text-secondary-500' : 'text-primary-500'}`}>
            {IconComponent}
          </span>
        )}
        {label}
        {required && <span className="text-secondary-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {/* Use a regular input instead of motion.input */}
        <input
          id={name}
          {...registerProps}
          {...rest}
          className={`
            w-full px-3 md:px-4 py-2 md:py-3 
            border-2 rounded-lg md:rounded-xl
            shadow-sm
            transition-all duration-300
            text-sm md:text-base
            ${error 
              ? 'border-secondary-300 focus:border-secondary-500 animate-shake' 
              : 'border-neutral-200 focus:border-primary-500'
            }
            ${isFocused ? 'ring-2 ring-primary-100' : ''}
            focus:outline-none
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        <AnimatePresence>
          {error && (
            <motion.p
              className="mt-1 md:mt-2 text-xs md:text-sm text-secondary-500 flex items-center"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
            >
              {error.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FormInput;