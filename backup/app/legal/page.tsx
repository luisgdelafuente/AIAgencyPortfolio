import { fetchPageContent } from '../lib/api';
import { Metadata } from 'next';
import { marked } from 'marked';

export const metadata: Metadata = {
  title: 'Legal Information | HAL149',
  description: 'Terms of Service, Privacy Policy, and Cookie Policy for HAL149, your trusted AI solutions provider.',
  keywords: 'HAL149 legal, terms of service, privacy policy, cookie policy, AI services legal, data privacy',
};

// Parse content from string to JSON
const parseContent = (content: string | undefined) => {
  if (!content) return {};
  try {
    return typeof content === 'string' ? JSON.parse(content) : content;
  } catch (error) {
    console.error('Error parsing JSON content:', error);
    return {};
  }
};

export default async function Legal() {
  // Fetch data using server components
  const pageContentData = await fetchPageContent('legal');
  
  // Parse the page content
  const pageContent = parseContent(pageContentData?.content);

  // Default terms of service content
  const defaultTermsOfService = `
## 1. Acceptance of Terms

By accessing and using HAL149's services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.

## 2. Services Description

HAL149 provides AI-powered solutions and consulting services to help businesses improve operations through artificial intelligence technologies.

## 3. User Obligations

Users agree to:
- Provide accurate and complete information
- Maintain the security of their account credentials
- Use the services in compliance with all applicable laws
- Not engage in activities that may disrupt or interfere with our services

## 4. Intellectual Property

All content, features, and functionality of our services are owned by HAL149 and are protected by international copyright, trademark, and other intellectual property laws.
  `;

  // Default privacy policy content
  const defaultPrivacyPolicy = `
## 1. Information We Collect

We collect information you provide directly to us, such as when you create an account, submit a contact form, or communicate with us.

## 2. How We Use Information

We use the information we collect to:
- Provide, maintain, and improve our services
- Communicate with you about our services
- Monitor and analyze trends and usage of our services
- Detect, prevent, and address technical issues

## 3. Information Sharing

We do not share your personal information with third parties except as described in this policy or with your consent.

## 4. Data Security

We implement reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access.
  `;

  // Default cookie policy content
  const defaultCookiePolicy = `
## 1. What Are Cookies

Cookies are small text files that are stored on your computer or mobile device when you visit a website.

## 2. How We Use Cookies

We use cookies to:
- Understand how you use our website
- Remember your preferences and settings
- Improve your browsing experience
- Enable certain functionality on our website

## 3. Managing Cookies

Most web browsers allow you to control cookies through their settings. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience.
  `;

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold sm:text-5xl mb-4">
              {pageContent.legalTitle || 'Legal Information'}
            </h1>
            <p className="text-xl text-gray-300">
              {pageContent.legalSubtitle || 'Terms of Service, Privacy Policy, and other legal information'}
            </p>
          </div>
        </div>
      </section>

      {/* Legal Content */}
      <section className="py-16">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {/* Terms of Service */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6">Terms of Service</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: marked.parse(pageContent.termsOfService || defaultTermsOfService)
                  }}
                />
              </div>
            </div>
            
            {/* Privacy Policy */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6">Privacy Policy</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: marked.parse(pageContent.privacyPolicy || defaultPrivacyPolicy)
                  }}
                />
              </div>
            </div>
            
            {/* Cookie Policy */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Cookie Policy</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: marked.parse(pageContent.cookiePolicy || defaultCookiePolicy)
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Last Updated Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">
            Last Updated: {pageContent.lastUpdated || 'April 1, 2025'}
          </p>
        </div>
      </section>
    </div>
  );
}