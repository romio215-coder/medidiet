"use client";
import { useUserStore } from "@/store/userStore";
export default function About() {
  const en = useUserStore((s) => s.language === "EN");
  return (
    <article className="panel prose">
      <p className="eyebrow">DATA & PRIVACY</p>
      <h1>{en ? "Understand your data" : "데이터와 개인정보 안내"}</h1>
      <h2 style={{ marginTop: 24 }}>
        {en ? "What this app does" : "서비스의 범위"}
      </h2>
      <p>
        {en
          ? "MediDiet is a personal food diary and nutrient information tool. It does not diagnose conditions, prescribe diets, or certify that a food is safe. Health interests do not produce automatic restrictions."
          : "메디다이어트는 개인 식사 기록과 영양 정보 확인 도구입니다. 질환을 진단하거나 식단을 처방하고 음식의 안전성을 보장하지 않습니다. 건강 관심사를 선택해도 자동으로 섭취를 제한하지 않습니다."}
      </p>
      <h2>{en ? "Where numbers come from" : "숫자의 출처"}</h2>
      <ul>
        <li>
          {en
            ? "Food search uses Open Food Facts by default, a community-contributed packaged food database under ODbL. It is not verified medical data. Nutrients are shown per 100 g or 100 ml; compare with the actual label. MFDS is used only when separately configured. Missing values remain unavailable."
            : "기본 식품 검색은 Open Food Facts의 이용자 참여형 포장 식품 데이터(ODbL)를 사용합니다. 검증된 의료 자료가 아닙니다. 100 g 또는 100 ml 기준이며 실제 영양표와 대조하세요. 식약처 연결은 별도 설정한 경우에만 사용합니다. 누락 정보는 정보 없음으로 표시합니다."}
        </li>
        <li>
          {en
            ? "Manual entry: values you type from a label. You are responsible for checking units and the amount."
            : "직접 입력: 사용자가 영양표를 보고 입력한 값입니다. 단위와 기준량을 확인해주세요."}
        </li>
        <li>
          {en
            ? "Totals include recorded foods only. Missing nutrients produce partial totals. Upper limits are values you enter, not personalized prescriptions."
            : "합계에는 기록한 음식만 포함됩니다. 누락 영양소가 있으면 부분 합계입니다. 하루 상한은 사용자가 입력한 값이며 맞춤 처방이 아닙니다."}
        </li>
      </ul>
      <p>
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
          Open Database License (ODbL)
        </a>
      </p>
      <h2>{en ? "Storage and network requests" : "저장과 네트워크 요청"}</h2>
      <p>
        {en
          ? "Your profile, health interests, and meal records are stored in this browser session by default. You may opt in to keeping them in local storage. Browsers can restore sessions. Data is not encrypted against another person using your browser profile. There is no account sync or server backup."
          : "별명, 건강 관심사, 식사 기록은 기본적으로 브라우저 세션에 저장됩니다. 기기 보관을 선택하면 로컬 저장소에 남습니다. 브라우저가 세션을 복원할 수 있으며, 같은 브라우저 프로필을 사용하는 다른 사람에게 암호화되어 숨겨지지 않습니다. 계정 동기화와 서버 백업은 없습니다."}
      </p>
      <p>
        {en
          ? "Search terms are sent directly to Open Food Facts, or to MFDS through a proxy if separately configured. Health interests and your diary are not included. Hosting and search providers may process network metadata such as IP addresses. Avoid entering names, medical details, or identifiers in the search box."
          : "검색어는 Open Food Facts로 직접 전송되며, 별도 설정 시 식약처 프록시로 전송됩니다. 건강 관심사와 식사 기록은 함께 보내지 않습니다. 호스팅·검색 제공자는 IP 주소 등 접속 정보를 처리할 수 있습니다. 검색창에는 이름, 진료 내용, 식별정보를 넣지 마세요."}
      </p>
      <p>
        {en
          ? "Export your records from the diary. Exported files contain your profile and meals; keep them private. Delete stored records in Settings, and also remove exported files separately if needed. Clearing browser data or changing devices can remove access to your records."
          : "식사 기록 화면에서 전체 기록을 내보낼 수 있습니다. 내보낸 파일에는 설정과 식사 내용이 포함되므로 안전하게 보관하세요. 설정에서 저장 기록을 모두 삭제할 수 있으며, 내보낸 파일은 별도로 삭제해야 합니다. 브라우저 데이터를 지우거나 기기를 바꾸면 기존 기록에 접근하지 못할 수 있습니다."}
      </p>
      <h2>{en ? "Further reading" : "영양 정보를 더 알아보려면"}</h2>
      <ul>
        <li>
          <a
            href="https://www.who.int/news-room/fact-sheets/detail/sodium-reduction"
            target="_blank"
            rel="noreferrer"
          >
            WHO — Sodium reduction
          </a>
        </li>
        <li>
          <a
            href="https://www.niddk.nih.gov/health-information/kidney-disease/chronic-kidney-disease-ckd/healthy-eating-adults-chronic-kidney-disease"
            target="_blank"
            rel="noreferrer"
          >
            NIDDK — Healthy eating with chronic kidney disease
          </a>
        </li>
        <li>
          <a
            href="https://www.foodsafetykorea.go.kr/"
            target="_blank"
            rel="noreferrer"
          >
            {en ? "MFDS / Food Safety Korea" : "식품안전나라"}
          </a>
        </li>
      </ul>
      <p>
        {en
          ? "These references provide general information. They do not validate every food value or provide an individualized treatment plan."
          : "위 자료는 일반 정보를 위한 참고자료입니다. 개별 음식 수치의 검증이나 개인별 치료 계획을 의미하지 않습니다."}
      </p>
    </article>
  );
}
