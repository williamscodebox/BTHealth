import { create } from "zustand";
import { createAuthSlice } from "./authSlice";
import { createBPStatSlice } from "./bpStatSlice";
import { AppState } from "@/utils/types/types";

export const useAppStore = create<AppState>()((...a) => ({
  ...createAuthSlice(...a), // add other slices here as needed
  ...createBPStatSlice(...a), // add other slices here as needed
}));
