import { FoodItem, MealRecommendation, UserProfile } from '@/types';

export function getRecommendedMeals(user: UserProfile, foods: FoodItem[]): MealRecommendation[] {
    return foods.map((food) => {
        let status: 'SAFE' | 'CAUTION' | 'DANGER' = 'SAFE';
        const reasons: string[] = [];

        const isDM = user.diseases.includes('DM');
        const isHTN = user.diseases.includes('HTN');
        const isCKD = user.diseases.includes('CKD');

        // --- CKD Logic (Highest Priority) ---
        if (isCKD) {
            // Potassium check
            // High potassium foods (> 400mg) are dangerous for CKD
            if (food.potassium > 400) {
                status = 'DANGER';
                reasons.push('HIGH_POTASSIUM');
            } else if (food.potassium > 200) {
                // If not already danger, mark caution
                if (status === 'SAFE' || status === 'CAUTION') {
                    status = 'CAUTION';
                }
                reasons.push('MODERATE_POTASSIUM');
            }

            // Protein check (0.6g/kg is strict, but for single item, warn if very high protein density)
            // Heuristic: > 30g protein in one item might be too much for one meal for CKD
            if (food.protein > 35) {
                if (status !== 'DANGER') status = 'CAUTION'; // Not danger, but caution to limit portion
                reasons.push('HIGH_PROTEIN');
            }

            // Sodium for CKD
            if (food.sodium > 800) {
                status = 'DANGER';
                reasons.push('HIGH_SODIUM_KIDNEY');
            }
        }

        // --- Diabetes (DM) Logic ---
        if (isDM) {
            // Sugar
            if (food.sugar > 10) {
                if (status !== 'DANGER') {
                    status = isCKD ? status : 'CAUTION'; // If CKD already set DANGER, keep it.
                    if (!isCKD && food.sugar > 20) status = 'DANGER'; // High sugar is danger for DM
                }
                reasons.push('HIGH_SUGAR');
            }

            // GI Index
            if (food.giIndex === 'High') {
                if (status !== 'DANGER') {
                    status = (status === 'SAFE') ? 'CAUTION' : status;
                }
                reasons.push('HIGH_GI');
            }
        }

        // --- Hypertension (HTN) Logic ---
        if (isHTN) {
            // Sodium > 2000mg/day. For a single meal item, > 800mg is high.
            if (food.sodium > 800) {
                if (status !== 'DANGER') {
                    // If CKD/DM didn't mark danger, HTN marks danger for very high sodium
                    status = (food.sodium > 1200) ? 'DANGER' : 'CAUTION';
                }
                reasons.push('HIGH_SODIUM_BP');
            }
        }

        // --- Obesity Logic (Based on 2024 Report) ---
        if (user.diseases.includes('OBESITY')) {
            // Calorie Check (> 700kcal is heavy for one meal)
            if (food.calories > 700) {
                status = (status === 'SAFE') ? 'CAUTION' : status;
                reasons.push('HIGH_CALORIES');
            }
            // Fat Check (> 25g)
            if (food.fat > 25) {
                if (status !== 'DANGER') status = 'CAUTION';
                reasons.push('HIGH_FAT');
            }
            // Sugar Check (Strict)
            if (food.sugar > 15) {
                reasons.push('HIGH_SUGAR');
                if (status === 'SAFE') status = 'CAUTION';
            }
        }

        // --- Colorectal Cancer Prevention (Based on 2024 Report) ---
        if (user.diseases.includes('COLORECTAL')) {
            // "Westernized Diet" (High Fat) is a risk factor
            if (food.fat > 20) {
                reasons.push('HIGH_FAT_COLORECTAL');
                if (status === 'SAFE') status = 'CAUTION';
            }
            // Ideally prioritize Fiber, but we lack data. 
            // We flag processed/heavy items (High Sodium + High Fat often correlates)
            if (food.sodium > 1000 && food.fat > 20) {
                status = 'CAUTION';
                reasons.push('PROCESSED');
            }
        }

        // Default Healthy Checks (even if no disease selected, strict high sodium/sugar is bad)
        if (user.diseases.length === 0) {
            if (food.sodium > 1500) {
                status = 'CAUTION';
                reasons.push('VERY_HIGH_SODIUM');
            }
        }

        return { food, status, reasons };
    });
}
