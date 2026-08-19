'use client';

import Link from 'next/link';
import { useLanguage } from '@/app/context/LanguageContext';

export default function NotFound() {
  const { t, dir } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="max-w-xl text-center">
          {/* 404 Heading */}
          <div className="mb-8">
            <h1 className="text-9xl md:text-[140px] font-black text-gray-200 dark:text-gray-800 leading-none mb-2">
              404
            </h1>
            <div className="h-1 w-20 bg-gradient-to-r from-amber-600 to-amber-400 mx-auto mb-6"></div>
          </div>

          {/* Message */}
          <h2 className="text-3xl md:text-4xl font-bold text-text-main-light dark:text-white mb-4">
            {t('notFound.heading')}
          </h2>
          <p className="text-lg text-text-muted-light dark:text-gray-300 mb-10">
            {t('notFound.description')}
          </p>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <Link 
              href="/" 
              className="inline-flex items-center justify-center px-8 py-4 bg-primary hover:bg-[#9a7009] text-white font-semibold rounded-lg transition-all duration-300 shadow-md"
            >
              {t('notFound.homeCta')}
            </Link>
            <Link 
              href="/products" 
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-text-main-light dark:border-gray-300 text-text-main-light dark:text-white font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300"
            >
              {t('notFound.shopCta')}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
