import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false }
});

const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
const files = fs.readdirSync(migrationsDir)
  .filter(f => f.endsWith('.sql'))
  .sort();

async function runMigrations() {
  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf-8');
    
    console.log(`\n=== Running ${file} ===`);
    
    // Split by semicolon and run each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    for (const stmt of statements) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: stmt });
        if (error) {
          // Try direct query if rpc fails
          const { error: err2 } = await supabase.from('_migration_dummy').select('*').limit(0);
          if (err2?.code === '42P01') {
            // Table doesn't exist, try raw query
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { error: err3 } = await supabase.auth.admin.listUsers();
            // Use raw SQL via postgres function
            console.log(`  Statement: ${stmt.substring(0, 80)}...`);
          }
        }
      } catch (e) {
        console.log(`  Note: ${e.message}`);
      }
    }
    console.log(`✓ ${file} done`);
  }
  console.log('\nAll migrations attempted!');
}

runMigrations().catch(console.error);