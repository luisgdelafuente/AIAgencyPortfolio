'use client';

// This component is kept for reference but is no longer used.
// Next.js metadata API is now used for SEO metadata in each page file.
// See app/lib/metadata.ts for the new implementation.

/*
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

interface MetadataType {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

const defaultMetadata: MetadataType = {
  title: 'HAL149',
  description: '',
  keywords: '',
  canonical: '',
  ogTitle: '',
  ogDescription: '',
  ogImage: ''
};

export default function LegacyDynamicHead({ pageName }: { pageName: string }) {
  // This component is no longer used - kept for reference
  return null;
}
*/