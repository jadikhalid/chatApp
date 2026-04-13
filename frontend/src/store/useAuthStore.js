import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      // Vérifie si ton backend renvoie res.data ou res.data.user
      // Si signUp utilise res.data, checkAuth devrait probablement faire de même
      set({ authUser: res.data, isCheckingAuth: false });
    } catch (error) {
      console.log("Error checking auth:", error);
      set({ authUser: null, isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created succesfully");
    } catch (error) {
      toast.error("Account not created");
      console.log(error);
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/signout");
      set({ authUser: null });
      toast.success("Logged out succesfully");
    } catch (error) {
      toast.error("Logout failed");
      console.log(error);
    }
  },
}));
