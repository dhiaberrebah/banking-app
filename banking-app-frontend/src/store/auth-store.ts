import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  age: number;
  gender: string;
  idCardNumber: string;
  role: string;
  accountStatus: string;
}

interface AuthState {
  currentUser: User | null;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; requiresVerification: boolean }>;
  logout: () => Promise<void>;
  register: (userData: FormData) => Promise<boolean>;
  verifyCode: (code: string, email: string) => Promise<boolean>;
  resendVerificationCode: (email: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  isLoading: true,
  
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get("http://localhost:5001/api/auth/checkAuth", {
        withCredentials: true
      });
      
      if (response.data.user) {
        set({ currentUser: response.data.user });
      } else {
        set({ currentUser: null });
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      set({ currentUser: null });
    } finally {
      set({ isLoading: false });
    }
  },
  
  login: async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/login", 
        { email, password },
        { withCredentials: true }
      );
      
      // If login is successful
      if (response.data.success) {
        // Check if verification is required
        if (response.data.requiresVerification) {
          // Store email for verification step
          localStorage.setItem('pendingVerificationEmail', response.data.email);
          toast.success("Credentials verified. Please check your email for verification code.");
          return { success: true, requiresVerification: true };
        } else {
          // No verification needed, set user directly
          set({ currentUser: response.data.user });
          toast.success("Login successful");
          return { success: true, requiresVerification: false };
        }
      } else {
        // Login failed with error from server
        toast.error(response.data.message || "Login failed");
        return { success: false, requiresVerification: false };
      }
    } catch (error: any) {
      // Handle error responses
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      
      // Handle specific account status messages
      if (error.response?.data?.accountStatus === "pending") {
        toast.info("Your account is pending approval");
      } else if (error.response?.data?.accountStatus === "refused") {
        toast.error("Your account registration has been declined");
      }
      
      return { success: false, requiresVerification: false };
    }
  },
  
  logout: async () => {
    try {
      await axios.post("http://localhost:5001/api/auth/logout", {}, 
        { withCredentials: true }
      );
      set({ currentUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  },
  
  register: async (userData) => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/signup",
        userData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      
      if (response.data.success) {
        toast.success("Registration successful! Please check your email for verification code.");
        return true;
      } else {
        toast.error(response.data.message || "Registration failed");
        return false;
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      return false;
    }
  },
  
  verifyCode: async (code, email) => {
    try {
      console.log(`Verifying code: ${code} for email: ${email}`);
      const response = await axios.post(
        "http://localhost:5001/api/auth/verify-code",
        { email, code },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Set user data after successful verification
        set({ currentUser: response.data.user });
        toast.success("Verification successful");
        return true;
      } else {
        toast.error(response.data.message || "Verification failed");
        return false;
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      const message = error.response?.data?.message || "Verification failed";
      toast.error(message);
      return false;
    }
  },
  
  resendVerificationCode: async (email) => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/resend-code",
        { email },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        toast.success("Verification code resent to your email");
        return true;
      } else {
        toast.error(response.data.message || "Failed to resend code");
        return false;
      }
    } catch (error) {
      const errorMessage = (error as any).response?.data?.message || "Failed to resend code";
      toast.error(errorMessage);
      console.error("Resend code error:", error);
      return false;
    }
  },
  
  forgotPassword: async (email) => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/forgot-password",
        { email },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        toast.success("Password reset code sent to your email");
        return true;
      } else {
        toast.error(response.data.message || "Failed to send password reset code");
        return false;
      }
    } catch (error) {
      const errorMessage = (error as any).response?.data?.message || "Failed to send password reset code";
      toast.error(errorMessage);
      console.error("Forgot password error:", error);
      return false;
    }
  },
  
  resetPassword: async (email, code, newPassword) => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/reset-password",
        { 
          email,
          code: code.toString(), // Ensure code is a string
          newPassword 
        },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        toast.success("Password reset successful. Please log in with your new password.");
        return true;
      } else {
        toast.error(response.data.message || "Failed to reset password");
        return false;
      }
    } catch (error) {
      const errorMessage = (error as any).response?.data?.message || "Failed to reset password";
      toast.error(errorMessage);
      console.error("Reset password error:", error);
      return false;
    }
  }
}));
