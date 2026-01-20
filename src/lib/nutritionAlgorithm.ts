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
                reasons.push('High Potassium (Risk for Kidneys)');
            } else if (food.potassium > 200) {
                // If not already danger, mark caution
                if (status === 'SAFE' || status === 'CAUTION') {
                    status = 'CAUTION';
                }
                reasons.push('Moderate Potassium');
            }

            // Protein check (0.6g/kg is strict, but for single item, warn if very high protein density)
            // Heuristic: > 30g protein in one item might be too much for one meal for CKD
            if (food.protein > 35) {
                if (status !== 'DANGER') status = 'CAUTION'; // Not danger, but caution to limit portion
                reasons.push('High Protein (Limit portion for CKD)');
            }

            // Sodium for CKD
            if (food.sodium > 800) {
                status = 'DANGER';
                reasons.push('High Sodium (Kidney Strain)');
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
                reasons.push('High Sugar');
            }

            // GI Index
            if (food.giIndex === 'High') {
                if (status !== 'DANGER') {
                    status = (status === 'SAFE') ? 'CAUTION' : status;
                }
                reasons.push('High GI (Blood Sugar Spike Risk)');
            } else if (food.giIndex === 'Low' && status === 'SAFE') {
                // Positive reinforcement could be handled elsewhere, but for now we just don't flag.
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
                reasons.push('High Sodium (BP Risk)');
            }
        }

        // --- Obesity Logic (Based on 2024 Report) ---
        if (user.diseases.includes('OBESITY')) {
            // Calorie Check (> 700kcal is heavy for one meal)
            if (food.calories > 700) {
                status = (status === 'SAFE') ? 'CAUTION' : status;
                reasons.push('High Calories');
            }
            // Fat Check (> 25g)
            if (food.fat > 25) {
                if (status !== 'DANGER') status = 'CAUTION';
                reasons.push('High Fat (Weight Management)');
            }
            // Sugar Check (Strict)
            if (food.sugar > 15) {
                reasons.push('High Sugar');
                if (status === 'SAFE') status = 'CAUTION';
            }
        }

        // --- Colorectal Cancer Prevention (Based on 2024 Report) ---
        if (user.diseases.includes('COLORECTAL')) {
            // "Westernized Diet" (High Fat) is a risk factor
            if (food.fat > 20) {
                reasons.push('High Fat (Colorectal Risk)');
                if (status === 'SAFE') status = 'CAUTION';
            }
            // Ideally prioritize Fiber, but we lack data. 
            // We flag processed/heavy items (High Sodium + High Fat often correlates)
            if (food.sodium > 1000 && food.fat > 20) {
                status = 'CAUTION';
                reasons.push('Processed/Heavy Meal (Limit for Gut Health)');
            }
        }

        // Default Healthy Checks (even if no disease selected, strict high sodium/sugar is bad)
        if (user.diseases.length === 0) {
            if (food.sodium > 1500) {
                status = 'CAUTION';
                reasons.push('Very High Sodium');
            }
        }

        return { food, status, reasons };
    });
}
