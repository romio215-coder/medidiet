"use client";

import { useUserStore } from '@/store/userStore';
import { translations } from '@/data/locales';

export function DisclaimerFooter() {
    const { language } = useUserStore();
    const t = translations[language].common;

    return (
        <div className="w-full mt-8 p-4 text-center border-t-2 border-[#D7CCC8]/30">
            <p className="text-[0.7rem] text-[#8D6E63] leading-relaxed whitespace-pre-wrap font-medium opacity-80">
                {t.disclaimer}
            </p>
        </div>
    );
}
