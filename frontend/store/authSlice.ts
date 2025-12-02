import { StateCreator } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/api";
import { AppState, AuthState, User } from "@/utils/types/types";

type AuthResult = { success: boolean; error?: string };

type AuthResponse = {
  user: User;
  token: string;
  message?: string;
};

const STORAGE_KEYS = {
  user: "auth_user",
  token: "auth_token",
};

export const createAuthSlice: StateCreator<AppState, [], [], AuthState> = (
  set
) => ({
  user: null,
  token: null,
  isLoading: false,
  isCheckingAuth: true,
  error: null,

  register: async (username, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data: AuthResponse = await response.json();

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      await AsyncStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data.user));
      await AsyncStorage.setItem(STORAGE_KEYS.token, data.token);

      set({ token: data.token, user: data.user, isLoading: false });

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data: AuthResponse = await response.json();

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      await AsyncStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data.user));
      await AsyncStorage.setItem(STORAGE_KEYS.token, data.token);

      set({ token: data.token, user: data.user, isLoading: false });

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      set({ isLoading: false, error: message });
      return { success: false, error: message };
    }
  },

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.token);
      const userJson = await AsyncStorage.getItem(STORAGE_KEYS.user);
      const user = userJson ? JSON.parse(userJson) : null;

      set({ token, user });
    } catch (err) {
      console.log("Auth check failed", err);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.token);
    await AsyncStorage.removeItem(STORAGE_KEYS.user);
    set({ token: null, user: null, error: null });
  },
});
