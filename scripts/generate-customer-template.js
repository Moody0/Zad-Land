const XLSX = require('xlsx');
const path = require('path');

const exampleData = [
    {
        Brand: "CeraVe",
        "Brand Group": "MAIN",
        Category: "Moisturizers",
        Name: "Moisturizing Cream",
        Description: "Rich moisturizing cream with 3 essential ceramides",
        Price: 18.99,
        "Discount Price": "",
        Stock: 100,
        SKU: "CER-MC-001",
        Images: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=800",
        "Is Trending": "No"
    },
    {
        Brand: "The Ordinary",
        "Brand Group": "MAIN",
        Category: "Serums",
        Name: "Niacinamide 10% + Zinc 1%",
        Description: "High-strength vitamin and mineral blemish formula",
        Price: 12.50,
        "Discount Price": 10.00,
        Stock: 200,
        SKU: "TO-NZ-001",
        Images: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800",
        "Is Trending": "Yes"
    },
    {
        Brand: "Flormar",
        "Brand Group": "DIFFERENT",
        Category: "Lips",
        Name: "Matte Lipstick - Ruby Red",
        Description: "Long-lasting matte lipstick",
        Price: 9.99,
        "Discount Price": "",
        Stock: 75,
        SKU: "FL-ML-001",
        Images: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800",
        "Is Trending": "No"
    },
    {
        Brand: "Cosrx",
        "Brand Group": "DIFFERENT",
        Category: "Essences",
        Name: "Advanced Snail 96 Mucin Power Essence",
        Description: "Lightweight essence with snail mucin for hydration",
        Price: 21.00,
        "Discount Price": 18.00,
        Stock: 60,
        SKU: "CX-SN-001",
        Images: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800",
        "Is Trending": "Yes"
    }
];

const worksheet = XLSX.utils.json_to_sheet(exampleData);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

const outputPath = path.join(__dirname, 'customer-data-template.xlsx');
XLSX.writeFile(workbook, outputPath);

console.log(`Excel template created at: ${outputPath}`);
console.log(`Total rows: ${exampleData.length}`);
