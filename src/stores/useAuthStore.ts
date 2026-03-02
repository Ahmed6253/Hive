import { create } from "zustand";

export interface AuthState {
  user: { name: string; email: string } | null;
  saveUser: (userData: { name: string; email: string } | null) => void;
  removeUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  saveUser: (userData) => set({ user: userData }),
  removeUser: () => set({ user: null }),
}));
