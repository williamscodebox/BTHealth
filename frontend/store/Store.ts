import { create } from "zustand";
import { createAuthSlice, AuthState } from "./authSlice";

type AppState = AuthState; // add other slices here as needed

export const useAppStore = create<AppState>()((...a) => ({
  ...createAuthSlice(...a), // add other slices here as needed
}));
