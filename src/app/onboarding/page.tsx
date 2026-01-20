"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { LargeButton } from '@/components/ui/LargeButton';
import { DiseaseType } from '@/types';
import { translations } from '@/data/locales';

export default function Onboarding() {
    const router = useRouter();
    const { setProfile, completeSetup, language } = useUserStore();
    const t = translations[language].onboarding;
    const common = translations[language].common;
    const [step, setStep] = useState(1);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: 'Male' as 'Male' | 'Female',
        height: '',
        weight: ''
    });
    const [selectedDiseases, setSelectedDiseases] = useState<DiseaseType[]>([]);

    const toggleDisease = (d: DiseaseType) => {
        if (selectedDiseases.includes(d)) {
            setSelectedDiseases(prev => prev.filter(item => item !== d));
        } else {
            setSelectedDiseases(prev => [...prev, d]);
        }
    };

    const handleNext = () => {
        if (step === 1) {
            if (!formData.name || !formData.age) return alert(t.alertInfo);
            setStep(2);
        } else {
            // Finish
            setProfile({
                ...formData,
                diseases: selectedDiseases
            });
            completeSetup();
            router.push('/dashboard');
        }
    };

    return (
        <div className="flex flex-col h-full w-full items-center py-6 relative">
            {/* Main Kawaii Card */}
            <div className="kawaii-card w-full flex-1 flex flex-col relative p-6">
                {/* Progress Bar (Cute Pink) */}
                <div className="w-full bg-[#FFECB3] h-6 rounded-full mb-6 mt-2 overflow-hidden relative border-2 border-[#FFCA28]">
                    <div
                        className="bg-[#FF4081] h-full transition-all duration-500 rounded-full relative"
                        style={{ width: step === 1 ? '50%' : '100%' }}
                    >
                        {/* Shine effect */}
                        <div className="absolute top-1 left-2 w-[90%] h-[0.5rem] bg-white/30 rounded-full"></div>
                    </div>
                </div>

                <h1 className="text-2xl font-black text-[#4E342E] mb-6 text-center drop-shadow-sm flex items-center justify-center gap-2">
                    {step === 1 ? '📝 ' + t.step1Title : '🩺 ' + t.step2Title}
                </h1>

                <div className="flex-1 overflow-y-auto pb-4 px-2 custom-scrollbar">
                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[#FF8A80] font-bold mb-2 ml-1 text-lg">{t.name}</label>
                                <input
                                    type="text"
                                    className="w-full kawaii-input placeholder-[#D7CCC8]"
                                    placeholder={t.name}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[#FF8A80] font-bold mb-2 ml-1 text-lg">{t.age}</label>
                                    <input
                                        type="number"
                                        className="w-full kawaii-input placeholder-[#D7CCC8]"
                                        placeholder="65"
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[#FF8A80] font-bold mb-2 ml-1 text-lg">{t.gender}</label>
                                    <select
                                        className="w-full kawaii-input bg-white"
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' })}
                                    >
                                        <option value="Male">{t.male}</option>
                                        <option value="Female">{t.female}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[#FF8A80] font-bold mb-2 ml-1 text-lg">{t.height}</label>
                                    <input
                                        type="number"
                                        className="w-full kawaii-input placeholder-[#D7CCC8]"
                                        placeholder="170"
                                        value={formData.height}
                                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[#FF8A80] font-bold mb-2 ml-1 text-lg">{t.weight}</label>
                                    <input
                                        type="number"
                                        className="w-full kawaii-input placeholder-[#D7CCC8]"
                                        placeholder="70"
                                        value={formData.weight}
                                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <p className="text-[#8D6E63] mb-4 text-lg font-bold text-center bg-[#FFF9C4] p-3 rounded-xl border border-[#FFF176]">
                                {t.selectDisease}
                            </p>

                            <div className="grid gap-3">
                                <DiseaseCard
                                    label={t.diseases.DM}
                                    selected={selectedDiseases.includes('DM')}
                                    onClick={() => toggleDisease('DM')}
                                />
                                <DiseaseCard
                                    label={t.diseases.HTN}
                                    selected={selectedDiseases.includes('HTN')}
                                    onClick={() => toggleDisease('HTN')}
                                />
                                <DiseaseCard
                                    label={t.diseases.DYS}
                                    selected={selectedDiseases.includes('DYS')}
                                    onClick={() => toggleDisease('DYS')}
                                />
                                <DiseaseCard
                                    label={t.diseases.CKD}
                                    selected={selectedDiseases.includes('CKD')}
                                    onClick={() => toggleDisease('CKD')}
                                    warning={t.warnings.CKD}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="pt-6 pb-2 mt-2">
                    <LargeButton onClick={handleNext} variant="primary">
                        {step === 1 ? common.next : common.save}
                    </LargeButton>
                </div>
            </div>
        </div>
    );
}

function DiseaseCard({ label, selected, onClick, warning }: { label: string, selected: boolean, onClick: () => void, warning?: string }) {
    return (
        <div
            onClick={onClick}
            className={`p-5 rounded-2xl cursor-pointer transition-all flex justify-between items-center border-2
        ${selected
                    ? 'bg-[#E6B333]/20 border-[#E6B333] shadow-sm'
                    : 'bg-[#FFFEF0] border-[#D7CCC8] hover:bg-white hover:border-[#8D6E63]'
                }
      `}
        >
            <div>
                <p className={`text-xl font-bold ${selected ? 'text-[#5D4037]' : 'text-[#8D6E63]'}`}>{label}</p>
                {warning && <p className="text-sm text-[#E07A5F] mt-1 font-bold">⚠️ {warning}</p>}
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all border-2
         ${selected
                    ? 'bg-[#6B8E23] border-[#6B8E23] text-white'
                    : 'bg-transparent border-[#D7CCC8] text-transparent'
                }
      `}>
                {selected && <span className="font-bold text-lg">✓</span>}
            </div>
        </div>
    );
}
