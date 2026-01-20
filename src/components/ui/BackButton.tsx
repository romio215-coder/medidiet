"use client";
import { useRouter } from 'next/navigation';

interface BackButtonProps {
    onClick?: () => void;
    className?: string;
}

export function BackButton({ onClick, className = "" }: BackButtonProps) {
    const router = useRouter();

    const handleBack = () => {
        if (onClick) {
            onClick();
        } else {
            router.back();
        }
    };

    return (
        <div className={`absolute top-2 left-16 z-[100] ${className}`}>
            <button
                onClick={handleBack}
                className="bg-white border-4 border-[#FFCDD2] rounded-full p-2 w-12 h-12 flex items-center justify-center shadow-md hover:scale-110 transition-transform group"
                aria-label="Go Back"
            >
                <span className="text-2xl group-hover:-translate-x-1 transition-transform">⬅️</span>
            </button>
        </div>
    );
}
