import { create } from "zustand";
import { createAuthSlice, AuthState } from "./authSlice";
import { createBPStatSlice, BPStatState } from "./bpStatSlice";

export type AppState = AuthState & BPStatState; // add other slices here as needed;

export const useAppStore = create<AppState>()((...a) => ({
  ...createAuthSlice(...a), // add other slices here as needed
  ...createBPStatSlice(...a), // add other slices here as needed
}));
