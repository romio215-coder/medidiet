import { NutrientKey } from "@/types";
export const nutrients: Record<NutrientKey, [string, string, string]> = {
  calories: ["열량", "Energy", "kcal"],
  carbs: ["탄수화물", "Carbohydrate", "g"],
  protein: ["단백질", "Protein", "g"],
  fat: ["지방", "Fat", "g"],
  sodium: ["나트륨", "Sodium", "mg"],
  potassium: ["칼륨", "Potassium", "mg"],
  sugar: ["총당류", "Total sugars", "g"],
};
export const conditions = {
  DM: ["당뇨병", "Diabetes"],
  HTN: ["고혈압", "Hypertension"],
  DYS: ["이상지질혈증", "Dyslipidemia"],
  CKD: ["만성신장질환", "Chronic kidney disease"],
  OBESITY: ["체중 관리", "Weight management"],
  COLORECTAL: ["대장 건강 관심", "Colorectal health"],
};
export const slots = {
  breakfast: ["아침", "Breakfast"],
  lunch: ["점심", "Lunch"],
  dinner: ["저녁", "Dinner"],
  snack: ["간식", "Snack"],
};
export const formatValue = (v: number | null, en = false) =>
  v === null
    ? en
      ? "Not available"
      : "정보 없음"
    : new Intl.NumberFormat(en ? "en-US" : "ko-KR", {
        maximumFractionDigits: 1,
      }).format(v);
