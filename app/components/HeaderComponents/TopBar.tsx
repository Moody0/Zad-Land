import React from 'react';
import LanguageToggle from '../LanguageToggle';
import CurrencyToggle from '../CurrencyToggle';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';

interface TopBarProps {
    isVisible: boolean;
}

const TopBar = ({ isVisible }: TopBarProps) => {
    return (
        <div 
            className={`hidden lg:block w-full bg-gray-50 dark:bg-zinc-900 border-b border-gray-100 dark:border-white/5 transition-all duration-300 ${
                isVisible ? 'max-h-[32px] opacity-100 overflow-visible' : 'max-h-0 opacity-0 border-transparent overflow-hidden'
            }`}
        >
            <div className="container-custom h-8 flex items-center justify-between">
                {/* Left Column */}
                <div className="flex-1"></div>
                
                {/* Center Column */}
                <div className="flex-1"></div>
                
                {/* Right Column */}
                <div className="flex-1 flex flex-row items-center justify-end gap-5 text-sm">
                    {/* Switchers */}
                    <div className="flex items-center gap-2">
                        <LanguageToggle />
                        <CurrencyToggle />
                    </div>

                    {/* Socials */}
                    <div className="flex items-center gap-3">
                        <a href="#" target="_blank" rel="noopener noreferrer" className="text-zinc-900 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors" aria-label="Facebook">
                            <FaFacebook className="text-base" />
                        </a>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="text-zinc-900 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors" aria-label="Instagram">
                            <FaInstagram className="text-base" />
                        </a>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="text-zinc-900 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors" aria-label="WhatsApp">
                            <FaWhatsapp className="text-base" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
