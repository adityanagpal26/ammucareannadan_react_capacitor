export interface Flow {
  id: number;
  fundraiserType: string;
  name: string;
  label: string;
  imageUrl: string;
  coupon: boolean;
  locationsEnabled: boolean;
}

export interface Photo {
  id: number;
  photoUrl: string;
  thumbnailUrl: string;
}

export interface Location {
  id: number;
  name: string;
  hasCoupons: boolean;
  photo: Photo;
}

export interface FundraiserPhoto {
  id: number;
  visible: boolean;
  photo: Photo;
}

export interface CoverPhoto {
  id: number;
  visible: boolean;
  photo: Photo;
}

export interface FundraiserOption {
  id: number;
  value: number;
}

export interface Fundraiser {
  id: number;
  name: string;
  description: string;
  mealsDonated: number;
  volunteers: number;
  donors: number;
  unitType: string;
  fundraiserType: string;
  couponsEnabled: boolean;
  currencyCode: string;
  segments: any[];
  baseMealsDonated: number;
  startDate: string;
  endDate: string;
  projectStartDate: string;
  target: number;
  unitPrice: number;
  createdAt: string;
  originalFundraiserId: number | null;
  coverPhoto: CoverPhoto;
  locationId: number;
  donationsCount: number;
  percentageCompleted: number;
  totalFundraiserDonations: number;
  totalDays: number;
  location: Location;
  fundraiserPhotos: FundraiserPhoto[];
  fundraiserOptions: FundraiserOption[];
}

export interface FundraiserStats {
  totalMeals: number;
  totalDays: number;
  totalDonors: number;
}

export interface DonationFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  pan?: string;
  reason?: string;
  requireReceipt: boolean;
}

export interface DonationData {
  id?: string;
  flowType: string;
  locationId?: string;
  fundraiserId?: string;
  amount: number;
  units: number;
  userDetails: DonationFormData;
  status?: 'pending' | 'successful' | 'failed';
  paymentId?: string;
  transactionId?: string;
}

export interface Transaction {
  id: string;
  donationId: string;
  amount: number;
  status: string;
  paymentGateway: string;
  gatewayTransactionId?: string;
}

export interface PaymentGatewayResponse {
  url: string;
  transactionId: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}