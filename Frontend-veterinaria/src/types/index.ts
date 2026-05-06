export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  image?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  userId?: string;
  customerEmail?: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

export type UserRole = 'admin' | 'veterinario' | 'cliente';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (role: UserRole) => boolean;
  login: () => void;
  logout: () => void;
  getAccessToken: () => Promise<string>;
} 