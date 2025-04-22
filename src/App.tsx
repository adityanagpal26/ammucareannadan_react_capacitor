import { Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <div className="min-h-screen font-sans bg-neutral-50 text-neutral-900">
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