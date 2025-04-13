// Script to create the page_contents table in Supabase
import { supabase } from '../server/supabase';

async function createPageContentsTable() {
  console.log('Creating page_contents table in Supabase...');

  try {
    // Create the page_contents table
    const { error } = await supabase.rpc('create_page_contents_table');
    
    if (error) {
      console.error('Error creating page_contents table:', error);
      
      // If the RPC function doesn't exist, try to create the table with direct SQL
      console.log('Attempting to create table using direct SQL...');
      const { error: sqlError } = await supabase.from('page_contents').select('id').limit(1);
      
      if (sqlError) {
        // SQL query to create page_contents table
        const createTableSQL = `
        CREATE TABLE IF NOT EXISTS page_contents (
          id SERIAL PRIMARY KEY,
          page TEXT NOT NULL UNIQUE,
          content TEXT NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
        `;
        
        // Execute SQL using Supabase's pg_query function (if available)
        const { error: createError } = await supabase.rpc('pg_query', { query: createTableSQL });
        
        if (createError) {
          console.error('Failed to create page_contents table with direct SQL:', createError);
          console.log('Please create the page_contents table manually in Supabase dashboard with the following structure:');
          console.log('- id: serial (primary key)');
          console.log('- page: text (not null, unique)');
          console.log('- content: text (not null)');
          console.log('- updated_at: timestamp with time zone (not null, default: current_timestamp)');
        } else {
          console.log('Successfully created page_contents table using direct SQL');
        }
      } else {
        console.log('Table already exists but is empty');
      }
    } else {
      console.log('Successfully created page_contents table using RPC function');
    }
  } catch (err) {
    console.error('Unexpected error creating page_contents table:', err);
  }
}

// Run the function
createPageContentsTable()
  .then(() => console.log('Script completed'))
  .catch(err => console.error('Script failed:', err));