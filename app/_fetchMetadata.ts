// This file serves as a utility to fetch metadata from the API
// It runs at build time to generate the static metadata content

import fs from 'fs';
import path from 'path';

interface Metadata {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

// Default metadata to use if API fetch fails
export const defaultMetadata: Metadata = {
  title: 'HAL149 | Unlocking Your Business Potential with AI',
  description: 'HAL149 is your partner From AI-powered apps and automations to strategic training and transformation programs',
  keywords: 'ai applications, ai solutions, ai automations, industry ai, ai consulting, ai training programs',
  canonical: 'https://hal149.com',
  ogTitle: 'HAL149 | Unlocking Your Business Potential with AI',
  ogDescription: 'HAL149 is your partner From AI-powered apps and automations to strategic training and transformation programs',
  ogImage: 'https://spebrqnqmrmeacntsrmp.supabase.co/storage/v1/object/public/assets//hallogoblack480.webp',
};

// Function to save metadata to a JSON file
export async function saveMetadataToJson() {
  try {
    // Fetch metadata for home page
    const response = await fetch('http://localhost:5000/api/page-contents/home');
    if (!response.ok) {
      console.error('Failed to fetch home page metadata');
      // Save default metadata if fetch fails
      saveToFile(defaultMetadata);
      return;
    }

    const data = await response.json();
    if (!data || !data.content) {
      console.error('No content found for home page');
      saveToFile(defaultMetadata);
      return;
    }

    // Parse content
    const content = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
    const metadata = content.metadata || defaultMetadata;
    
    // Save to file
    saveToFile(metadata);
    console.log('Successfully saved metadata to JSON file');
  } catch (error) {
    console.error('Error fetching or saving metadata:', error);
    saveToFile(defaultMetadata);
  }
}

function saveToFile(metadata: Metadata) {
  const filePath = path.join(process.cwd(), 'public', 'metadata.json');
  fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2));
}

// Run this function on server start to ensure metadata is updated
saveMetadataToJson();