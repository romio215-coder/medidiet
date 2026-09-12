import { create } from "zustand";
import { MealEntry, UserProfile } from "@/types";
import { validEntry, validProfile } from "@/lib/validation";
const KEY = "medidiet-v2";
const emptyProfile = (): UserProfile => ({
  name: "",
  age: "",
  gender: "Male",
  height: "",
  weight: "",
  diseases: [],
  biometrics: {},
  limits: {},
});
interface UserState {
  profile: UserProfile;
  language: "KO" | "EN";
  isConfigured: boolean;
  ready: boolean;
  remember: boolean;
  storageError: boolean;
  entries: MealEntry[];
  hydrate: () => void;
  setProfile: (p: Partial<UserProfile>) => void;
  setLanguage: (l: "KO" | "EN") => void;
  completeSetup: () => void;
  resetProfile: () => void;
  setRemember: (v: boolean) => void;
  addEntry: (e: MealEntry) => boolean;
  removeEntry: (id: string) => void;
}
export const useUserStore = create<UserState>((set, get) => ({
  profile: emptyProfile(),
  language: "KO",
  isConfigured: false,
  ready: false,
  remember: false,
  storageError: false,
  entries: [],
  hydrate() {
    if (get().ready) return;
    try {
      const value = localStorage.getItem(KEY) || sessionStorage.getItem(KEY);
      if (value) {
        const data = JSON.parse(value);
        if (
          data.version !== 2 ||
          !validProfile(data.profile) ||
          !Array.isArray(data.entries) ||
          data.entries.length > 3000 ||
          !data.entries.every(validEntry)
        )
          throw new Error("Invalid saved data");
        set({
          profile: data.profile,
          entries: data.entries,
          language: data.language === "EN" ? "EN" : "KO",
          isConfigured: true,
          remember: data.remember === true,
        });
      }
    } catch {
      set({ storageError: true });
    }
    set({ ready: true });
  },
  setProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),
  setLanguage: (language) => set({ language }),
  setRemember: (remember) => set({ remember }),
  completeSetup() {
    if (validProfile(get().profile))
      set({ isConfigured: true, storageError: false });
  },
  resetProfile: () =>
    set({
      profile: emptyProfile(),
      entries: [],
      isConfigured: false,
      remember: false,
      storageError: false,
    }),
  addEntry(e) {
    if (
      !get().isConfigured ||
      !validEntry(e) ||
      get().entries.length >= 3000 ||
      get().entries.some((row) => row.id === e.id)
    )
      return false;
    set((s) => ({ entries: [...s.entries, e] }));
    return true;
  },
  removeEntry: (id) =>
    set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),
}));
let writing = false;
useUserStore.subscribe((state) => {
  if (!state.ready || writing || state.storageError) return;
  writing = true;
  try {
    if (!state.isConfigured) {
      localStorage.removeItem(KEY);
      sessionStorage.removeItem(KEY);
    } else {
      const value = JSON.stringify({
        version: 2,
        profile: state.profile,
        entries: state.entries,
        language: state.language,
        remember: state.remember,
      });
      const target = state.remember ? localStorage : sessionStorage;
      target.setItem(KEY, value);
      (state.remember ? sessionStorage : localStorage).removeItem(KEY);
    }
  } catch {
    if (!state.storageError) useUserStore.setState({ storageError: true });
  } finally {
    writing = false;
  }
});
