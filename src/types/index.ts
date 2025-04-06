
export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  dateAdmitted: string;
  status: string;
  guardianInfo?: string;
  childPresent?: boolean;
  childUpdated?: boolean;
}

export interface Donation {
  id: string;
  donorId: string;
  donorName?: string;
  date: string;
  amount: number;
  currency: string;
  type: string;
  purpose: string;
  notes?: string;
}

export interface Sponsorship {
  id: string;
  donorId: string;
  donorName?: string;
  childId: string;
  childName?: string;
  startDate: string;
  endDate?: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annually';
  notes?: string;
  status: 'active' | 'ended';
}

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  dateReceived: string;
  supplier?: string;
  status?: 'normal' | 'lowStock' | 'nearExpiry';
}

export interface ClothingItem {
  id: string;
  name: string;
  category: string;
  type?: string; // Added to match the code using this property
  size: string;
  gender: string;
  quantity: number;
  condition: string;
  assignedTo?: string[]; // Changed from string to string[] as it's used as an array
  dateReceived?: string;
  location?: string;
  ageRange?: string; // Added to match the code using this property
  notes?: string; // Added to match the code using this property
}

export interface HealthRecord {
  id: string;
  childId: string;
  childFirstName?: string;
  childLastName?: string;
  date: string;
  type: string;
  description: string;
  doctor: string;
  hospital?: string;
  disease?: string;
  treatment?: string;
  cost?: number;
  isPaid: boolean;
  debt?: number;
  notes?: string;
  paymentReceipt?: string;
  pendingMedicines?: string[];
  childPresent?: boolean;
  childUpdated?: boolean;
}
