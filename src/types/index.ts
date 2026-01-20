export type DiseaseType = 'DM' | 'HTN' | 'DYS' | 'CKD';

export interface UserProfile {
    name: string;
    age: string; // Using string for input forms, convert to number for logic
    gender: 'Male' | 'Female';
    height: string;
    weight: string;
    diseases: DiseaseType[];
    biometrics: {
        hba1c?: string;
        fastingGlucose?: string;
        systolicBp?: string;
        diastolicBp?: string;
    };
}

export interface FoodItem {
    id: string;
    name: string;
    nameKo?: string;
    category: string;
    categoryKo?: string;
    calories: number; // kcal
    carbs: number; // g
    protein: number; // g
    fat: number; // g
    sodium: number; // mg
    potassium: number; // mg
    sugar: number; // g
    giIndex: 'Low' | 'Medium' | 'High';
}

export interface MealRecommendation {
    food: FoodItem;
    status: 'SAFE' | 'CAUTION' | 'DANGER';
    reasons: string[];
}
