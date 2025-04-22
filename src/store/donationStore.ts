import { create } from 'zustand';
import { DonationData, DonationFormData } from '../types';

interface DonationState {
  currentDonation: Partial<DonationData>;
  setFlowType: (flowType: string) => void;
  setLocationId: (locationId: string) => void;
  setFundraiserId: (fundraiserId: string) => void;
  setAmount: (amount: number) => void;
  setUnits: (units: number) => void;
  setUserDetails: (userDetails: DonationFormData) => void;
  setDonationId: (donationId: string) => void;
  setPaymentId: (paymentId: string) => void;
  setTransactionId: (transactionId: string) => void;
  resetDonation: () => void;
}

export const useDonationStore = create<DonationState>((set) => ({
  currentDonation: {
    flowType: '',
    userDetails: {
      name: '',
      email: '',
      phone: '',
      address: '',
      requireReceipt: false,
    },
    amount: 0,
    units: 0,
  },
  setFlowType: (flowType) => set((state) => ({
    currentDonation: { ...state.currentDonation, flowType },
  })),
  setLocationId: (locationId) => set((state) => ({
    currentDonation: { ...state.currentDonation, locationId },
  })),
  setFundraiserId: (fundraiserId) => set((state) => ({
    currentDonation: { ...state.currentDonation, fundraiserId },
  })),
  setAmount: (amount) => set((state) => ({
    currentDonation: { ...state.currentDonation, amount },
  })),
  setUnits: (units) => set((state) => ({
    currentDonation: { ...state.currentDonation, units },
  })),
  setUserDetails: (userDetails) => set((state) => ({
    currentDonation: { ...state.currentDonation, userDetails },
  })),
  setDonationId: (id) => set((state) => ({
    currentDonation: { ...state.currentDonation, id },
  })),
  setPaymentId: (paymentId) => set((state) => ({
    currentDonation: { ...state.currentDonation, paymentId },
  })),
  setTransactionId: (transactionId) => set((state) => ({
    currentDonation: { ...state.currentDonation, transactionId },
  })),
  resetDonation: () => set({
    currentDonation: {
      flowType: '',
      userDetails: {
        name: '',
        email: '',
        phone: '',
        address: '',
        requireReceipt: false,
      },
      amount: 0,
      units: 0,
    },
  }),
}));