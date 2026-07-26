"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import OrderSuccessHeader from '@/app/components/CompleteOrderComponents/OrderSuccessHeader';
import OrderBasicInfo from '@/app/components/CompleteOrderComponents/OrderBasicInfo';
import OrderShippingAndPayment from '@/app/components/CompleteOrderComponents/OrderShippingAndPayment';
import OrderItemsSelection from '@/app/components/CompleteOrderComponents/OrderItemsSelection';
import OrderSupportFooter from '@/app/components/CompleteOrderComponents/OrderSupportFooter';
import { MdRefresh } from 'react-icons/md';

interface OrderItem {
    id: string;
    product: {
        images: string;
        name: string;
    };
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    Name: string;
    phone: string;
    streetAddress: string;
    city: string;
    totalAmount: number;
    items: OrderItem[];
    createdAt: string;
}

const CompleteOrderContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get('id');
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!orderId) {
            router.push('/');
            return;
        }

        const fetchOrder = async () => {
            try {
                const response = await fetch(`/api/orders/${orderId}`);
                if (response.ok) {
                    const data = await response.json();
                    setOrder(data);
                } else {
                    router.push('/');
                }
            } catch (error) {
                console.error("Error fetching order:", error);
                router.push('/');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId, router]);

    if (loading) {
        return (
            <div className="flex-grow flex items-center justify-center min-h-[60vh]">
                <MdRefresh className="animate-spin text-zinc-900 dark:text-white text-4xl" />
            </div>
        );
    }

    if (!order) return null;

    return (
        <main className="flex-grow w-full max-w-4xl mx-auto px-4 py-8 md:py-16 flex flex-col items-center">
            <OrderSuccessHeader />

            <div className="w-full bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
                <OrderBasicInfo
                    orderId={order.id}
                    totalAmount={order.totalAmount}
                />

                <OrderShippingAndPayment
                    name={order.Name}
                    streetAddress={order.streetAddress}
                    city={order.city}
                    phone={order.phone}
                />

                <OrderItemsSelection
                    items={order.items}
                />
            </div>

            <OrderSupportFooter />
        </main>
    );
};

const Page = () => {
    return (
        <Suspense fallback={
            <div className="flex-grow flex items-center justify-center min-h-[60vh]">
                <MdRefresh className="animate-spin text-zinc-900 dark:text-white text-4xl" />
            </div>
        }>
            <CompleteOrderContent />
        </Suspense>
    );
};

export default Page;
