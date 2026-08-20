const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function finalizeHealthy() {
    console.log("Finalizing Healthy departments merge...");
    
    // Find the main keeper department
    let target = await prisma.mainCategory.findFirst({ where: { name: "أغذية صحية وسناكس" } });
    if (!target) {
        target = await prisma.mainCategory.findFirst({ where: { name: "أغذية صحية ودايت" } });
    }

    if (target) {
        // Find other healthy departments
        const others = await prisma.mainCategory.findMany({
            where: {
                id: { not: target.id },
                name: { in: ["أغذية صحية ودايت", "أغذية صحية ورياضية", "أغذية صحية وسناكس"] }
            }
        });

        for (const other of others) {
            console.log(`Reassigning products & brands from "${other.name}" (${other.id}) to "${target.name}" (${target.id})...`);
            await prisma.product.updateMany({ where: { mainCategoryId: other.id }, data: { mainCategoryId: target.id } });
            await prisma.brand.updateMany({ where: { mainCategoryId: other.id }, data: { mainCategoryId: target.id } });
            await prisma.mainCategory.delete({ where: { id: other.id } });
            console.log(`Deleted "${other.name}".`);
        }

        // Update target details
        await prisma.mainCategory.update({
            where: { id: target.id },
            data: {
                name: "أغذية صحية وسناكس",
                description: "Healthy Snacks & Diet",
                slug: "healthy-snacks",
                isFeatured: false
            }
        });
        console.log("✅ Target department updated to 'أغذية صحية وسناكس'!");
    }
}

finalizeHealthy().catch(console.error).finally(() => prisma.$disconnect());
