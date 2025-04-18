import { Metadata } from 'next';
import ViewSourceClient from './ViewSourceClient';

// Static metadata for this utility page
export const metadata: Metadata = {
  title: 'View Source | HAL149',
  description: 'Utility to view the HTML source of pages to verify SEO metadata implementation',
  robots: {
    index: false,
    follow: false,
  }
};

export default function ViewSourcePage() {
  return <ViewSourceClient />;
}