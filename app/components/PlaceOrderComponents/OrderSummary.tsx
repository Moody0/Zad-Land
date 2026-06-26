"use client";

import React from 'react';
import { CartItem } from '@/app/context/CartContext';
import { useLanguage } from '@/app/context/LanguageContext';
import { MdPayments, MdRefresh, MdCheckCircle, MdSupportAgent } from 'react-icons/md';
import { getSafeImageUrl } from '@/lib/image-utils';

interface OrderSummaryProps {
    items: CartItem[];
    subtotal: number;
    total: number;
    loading: boolean;
    discount?: number;
    onApplyPromo?: (code: string) => Promise<{ success: boolean; message?: string }>;
}

const OrderSummary = ({ items, subtotal, total, loading, discount = 0, onApplyPromo }: OrderSummaryProps) => {
    const { t } = useLanguage();
    const [promoCode, setPromoCode] = React.useState("");
    const [promoMessage, setPromoMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isApplyingPromo, setIsApplyingPromo] = React.useState(false);

    const handleApplyPromo = async () => {
        if (!promoCode.trim() || !onApplyPromo) return;

        setIsApplyingPromo(true);
        setPromoMessage(null);
        try {
            const result = await onApplyPromo(promoCode);
            if (result.success) {
                setPromoMessage({ type: 'success', text: result.message || "Promo code applied!" });
            } else {
                setPromoMessage({ type: 'error', text: result.message || "Invalid promo code" });
            }
        } catch (error) {
            setPromoMessage({ type: 'error', text: "Failed to apply code" });
        } finally {
            setIsApplyingPromo(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent outer form submission
            handleApplyPromo();
        }
    };

    return (
        <div className="sticky top-[168px] space-y-6">
            <div className="bg-white dark:bg-white/5 p-8 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#E6E9EB] dark:border-white/10">
                <h2 className="text-[18px] font-bold mb-6 text-[#072835] dark:text-white uppercase tracking-wider">{t('cart.orderSummary')}</h2>
                <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto ltr:pr-2 rtl:pl-2 custom-scrollbar">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                            <div className="relative w-16 h-16 !bg-white rounded-lg border border-[#e6dbdf] dark:border-gray-800/50 overflow-hidden shrink-0">
                                <img
                                    src={getSafeImageUrl(item.image.split(',')[0])}
                                    alt={item.name}
                                    className="w-full h-full object-contain p-1"
                                    loading="lazy"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p dir="ltr" className="text-[14px] font-bold truncate text-[#072835] dark:text-white font-sans tracking-normal text-left rtl:text-right" title={item.name}>{item.name}</p>
                                <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400 mt-0.5">{t('cart.quantity')}: {item.quantity} • <span className="text-[#C20059] font-bold">${item.price.toFixed(2)}</span></p>
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <p className="text-sm text-center py-4 text-[#89616f]">{t('cart.emptyCart')}</p>
                    )}
                </div>

                {onApplyPromo && (
                    <div className="mb-6">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                onKeyDown={handleKeyDown}
                                placeholder={t('checkout.promoCode')}
                                className="flex-1 px-4 py-3 rounded-xl border border-[#E6E9EB] dark:border-white/10 bg-[#FAFAFA] dark:bg-white/5 text-[14px] focus:outline-none focus:border-[#072835] focus:ring-1 focus:ring-[#072835] uppercase font-medium placeholder:normal-case transition-all"
                            />
                            <button
                                type="button"
                                onClick={handleApplyPromo}
                                disabled={isApplyingPromo || !promoCode.trim()}
                                className="px-6 py-3 bg-[#072835] dark:bg-white/10 text-white text-[14px] font-bold rounded-xl hover:bg-[#051e28] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-[#072835]/10"
                            >
                                {isApplyingPromo ? '...' : t('common.apply')}
                            </button>
                        </div>
                        {promoMessage && (
                            <p className={`text-xs mt-2 font-bold ${promoMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                                {promoMessage.text}
                            </p>
                        )}
                    </div>
                )}

                <div className="flex flex-col gap-3.5 mb-6 border-t border-b border-[#E6E9EB] dark:border-white/10 py-6">
                    <div className="flex justify-between text-gray-500 dark:text-gray-400 text-[14px] font-medium">
                        <span>{t('cart.subtotal')}</span>
                        <span className="font-bold text-[#072835] dark:text-white">${subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                        <div className="flex justify-between text-[#C20059] font-bold text-[14px]">
                            <span>{t('checkout.discount')}</span>
                            <span>-${discount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-gray-500 dark:text-gray-400 text-[14px] font-medium">
                        <span>{t('cart.shipping')}</span>
                        <span className="font-bold text-green-600 uppercase tracking-wide text-[12px]">{t('cart.freeShipping')}</span>
                    </div>
                </div>

                <div className="bg-[#FAFAFA] dark:bg-white/5 rounded-[14px] p-5 mb-8 border border-[#E6E9EB] dark:border-white/10">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t('checkout.paymentMethod')}</span>
                        <MdPayments className="text-[#072835] dark:text-white text-[16px]" />
                    </div>
                    <p className="text-[15px] font-bold text-[#072835] dark:text-white">{t('checkout.cashOnDelivery')}</p>
                </div>

                <div className="flex justify-between items-end mb-8">
                    <span className="text-[18px] font-bold text-[#072835] dark:text-white uppercase tracking-wider">{t('cart.total')}</span>
                    <span className="text-3xl font-black text-[#C20059] leading-none">${total.toFixed(2)}</span>
                </div>

                <button
                    type="submit"
                    disabled={loading || items.length === 0}
                    className="w-full bg-[#072835] hover:bg-[#051e28] text-white font-bold rounded-full h-[54px] flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-lg shadow-[#072835]/20 text-[16px]"
                >
                    {loading ? (
                        <MdRefresh className="animate-spin text-xl" />
                    ) : (
                        <>
                            <span>{t('checkout.placeOrder')}</span>
                            <MdCheckCircle className="text-[18px]" />
                        </>
                    )}
                </button>
                <p className="text-[10px] text-center text-gray-400 dark:text-gray-500 mt-5 uppercase tracking-widest font-bold">{t('checkout.secureCheckout')}</p>
            </div>

            <div className="bg-white dark:bg-white/5 p-5 rounded-[16px] border border-[#E6E9EB] dark:border-white/10 flex items-center gap-4 shadow-sm">
                <div className="w-11 h-11 rounded-full bg-[#FAFAFA] dark:bg-white/10 flex items-center justify-center border border-[#E6E9EB] dark:border-white/5">
                    <MdSupportAgent className="text-[#072835] dark:text-white text-[22px]" />
                </div>
                <div>
                    <p className="text-[14px] font-bold text-[#072835] dark:text-white mb-0.5">{t('checkout.needAssistance')}</p>
                    <a
                        className="text-[12px] font-bold text-gray-500 hover-underline-animated"
                        href="https://wa.me/963933254796"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {t('checkout.speakWithExpert')}
                    </a>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
