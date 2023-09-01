import { create } from "zustand";

export enum AuthMode {
  SIGN_UP = "sign_up",
  SIGN_IN = "sign_in",
  FORGOT_PASSWORD = "forgot_password",
}

export interface AuthStore {
  authMode: AuthMode;
  setAuthMode: (mode: AuthMode) => void;
  showAuthModal: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isAuthorized: boolean;
  setAuthorized: () => void;
  setUnauthorized: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  authMode: AuthMode.SIGN_IN,
  setAuthMode: (mode: AuthMode) => set(() => ({ authMode: mode })),

  showAuthModal: false,
  openAuthModal: () => set(() => ({ showAuthModal: true })),
  closeAuthModal: () =>
    set(() => ({ showAuthModal: false, authMode: AuthMode.SIGN_IN })),

  isAuthorized: false,
  setAuthorized: () => set(() => ({ isAuthorized: true })),
  setUnauthorized: () => set(() => ({ isAuthorized: false })),
}));
