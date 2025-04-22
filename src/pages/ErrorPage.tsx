import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import Container from '../components/common/Container';
import Button from '../components/common/Button';

const ErrorPage = () => {
  const { errorType } = useParams<{ errorType?: string }>();
  const navigate = useNavigate();
  
  const getErrorMessage = () => {
    switch (errorType) {
      case 'payment':
        return 'There was an issue processing your payment. No charges have been made to your account.';
      case 'server':
        return 'We are experiencing some technical difficulties. Please try again later.';
      default:
        return 'Something went wrong. Please try again.';
    }
  };
  
  const handleTryAgain = () => {
    if (errorType === 'payment') {
      // Go back to the previous page
      navigate(-1);
    } else {
      // Go to the home page
      navigate('/');
    }
  };
  
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
      <Container>
        <motion.div
          className="bg-white rounded-xl shadow-md p-6 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-6">
            <div className="bg-secondary-100 p-4 rounded-full">
              <AlertCircle className="w-12 h-12 text-secondary-500" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-neutral-800 text-center mb-2">
            Oops! Something Went Wrong
          </h1>
          
          <p className="text-neutral-600 text-center mb-6">
            {getErrorMessage()}
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/select-flow')}
            >
              Go Home
            </Button>
            
            <Button
              variant="primary"
              onClick={handleTryAgain}
            >
              Try Again
            </Button>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default ErrorPage;