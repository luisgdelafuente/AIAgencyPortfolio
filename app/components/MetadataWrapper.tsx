'use client';

/**
 * In our custom server approach, metadata is injected directly into the HTML.
 * This component is kept for compatibility but doesn't need to do any work.
 * 
 * All metadata is now handled by our custom Express middleware in server-next.js
 * which intercepts requests and inserts metadata before the HTML is sent to the client.
 */
export default function MetadataWrapper() {
  // No client-side metadata manipulation needed
  // The custom server handles all the metadata injection
  return null;
}