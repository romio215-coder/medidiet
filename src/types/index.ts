export type DiseaseType =
  "DM" | "HTN" | "DYS" | "CKD" | "OBESITY" | "COLORECTAL";
export const nutrientKeys = [
  "calories",
  "carbs",
  "protein",
  "fat",
  "sodium",
  "potassium",
  "sugar",
] as const;
export type NutrientKey = (typeof nutrientKeys)[number];
export interface UserProfile {
  name: string;
  age: string;
  gender: "Male" | "Female";
  height: string;
  weight: string;
  diseases: DiseaseType[];
  biometrics: {
    hba1c?: string;
    fastingGlucose?: string;
    systolicBp?: string;
    diastolicBp?: string;
  };
  limits?: Partial<Record<NutrientKey, number>>;
}
export type FoodItem = Record<NutrientKey, number | null> & {
  id: string;
  name: string;
  nameKo?: string;
  category: string;
  categoryKo?: string;
  giIndex: "Low" | "Medium" | "High" | null;
  source?: "example" | "mfds" | "manual" | "openfoodfacts";
  sourceUrl?: string;
  serving?: string;
};
export interface MealRecommendation {
  food: FoodItem;
  status: "INFO" | "REVIEW" | "INCOMPLETE";
  reasons: string[];
}
export type MealSlot = "breakfast" | "lunch" | "dinner" | "snack";
export interface MealEntry {
  id: string;
  date: string;
  slot: MealSlot;
  food: FoodItem;
  portions: number;
}
