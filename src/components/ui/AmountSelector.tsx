import { useState } from 'react';
import { motion } from 'framer-motion';

interface AmountSelectorProps {
  options: number[];
  unitType: 'meals' | 'coupons' | 'amount';
  defaultValue?: number;
  pricePerUnit?: number;
  onChange: (value: number) => void;
  minAmount?: number;
  allowCustomAmount?: boolean;
}

const AmountSelector = ({
  options,
  unitType,
  defaultValue,
  pricePerUnit = 0,
  onChange,
  minAmount = 11,
  allowCustomAmount = false,
}: AmountSelectorProps) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(defaultValue || options[0]);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
  
  const handleOptionClick = (value: number) => {
    if (value === -1 && allowCustomAmount) {
      setShowCustomInput(true);
    } else {
      setSelectedAmount(value);
      setShowCustomInput(false);
      onChange(value);
    }
  };
  
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= minAmount) {
      setSelectedAmount(numValue);
      onChange(numValue);
    }
  };
  
  const getUnitLabel = () => {
    switch (unitType) {
      case 'meals':
        return 'Meals';
      case 'coupons':
        return 'Coupons';
      case 'amount':
        return '₹';
      default:
        return '';
    }
  };
  
  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-neutral-800 mb-2">
          Select {unitType === 'amount' ? 'amount' : getUnitLabel()}
        </h3>
        {pricePerUnit > 0 && unitType !== 'amount' && (
          <p className="text-sm text-neutral-600 mb-3">
            ₹{pricePerUnit} per {unitType === 'meals' ? 'meal' : 'coupon'}
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-6">
        {options.map((option) => (
          <motion.button
            key={option}
            className={`relative py-4 px-3 rounded-xl border-2 text-center font-medium transition-all duration-300 
              ${selectedAmount === option
                ? 'border-primary-500 bg-primary-50/80 text-primary-700 shadow-lg'
                : 'border-neutral-200 text-neutral-700 hover:border-primary-200 hover:bg-primary-50/20'
              } overflow-hidden`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOptionClick(option)}
          >
            {/* Glowing border effect on hover */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-200/0 via-primary-200/30 to-primary-200/0 opacity-0 hover:opacity-100 transition-opacity duration-500" />
            
            {/* Content */}
            <div className="relative">
              {unitType === 'amount' ? '₹' : ''}{option}
            </div>
            
            {/* Selected indicator */}
            {selectedAmount === option && (
              <motion.div
                className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-500"
                layoutId="selected-indicator"
              />
            )}
          </motion.button>
        ))}
        
        {allowCustomAmount && (
          <motion.button
            className={`relative py-4 px-3 rounded-xl border-2 text-center font-medium transition-all duration-300
              ${showCustomInput
                ? 'border-primary-500 bg-primary-50/80 text-primary-700 shadow-lg'
                : 'border-neutral-200 text-neutral-700 hover:border-primary-200 hover:bg-primary-50/20'
              } overflow-hidden`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOptionClick(-1)}
          >
            {/* Glowing border effect on hover */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-200/0 via-primary-200/30 to-primary-200/0 opacity-0 hover:opacity-100 transition-opacity duration-500" />
            
            {/* Content */}
            <div className="relative">
              Custom
            </div>
          </motion.button>
        )}
      </div>
      
      {showCustomInput && (
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Enter custom amount (min: {unitType === 'amount' ? '₹' : ''}{minAmount})
          </label>
          <div className="relative">
            {unitType === 'amount' && (
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-neutral-500">₹</span>
              </div>
            )}
            <input
              type="number"
              className={`w-full px-4 ${unitType === 'amount' ? 'pl-7' : ''} py-3 border-2 border-neutral-200 
                rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-300
                transition-all duration-300`}
              placeholder={`Enter ${unitType === 'amount' ? 'amount' : getUnitLabel()}`}
              min={minAmount}
              value={customAmount}
              onChange={handleCustomAmountChange}
            />
          </div>
        </motion.div>
      )}
      
      {selectedAmount > 0 && (
        <motion.div
          className="mt-8 p-6 bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-xl border border-primary-200 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <div className="flex justify-between items-center">
            <span className="text-neutral-700 font-medium">
              {unitType === 'amount' ? 'Donation amount' : `${getUnitLabel()} selected`}:
            </span>
            <span className="text-xl font-bold text-primary-700">
              {unitType === 'amount' ? '₹' : ''}{selectedAmount}
            </span>
          </div>
          {unitType !== 'amount' && pricePerUnit > 0 && (
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-primary-200">
              <span className="text-neutral-700 font-medium">Total amount:</span>
              <span className="text-xl font-bold text-primary-700">
                ₹{(selectedAmount * pricePerUnit).toLocaleString()}
              </span>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AmountSelector;