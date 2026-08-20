const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const slugMap = {
    "لحوم باردة": "cold-cuts",
    "معكرونة ومواد غذائية": "pasta-foodstuffs",
    "مشروبات وقهوة": "beverages-coffee",
    "صوصات وصلصات": "sauces-condiments",
    "مفرزات ولحوم": "frozen-foods",
    "السناكس والحلويات": "snacks-sweets",
    "باستا": "pasta-grains",
    "ألبان وبدائلها": "dairy-milk",
    "أغذية صحية ودايت": "healthy-diet",
    "فطور وسيريال": "breakfast-cereals",
    "مأكولات وفطور": "breakfast-food",
    "أغذية صحية ورياضية": "sports-nutrition",
    "أغذية صحية وسناكس": "healthy-snacks",
    "العناية بالطفل": "baby-care",
    "ألبان ومنتجات الطبخ": "dairy-cooking",
    "معلبات": "canned-goods",
    "العناية الشخصية والصحة": "personal-care-hygiene",
    "مشروبات وبدائل الحليب": "beverages-plant-milk",
};

async function fixAllSlugs() {
    const all = await prisma.mainCategory.findMany();
    for (const mc of all) {
        const cleanSlug = slugMap[mc.name.trim()] || mc.slug.replace(/^-+|-+$/g, '') || `dept-${mc.id}`;
        await prisma.mainCategory.update({
            where: { id: mc.id },
            data: { slug: cleanSlug }
        });
        console.log(`Updated "${mc.name}" -> slug: "${cleanSlug}"`);
    }
}

fixAllSlugs().catch(console.error).finally(() => prisma.$disconnect());
