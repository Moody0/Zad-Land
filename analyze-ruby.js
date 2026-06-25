const XLSX = require('xlsx');

async function analyzeXlsx() {
    try {
        const filePath = 'C:/Users/moham/OneDrive/Desktop/Web/ruby-beauty/ruby beauty chinieses FINAL.xlsx';
        const workbook = XLSX.readFile(filePath);
        console.log('--- XLSX ANALYSIS ---');
        console.log('Sheet Names:', workbook.SheetNames);
        
        for (const sheetName of workbook.SheetNames) {
            console.log(`\n--- Sheet: ${sheetName} ---`);
            const worksheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);
            console.log(`Total Rows: ${data.length}`);
            
            if (data.length > 0) {
                console.log('Columns Found:', Object.keys(data[0]));
                console.log('\nFirst 3 rows:');
                console.log(JSON.stringify(data.slice(0, 3), null, 2));
            } else {
                console.log('Sheet is empty.');
            }
        }
    } catch (error) {
        console.error('Error reading XLSX:', error.message);
    }
}

analyzeXlsx();
