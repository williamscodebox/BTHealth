import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/api";

type User = {
  id: string;
  username: string;
  email: string;
  profileImage: string;
  createdAt: string;
  updatedAt: string;
  // add other fields returned by your API
};

type AuthResult = { success: boolean; error?: string };

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isCheckingAuth: boolean;

  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<AuthResult>;

  login: (email: string, password: string) => Promise<AuthResult>;

  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isCheckingAuth: true,

  register: async (username, email, password) => {
    set({ isLoading: true });
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

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);

      set({ token: data.token, user: data.user, isLoading: false });

      return { success: true };
    } catch (err: unknown) {
      set({ isLoading: false });
      const message = err instanceof Error ? err.message : "Unknown error";
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

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Something went wrong");

      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);

      set({ token: data.token, user: data.user, isLoading: false });

      return { success: true };
    } catch (err: unknown) {
      set({ isLoading: false });
      const message = err instanceof Error ? err.message : "Unknown error";
      return { success: false, error: message };
    }
  },

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userJson = await AsyncStorage.getItem("user");
      const user = userJson ? JSON.parse(userJson) : null;

      set({ token, user });
    } catch (err) {
      console.log("Auth check failed", err);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    set({ token: null, user: null });
  },
}));
