import type { Metadata } from "next";
import { Jua } from "next/font/google";
import "./globals.css";

const jua = Jua({
  weight: "400", // Jua only has 400 weight
  subsets: ["latin"],
  variable: "--font-jua",
});

export const metadata: Metadata = {
  title: "MediDiet - Senior Nutrition",
  description: "Personalized nutrition for seniors with chronic diseases",
};

import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { HomeButton } from "@/components/ui/HomeButton";
import { DisclaimerFooter } from "@/components/ui/DisclaimerFooter";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jua.className} antialiased text-lg text-[#3E2723]`}
      >
        <main className="min-h-screen flex flex-col items-center justify-start max-w-lg mx-auto p-4">
          <div className="w-full relative">
            <HomeButton />
            <LanguageSwitcher />
            {children}
            <DisclaimerFooter />
          </div>
        </main>
      </body>
    </html>
  );
}
