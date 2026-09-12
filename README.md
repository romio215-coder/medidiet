# MediDiet

한국어/영어 개인 식사 노트. Next.js 정적 내보내기와 Zustand를 사용합니다.

## 실행

Node.js 22 이상에서:

```sh
npm ci
npm run dev
```

`http://localhost:3000/medidiet/`를 엽니다. 검색 연결은 `.env.example`을 참고하며 없어도 영양표 직접 입력과 식사 기록이 작동합니다.

```sh
npm run lint
npm test
npm run build
```

결과는 `out/`에 생성되며 `/medidiet/` 경로로 서비스해야 합니다. `next start`는 정적 내보내기용 서버가 아닙니다.

## 데이터

실제 입력만 합산하고 없는 정보는 0과 구분합니다. 세션 저장이 기본이며 기기 보관은 선택입니다. 건강정보와 식사 기록을 검색 API에 보내지 않습니다. 조회용 식품 DB에 확인된 영양 기준량이 없으면 자동 기록을 허용하지 않습니다.

외부 검색 설정, 데이터 기준과 상용 운영 미완료 항목은 [LAUNCH.md](./LAUNCH.md)를 확인하세요.
