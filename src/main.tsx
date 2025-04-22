import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { initCapacitor } from './utils/capacitor';
import AppInitializer from './components/common/AppInitializer';

// Initialize Capacitor features
document.addEventListener('DOMContentLoaded', () => {
  initCapacitor().catch(console.error);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppInitializer>
        <App />
      </AppInitializer>
    </BrowserRouter>
  </StrictMode>
);