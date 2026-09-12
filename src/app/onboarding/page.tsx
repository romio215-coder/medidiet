"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { conditions, nutrients } from "@/data/copy";
import { DiseaseType, NutrientKey } from "@/types";
import { validProfile } from "@/lib/validation";
export default function Settings() {
  const store = useUserStore(),
    en = store.language === "EN",
    router = useRouter();
  const [name, setName] = useState(store.profile.name);
  const [selected, setSelected] = useState<DiseaseType[]>(
    store.profile.diseases,
  );
  const [limits, setLimits] = useState<Record<string, string>>(
    Object.fromEntries(
      Object.entries(store.profile.limits || {}).map(([k, v]) => [
        k,
        String(v),
      ]),
    ),
  );
  const [remember, setRemember] = useState(store.remember),
    [error, setError] = useState("");
  function save(e: React.FormEvent) {
    e.preventDefault();
    const parsed: Partial<Record<NutrientKey, number>> = {};
    for (const [k, v] of Object.entries(limits)) {
      if (v.trim()) {
        const n = Number(v);
        if (!Number.isFinite(n) || n <= 0 || n > 100000) {
          setError(
            en
              ? "Enter a positive daily limit."
              : "하루 기준은 0보다 큰 숫자로 입력해주세요.",
          );
          return;
        }
        parsed[k as NutrientKey] = n;
      }
    }
    const profile = {
      name: name.trim(),
      age: "",
      height: "",
      weight: "",
      gender: "Male" as const,
      biometrics: {},
      diseases: selected,
      limits: parsed,
    };
    if (!validProfile(profile)) {
      setError(
        en
          ? "Enter a nickname of 1–40 characters."
          : "별명을 1~40자로 입력해주세요.",
      );
      return;
    }
    store.setProfile(profile);
    store.setRemember(remember);
    store.completeSetup();
    router.push("/dashboard");
  }
  return (
    <>
      <div className="heading">
        <div>
          <p className="eyebrow">MY PREFERENCES</p>
          <h1>{en ? "Your diary, your settings" : "내 식단 노트 설정"}</h1>
          <p>
            {en
              ? "Only the information needed for your notes."
              : "기록에 필요한 정보만 간단히 입력하세요."}
          </p>
        </div>
      </div>
      <form className="stack" onSubmit={save}>
        <section className="panel">
          <h2 className="section-title">
            {en ? "About your diary" : "기본 설정"}
          </h2>
          <label htmlFor="nickname">{en ? "Nickname" : "별명"}</label>
          <p className="field-hint">
            {en
              ? "A real name, birthday, or contact details are not needed."
              : "실명, 생년월일, 연락처는 필요하지 않습니다."}
          </p>
          <input
            id="nickname"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
            required
            autoComplete="nickname"
            placeholder={
              en ? "How should we call you?" : "어떻게 불러드릴까요?"
            }
          />
        </section>
        <section className="panel">
          <h2>{en ? "Health interests (optional)" : "건강 관심사 (선택)"}</h2>
          <p className="field-hint">
            {en
              ? "Used to show relevant guidance, not to calculate a treatment diet. You can leave all unchecked."
              : "관련 안내를 보여주기 위한 정보이며 치료 식단을 자동 계산하지 않습니다. 선택하지 않아도 사용할 수 있습니다."}
          </p>
          <div className="choices">
            {Object.entries(conditions).map(([key, labels]) => (
              <label className="check" key={key}>
                <input
                  type="checkbox"
                  checked={selected.includes(key as DiseaseType)}
                  onChange={() =>
                    setSelected((s) =>
                      s.includes(key as DiseaseType)
                        ? s.filter((d) => d !== key)
                        : [...s, key as DiseaseType],
                    )
                  }
                />
                {labels[en ? 1 : 0]}
              </label>
            ))}
          </div>
          {selected.includes("CKD") && (
            <p className="notice" style={{ marginTop: 18 }}>
              {en
                ? "Potassium and protein needs vary with blood tests and treatment. No automatic kidney-diet restriction is applied."
                : "칼륨·단백질 필요량은 검사 결과와 치료에 따라 달라집니다. 신장 식단을 자동으로 제한하지 않습니다."}
            </p>
          )}
        </section>
        <section className="panel">
          <details>
            <summary>
              {en
                ? "Add daily upper limits (optional)"
                : "하루 상한 기준 입력 (선택)"}
            </summary>
            <p className="field-hint">
              {en
                ? "Only enter upper limits agreed with your clinician. These are not calorie or protein intake goals. Leave unknown values blank; no default is prescribed. Total sugars are different from free sugars."
                : "의료진과 정한 하루 상한이 있을 때만 입력하세요. 섭취 목표량이나 최소 필요량이 아닙니다. 모르는 값은 비워두며 자동 기준은 적용하지 않습니다. 총당류와 유리당은 다릅니다."}
            </p>
            <div className="form-grid">
              {Object.entries(nutrients).map(([k, labels]) => (
                <label key={k} htmlFor={"limit-" + k}>
                  {labels[en ? 1 : 0]} ({labels[2]})
                  <input
                    id={"limit-" + k}
                    type="number"
                    min="0.1"
                    max="100000"
                    step="any"
                    value={limits[k] || ""}
                    onChange={(e) =>
                      setLimits((s) => ({ ...s, [k]: e.target.value }))
                    }
                  />
                </label>
              ))}
            </div>
          </details>
        </section>
        <section className="panel">
          <h2>{en ? "Storage & privacy" : "저장과 개인정보"}</h2>
          <p className="field-hint">
            {en
              ? "By default, records survive a refresh in this tab and end with the browser session. Browsers may restore sessions. Use Delete all records when using a shared device."
              : "기본값은 이 탭의 세션 저장이며 새로고침해도 유지됩니다. 브라우저의 세션 복원 기능으로 남을 수 있으므로 공용 기기에서는 사용 후 전체 삭제하세요."}
          </p>
          <label className="check">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            {en
              ? "Keep my profile and diary in this browser after closing it"
              : "브라우저를 닫아도 이 기기에 설정과 식사 기록 보관"}
          </label>
          <p className="field-hint">
            {en
              ? "No account sync or server backup. Anyone with access to this browser profile can read stored data. Export a backup before clearing browser data."
              : "계정 동기화나 서버 백업은 없습니다. 같은 브라우저 프로필에 접근하는 사람은 저장된 정보를 볼 수 있습니다. 브라우저 데이터를 지우기 전에 기록을 내보내세요."}
          </p>
        </section>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <div className="actions">
          <button className="btn" type="submit">
            {en ? "Save & open diary" : "저장하고 기록 시작"}
          </button>
          {store.isConfigured && (
            <button
              type="button"
              className="btn danger"
              onClick={() => {
                if (
                  window.confirm(
                    en
                      ? "Delete all profile and meal records in this browser? This cannot be undone."
                      : "이 브라우저의 설정과 식사 기록을 모두 삭제할까요? 복구할 수 없습니다.",
                  )
                ) {
                  store.resetProfile();
                  router.push("/");
                }
              }}
            >
              {en ? "Delete all records" : "내 기록 전체 삭제"}
            </button>
          )}
        </div>
      </form>
    </>
  );
}
