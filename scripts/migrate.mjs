import 'dotenv/config';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing env vars');
  process.exit(1);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function runSQL(sql) {
  const res = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`
    },
    body: JSON.stringify({ query: sql })
  });
  return res;
}

const migrations = [
  '001_initial_schema.sql',
  '002_auth_trigger.sql',
  '003_slot_counter_trigger.sql',
  '004_rls_policies.sql',
  '005_fixes_notifications_project_fields.sql',
  '006_usulan_favorit_ratelimit.sql',
  '007_notifikasi_link_dan_validasi.sql'
];

for (const file of migrations) {
  console.log(`\n=== Running ${file} ===`);
  const sql = readFileSync(join(__dirname, '..', 'supabase', 'migrations', file), 'utf-8');
  
  const res = await fetch(`${supabaseUrl}/rest/v1/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({ query: sql })
  });
  
  console.log(`Status: ${res.status}`);
  if (!res.ok) {
    const text = await res.text();
    console.log(`Response: ${text}`);
  }
}

console.log('\nDone!');