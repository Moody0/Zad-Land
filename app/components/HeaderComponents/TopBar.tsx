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
            className={`hidden lg:block w-full bg-[#FAFAFA] dark:bg-[#1a1517] border-b border-[#E6E9EB] dark:border-white/5 transition-all duration-300 ${
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
                        <a href="https://www.facebook.com/share/1HzXdo7sLG/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-[#072835] hover:opacity-75 dark:text-gray-400 dark:hover:text-white transition-opacity" aria-label="Facebook">
                            <FaFacebook className="text-[17px]" />
                        </a>
                        <a href="https://www.instagram.com/ruby.beauty.sy" target="_blank" rel="noopener noreferrer" className="text-[#072835] hover:opacity-75 dark:text-gray-400 dark:hover:text-white transition-opacity" aria-label="Instagram">
                            <FaInstagram className="text-[17px]" />
                        </a>
                        <a href="https://wa.me/963933254796" target="_blank" rel="noopener noreferrer" className="text-[#072835] hover:opacity-75 dark:text-gray-400 dark:hover:text-white transition-opacity" aria-label="WhatsApp">
                            <FaWhatsapp className="text-[17px]" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
