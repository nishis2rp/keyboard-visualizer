import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCategories() {
  console.log('Fetching unique categories from shortcuts table...\n');

  const { data, error } = await supabase
    .from('shortcuts')
    .select('category, application')
    .order('application')
    .order('category');

  if (error) {
    console.error('Error fetching categories:', error);
    return;
  }

  // Group categories by application
  const categoriesByApp: Record<string, Set<string>> = {};

  data?.forEach((row) => {
    if (!categoriesByApp[row.application]) {
      categoriesByApp[row.application] = new Set();
    }
    if (row.category) {
      categoriesByApp[row.application].add(row.category);
    }
  });

  // Print results
  for (const [app, categories] of Object.entries(categoriesByApp)) {
    console.log(`\n${app}:`);
    Array.from(categories).sort().forEach((category) => {
      console.log(`  - ${category}`);
    });
  }

  // Print all unique categories
  const allCategories = new Set<string>();
  Object.values(categoriesByApp).forEach((categories) => {
    categories.forEach((cat) => allCategories.add(cat));
  });

  console.log(`\n\nAll unique categories (${allCategories.size} total):`);
  Array.from(allCategories).sort().forEach((category) => {
    console.log(`  - ${category}`);
  });
}

checkCategories();
