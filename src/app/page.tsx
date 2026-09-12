"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { useUserStore } from "@/store/userStore";
export default function Home() {
  const { language, isConfigured } = useUserStore();
  const en = language === "EN";
  return (
    <>
      <div className="heading">
        <div>
          <p className="eyebrow">YOUR EVERYDAY NUTRITION</p>
          <p>
            {en
              ? "A little more understanding, one meal at a time."
              : "내 식사를 이해하는 가장 작은 시작"}
          </p>
        </div>
      </div>
      <section className="hero">
        <div className="hero-copy">
          <span className="badge">
            {en ? "A food diary, built around you" : "나를 위한 식사 노트"}
          </span>
          <h1>
            {en ? (
              <>
                Know your meals.
                <br />
                Find your balance.
              </>
            ) : (
              <>
                오늘 먹은 한 끼,
                <br />
                내일을 위한 기록.
              </>
            )}
          </h1>
          <p>
            {en
              ? "Check food information, record portions, and see the nutrients in your day. Keep your notes close, in your own browser."
              : "음식의 영양 정보를 확인하고 먹은 만큼 기록하세요. 하루의 식사를 한눈에 살펴볼 수 있습니다."}
          </p>
          <div className="actions">
            <Link
              className="btn"
              href={isConfigured ? "/dashboard" : "/onboarding"}
            >
              {en
                ? isConfigured
                  ? "Open diary"
                  : "Set up my diary"
                : isConfigured
                  ? "내 기록 보기"
                  : "내 식단 노트 시작"}
              <ArrowRight size={18} />
            </Link>
            <Link className="btn secondary" href="/meals">
              {en ? "Explore foods" : "음식 먼저 살펴보기"}
            </Link>
          </div>
        </div>
        <div className="hero-art">
          <Image
            src="/medidiet/images/kawaii-bg.png"
            alt=""
            fill
            priority
            sizes="(max-width:760px) 100vw, 40vw"
          />
        </div>
      </section>
      <div className="steps">
        {(en
          ? [
              [
                "01 / DISCOVER",
                "Read the details",
                "See serving sizes, data sources, and unavailable nutrients.",
              ],
              [
                "02 / RECORD",
                "Log what you ate",
                "Enter label values and record breakfast, lunch, dinner, or snacks.",
              ],
              [
                "03 / REFLECT",
                "Look at your day",
                "Review recorded totals without invented progress or automatic medical judgments.",
              ],
            ]
          : [
              [
                "01 / 살펴보기",
                "음식 정보 확인",
                "제공량과 출처를 확인하고, 없는 영양 정보는 구분해서 봅니다.",
              ],
              [
                "02 / 기록하기",
                "먹은 만큼 기록",
                "영양표 기준량과 실제로 먹은 양을 식사별로 기록합니다.",
              ],
              [
                "03 / 돌아보기",
                "하루 식사 한눈에",
                "기록한 내용만 합산해 확인하고, 내일의 식사를 준비합니다.",
              ],
            ]
        ).map(([n, title, text]) => (
          <section className="panel" key={n}>
            <span className="step-number">{n}</span>
            <h2>{title}</h2>
            <p>{text}</p>
          </section>
        ))}
      </div>
      <div className="notice" style={{ marginTop: 24 }}>
        <Plus size={16} style={{ display: "inline", marginRight: 8 }} />
        {en
          ? "For a prescribed diet, follow the targets agreed with your clinician. This app does not decide whether a food is safe for a condition."
          : "치료 식단이 필요하다면 의료진과 정한 기준을 우선하세요. 이 앱은 질환별 음식의 안전 여부를 판정하지 않습니다."}
      </div>
    </>
  );
}
