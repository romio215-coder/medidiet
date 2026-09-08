import { FoodItem, MealRecommendation, UserProfile } from '@/types';

type RiskStatus = MealRecommendation['status'];

const RISK_LEVEL: Record<RiskStatus, number> = {
    SAFE: 0,
    CAUTION: 1,
    DANGER: 2,
};

/**
 * Escalate risk only. A later rule must never downgrade DANGER to CAUTION
 * or CAUTION to SAFE when a user has multiple conditions.
 */
function raiseRisk(current: RiskStatus, next: RiskStatus): RiskStatus {
    return RISK_LEVEL[next] > RISK_LEVEL[current] ? next : current;
}

function addReason(reasons: string[], reason: string) {
    if (!reasons.includes(reason)) reasons.push(reason);
}

export function getRecommendedMeals(user: UserProfile, foods: FoodItem[]): MealRecommendation[] {
    return foods.map((food) => {
        let status: RiskStatus = 'SAFE';
        const reasons: string[] = [];

        const isDM = user.diseases.includes('DM');
        const isHTN = user.diseases.includes('HTN');
        const isCKD = user.diseases.includes('CKD');

        // NOTE: These thresholds are screening heuristics for the prototype UI,
        // not individualized medical advice. Keep them traceable to reviewed
        // clinical guidance before presenting them as patient-specific targets.

        // --- CKD Logic (Highest Priority) ---
        if (isCKD) {
            if (food.potassium > 400) {
                status = raiseRisk(status, 'DANGER');
                addReason(reasons, 'HIGH_POTASSIUM');
            } else if (food.potassium > 200) {
                status = raiseRisk(status, 'CAUTION');
                addReason(reasons, 'MODERATE_POTASSIUM');
            }

            if (food.protein > 35) {
                status = raiseRisk(status, 'CAUTION');
                addReason(reasons, 'HIGH_PROTEIN');
            }

            if (food.sodium > 800) {
                status = raiseRisk(status, 'DANGER');
                addReason(reasons, 'HIGH_SODIUM_KIDNEY');
            }
        }

        // --- Diabetes (DM) Logic ---
        if (isDM) {
            if (food.sugar > 20) {
                status = raiseRisk(status, 'DANGER');
                addReason(reasons, 'HIGH_SUGAR');
            } else if (food.sugar > 10) {
                status = raiseRisk(status, 'CAUTION');
                addReason(reasons, 'HIGH_SUGAR');
            }

            if (food.giIndex === 'High') {
                status = raiseRisk(status, 'CAUTION');
                addReason(reasons, 'HIGH_GI');
            }
        }

        // --- Hypertension (HTN) Logic ---
        if (isHTN && food.sodium > 800) {
            status = raiseRisk(status, food.sodium > 1200 ? 'DANGER' : 'CAUTION');
            addReason(reasons, 'HIGH_SODIUM_BP');
        }

        // --- Obesity Logic ---
        if (user.diseases.includes('OBESITY')) {
            if (food.calories > 700) {
                status = raiseRisk(status, 'CAUTION');
                addReason(reasons, 'HIGH_CALORIES');
            }
            if (food.fat > 25) {
                status = raiseRisk(status, 'CAUTION');
                addReason(reasons, 'HIGH_FAT');
            }
            if (food.sugar > 15) {
                status = raiseRisk(status, 'CAUTION');
                addReason(reasons, 'HIGH_SUGAR');
            }
        }

        // --- Colorectal Cancer Prevention ---
        if (user.diseases.includes('COLORECTAL')) {
            if (food.fat > 20) {
                status = raiseRisk(status, 'CAUTION');
                addReason(reasons, 'HIGH_FAT_COLORECTAL');
            }
            if (food.sodium > 1000 && food.fat > 20) {
                // Important: never overwrite a DANGER result from another rule.
                status = raiseRisk(status, 'CAUTION');
                addReason(reasons, 'PROCESSED');
            }
        }

        // Default healthy screening
        if (user.diseases.length === 0 && food.sodium > 1500) {
            status = raiseRisk(status, 'CAUTION');
            addReason(reasons, 'VERY_HIGH_SODIUM');
        }

        return { food, status, reasons };
    });
}
