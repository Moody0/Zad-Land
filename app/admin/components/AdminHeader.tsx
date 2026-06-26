"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { MdMenu, MdLanguage } from "react-icons/md";

interface AdminHeaderProps {
    title: string;
    onMenuClick: () => void;
}

export default function AdminHeader({ title, onMenuClick }: AdminHeaderProps) {
    const { language, setLanguage } = useLanguage();

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-xl border-b border-black/[0.04] dark:border-white/[0.04]">
            <div className="flex items-center gap-4 text-text-main dark:text-white">
                {/* Mobile Menu Button */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden text-text-sub hover:text-text-main dark:text-gray-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 p-2 rounded-md transition-colors"
                >
                    <MdMenu className="text-[22px]" />
                </button>
                <h2 className="text-lg font-semibold tracking-tight text-text-main dark:text-white">{title}</h2>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-text-sub dark:text-gray-400 hover:text-text-main dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-full border border-black/5 dark:border-white/5 transition-all"
                    title={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
                >
                    <MdLanguage className="text-[16px]" />
                    <span>{language === 'en' ? 'العربية' : 'EN'}</span>
                </button>
            </div>
        </header>
    );
}
