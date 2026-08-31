'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function NavigationProgressBar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isNavigating, setIsNavigating] = useState(false);
    const [progress, setProgress] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Complete progress bar when pathname or searchParams change (navigation finished)
    useEffect(() => {
        if (isNavigating) {
            setProgress(100);
            const timeout = setTimeout(() => {
                setIsNavigating(false);
                setProgress(0);
            }, 300);
            return () => clearTimeout(timeout);
        }
    }, [pathname, searchParams]);

    // Intercept link clicks to start progress bar instantly (0ms feedback)
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = (e.target as HTMLElement).closest('a');
            if (!target) return;

            const href = target.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || target.target === '_blank') {
                return;
            }

            // Check if it is an internal link
            try {
                const url = new URL(href, window.location.href);
                if (url.origin === window.location.origin) {
                    const currentUrl = new URL(window.location.href);
                    // If navigating to a different pathname or search query
                    if (url.pathname !== currentUrl.pathname || url.search !== currentUrl.search) {
                        setIsNavigating(true);
                        setProgress(25);

                        if (timerRef.current) clearInterval(timerRef.current);
                        timerRef.current = setInterval(() => {
                            setProgress((prev) => {
                                if (prev < 80) return prev + Math.random() * 15;
                                return prev;
                            });
                        }, 200);
                    }
                }
            } catch {
                // Ignore invalid URLs
            }
        };

        const handlePopState = () => {
            setIsNavigating(true);
            setProgress(40);
        };

        document.addEventListener('click', handleClick, { capture: true });
        window.addEventListener('popstate', handlePopState);

        return () => {
            document.removeEventListener('click', handleClick, { capture: true });
            window.removeEventListener('popstate', handlePopState);
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    if (!isNavigating && progress === 0) return null;

    return (
        <div 
            className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none h-[3px] bg-transparent"
            aria-hidden="true"
        >
            <div
                className="h-full bg-gradient-to-r from-[#B8860B] via-[#E5B54A] to-[#B8860B] shadow-[0_0_8px_rgba(184,134,11,0.6)] transition-all duration-300 ease-out"
                style={{
                    width: `${progress}%`,
                    opacity: progress === 100 ? 0 : 1,
                    transition: progress === 100 ? 'width 150ms ease-out, opacity 250ms ease-in 150ms' : 'width 300ms ease-out',
                }}
            />
        </div>
    );
}
