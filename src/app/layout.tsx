import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
export const metadata: Metadata = {
  title: {
    default: "메디다이어트 | 식사 기록과 영양 정보",
    template: "%s | MediDiet",
  },
  description:
    "먹은 음식을 기록하고 제공량과 영양 정보를 확인하는 개인 식단 노트.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
