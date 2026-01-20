"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function HomeButton() {
    const pathname = usePathname();

    // Hide on Landing Page
    if (pathname === '/') return null;

    return (
        <div className="absolute top-2 left-2 z-[100]">
            <Link href="/">
                <button
                    className="bg-white border-4 border-[#B9F6CA] rounded-full p-2 w-12 h-12 flex items-center justify-center shadow-md hover:scale-110 transition-transform group"
                    aria-label="Go to Home"
                >
                    <span className="text-2xl group-hover:animate-bounce">🏠</span>
                </button>
            </Link>
        </div>
    );
}
