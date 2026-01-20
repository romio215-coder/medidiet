"use client";

import { useUserStore } from '@/store/userStore';

export function LanguageSwitcher() {
    const { language, setLanguage } = useUserStore();

    return (
        <div className="absolute top-2 right-2 z-[100]">
            <button
                onClick={() => setLanguage(language === 'KO' ? 'EN' : 'KO')}
                className="bg-white border-4 border-[#FFE082] rounded-full px-4 py-2 font-bold text-sm text-[#FF6F00] hover:bg-[#FFF8E1] transition-all shadow-md hover:scale-110 flex items-center gap-2"
            >
                <span>{language === 'KO' ? '🇺🇸 English' : '🇰🇷 한국어'}</span>
                <span className="text-lg">⭐</span>
            </button>
        </div>
    );
}
