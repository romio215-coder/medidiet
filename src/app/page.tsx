"use client";

import { useUserStore } from '@/store/userStore';
import { LargeButton } from '@/components/ui/LargeButton';
import Link from 'next/link';
import Image from 'next/image';
import { translations } from '@/data/locales';

export default function Home() {
  const { language } = useUserStore();
  const t = translations[language].landing;
  const common = translations[language].common;

  return (
    <div className="flex flex-col h-full items-center justify-center py-6 text-center">
      {/* Kawaii Container */}
      <div className="kawaii-card w-full max-w-sm p-8 flex flex-col items-center space-y-8 animate-bounce-float">
        {/* Logo Area */}
        <div className="relative w-48 h-48 drop-shadow-xl">
          <Image
            src="/medidiet/images/kawaii-logo.png"
            alt="MediDiet Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Text Area */}
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-[#FF8A80] drop-shadow-sm">
            {t.title}
        </div>
        <p className="text-[#8D6E63] font-bold text-lg leading-relaxed whitespace-pre-wrap">
          {t.subtitle}
        </p>
      </div>

      {/* Features Highlight */}
      <ul className="text-left w-full space-y-2 bg-[#FFF9C4]/50 p-4 rounded-3xl border-2 border-[#FFF59D] border-dashed">
        {t.whyList.map((item, i) => (
          <li key={i} className="flex items-center text-[#5D4037] font-bold text-sm">
            <span className="mr-2 text-pink-400">💖</span> {item}
          </li>
        ))}
      </ul>

      {/* Start Button */}
      <div className="w-full pt-4">
        <Link href="/meals/">
          <LargeButton variant="primary" className="text-xl py-6 shadow-lg">
            {common.start}
          </LargeButton>
        </Link>
        <p className="text-[0.7rem] text-[#90A4AE] mt-4 font-bold opacity-70">
          {t.freeNotice}
        </p>
      </div>
    </div>
        </div >
    );
}
