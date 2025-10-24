const en = require('../messages/en.json');
const id = require('../messages/id.json');

console.log('🔍 Verifying Translation Files\n');

// Check top-level keys
const enKeys = Object.keys(en).sort();
const idKeys = Object.keys(id).sort();

console.log('Top-level sections:');
console.log('EN:', enKeys);
console.log('ID:', idKeys);
console.log('Match:', JSON.stringify(enKeys) === JSON.stringify(idKeys) ? '✅ YES\n' : '❌ NO\n');

// Check nested keys for each section
let allMatch = true;
enKeys.forEach(section => {
  const enSubKeys = Object.keys(en[section]).sort();
  const idSubKeys = Object.keys(id[section]).sort();
  const match = JSON.stringify(enSubKeys) === JSON.stringify(idSubKeys);

  console.log(`${section}: ${match ? '✅' : '❌'}`);

  if (!match) {
    console.log('  EN keys:', enSubKeys);
    console.log('  ID keys:', idSubKeys);
    allMatch = false;
  }
});

console.log('\n' + '='.repeat(50));
console.log('Overall Result:', allMatch ? '✅ ALL KEYS MATCH' : '❌ KEYS DO NOT MATCH');
console.log('='.repeat(50));

// Count total keys
let enTotal = 0;
let idTotal = 0;
Object.keys(en).forEach(section => {
  enTotal += Object.keys(en[section]).length;
  idTotal += Object.keys(id[section]).length;
});

console.log(`\n📊 Translation Statistics:`);
console.log(`   EN total keys: ${enTotal}`);
console.log(`   ID total keys: ${idTotal}`);
console.log(`   Match: ${enTotal === idTotal ? '✅' : '❌'}`);
