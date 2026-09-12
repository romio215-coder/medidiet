"use client";
import Link from "next/link";
import { useState } from "react";
import { Plus, Download, Utensils } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { calculateTotals, localDate } from "@/lib/nutritionAlgorithm";
import { nutrients, slots, formatValue, conditions } from "@/data/copy";
import { nutrientKeys } from "@/types";
export default function Dashboard() {
  const { profile, entries, isConfigured, language, removeEntry, remember } =
    useUserStore();
  const en = language === "EN";
  const [date, setDate] = useState(localDate());
  if (!isConfigured)
    return (
      <section className="panel empty">
        <Utensils size={36} style={{ margin: "auto" }} />
        <h1>{en ? "Start your food diary" : "식단 노트를 시작해보세요"}</h1>
        <p>
          {en
            ? "Choose a nickname and storage preference first."
            : "별명과 저장 방식을 정하면 기록을 시작할 수 있어요."}
        </p>
        <Link href="/onboarding" className="btn">
          {en ? "Set up diary" : "설정 시작하기"}
        </Link>
      </section>
    );
  const records = entries.filter((e) => e.date === date),
    totals = calculateTotals(records);
  function download() {
    const body = JSON.stringify(
      { exportedAt: new Date().toISOString(), profile, entries },
      null,
      2,
    );
    const url = URL.createObjectURL(
      new Blob([body], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `medidiet-${localDate()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <div className="stack">
      <div className="heading">
        <div>
          <p className="eyebrow">MY FOOD DIARY</p>
          <h1>
            {en
              ? `${profile.name}’s food diary`
              : `${profile.name}님의 식사 기록`}
          </h1>
          <p>
            {en
              ? "What you recorded, without the guesswork."
              : "먹은 만큼 기록하고, 하루의 균형을 살펴보세요."}
          </p>
        </div>
        <Link className="btn" href="/meals">
          <Plus size={18} />
          {en ? "Record a meal" : "식사 기록하기"}
        </Link>
      </div>
      <div className="actions">
        <label htmlFor="diary-date">{en ? "Date" : "날짜"}</label>
        <input
          className="date-field"
          id="diary-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={localDate()}
        />
        <span className="badge">
          {en ? `${records.length} records` : `${records.length}개 기록`}
        </span>
      </div>
      <div className="metrics">
        {(["calories", "carbs", "protein", "sodium"] as const).map((k) => (
          <div className="metric" key={k}>
            <span>{nutrients[k][en ? 1 : 0]}</span>
            <strong
              className={
                profile.limits?.[k] && totals[k].value > profile.limits[k]!
                  ? "over"
                  : ""
              }
            >
              {records.length
                ? formatValue(
                    totals[k].missing === records.length
                      ? null
                      : totals[k].value,
                    en,
                  )
                : "—"}{" "}
              <small>{nutrients[k][2]}</small>
            </strong>
            <small>
              {totals[k].missing
                ? en
                  ? `${totals[k].missing} missing; partial sum`
                  : `${totals[k].missing}건 정보 없음 · 부분 합계`
                : en
                  ? "Recorded total"
                  : "기록한 음식의 합계"}
            </small>
            {profile.limits?.[k] && (
              <p>
                <small>
                  {en ? "Your daily upper limit" : "내 하루 상한"}{" "}
                  {profile.limits[k]} {nutrients[k][2]}
                </small>
              </p>
            )}
          </div>
        ))}
      </div>
      {nutrientKeys.some((k) => profile.limits?.[k]) && (
        <section className="panel">
          <h2>
            {en ? "Daily upper limits you entered" : "내가 입력한 하루 상한"}
          </h2>
          <div className="stack" style={{ marginTop: 16, gap: 10 }}>
            {nutrientKeys
              .filter((k) => profile.limits?.[k])
              .map((k) => (
                <p key={k}>
                  <strong>{nutrients[k][en ? 1 : 0]}</strong>
                  {" · "}
                  {profile.limits![k]} {nutrients[k][2]}
                  {" · "}
                  {totals[k].value > profile.limits![k]!
                    ? en
                      ? "Recorded total exceeds this limit"
                      : "기록 합계가 상한을 넘었습니다"
                    : totals[k].missing
                      ? en
                        ? "Incomplete data; total may be higher"
                        : "누락 정보가 있어 실제 합계는 더 높을 수 있습니다"
                      : records.length
                        ? en
                          ? "Recorded total is within this limit"
                          : "기록 합계가 입력한 상한 이내입니다"
                        : en
                          ? "No records for this date"
                          : "선택한 날의 기록 없음"}
                </p>
              ))}
          </div>
        </section>
      )}
      <section className="panel">
        <div className="heading">
          <h2>{en ? "Meals for this date" : "선택한 날의 식사"}</h2>
          <button
            className="btn secondary small"
            onClick={download}
            disabled={!entries.length}
          >
            <Download size={16} />
            {en ? "Export all" : "전체 기록 내보내기"}
          </button>
        </div>
        {!records.length ? (
          <div className="empty">
            <h3>
              {en ? "No meals recorded yet" : "아직 기록한 식사가 없어요"}
            </h3>
            <p>
              {en
                ? "Add a food to see your actual recorded totals here."
                : "음식을 추가하면 이곳에 실제 기록한 영양 합계가 표시됩니다."}
            </p>
            <Link className="btn secondary" href="/meals">
              {en ? "Find or enter food" : "음식 찾거나 직접 입력"}
            </Link>
          </div>
        ) : (
          records.map((e) => (
            <article className="record" key={e.id}>
              <div>
                <span className="badge">{slots[e.slot][en ? 1 : 0]}</span>
                <h3>{en ? e.food.name : e.food.nameKo || e.food.name}</h3>
                <p>
                  {e.food.serving} × {e.portions} ·{" "}
                  {formatValue(
                    e.food.calories === null
                      ? null
                      : e.food.calories * e.portions,
                    en,
                  )}{" "}
                  kcal
                </p>
                <p>
                  {e.food.source === "manual"
                    ? en
                      ? "Entered from a label"
                      : "영양표 직접 입력"
                    : e.food.source === "openfoodfacts"
                      ? "Open Food Facts · ODbL"
                      : "MFDS"}
                </p>
              </div>
              <button
                className="btn secondary small"
                aria-label={`${en ? "Delete" : "삭제"} ${e.food.name}`}
                onClick={() => {
                  if (
                    window.confirm(
                      en
                        ? "Remove this meal record?"
                        : "이 식사 기록을 삭제할까요?",
                    )
                  )
                    removeEntry(e.id);
                }}
              >
                {en ? "Delete" : "삭제"}
              </button>
            </article>
          ))
        )}
      </section>
      <div className="grid-two">
        <section className="panel">
          <h2>{en ? "Other nutrients" : "나머지 영양소"}</h2>
          <div className="nutrition" style={{ marginTop: 20 }}>
            {nutrientKeys
              .filter(
                (k) => !["calories", "carbs", "protein", "sodium"].includes(k),
              )
              .map((k) => (
                <div key={k}>
                  <span>{nutrients[k][en ? 1 : 0]}</span>
                  <span>
                    {records.length
                      ? formatValue(
                          totals[k].missing === records.length
                            ? null
                            : totals[k].value,
                          en,
                        )
                      : "—"}{" "}
                    {nutrients[k][2]}
                    {totals[k].missing ? " *" : ""}
                  </span>
                </div>
              ))}
          </div>
          <p className="field-hint">
            {en
              ? "* Partial sum when a nutrient is unavailable. Total sugars are not the same as free or added sugars."
              : "* 정보가 없는 음식은 합산하지 않은 부분 합계입니다. 총당류는 유리당·첨가당과 다릅니다."}
          </p>
        </section>
        <section className="panel">
          <h2>{en ? "Your preferences" : "나의 설정"}</h2>
          <div className="actions" style={{ marginTop: 18 }}>
            {profile.diseases.length ? (
              profile.diseases.map((d) => (
                <span className="badge" key={d}>
                  {conditions[d][en ? 1 : 0]}
                </span>
              ))
            ) : (
              <p className="muted">
                {en
                  ? "No health interests selected"
                  : "선택한 건강 관심사 없음"}
              </p>
            )}
          </div>
          <p className="field-hint">
            {remember
              ? en
                ? "Kept in this browser."
                : "이 브라우저에 보관 중입니다."
              : en
                ? "Stored for this browser session."
                : "현재 브라우저 세션에 저장 중입니다."}
          </p>
          <Link className="btn secondary small" href="/onboarding">
            {en ? "Edit settings" : "설정 변경"}
          </Link>
        </section>
      </div>
    </div>
  );
}
