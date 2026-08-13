const fs = require('fs');
const path = require('path');

const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
const files = fs.readdirSync(migrationsDir)
  .filter(f => f.endsWith('.sql') && f !== 'run_all_migrations_once.sql')
  .sort();

let combinedContent = '';

for (const file of files) {
  const content = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
  combinedContent += `-- ==========================================\n`;
  combinedContent += `-- Source: ${file}\n`;
  combinedContent += `-- ==========================================\n\n`;
  combinedContent += content + '\n\n';
}

const outputPath = path.join(migrationsDir, '20240801000000_initial_schema.sql');
fs.writeFileSync(outputPath, combinedContent, 'utf-8');

// Delete the old ones
for (const file of files) {
  fs.unlinkSync(path.join(migrationsDir, file));
}
// Delete the run_all file too
const runAllPath = path.join(migrationsDir, 'run_all_migrations_once.sql');
if (fs.existsSync(runAllPath)) {
  fs.unlinkSync(runAllPath);
}

console.log('Successfully consolidated into 20240801000000_initial_schema.sql');
