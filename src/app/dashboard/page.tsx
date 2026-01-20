"use client";

import { useUserStore } from '@/store/userStore';
import { LargeButton } from '@/components/ui/LargeButton';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { translations } from '@/data/locales';

export default function Dashboard() {
    const { profile, isConfigured, language } = useUserStore();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const t = translations[language].dashboard;
    // const common = translations[language].common;
    const mealT = translations[language].meals;

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isConfigured) {
            router.push('/onboarding');
        }
    }, [isConfigured, router]);

    if (!mounted || !isConfigured) return null;

    return (
        <div className="flex flex-col h-full w-full p-6 space-y-8 relative">

            <div className="flex flex-col h-full w-full items-center py-6 relative">

                {/* Main Kawaii Card */}
                <div className="kawaii-card w-full min-h-[85vh] flex flex-col space-y-6 relative p-6">
                    {/* Header */}
                    <div className="flex flex-col items-center border-b-4 border-[#FFEBEE] border-dashed pb-4">
                        <h1 className="text-3xl font-black text-[#FF8A80] mb-2">{t.greeting} {profile.name}{t.sir}</h1>

                        {/* Disease Tags */}
                        <div className="flex flex-wrap gap-2 justify-center">
                            {profile.diseases.length > 0 ? (
                                profile.diseases.map(d => (
                                    <span key={d} className="bg-[#E1F5FE] text-[#0277BD] border-2 border-[#81D4FA] px-3 py-1 rounded-full font-bold text-sm shadow-sm">
                                        {d}
                                    </span>
                                ))
                            ) : (
                                <span className="bg-[#B9F6CA] text-[#1B5E20] border-2 border-[#69F0AE] px-4 py-1 rounded-full font-bold text-sm">
                                    {t.healthy}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Health Gauges */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-[#4E342E] flex items-center gap-2">
                            📊 {t.goalsTitle}
                        </h2>
                        <div className="space-y-5 bg-[#FFF9C4]/30 p-4 rounded-[2rem] border-2 border-[#FFF59D]">
                            <Gauge label={mealT.sodium} current={800} max={2000} unit="mg"
                                warning={profile.diseases.includes('HTN') || profile.diseases.includes('CKD')}
                            />
                            <Gauge label={mealT.sugar} current={15} max={50} unit="g"
                                warning={profile.diseases.includes('DM')}
                            />
                            {profile.diseases.includes('CKD') && (
                                <Gauge label={mealT.potassium} current={1200} max={2000} unit="mg" warning />
                            )}
                        </div>
                    </div>

                    {/* CTA (Note style inside parchment) */}
                    <div className="mt-auto bg-[#E1F5FE] p-5 rounded-[2rem] border-4 border-[#B3E5FC] text-center transform hover:scale-105 transition-all">
                        <h2 className="text-xl font-bold mb-2 text-[#0277BD]">🥗 {t.recommendedTitle}</h2>
                        <p className="mb-4 text-[#5D4037] text-sm">{t.recommendedDesc}</p>
                        <Link href="/meals">
                            <LargeButton variant="primary" className="shadow-md">
                                {t.viewPlan}
                            </LargeButton>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Gauge({ label, current, max, unit, warning }: { label: string, current: number, max: number, unit: string, warning?: boolean }) {
    const percent = Math.min((current / max) * 100, 100);
    const color = warning && percent > 80 ? 'bg-[#E07A5F]' : 'bg-[#6B8E23]';

    return (
        <div>
            <div className="flex justify-between mb-2 text-base font-bold">
                <span className={warning ? 'text-[#E07A5F]' : 'text-[#8D6E63]'}>{label}</span>
                <span className="text-[#A1887F] text-sm">{current} / {max} {unit}</span>
            </div>
            <div className="w-full bg-[#D7CCC8] h-3 rounded-full overflow-hidden relative border border-[#BCAAA4]">
                <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}
