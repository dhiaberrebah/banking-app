// Core types for the application
export interface User {
    id: number;
    name: string;
    email: string;
    role: "user" | "admin";
  }
  
  export interface AuthContextType {
    currentUser: User | null;
    login: (email: string, password: string) => boolean;
    register: (userData: RegisterData) => boolean;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean; // Ajouté pour la vérification du rôle admin
  }
  
  export interface RegisterData {
    name: string;
    email: string;
    password: string;
  }
  
  export interface MockUser {
    id: number;
    name: string;
    email: string;
    password: string;
    role: "user" | "admin";
  }
  
  // Nouvelles interfaces pour les comptes et transactions
  export interface Account {
    id: number;
    userId: number;
    accountNumber: string;
    accountType: string;
    balance: number;
    currency: string;
    status: string;
  }
  
  export interface Transaction {
    id: number;
    accountId: number;
    date: string;
    description: string;
    amount: number;
    type: "deposit" | "withdrawal";
  }