/**
 * This script synchronizes metadata from the database to static metadata files
 * 
 * It should be run:
 * 1. As part of the build process
 * 2. After admin updates to metadata
 * 3. On a scheduled basis (optional)
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Supabase config
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Output paths
const ROOT_METADATA_FILE = path.join(__dirname, '../app/lib/generatedMetadata.ts');
const METADATA_PAGES = ['home', 'about', 'blog', 'projects', 'contact', 'legal'];

async function fetchPageMetadata(page) {
  try {
    const { data, error } = await supabase
      .from('page_contents')
      .select('content')
      .eq('page', page)
      .single();

    if (error) {
      console.error(`Error fetching ${page} metadata:`, error);
      return null;
    }

    if (!data || !data.content) {
      console.warn(`No content found for ${page}`);
      return null;
    }

    // Parse the content
    let parsedContent;
    try {
      parsedContent = typeof data.content === 'string' 
        ? JSON.parse(data.content) 
        : data.content;
    } catch (error) {
      console.error(`Error parsing ${page} content:`, error);
      return null;
    }

    return parsedContent.metadata || null;
  } catch (error) {
    console.error(`Error in fetchPageMetadata for ${page}:`, error);
    return null;
  }
}

async function generateMetadataFile() {
  console.log('Starting metadata synchronization...');
  
  const metadata = {};
  
  // Fetch metadata for each page
  for (const page of METADATA_PAGES) {
    console.log(`Fetching metadata for ${page}...`);
    const pageMetadata = await fetchPageMetadata(page);
    if (pageMetadata) {
      metadata[page] = pageMetadata;
    }
  }
  
  // Generate TypeScript file with metadata
  const fileContent = `/**
 * AUTOMATICALLY GENERATED FILE - DO NOT EDIT DIRECTLY
 * 
 * This file contains metadata from the database that has been
 * synchronized to static files for better performance and reliability.
 * 
 * Last updated: ${new Date().toISOString()}
 */

import { Metadata } from 'next';

export const generatedMetadata: Record<string, Metadata> = ${JSON.stringify(metadata, null, 2)};

// Default metadata as fallback
export const defaultMetadata: Metadata = {
  title: {
    template: '%s | HAL149',
    default: 'HAL149 | AI Solutions',
  },
  description: 'HAL149 provides advanced AI solutions for businesses of all sizes.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hal149.com',
    siteName: 'HAL149',
    title: 'HAL149 - AI Solutions',
    description: 'HAL149 provides advanced AI solutions for businesses of all sizes.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HAL149 - AI Solutions',
    description: 'HAL149 provides advanced AI solutions for businesses of all sizes.',
    creator: '@hal149',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    }
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.png',
  },
  metadataBase: new URL('https://hal149.com'),
};
`;

  // Write to file
  fs.writeFileSync(ROOT_METADATA_FILE, fileContent);
  console.log(`Metadata synchronized to ${ROOT_METADATA_FILE}`);
}

// Run the synchronization
generateMetadataFile()
  .then(() => {
    console.log('Metadata synchronization completed successfully.');
    process.exit(0);
  })
  .catch(error => {
    console.error('Metadata synchronization failed:', error);
    process.exit(1);
  });