"use client";

import { useUserStore } from '@/store/userStore';
import { getRecommendedMeals } from '@/lib/nutritionAlgorithm';
import foodData from '@/data/foodData.json';
import { FoodItem } from '@/types';
import { useState, useMemo, useEffect } from 'react';
import { translations } from '@/data/locales';
import { adaptMfdsItems } from '@/data/apiAdapter';
import { BackButton } from '@/components/ui/BackButton';

export default function MealRecommendations() {
  const { profile, language } = useUserStore();
  const t = translations[language].meals;
  const common = translations[language].common;

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [apiResults, setApiResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch API on search (Note: This will not work on static GitHub Pages)
  useEffect(() => {
    const fetchApi = async () => {
      if (searchQuery.length < 2) {
        setApiResults([]);
        return;
      }
      setLoading(true);
      try {
        const key = '40b1066f060f492fadfd';
        const url = `https://openapi.foodsafetykorea.go.kr/api/${key}/I2790/json/1/10/DESC_KOR=${encodeURIComponent(searchQuery)}`;

        console.log("Fetching MFDS API (Client-side):", searchQuery);

        const res = await fetch(url);
        if (!res.ok) throw new Error("API not available or blocked by CORS");
        const rawData = await res.json();

        if (rawData.I2790 && rawData.I2790.row) {
          const adapted = adaptMfdsItems(rawData.I2790.row);
          setApiResults(adapted);
        }
      } catch (err) {
        console.warn("Search API skipped (Static Mode or Error)", err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce
    const timeout = setTimeout(fetchApi, 500);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // Merge Local + API
  const allFoods = useMemo(() => {
    // If searching, prioritize API results + partial local matches
    if (searchQuery) {
      const localMatches = (foodData as unknown as FoodItem[]).filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (f.nameKo && f.nameKo.includes(searchQuery))
      );
      return [...localMatches, ...apiResults];
    }
    // Default: just local
    return foodData as unknown as FoodItem[];
  }, [searchQuery, apiResults]);

  // Apply Algorithm
  const recommendations = useMemo(() => {
    return getRecommendedMeals(profile, allFoods);
  }, [profile, allFoods]);

  // Simple Category Filter
  const [filter, setFilter] = useState<'ALL' | 'SAFE' | 'CAUTION'>('ALL');

  const displayedMeals = recommendations.filter(rec => {
    if (filter === 'ALL') return true;
    return rec.status === filter;
  });

  return (
    <div className="flex flex-col h-full w-full items-center py-6 relative">
      <BackButton />

      {/* Main Kawaii Card */}
      <div className="kawaii-card w-full min-h-[85vh] flex flex-col space-y-4 relative p-6">
        <h1 className="text-3xl font-black text-[#FF8A80] text-center mb-2">🥗 {t.title}</h1>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder={common.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full kawaii-input py-3 px-4 text-lg bg-[#FAFAFA] pl-10"
          />
          <div className="absolute right-4 top-4 text-[#BDBDBD]">🍳</div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2">
          {['ALL', 'SAFE', 'CAUTION'].map((ft) => (
            <button
              key={ft}
              onClick={() => setFilter(ft as 'ALL' | 'SAFE' | 'CAUTION')}
              className={`flex-1 py-2 rounded-full font-bold transition-all border-2
                  ${filter === ft
                  ? 'bg-[#FF8A80] text-white border-[#FF8A80] shadow-md transform scale-105'
                  : 'bg-white text-[#90A4AE] border-[#CFD8DC] hover:bg-[#ECEFF1]'}
                `}
            >
              {ft === 'ALL' ? t.filterAll : ft === 'SAFE' ? '🥰 ' + common.safe : '😯 ' + common.caution}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 space-y-4 overflow-y-auto pb-4 custom-scrollbar px-1">
          {displayedMeals.map((item) => (
            <div key={item.food.id} className={`p-4 rounded-[1.5rem] flex flex-col space-y-2 border-2 transition-all hover:scale-[1.02] duration-200 shadow-sm
                ${item.status === 'SAFE' ? 'bg-[#F1F8E9] border-[#C5E1A5]' : ''}
                ${item.status === 'CAUTION' ? 'bg-[#FFF8E1] border-[#FFE082]' : ''}
                ${item.status === 'DANGER' ? 'bg-[#FFEBEE] border-[#FFCDD2]' : ''}
             `}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-[#4E342E]">
                    {language === 'KO' ? (item.food.nameKo || item.food.name) : item.food.name}
                  </h3>
                  <p className="text-[#90A4AE] text-sm font-bold">
                    {language === 'KO' ? (item.food.categoryKo || item.food.category) : item.food.category} • {item.food.calories} kcal
                  </p>
                </div>
                <div className="text-2xl">
                  {item.status === 'SAFE' ? '🥰' : item.status === 'CAUTION' ? '😯' : '😱'}
                </div>
              </div>

              {/* Nutrition details */}
              <div className="text-sm font-bold text-[#795548] grid grid-cols-2 gap-x-4 gap-y-1 mt-1 bg-white/50 p-2 rounded-xl">
                <span>{t.sodium}: {item.food.sodium}mg</span>
                <span>{t.sugar}: {item.food.sugar}g</span>
                <span>{t.carbs}: {item.food.carbs}g</span>
                <span>{t.protein}: {item.food.protein}g</span>
                <span>{t.fat}: {item.food.fat}g</span>
                {profile.diseases.includes('CKD') && (
                  <span className="text-[#E64A19]">{t.potassium}: {item.food.potassium}mg</span>
                )}
              </div>

              {/* Status Message */}
              {item.reasons.length > 0 && (
                <p className="text-sm font-bold text-[#D32F2F] bg-[#FFCDD2] p-2 rounded-lg text-center">
                  ⚠️ {item.reasons.map(code => (
                    // Only try to translate if it's a known code, otherwise show as is (fallback)
                    t.warningCodes && t.warningCodes[code as keyof typeof t.warningCodes]
                      ? t.warningCodes[code as keyof typeof t.warningCodes]
                      : code
                  )).join(', ')}
                </p>
              )}
            </div>
          ))}

          {displayedMeals.length === 0 && (
            <div className="text-center py-10 opacity-50">
              <span className="text-6xl">🥕</span>
              <p className="text-[#8D6E63] font-bold text-xl mt-4">{loading ? common.loading : t.noResults}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
