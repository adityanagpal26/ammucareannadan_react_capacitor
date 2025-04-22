import axios from 'axios';
import { 
  Flow, 
  Location, 
  Fundraiser, 
  DonationData, 
  Transaction, 
  PaymentGatewayResponse,
  ApiResponse
} from '../types';

const API_BASE_URL = 'https://api-staging.annadaan.ammucare.org/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flow endpoints
export const getFlows = async (): Promise<ApiResponse<Flow[]>> => {
  try {
    const response = await api.get('/annadaan-flows');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching flows:', error);
    return { success: false, error: 'Failed to fetch donation flows' };
  }
};

// Location endpoints
export const getLocations = async (): Promise<ApiResponse<Location[]>> => {
  try {
    const response = await api.get('/locations');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching locations:', error);
    return { success: false, error: 'Failed to fetch locations' };
  }
};

// Fundraiser endpoints
export const getFundraisers = async (
  locationId: string, 
  fundraiserType: string, 
  isCoupon: boolean = false
): Promise<ApiResponse<Fundraiser[]>> => {
  try {
    const response = await api.get('/fundraisers', {
      params: {
        locationId,
        fundraiserType,
        coupon: isCoupon ? 1 : 0,
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching fundraisers:', error);
    return { success: false, error: 'Failed to fetch fundraisers' };
  }
};

export const getFundraiser = async (id: string): Promise<ApiResponse<Fundraiser>> => {
  try {
    const response = await api.get(`/fundraisers/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Error fetching fundraiser ${id}:`, error);
    return { success: false, error: 'Failed to fetch fundraiser details' };
  }
};

export const getFundraiserStats = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await api.get('/fundraisers/stats');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching fundraiser stats:', error);
    return { success: false, error: 'Failed to fetch fundraiser statistics' };
  }
};

// Donation endpoints
export const createDonation = async (donationData: DonationData): Promise<ApiResponse<{ id: string }>> => {
  try {
    const response = await api.post('/donations', donationData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error creating donation:', error);
    return { success: false, error: 'Failed to create donation' };
  }
};

export const getDonation = async (id: string): Promise<ApiResponse<DonationData>> => {
  try {
    const response = await api.get(`/donations/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Error fetching donation ${id}:`, error);
    return { success: false, error: 'Failed to fetch donation details' };
  }
};

export const updateDonationStatus = async (
  id: string, 
  status: 'successful' | 'failure'
): Promise<ApiResponse<DonationData>> => {
  try {
    const endpoint = `/donations/${id}/${status}`;
    const response = await api.put(endpoint);
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Error updating donation ${id} status:`, error);
    return { success: false, error: 'Failed to update donation status' };
  }
};

// Transaction endpoints
export const createTransaction = async (
  donationId: string, 
  amount: number
): Promise<ApiResponse<Transaction>> => {
  try {
    const response = await api.post('/transactions', {
      donationId,
      amount,
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error creating transaction:', error);
    return { success: false, error: 'Failed to create transaction' };
  }
};

export const getTransaction = async (id: string): Promise<ApiResponse<Transaction>> => {
  try {
    const response = await api.get(`/transactions/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Error fetching transaction ${id}:`, error);
    return { success: false, error: 'Failed to fetch transaction details' };
  }
};

// Payment gateway endpoints
export const initiatePayment = async (
  transactionId: string
): Promise<ApiResponse<PaymentGatewayResponse>> => {
  try {
    const response = await api.post('/payment-gateway/payu/initiate-payment', {
      transactionId,
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error initiating payment:', error);
    return { success: false, error: 'Failed to initiate payment' };
  }
};

export const generatePaymentUrl = async (
  transactionId: string
): Promise<ApiResponse<{url: string}>> => {
  try {
    const response = await api.post('/payment-gateway/payu/generate-payment-url', {
      transactionId,
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error generating payment URL:', error);
    return { success: false, error: 'Failed to generate payment URL' };
  }
};

export const sendDonationEmail = async (
  donationId: string, 
  status: 'success' | 'failure'
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post('/payment-gateway/send-email', null, {
      params: {
        donationId,
        status,
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error sending donation email:', error);
    return { success: false, error: 'Failed to send donation email notification' };
  }
};

// App version check
export const checkAppVersion = async (version: string): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post('/app-version/check', { version });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error checking app version:', error);
    return { success: false, error: 'Failed to check app version' };
  }
};

// Photos preload
export const getPreloadPhotoUrls = async (): Promise<ApiResponse<string[]>> => {
  try {
    const response = await api.get('/preload-photo-urls');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching preload photo URLs:', error);
    return { success: false, error: 'Failed to fetch preload photo URLs' };
  }
};