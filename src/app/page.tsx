"use client";

import Link from 'next/link';
import { LargeButton } from '@/components/ui/LargeButton';
import { useUserStore } from '@/store/userStore';
import { translations } from '@/data/locales';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export default function Home() {
  const { language } = useUserStore();
  const t = translations[language].landing;
  const common = translations[language].common;

  return (
    <div className="flex flex-col h-full w-full items-center text-center space-y-6 relative py-12">

      {/* Main Kawaii Card */}
      <div className="kawaii-card w-full min-h-[70vh] flex flex-col items-center justify-center p-8 space-y-6 relative animate-bounce-float">

        {/* Logo Image */}
        <div className="w-full max-w-sm mx-auto transform hover:scale-105 transition-transform duration-300">
          <img
            src="/images/kawaii-logo.png"
            alt="MediDiet Logo"
            className="w-full h-auto drop-shadow-md"
          />
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold text-[#FF8A80] drop-shadow-sm mb-[-1rem]">
          {t.title}
        </h1>

        <p className="text-xl text-[#4E342E] whitespace-pre-line font-bold opacity-80 mt-2">
          {t.subtitle}
        </p>

        {/* Feature List */}
        <div className="w-full max-w-xs mx-auto bg-[#FFFDE7] p-6 rounded-3xl border-2 border-[#FFE082]">
          <ul className="text-left text-[#5D4037] space-y-4 list-none text-lg font-bold">
            {t.whyList.map((item, idx) => (
              <li key={idx} className="flex items-center space-x-3">
                <img src="/images/cute-leaf.png" alt="leaf" className="w-8 h-8 animate-pulse" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <div className="w-full max-w-xs pt-4">
          <Link href="/onboarding" className="w-full block transform hover:scale-105 transition-transform duration-300">
            <LargeButton variant="primary" className="shadow-lg">
              {common.start}
            </LargeButton>
          </Link>
          <p className="mt-4 text-[#FF8A80] text-sm font-bold">
            {t.freeNotice}
          </p>
        </div>
      </div>
    </div>
  );
}
