"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, Plus } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { parseNutrient } from "@/data/apiAdapter";
import {
  searchFoods,
  mfdsProxy,
  foodProvider,
  SearchError,
} from "@/lib/foodSearch";
import { getRecommendedMeals, localDate } from "@/lib/nutritionAlgorithm";
import { FoodItem, MealSlot, nutrientKeys } from "@/types";
import { nutrients, formatValue, slots } from "@/data/copy";
const proxy = mfdsProxy;
export default function Meals() {
  const { language, profile, isConfigured, addEntry } = useUserStore(),
    en = language === "EN";
  const [query, setQuery] = useState(""),
    [remote, setRemote] = useState<{ query: string; foods: FoodItem[] }>({
      query: "",
      foods: [],
    }),
    [loading, setLoading] = useState(false),
    [failed, setFailed] = useState(false),
    [rateLimited, setRateLimited] = useState(false);
  const [selected, setSelected] = useState<FoodItem | null>(null),
    [notice, setNotice] = useState("");
  const [portion, setPortion] = useState("1"),
    [slot, setSlot] = useState<MealSlot>("lunch"),
    [date, setDate] = useState(localDate());
  const [manual, setManual] = useState(false),
    [draft, setDraft] = useState<Record<string, string>>({}),
    [manualError, setManualError] = useState("");
  const formRef = useRef<HTMLElement>(null);
  const q = query.trim();
  const requestRef = useRef<AbortController | null>(null);
  const [verified, setVerified] = useState(false);
  useEffect(() => () => requestRef.current?.abort(), []);
  async function runSearch(e?: React.FormEvent) {
    e?.preventDefault();
    if (q.length < 2 || q.length > 60) return;
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setFailed(false);
    setRateLimited(false);
    setLoading(true);
    try {
      const foods = await searchFoods(proxy, q, controller.signal);
      if (!controller.signal.aborted) setRemote({ query: q, foods });
    } catch (error) {
      if (!controller.signal.aborted) {
        setRateLimited(
          error instanceof SearchError && error.code === "RATE_LIMIT",
        );
        setFailed(true);
        setRemote({ query: q, foods: [] });
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }
  const rows = getRecommendedMeals(
    profile,
    remote.query === q && q.length >= 2 ? remote.foods : [],
  );
  function choose(food: FoodItem) {
    setSelected(food);
    setVerified(food.source === "manual");
    setPortion("1");
    setNotice("");
    setTimeout(
      () =>
        formRef.current?.scrollIntoView({ behavior: "auto", block: "center" }),
      0,
    );
  }
  function record(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !verified) return;
    const value = Number(portion);
    const result = addEntry({
      id: crypto.randomUUID(),
      date,
      slot,
      food: selected,
      portions: value,
    });
    if (result) {
      setSelected(null);
      setNotice(
        en
          ? "Meal recorded. View it in your diary."
          : "식사를 기록했습니다. 내 기록에서 확인하세요.",
      );
    } else
      setNotice(
        en
          ? "Check the date and portion (more than 0, up to 20). A diary holds up to 3,000 entries."
          : "날짜와 제공량 배수(0 초과~20)를 확인해주세요. 기록은 최대 3,000개까지 보관합니다.",
      );
  }
  function prepareManual(e: React.FormEvent) {
    e.preventDefault();
    const name = draft.name?.trim(),
      serving = draft.serving?.trim();
    if (!name || !serving) {
      setManualError(
        en
          ? "Enter a food name and serving size."
          : "음식 이름과 영양표 기준 제공량을 입력해주세요.",
      );
      return;
    }
    const values = Object.fromEntries(
      nutrientKeys.map((k) => [k, parseNutrient(draft[k])]),
    ) as Pick<FoodItem, (typeof nutrientKeys)[number]>;
    if (
      nutrientKeys.every((k) => values[k] === null) ||
      nutrientKeys.some(
        (k) => draft[k]?.trim() && (values[k] === null || values[k]! > 100000),
      )
    ) {
      setManualError(
        en
          ? "Enter at least one valid nutrient. Leave unavailable values blank."
          : "영양소를 하나 이상 올바르게 입력하고, 모르는 값은 비워두세요.",
      );
      return;
    }
    const food: FoodItem = {
      ...values,
      id: "manual-" + crypto.randomUUID(),
      name,
      nameKo: name,
      serving,
      source: "manual",
      category: "Manual entry",
      categoryKo: "직접 입력",
      giIndex: null,
    };
    setManualError("");
    setManual(false);
    choose(food);
  }
  return (
    <div className="stack">
      <div className="heading">
        <div>
          <p className="eyebrow">FOOD EXPLORER</p>
          <h1>
            {en
              ? "Find food. Read the details."
              : "내가 먹는 음식, 자세히 보기"}
          </h1>
          <p>
            {en
              ? "Check the serving size before adding a food to your diary."
              : "제공량과 영양 정보를 확인하고 식사 기록에 추가하세요."}
          </p>
        </div>
        <button
          className="btn"
          onClick={() => {
            setManual(!manual);
            setSelected(null);
          }}
          aria-expanded={manual}
        >
          <Plus size={18} />
          {en ? "Enter nutrition label" : "영양표 직접 입력"}
        </button>
      </div>
      {!isConfigured && (
        <div className="notice">
          {en
            ? "You can browse without a profile. Set up a diary to save meals."
            : "설정 없이 음식을 살펴볼 수 있습니다. 식사를 저장하려면 노트를 먼저 만들어주세요."}{" "}
          <Link href="/onboarding">{en ? "Set up" : "설정하기"}</Link>
        </div>
      )}
      {manual && (
        <form className="panel stack" onSubmit={prepareManual}>
          <h2>
            {en ? "Nutrition label per serving" : "1회 제공량 기준 영양표"}
          </h2>
          <div className="form-grid">
            <label>
              {en ? "Food name" : "음식 이름"}
              <input
                required
                maxLength={160}
                value={draft.name || ""}
                onChange={(e) =>
                  setDraft((s) => ({ ...s, name: e.target.value }))
                }
              />
            </label>
            <label>
              {en ? "Serving shown on label" : "영양표 기준 제공량"}
              <input
                required
                maxLength={100}
                placeholder={en ? "e.g. 1 pack (200 g)" : "예: 1팩 (200 g)"}
                value={draft.serving || ""}
                onChange={(e) =>
                  setDraft((s) => ({ ...s, serving: e.target.value }))
                }
              />
            </label>
            {nutrientKeys.map((k) => (
              <label key={k}>
                {nutrients[k][en ? 1 : 0]} ({nutrients[k][2]})
                <input
                  type="number"
                  min="0"
                  max="100000"
                  step="any"
                  value={draft[k] || ""}
                  onChange={(e) =>
                    setDraft((s) => ({ ...s, [k]: e.target.value }))
                  }
                />
              </label>
            ))}
          </div>
          <p className="muted">
            {en
              ? "Leave unavailable nutrients blank. Zero means the label explicitly says zero."
              : "모르는 영양소는 비워두세요. 0은 영양표에 실제로 0이라고 적힌 경우에만 입력합니다."}
          </p>
          {manualError && (
            <p className="error" role="alert">
              {manualError}
            </p>
          )}
          <div className="actions">
            <button className="btn" type="submit">
              {en ? "Review entry" : "입력 내용 확인"}
            </button>
            <button
              className="btn secondary"
              type="button"
              onClick={() => setManual(false)}
            >
              {en ? "Cancel" : "취소"}
            </button>
          </div>
        </form>
      )}
      {selected && (
        <section className="panel" ref={formRef}>
          <h2>{en ? selected.name : selected.nameKo || selected.name}</h2>
          <p className="field-hint">
            {en ? "Nutrition per" : "영양 정보 기준"} {selected.serving} ·{" "}
            {en
              ? "Verify with the product label."
              : "실제 제품 영양표와 대조해주세요."}
          </p>
          <div className="nutrition">
            {nutrientKeys.map((k) => (
              <div key={k}>
                <span>{nutrients[k][en ? 1 : 0]}</span>
                <span>
                  {formatValue(selected[k], en)} {nutrients[k][2]}
                </span>
              </div>
            ))}
          </div>
          <form onSubmit={record} className="stack" style={{ marginTop: 20 }}>
            <div className="form-grid">
              <label>
                {en ? "Date" : "기록 날짜"}
                <input
                  type="date"
                  required
                  max={localDate()}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>
              <label>
                {en ? "Meal" : "식사"}
                <select
                  value={slot}
                  onChange={(e) => setSlot(e.target.value as MealSlot)}
                >
                  {Object.entries(slots).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v[en ? 1 : 0]}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {en
                  ? "Servings eaten (0.5 = half)"
                  : "먹은 제공량 배수 (0.5 = 절반)"}
                <input
                  type="number"
                  required
                  min="0.01"
                  max="20"
                  step="any"
                  value={portion}
                  onChange={(e) => setPortion(e.target.value)}
                />
              </label>
            </div>
            <div className="actions">
              {selected.source !== "manual" && (
                <label className="check">
                  <input
                    type="checkbox"
                    required
                    checked={verified}
                    onChange={(e) => setVerified(e.target.checked)}
                  />
                  {en
                    ? "I checked this product and its nutrition basis (100 g or 100 ml) against the label."
                    : "실제 제품과 영양 기준량(100 g 또는 100 ml)을 영양표에서 확인했습니다."}
                </label>
              )}
              <button
                disabled={!isConfigured || !verified}
                className="btn"
                type="submit"
              >
                {en ? "Save meal" : "식사 저장"}
              </button>
              <button
                className="btn secondary"
                type="button"
                onClick={() => setSelected(null)}
              >
                {en ? "Cancel" : "취소"}
              </button>
            </div>
          </form>
        </section>
      )}
      {notice && (
        <p className="status" role="status">
          {notice}{" "}
          <Link href="/dashboard" style={{ textDecoration: "underline" }}>
            {en ? "Open diary" : "내 기록 보기"}
          </Link>
        </p>
      )}
      <section>
        <label htmlFor="food-query" className="field-hint">
          {en
            ? "Food name · database search needs at least 2 characters"
            : "음식 이름 · 식품 DB 검색은 2글자 이상"}
        </label>
        <form className="actions" onSubmit={runSearch}>
          <div className="search-box" style={{ flex: 1, minWidth: 180 }}>
            <Search size={20} />
            <input
              id="food-query"
              type="search"
              maxLength={60}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                en ? "Product name, e.g. milk" : "제품 이름, 예: 우유"
              }
            />
          </div>
          <button
            className="btn"
            type="submit"
            disabled={loading || q.length < 2}
          >
            {en ? "Search" : "검색"}
          </button>
        </form>
        <p className="field-hint">
          {foodProvider === "openfoodfacts"
            ? en
              ? "Open Food Facts · community-contributed packaged food data. Compare with the actual label. Korean products may be missing."
              : "Open Food Facts · 이용자 참여형 포장 식품 데이터입니다. 실제 제품 영양표와 대조하세요. 일부 한국 제품은 없을 수 있습니다."
            : en
              ? "MFDS food database"
              : "식약처 식품 DB"}
        </p>
        {foodProvider === "openfoodfacts" && (
          <p className="field-hint">
            <a
              href="https://world.openfoodfacts.org"
              target="_blank"
              rel="noreferrer"
            >
              Open Food Facts
            </a>
            {" · "}
            <a
              href="https://opendatacommons.org/licenses/odbl/1-0/"
              target="_blank"
              rel="noreferrer"
            >
              ODbL
            </a>
            {" · "}
            {en
              ? "Search by pressing Enter or Search."
              : "검색 버튼 또는 Enter로 검색합니다."}
          </p>
        )}
        {failed && remote.query === q && (
          <div className="notice" role="alert">
            {rateLimited
              ? en
                ? "Too many searches. Wait a minute and retry."
                : "검색 요청이 많습니다. 잠시 후 다시 검색해주세요."
              : en
                ? "The food database is unavailable. Retry or enter a nutrition label."
                : "식품 DB에 연결하지 못했습니다. 다시 시도하거나 영양표를 직접 입력해주세요."}{" "}
            <button className="btn secondary small" onClick={() => runSearch()}>
              {en ? "Retry" : "다시 시도"}
            </button>
          </div>
        )}
        <p className="field-hint" role="status">
          {loading
            ? en
              ? "Searching database…"
              : "식품 DB 검색 중…"
            : en
              ? `${rows.length} results`
              : `검색 결과 ${rows.length}개`}
        </p>
        <div className="food-grid">
          {rows.map(({ food, reasons }) => (
            <article className="panel food-card" key={food.id}>
              <div className="actions">
                <span
                  className={
                    "badge" + (food.source === "example" ? " warn" : "")
                  }
                >
                  {food.source === "example"
                    ? en
                      ? "Example · unverified"
                      : "화면 예시 · 미검증"
                    : food.source === "openfoodfacts"
                      ? "Open Food Facts"
                      : "MFDS"}
                </span>
                {reasons.includes("MISSING_DATA") && (
                  <span className="badge warn">
                    {en ? "Some data unavailable" : "일부 정보 없음"}
                  </span>
                )}
              </div>
              <div>
                <h2>{en ? food.name : food.nameKo || food.name}</h2>
                <p className="field-hint">
                  {food.serving ||
                    (en
                      ? "Nutrition basis unverified · check label"
                      : "영양 기준량 미확인 · 제품 영양표 확인 필요")}
                </p>
              </div>
              {food.sourceUrl && (
                <a
                  className="field-hint"
                  href={food.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {en ? "View source product" : "원본 제품 정보 보기"}
                </a>
              )}
              <div className="nutrition">
                {nutrientKeys.map((k) => (
                  <div key={k}>
                    <span>{nutrients[k][en ? 1 : 0]}</span>
                    <span>
                      {formatValue(food[k], en)} {nutrients[k][2]}
                    </span>
                  </div>
                ))}
              </div>
              {profile.diseases.length > 0 && (
                <p className="field-hint">
                  {en
                    ? "This is not a condition-specific suitability assessment. Follow your care team’s guidance."
                    : "질환에 따른 적합성 판정이 아닙니다. 담당 의료진의 식사 지침을 따라주세요."}
                </p>
              )}
              {reasons.includes("ABOVE_DAILY_LIMIT") && (
                <p className="notice">
                  {en
                    ? "One serving exceeds a daily upper limit you entered. Check the amount."
                    : "1회 제공량이 입력한 하루 상한을 넘는 영양소가 있습니다. 섭취량을 확인하세요."}
                </p>
              )}
              <div className="actions">
                <button
                  className="btn secondary"
                  disabled={
                    !isConfigured || food.source === "example" || !food.serving
                  }
                  onClick={() => choose(food)}
                >
                  <Plus size={16} />
                  {en ? "Record this food" : "이 음식 기록"}
                </button>
              </div>
              {food.source === "example" && (
                <p className="field-hint">
                  {en
                    ? "Examples cannot be added to real meal totals."
                    : "예시 음식은 실제 식사 합계에 추가할 수 없습니다."}
                </p>
              )}
            </article>
          ))}
        </div>
        {!rows.length && !loading && (
          <div className="panel empty">
            <h2>{en ? "No matching foods" : "일치하는 음식이 없어요"}</h2>
            <p>
              {en
                ? "Search by food name or enter a nutrition label."
                : "음식 이름으로 검색하거나 영양표를 직접 입력해보세요."}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
