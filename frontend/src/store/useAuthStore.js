import { create } from "zustand";
import { axiosInstance } from "../lib/axios";  // Make sure axiosInstance is set up correctly

export const useAuthStore = create((set) => ({
  authUser: null,  // Initially, no user is authenticated
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,  // Initially, checking auth status

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");  // Send request to check auth status
      set({ authUser: res.data });  // If the check is successful, set the user data
    } catch (error) {
      console.log("Error in checkAuth:", error);  // If error, log it
      set({ authUser: null });  // Reset authUser to null
    } finally {
      set({ isCheckingAuth: false });  // Set checking to false once the request completes
    }
  },
}));
