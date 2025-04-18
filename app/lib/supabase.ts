import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and API key from environment variables
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or key is missing');
}

// Create a Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);