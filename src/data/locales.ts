export const translations = {
    KO: {
        common: {
            next: "다음",
            save: "저장하기",
            start: "건강 분석 시작하기",
            loading: "로딩 중...",
            safe: "안심",
            caution: "주의",
            danger: "위험",
            all: "전체",
            search: "음식 검색...",
            voiceSearch: "음성 검색",
            disclaimer: "본 서비스에서 제공하는 영양 정보 및 식단 추천은 단순 참고용 데이터이며 의학적 진단이나 처방을 대신할 수 없습니다. 개인의 체질과 질환 진행 정도에 따라 실제 필요한 영양소는 달라질 수 있습니다."
        },
        landing: {
            title: "메디다이어트",
            subtitle: "시니어를 위한\n만성질환 맞춤 영양 관리",
            whyTitle: "내 손 안의 영양사",
            whyList: [
                "나의 질환에 딱 맞는 식단 추천",
                "나트륨, 당, 칼륨 주의 알림",
                "신장질환자 맞춤 안전 가이드"
            ],
            freeNotice: "복잡한 가입 없이 바로 사용하세요."
        },
        onboarding: {
            step1Title: "기본 정보",
            step2Title: "건강 상태",
            name: "이름",
            age: "나이",
            gender: "성별",
            male: "남성",
            female: "여성",
            height: "키 (cm)",
            weight: "몸무게 (kg)",
            selectDisease: "해당하는 질환을 모두 선택해주세요:",
            diseases: {
                DM: "당뇨병 (Diabetes)",
                HTN: "고혈압 (Hypertension)",
                DYS: "이상지질혈증 (Dyslipidemia)",
                CKD: "만성신장질환 (CKD)",
                OBESITY: "비만 (Obesity)",
                COLORECTAL: "암 예방 (Cancer Prevention)"
            },
            warnings: {
                CKD: "칼륨과 단백질 섭취를 자동으로 제한합니다.",
                OBESITY: "체중 감량을 위해 칼로리와 지방 섭취를 제한합니다.",
                COLORECTAL: "항암 건강을 위해 가공식품을 줄이고 자연식을 권장합니다."
            },
            healthReport: {
                title: "최신 건강 리포트",
                facts: [
                    { title: "비만 경보", text: "비만 유병률이 10년 새 2배 급증했습니다 (10.3% → 20.9%). 체중 관리가 시급합니다.", type: "danger" },
                    { title: "조용한 살인자", text: "고혈압 환자의 56%는 혈압 관리가 제대로 되지 않고 있습니다.", type: "caution" },
                    { title: "암 발생 변화", text: "서구화된 식습관으로 대장암 등 서구형 암이 증가하고 있습니다. 채소 섭취를 늘리세요!", type: "info" },
                    { title: "예방이 최선", text: "만성질환이 전체 진료비의 80%를 차지합니다. 치료보다 예방이 중요합니다.", type: "success" }
                ]
            },
            alertInfo: "이름과 나이를 입력해주세요."
        },
        dashboard: {
            greeting: "안녕하세요,",
            goalsTitle: "오늘의 영양 목표",
            recommendedTitle: "🥗 오늘의 추천 메뉴",
            recommendedDesc: "현재 건강 상태에 딱 맞는 안전한 식단을 찾았습니다.",
            viewPlan: "식단 보러가기",
            healthy: "건강함",
            sir: " 님"
        },
        meals: {
            title: "식단 가이드",
            done: "완료",
            filterAll: "전체",
            filterSafe: "안심 ✅",
            filterCaution: "주의 ⚠️",
            sodium: "나트륨",
            sugar: "당류",
            carbs: "탄수화물",
            protein: "단백질",
            fat: "지방",
            potassium: "칼륨",
            noResults: "해당하는 음식이 없습니다.",
            reasons: "이유"
        }
    },
    EN: {
        common: {
            next: "Next",
            save: "Save Profile",
            start: "Start Health Analysis",
            loading: "Loading...",
            safe: "SAFE",
            caution: "CAUTION",
            danger: "AVOID",
            all: "All",
            search: "Search foods...",
            voiceSearch: "Voice Search",
            disclaimer: "The nutrition information provided is for reference only and does not replace professional medical diagnosis or treatment. Nutritional needs may vary by individual."
        },
        landing: {
            title: "MediDiet",
            subtitle: "Chronic Disease Management\nMade Simple for Seniors",
            whyTitle: "Why MediDiet?",
            whyList: [
                "Personalized meal plans",
                "Warning for high sodium/sugar",
                "Kidney-safe recommendations"
            ],
            freeNotice: "No sign-up required. Free to use."
        },
        onboarding: {
            step1Title: "Basic Information",
            step2Title: "Health Conditions",
            name: "Name",
            age: "Age",
            gender: "Gender",
            male: "Male",
            female: "Female",
            height: "Height (cm)",
            weight: "Weight (kg)",
            selectDisease: "Select all that apply:",
            diseases: {
                DM: "Diabetes (DM)",
                HTN: "Hypertension (High BP)",
                DYS: "Dyslipidemia",
                CKD: "Chronic Kidney Disease",
                OBESITY: "Obesity (BMI > 25)",
                COLORECTAL: "Cancer Prevention"
            },
            warnings: {
                CKD: "We will limit Potassium & Protein",
                OBESITY: "We will restrict calories & fat for weight loss.",
                COLORECTAL: "We recommend whole foods and less processed items."
            },
            healthReport: {
                title: "Latest Health Report",
                facts: [
                    { title: "Obesity Alert", text: "Obesity rates doubled in 10 years (10.3% → 20.9%). Managing weight is key.", type: "danger" },
                    { title: "Silent Killer", text: "56% of Hypertension patients don't have their BP under control.", type: "caution" },
                    { title: "Cancer Trends", text: "Westernized diets are increasing cancer risks. Eat more fiber!", type: "info" },
                    { title: "Prevention First", text: "Chronic diseases account for 80% of medical costs. Prevention is better than cure.", type: "success" }
                ]
            },
            alertInfo: "Please enter Name and Age"
        },
        dashboard: {
            greeting: "Good Morning,",
            goalsTitle: "Today's Nutrition Goals",
            recommendedTitle: "🥗 Recommended Meal",
            recommendedDesc: "Based on your condition, we found safe meals for you.",
            viewPlan: "View Meal Plan",
            healthy: "Healthy",
            sir: ""
        },
        meals: {
            title: "Meal Plan",
            done: "Done",
            filterAll: "All",
            filterSafe: "Safe ✅",
            filterCaution: "Caution ⚠️",
            sodium: "Sodium",
            sugar: "Sugar",
            carbs: "Carbs",
            protein: "Protein",
            fat: "Fat",
            potassium: "K+",
            noResults: "No foods found.",
            reasons: "Reason"
        }
    }
};
