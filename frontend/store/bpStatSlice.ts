import { StateCreator } from "zustand";
import { API_URL } from "../constants/api";
import { AppState, BPStat, BPStatState } from "@/utils/types/types";

type AuthResponse = {
  bpStat: BPStat;
  message?: string;
};

export const createBPStatSlice: StateCreator<AppState, [], [], BPStatState> = (
  set,
  get
) => ({
  createBp: async (systolic, diastolic, heartRate) => {
    const token = get().token;

    //set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/bpStat/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ include token
        },
        body: JSON.stringify({
          systolic,
          diastolic,
          heartRate,
        }),
      });

      const data: AuthResponse = await response.json();

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";

      return { success: false, error: message };
    }
  },
});
