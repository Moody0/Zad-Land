const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
async function run() {
    console.log({
        Orders: await p.order.count(),
        OrderItems: await p.orderItem.count(),
        Reviews: await p.review.count(),
        Products: await p.product.count(),
        Brands: await p.brand.count(),
        Categories: await p.category.count(),
        MainCategories: await p.mainCategory.count(),
        Banners: await p.banner.count(),
        Settings: await p.settings.count(),
    });
}
run().finally(() => p.$disconnect());
