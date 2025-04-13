import { createClient } from '@supabase/supabase-js';
import { type User, type BlogPost, type Project, type WaitlistEntry } from '@shared/schema';

// Use environment variables with fallback to the current values
const supabaseUrl = process.env.SUPABASE_URL || 'https://spebrqnqmrmeacntsrmp.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwZWJycW5xbXJtZWFjbnRzcm1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzNjQ4ODYsImV4cCI6MjA1OTk0MDg4Nn0.TIihY4A0vhBQBG4sBJ7Y6yLvQJULVTxLFrDNU2mCjxU';

export const supabase = createClient(supabaseUrl, supabaseKey);