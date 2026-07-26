const fs = require('fs');

try {
  const filename = process.argv[2] || 'localhost_3000-20260726T122816.json';
  const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
  
  console.log("Performance Score:", data.categories.performance ? Math.round(data.categories.performance.score * 100) : "N/A");
  
  const metrics = [
    'first-contentful-paint',
    'speed-index',
    'largest-contentful-paint',
    'total-blocking-time',
    'cumulative-layout-shift'
  ];
  
  console.log("\n--- Core Web Vitals ---");
  metrics.forEach(m => {
    if (data.audits[m]) {
      console.log(`${data.audits[m].title}: ${data.audits[m].displayValue}`);
    }
  });
  
  console.log("\n--- Opportunities (Potential Savings) ---");
  const audits = data.audits;
  let hasOpportunities = false;
  for (const key in audits) {
    const audit = audits[key];
    if (audit.details && audit.details.type === 'opportunity' && (audit.details.overallSavingsMs > 0 || audit.details.overallSavingsBytes > 0)) {
      hasOpportunities = true;
      const ms = audit.details.overallSavingsMs || 0;
      const kb = Math.round((audit.details.overallSavingsBytes || 0) / 1024);
      console.log(`${audit.title}: Savings ${ms}ms / ${kb} KB`);
      
      if (audit.details.items && audit.details.items.length > 0) {
         audit.details.items.slice(0, 3).forEach(item => {
             console.log(`    -> URL: ${item.url ? item.url.substring(0, 80) + '...' : 'N/A'}, Savings: ${item.wastedMs ? item.wastedMs + 'ms' : ''} ${item.wastedBytes ? Math.round(item.wastedBytes/1024) + 'KB' : ''}`);
         });
      }
    }
  }
  if (!hasOpportunities) console.log("No significant opportunities found.");
  
  console.log("\n--- Other Performance Diagnostics (Score < 1) ---");
  const perfRefs = data.categories.performance ? data.categories.performance.auditRefs.map(r => r.id) : [];
  for (const key in audits) {
    const audit = audits[key];
    if (perfRefs.includes(key) && audit.score !== null && audit.score < 1 && audit.details && audit.details.type !== 'opportunity') {
       if (!metrics.includes(key) && audit.title) {
          console.log(`\n${audit.title}: ${audit.displayValue || 'N/A'} (Score: ${audit.score})`);
          if (audit.details && audit.details.items && audit.details.items.length > 0) {
             audit.details.items.slice(0, 3).forEach(item => {
                 let line = "   - ";
                 if (item.url) line += `URL: ${item.url.substring(0, 60)}... `;
                 if (item.node && item.node.snippet) line += `Node: ${item.node.snippet.substring(0, 40)}... `;
                 if (item.wastedMs) line += `wastedMs: ${item.wastedMs} `;
                 if (item.wastedBytes) line += `wastedBytes: ${Math.round(item.wastedBytes/1024)}KB `;
                 if (item.transferSize) line += `transferSize: ${Math.round(item.transferSize/1024)}KB `;
                 console.log(line);
             });
          }
       }
    }
  }

} catch (err) {
  console.error("Error analyzing Lighthouse report:", err);
}
