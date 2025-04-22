import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import SplashScreen from './pages/SplashScreen';
import FlowSelection from './pages/FlowSelection';
import VideoScreen from './pages/VideoScreen';
import LocationsList from './pages/LocationsList';
import LocationDetails from './pages/LocationDetails';
import DonationAmount from './pages/DonationAmount';
import UserDetails from './pages/UserDetails';
import PaymentGateway from './pages/PaymentGateway';
import ThankYou from './pages/ThankYou';
import ErrorPage from './pages/ErrorPage';
import { setupBackButtonHandler, isNativePlatform, hideKeyboard } from './utils/capacitor';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // Setup mobile-specific event handlers
  useEffect(() => {
    if (isNativePlatform()) {
      // Handle Android back button
      const cleanupBackButton = setupBackButtonHandler(() => {
        // Custom logic for special cases can go here
        return false; // Return true to stop default behavior
      });

      // Hide keyboard when route changes
      hideKeyboard().catch(console.error);

      return () => {
        if (cleanupBackButton) cleanupBackButton();
      };
    }
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen font-sans bg-neutral-50 text-neutral-900 safe-area-inset">
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/select-flow" element={<FlowSelection />} />
        <Route path="/video/:flowType" element={<VideoScreen />} />
        <Route path="/locations/:flowType" element={<LocationsList />} />
        <Route path="/location/:locationId/:flowType" element={<LocationDetails />} />
        <Route path="/donate/:flowType/:locationId?" element={<DonationAmount />} />
        <Route path="/user-details/:flowType/:locationId?/:amount" element={<UserDetails />} />
        <Route path="/payment/:donationId" element={<PaymentGateway />} />
        <Route path="/thank-you/:donationId" element={<ThankYou />} />
        <Route path="/error/:errorType?" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;