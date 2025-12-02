export type AppState = AuthState & BPStatState; // add other slices here as needed;

export type User = {
  id: string;
  username: string;
  email: string;
  profileImage: string;
  createdAt: string;
  updatedAt: string;
  // add other fields returned by your API
};

type AuthResult = { success: boolean; error?: string };

type CategoryType =
  | "Uncategorized"
  | "Low"
  | "Normal"
  | "Elevated"
  | "Stage 1 Hypertension "
  | "Stage 2 Hypertension"
  | "Hypertensive Crisis";

export type BPStat = {
  _id: string;
  systolic: Number;
  diastolic: Number;
  heartRate: Number;
  category: CategoryType;
  user: string;
  createdAt: string;
  updatedAt: string;
  // add other fields returned by your API
};

export type BPStatState = {
  createBp: (
    systolic: Number,
    diastolic: Number,
    heartRate: Number
  ) => Promise<AuthResult>;
};

export type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isCheckingAuth: boolean;
  error: string | null;

  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<AuthResult>;

  login: (email: string, password: string) => Promise<AuthResult>;

  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
};
