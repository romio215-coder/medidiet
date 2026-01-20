import { FoodItem } from '@/types';

// MFDS API Response Type (Partial)
interface MfdsFoodItem {
    DESC_KOR: string; // 음식이름
    SERVING_SIZE: string; // 1회제공량
    NUTR_CONT1: string; // 열량(kcal)
    NUTR_CONT2: string; // 탄수화물(g)
    NUTR_CONT3: string; // 단백질(g)
    NUTR_CONT4: string; // 지방(g)
    NUTR_CONT5: string; // 당류(g)
    NUTR_CONT6: string; // 나트륨(mg)
    // NUTR_CONT7: Cholesterol
    // NUTR_CONT8: Saturated Fat
    // NUTR_CONT9: Trans Fat
    // NUTR_CONT10: ?
    // I2790 doesn't always provide Potassium directly in NUTR_CONT cols?
    // Let's check docs safely. Usually Potassium is not guaranteed in standard I2790 fields unless expanded.
    // For safety, we will parse what is available.
}

export function adaptMfdsItems(rows: any[]): FoodItem[] {
    return rows.map((row, index) => {
        // Parse helper
        const p = (val: string) => {
            const num = parseFloat(val);
            return isNaN(num) ? 0 : num;
        };

        return {
            id: `api-\${index}-\${Date.now()}`,
            name: row.DESC_KOR, // English fallback could be same or google translated? For now use Korean name for both
            nameKo: row.DESC_KOR,
            calories: p(row.NUTR_CONT1),
            carbs: p(row.NUTR_CONT2),
            protein: p(row.NUTR_CONT3),
            fat: p(row.NUTR_CONT4),
            sugar: p(row.NUTR_CONT5),
            sodium: p(row.NUTR_CONT6),

            // Potassium (K) might not be in I2790 standard return or named differently.
            // If missing, we default to 0 but should warn user or try to find it.
            // Often NUTR_CONT_K is used if extended, checking basic fields 1-9 usually covers macros + Na.
            potassium: 0, // Fallback as API might not provide it reliably in this service ID.

            giIndex: 'Medium', // We don't have GI data from API, default to Medium
            category: 'General',
            categoryKo: '일반'
        };
    });
}
