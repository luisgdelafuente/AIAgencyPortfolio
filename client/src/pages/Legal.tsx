import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Legal() {
  return (
    <>
      <Helmet>
        <title>Legal | HAL149</title>
        <meta name="description" content="HAL149 legal documents including privacy policy and terms of service." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow pt-20">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                Legal Documents
              </h1>
              <p className="text-lg text-gray-600">
                Our privacy policy, terms of service, and other legal information
              </p>
            </div>
            
            <div>
              <Tabs defaultValue="privacy">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
                  <TabsTrigger value="terms">Terms of Service</TabsTrigger>
                </TabsList>
                
                <TabsContent value="privacy" className="border rounded-lg p-6 bg-white">
                  <div className="prose max-w-none">
                    <h2>Privacy Policy</h2>
                    <p>Last updated: April 5, 2024</p>
                    
                    <h3>1. Introduction</h3>
                    <p>HAL149 ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.</p>
                    
                    <h3>2. Information We Collect</h3>
                    <p>We may collect information about you in a variety of ways, including:</p>
                    <ul>
                      <li><strong>Personal Data:</strong> Name, email address, phone number, and other information you provide when contacting us or signing up for our services.</li>
                      <li><strong>Usage Data:</strong> Information about how you use our website and services, including IP address, browser type, pages visited, and time spent.</li>
                      <li><strong>Cookies:</strong> We use cookies and similar tracking technologies to enhance your experience on our website.</li>
                    </ul>
                    
                    <h3>3. How We Use Your Information</h3>
                    <p>We may use the information we collect for various purposes, including:</p>
                    <ul>
                      <li>Providing, operating, and maintaining our services</li>
                      <li>Improving, personalizing, and expanding our services</li>
                      <li>Understanding and analyzing how you use our services</li>
                      <li>Communicating with you about updates, security alerts, and support</li>
                      <li>Marketing and advertising purposes</li>
                    </ul>
                    
                    <h3>4. Disclosure of Your Information</h3>
                    <p>We may share your information with third parties in certain situations:</p>
                    <ul>
                      <li><strong>Business Transfers:</strong> If we're involved in a merger, acquisition, or sale of assets.</li>
                      <li><strong>Service Providers:</strong> We may share your information with third-party vendors who provide services on our behalf.</li>
                      <li><strong>Legal Requirements:</strong> If required by law or to protect our rights.</li>
                    </ul>
                    
                    <h3>5. Data Security</h3>
                    <p>We use administrative, technical, and physical security measures to protect your personal information. However, no data transmission over the Internet or storage system can be guaranteed to be 100% secure.</p>
                    
                    <h3>6. Your Rights</h3>
                    <p>Depending on your location, you may have certain rights regarding your personal information, including the right to access, correct, delete, or restrict processing of your data.</p>
                    
                    <h3>7. Changes to This Privacy Policy</h3>
                    <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>
                    
                    <h3>8. Contact Us</h3>
                    <p>If you have any questions about this Privacy Policy, please contact us at privacy@hal149.com.</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="terms" className="border rounded-lg p-6 bg-white">
                  <div className="prose max-w-none">
                    <h2>Terms of Service</h2>
                    <p>Last updated: April 5, 2024</p>
                    
                    <h3>1. Agreement to Terms</h3>
                    <p>By accessing or using our website and services, you agree to be bound by these Terms of Service. If you do not agree to these Terms, you may not access or use our services.</p>
                    
                    <h3>2. Description of Services</h3>
                    <p>HAL149 provides industry-specific AI applications designed to transform data into insights, automate workflows, and help businesses stay ahead of the competition.</p>
                    
                    <h3>3. User Accounts</h3>
                    <p>Some features of our services may require you to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
                    
                    <h3>4. User Conduct</h3>
                    <p>When using our services, you agree not to:</p>
                    <ul>
                      <li>Violate any applicable laws or regulations</li>
                      <li>Infringe on the intellectual property rights of others</li>
                      <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
                      <li>Use our services for any illegal or unauthorized purpose</li>
                      <li>Interfere with or disrupt the integrity or performance of our services</li>
                    </ul>
                    
                    <h3>5. Intellectual Property</h3>
                    <p>Our website and services, including all content, features, and functionality, are owned by HAL149 and are protected by copyright, trademark, and other intellectual property laws.</p>
                    
                    <h3>6. Limitation of Liability</h3>
                    <p>To the maximum extent permitted by law, HAL149 shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of our services.</p>
                    
                    <h3>7. Indemnification</h3>
                    <p>You agree to indemnify and hold harmless HAL149 and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses arising out of or related to your use of our services or violation of these Terms.</p>
                    
                    <h3>8. Termination</h3>
                    <p>We may terminate or suspend your access to our services at any time, without prior notice or liability, for any reason, including if you breach these Terms.</p>
                    
                    <h3>9. Changes to Terms</h3>
                    <p>We reserve the right to modify these Terms at any time. If we make material changes, we will notify you by posting the revised Terms on our website.</p>
                    
                    <h3>10. Governing Law</h3>
                    <p>These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.</p>
                    
                    <h3>11. Contact Us</h3>
                    <p>If you have any questions about these Terms, please contact us at legal@hal149.com.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}