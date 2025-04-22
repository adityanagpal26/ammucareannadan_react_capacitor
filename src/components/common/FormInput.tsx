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
        return <User size={18} />;
      case 'email':
        return <Mail size={18} />;
      case 'phone':
        return <Phone size={18} />;
      case 'address':
        return <MapPin size={18} />;
      case 'pan':
        return <CreditCard size={18} />;
      case 'reason':
        return <FileText size={18} />;
      default:
        return null;
    }
  };
  
  const IconComponent = getIcon();
  
  return (
    <div className={`mb-6 ${className}`}>
      <label 
        htmlFor={name} 
        className="block text-sm font-medium text-neutral-700 mb-2 flex items-center"
      >
        {IconComponent && (
          <span className={`mr-2 ${error ? 'text-secondary-500' : 'text-primary-500'}`}>
            {IconComponent}
          </span>
        )}
        {label}
        {required && <span className="text-secondary-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <motion.input
          id={name}
          {...register(name)}
          {...rest}
          className={`
            w-full px-4 py-3 
            border-2 rounded-xl
            shadow-sm
            transition-all duration-300
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
              className="mt-2 text-sm text-secondary-500 flex items-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
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