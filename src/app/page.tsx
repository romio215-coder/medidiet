"use client";

import Link from 'next/link';
import { LargeButton } from '@/components/ui/LargeButton';
import { useUserStore } from '@/store/userStore';
import { translations } from '@/data/locales';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { useEffect } from 'react';

export default function Home() {
  const { language } = useUserStore();
  // const t = translations[language].landing;
  // const common = translations[language].common;

  // Redirect to /meals immediately
  useEffect(() => {
    // Use window.location to handle the basePath automatically or explicit path
    // Since we set basePath: '/medidiet', standard router.push('/meals') works relative to base, 
    // but for static export safety on gh-pages, explicit window location is robust.
    // Actually, asking the router is better.
    // But let's use the detailed request: "screen coming out immediately".

    // We can use next/navigation
    const timer = setTimeout(() => {
      window.location.href = '/medidiet/meals/';
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col h-full w-full items-center justify-center min-h-screen bg-[#FFFDE7]">
      <div className="text-2xl font-bold text-[#FF8A80] animate-bounce">
        Redirecting to MediDiet... 🥗
      </div>
    </div>
  );
}
