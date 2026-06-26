"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '@/app/context/CartContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import CheckoutSteps from '@/app/components/PlaceOrderComponents/CheckoutSteps';
import ShippingForm from '@/app/components/PlaceOrderComponents/ShippingForm';
import OrderSummary from '@/app/components/PlaceOrderComponents/OrderSummary';
import { validatePromoCode } from '@/lib/admin-actions';

const PlaceOrderPage = () => {
    const { items, subtotal, clearCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        streetAddress: '',
        city: ''
    });

    const [promoDetails, setPromoDetails] = useState<{ id: string, percentage: number } | null>(null);
    const [discountAmount, setDiscountAmount] = useState(0);

    // Recalculate discount if subtotal changes (though subtotal shouldn't change here usually)
    useEffect(() => {
        if (promoDetails) {
            setDiscountAmount((subtotal * promoDetails.percentage) / 100);
        } else {
            setDiscountAmount(0);
        }
    }, [subtotal, promoDetails]);

    const total = Math.max(0, subtotal - discountAmount);

    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (items.length === 0 && !loading && !isSuccess) {
            router.push('/cart');
        }
    }, [items, router, loading, isSuccess]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        // Prevent non-numeric input for phone
        if (name === 'phone') {
            const numericValue = value.replace(/[^0-9]/g, '');
            setFormData(prev => ({ ...prev, [name]: numericValue }));
            return;
        }
        
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateSyrianPhone = (phone: string) => {
        // Syrian mobile numbers are 10 digits and start with 09
        const syrianPhoneRegex = /^09\d{8}$/;
        return syrianPhoneRegex.test(phone);
    };

    const handleApplyPromo = async (code: string) => {
        const result = await validatePromoCode(code);
        if (result.success && result.promoCode) {
            setPromoDetails({
                id: result.promoCode.id,
                percentage: result.promoCode.discountPercentage
            });
            return { success: true, message: `Applied ${result.promoCode.discountPercentage}% discount!` };
        }
        setPromoDetails(null);
        return { success: false, message: result.error };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.firstName || !formData.lastName || !formData.phone || !formData.streetAddress || !formData.city) {
            toast.error("Please fill in all required fields");
            return;
        }

        // Validate Syrian Phone Number
        if (!validateSyrianPhone(formData.phone)) {
            toast.error("Please enter a valid Syrian mobile number (e.g. 09xxxxxxxx)");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                    streetAddress: formData.streetAddress,
                    city: formData.city,
                    totalAmount: parseFloat(total.toFixed(2)),
                    promoCodeId: promoDetails?.id,
                    discount: parseFloat(discountAmount.toFixed(2)),
                    items: items.map(item => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price
                    }))
                })
            });

            if (response.ok) {
                const data = await response.json();
                toast.success("Order placed successfully!");
                setIsSuccess(true);
                clearCart();
                router.push(`/complete-order?id=${data.id}`);
            } else {
                const error = await response.json();
                toast.error(error.message || "Failed to place order");
            }
        } catch (error) {
            console.error("Order error:", error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="grow w-full mx-auto container-custom py-4 lg:py-8">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-7">
                    <CheckoutSteps />
                    <ShippingForm formData={formData} handleInputChange={handleInputChange} />
                </div>
                <div className="lg:col-span-5">
                    <OrderSummary
                        items={items}
                        subtotal={subtotal}
                        total={total}
                        loading={loading}
                        discount={discountAmount}
                        onApplyPromo={handleApplyPromo}
                    />
                </div>
            </form>
        </main>
    );
};

export default PlaceOrderPage;
