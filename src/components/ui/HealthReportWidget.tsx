import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { translations } from '@/data/locales';

export function HealthReportWidget() {
    const { language } = useUserStore();
    const t = translations[language].onboarding?.healthReport;
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            if (t && t.facts) {
                setIndex((prev) => (prev + 1) % t.facts.length);
            }
        }, 5000);
        return () => clearInterval(timer);
    }, [t]);

    if (!t || !t.facts) return null;

    // Safety check in case of hot reload index mismatch
    const safeIndex = index % t.facts.length;
    const fact = t.facts[safeIndex];

    const colors = {
        danger: "bg-[#FFEBEE] border-[#FFCDD2] text-[#C62828]",
        caution: "bg-[#FFF8E1] border-[#FFECB3] text-[#F57F17]",
        info: "bg-[#E3F2FD] border-[#BBDEFB] text-[#1565C0]",
        success: "bg-[#E8F5E9] border-[#C8E6C9] text-[#2E7D32]"
    };

    return (
        <div className={`w-full p-4 rounded-2xl border-2 mb-4 transition-all duration-500 ${colors[fact.type as keyof typeof colors]}`}>
            <div className="flex justify-between items-center mb-1">
                <h3 className="font-black text-sm uppercase tracking-wider">📊 {t.title}</h3>
                <span className="text-xs bg-white/50 px-2 py-0.5 rounded-full font-bold">{safeIndex + 1}/{t.facts.length}</span>
            </div>
            <p className="font-bold text-lg mb-1">{fact.title}</p>
            <p className="text-sm font-medium opacity-90">{fact.text}</p>
        </div>
    );
}
