"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Leaf, LayoutDashboard, Search, Settings } from "lucide-react";
import { useUserStore } from "@/store/userStore";
export function AppShell({ children }: { children: React.ReactNode }) {
  const { language, setLanguage, hydrate, ready, storageError } =
    useUserStore();
  const en = language === "EN";
  const path = usePathname();
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  useEffect(() => {
    document.documentElement.lang = en ? "en" : "ko";
  }, [en]);
  const links = [
    ["/dashboard", "식사 기록", "Diary", LayoutDashboard],
    ["/meals", "음식 찾기", "Food search", Search],
    ["/onboarding", "내 설정", "Settings", Settings],
  ] as const;
  return (
    <div className="app">
      <a className="skip" href="#main">
        {en ? "Skip to content" : "본문 바로가기"}
      </a>
      <header className="app-header">
        <Link className="brand" href="/">
          <span className="brand-icon">
            <Leaf size={23} />
          </span>
          MediDiet
          <span className="brand-label">
            {en ? "FOOD & BALANCE" : "오늘의 식사, 차곡차곡"}
          </span>
        </Link>
        <div className="languages" aria-label="Language">
          {(["KO", "EN"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLanguage(l)}
              aria-pressed={language === l}
            >
              {l}
            </button>
          ))}
        </div>
      </header>
      <div className="workspace">
        <aside className="sidebar">
          <p className="eyebrow">MY MEDIDIET</p>
          <nav aria-label={en ? "Main" : "주요 메뉴"}>
            {links.map(([href, ko, eng, Icon]) => (
              <Link
                key={href}
                href={href}
                aria-current={
                  path.replace(/\/$/, "") === href ? "page" : undefined
                }
              >
                <Icon size={20} />
                {en ? eng : ko}
              </Link>
            ))}
          </nav>
          <div className="sidebar-note">
            <Leaf size={22} />
            <p>
              {en
                ? "Small records, better understanding."
                : "작은 기록이 모여 내 식사를 이해하게 됩니다."}
            </p>
            <span>
              {en
                ? "Your data stays in this browser."
                : "내 기록은 이 브라우저에만 저장됩니다."}
            </span>
          </div>
        </aside>
        <div className="main-column">
          <main id="main">
            {storageError && (
              <p className="notice" role="alert">
                {en
                  ? "Saved data could not be loaded or saved. Keep this tab open and export your records before leaving."
                  : "저장 데이터를 읽거나 저장하지 못했습니다. 이 탭을 유지하고 기록을 내보내 주세요."}
              </p>
            )}
            {ready ? (
              children
            ) : (
              <p className="loading" role="status">
                {en ? "Loading your workspace…" : "내 식단을 불러오는 중…"}
              </p>
            )}
          </main>
          <footer className="app-footer">
            <strong>MediDiet</strong>
            <p>
              {en
                ? "Nutrition records and information, not diagnosis or a prescription. Personal needs depend on treatment and health status."
                : "영양 기록과 정보 제공용이며 진단·처방을 대신하지 않습니다. 개인의 필요량은 건강 상태와 치료에 따라 달라집니다."}
            </p>
            <Link href="/about">
              {en ? "Data & privacy" : "데이터·개인정보 안내"}
            </Link>
          </footer>
        </div>
      </div>
    </div>
  );
}
