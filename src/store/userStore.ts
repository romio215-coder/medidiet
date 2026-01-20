import { create } from 'zustand';
import { UserProfile } from '@/types';

interface UserState {
    profile: UserProfile;
    language: 'KO' | 'EN';
    setProfile: (profile: Partial<UserProfile>) => void;
    setLanguage: (lang: 'KO' | 'EN') => void;
    resetProfile: () => void;
    isConfigured: boolean;
    completeSetup: () => void;
}

const initialProfile: UserProfile = {
    name: '',
    age: '',
    gender: 'Male', // Default
    height: '',
    weight: '',
    diseases: [],
    biometrics: {},
};

export const useUserStore = create<UserState>((set) => ({
    profile: initialProfile,
    language: 'KO', // Default KO
    isConfigured: false,
    setProfile: (updates) =>
        set((state) => ({
            profile: { ...state.profile, ...updates },
        })),
    setLanguage: (lang) => set({ language: lang }),
    resetProfile: () => set({ profile: initialProfile, isConfigured: false }),
    completeSetup: () => set({ isConfigured: true }),
}));
