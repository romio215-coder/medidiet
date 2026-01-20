import { useState, useEffect } from 'react';

const facts = [
    { title: "Obesity Alert", text: "Obesity rates doubled in 10 years (10.3% → 20.9%). Managing weight is key.", type: "danger" },
    { title: "Silent Killer", text: "56% of Hypertension patients don't have their BP under control.", type: "caution" },
    { title: "Cancer Trends", text: "Colorectal cancer is rising due to westernized diets. Eat more fiber!", type: "info" },
    { title: "Prevention First", text: "Chronic diseases account for 80% of medical costs. Prevention is better than cure.", type: "success" }
];

export function HealthReportWidget() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % facts.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const fact = facts[index];

    const colors = {
        danger: "bg-[#FFEBEE] border-[#FFCDD2] text-[#C62828]",
        caution: "bg-[#FFF8E1] border-[#FFECB3] text-[#F57F17]",
        info: "bg-[#E3F2FD] border-[#BBDEFB] text-[#1565C0]",
        success: "bg-[#E8F5E9] border-[#C8E6C9] text-[#2E7D32]"
    };

    return (
        <div className={`w-full p-4 rounded-2xl border-2 mb-4 transition-all duration-500 ${colors[fact.type as keyof typeof colors]}`}>
            <div className="flex justify-between items-center mb-1">
                <h3 className="font-black text-sm uppercase tracking-wider">📊 2024 Health Report</h3>
                <span className="text-xs bg-white/50 px-2 py-0.5 rounded-full font-bold">{index + 1}/{facts.length}</span>
            </div>
            <p className="font-bold text-lg mb-1">{fact.title}</p>
            <p className="text-sm font-medium opacity-90">{fact.text}</p>
        </div>
    );
}
