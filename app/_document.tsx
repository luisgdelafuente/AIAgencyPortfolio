import { Html, Head, Main, NextScript } from 'next/document';

/**
 * Custom Document component to enhance the HTML and body tags
 * This component is rendered on the server side and serves as the 
 * container for all other components
 */
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Default metadata that will be visible to search engines on first load */}
        <meta name="description" content="HAL149 is your partner From AI-powered apps and automations to strategic training and transformation programs" />
        <meta name="keywords" content="ai applications, ai solutions, ai automations, industry ai, ai consulting, ai training programs" />
        
        {/* Open Graph */}
        <meta property="og:title" content="HAL149 | Unlocking Your Business Potential with AI" />
        <meta property="og:description" content="HAL149 is your partner From AI-powered apps and automations to strategic training and transformation programs" />
        <meta property="og:image" content="https://spebrqnqmrmeacntsrmp.supabase.co/storage/v1/object/public/assets//hallogoblack480.webp" />
        <meta property="og:url" content="https://hal149.com" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HAL149 | Unlocking Your Business Potential with AI" />
        <meta name="twitter:description" content="HAL149 is your partner From AI-powered apps and automations to strategic training and transformation programs" />
        <meta name="twitter:image" content="https://spebrqnqmrmeacntsrmp.supabase.co/storage/v1/object/public/assets//hallogoblack480.webp" />
        
        {/* Canonical */}
        <link rel="canonical" href="https://hal149.com" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}