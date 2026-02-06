import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'Prefer': 'count=exact',
    },
  },
});

export interface Shortcut {
  id: number;
  application: string;
  keys: string;
  description: string;
  category: string | null;
  created_at: string;
  difficulty: string | null;
  platform?: 'Windows' | 'macOS' | 'Cross-Platform';
  windows_keys?: string | null;
  macos_keys?: string | null;
  windows_protection_level?: string | null;
  macos_protection_level?: string | null;
}
