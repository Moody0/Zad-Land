import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface OrderItemInput {
    productId: string;
    quantity: number;
    price: number;
    options?: string | null;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            firstName,
            lastName,
            phone,
            streetAddress,
            city,
            totalAmount,
            promoCodeId,
            discount,
            items
        } = body;

        // Basic validation
        if (!firstName || !lastName || !phone || !streetAddress || !city || !items || items.length === 0) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Create order with items in a transaction
        const order = await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    Name: `${firstName} ${lastName}`,
                    phone,
                    streetAddress,
                    city,
                    totalAmount,
                    status: 'PENDING',
                    promoCodeId: promoCodeId || null,
                    discount: discount || 0,
                    items: {
                        create: items.map((item: OrderItemInput) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.price,
                            options: item.options || null,
                        }))
                    }
                },
                include: {
                    items: true
                }
            });

            // Update Promo Code stats
            if (promoCodeId) {
                await tx.promoCode.update({
                    where: { id: promoCodeId },
                    data: {
                        usageCount: { increment: 1 },
                        totalSales: { increment: totalAmount }
                    }
                });
            }

            return newOrder;
        });

        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error("Order creation error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
