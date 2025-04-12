import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from "react-helmet";

export default function About() {
  return (
    <>
      <Helmet>
        <title>About | HAL149</title>
        <meta name="description" content="Learn about HAL149, our mission, vision, and the team behind our industry-specific AI applications." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow pt-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                About HAL149
              </h1>
              <p className="text-lg text-gray-600">
                Pioneering the future of AI with industry-specific solutions
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <div className="prose prose-gray max-w-none">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-gray-600 mb-10 leading-relaxed">
                  At HAL149, our mission is to democratize access to cutting-edge artificial intelligence solutions by creating tailored applications for specific industries. We believe that the transformative power of AI should be accessible to businesses of all sizes, not just tech giants with vast resources.
                </p>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Founded in 2022 by a team of AI researchers and industry veterans, HAL149 emerged from the recognition that while general-purpose AI tools are powerful, the most impactful solutions are those designed with deep domain expertise for specific business contexts.
                </p>
                <p className="text-gray-600 mb-10 leading-relaxed">
                  We began by partnering with companies in healthcare and finance to develop proof-of-concept applications. The results were transformative – our partners reported significant improvements in efficiency, accuracy, and decision-making capabilities. This early success fueled our growth into additional sectors.
                </p>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Approach</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  We combine deep technical expertise in machine learning with extensive domain knowledge to create solutions that address real-world business challenges. Our collaborative development process ensures that our AI applications align perfectly with the workflows, regulations, and unique needs of each industry we serve.
                </p>
                <p className="text-gray-600 mb-10 leading-relaxed">
                  Our commitment to ethical AI development means that all our solutions are designed with fairness, transparency, privacy, and human oversight as core principles.
                </p>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Leadership Team</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Our team brings together experts from both the AI research community and various industries, creating a unique blend of technical innovation and practical business experience.
                </p>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-start">
                    <span className="bg-gray-100 rounded-full p-1 mr-3 mt-1">
                      <svg className="w-4 h-4 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <p className="text-gray-600">
                      <strong className="font-semibold text-gray-900">Dr. Sarah Chen</strong> – CEO & Co-founder, former AI Research Lead at a major tech company
                    </p>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-gray-100 rounded-full p-1 mr-3 mt-1">
                      <svg className="w-4 h-4 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <p className="text-gray-600">
                      <strong className="font-semibold text-gray-900">Michael Rodriguez</strong> – CTO & Co-founder, with 15 years of experience building enterprise software
                    </p>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-gray-100 rounded-full p-1 mr-3 mt-1">
                      <svg className="w-4 h-4 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <p className="text-gray-600">
                      <strong className="font-semibold text-gray-900">Dr. James Wilson</strong> – Chief Research Officer, specializing in neural network architecture
                    </p>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-gray-100 rounded-full p-1 mr-3 mt-1">
                      <svg className="w-4 h-4 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <p className="text-gray-600">
                      <strong className="font-semibold text-gray-900">Aisha Patel</strong> – Chief Commercial Officer, with extensive experience in healthcare technology
                    </p>
                  </li>
                </ul>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Join Us</h2>
                <p className="text-gray-600 leading-relaxed">
                  We're always looking for talented individuals who share our passion for AI and our commitment to creating impactful solutions. If you're interested in joining our team, check out our careers page or reach out directly.
                </p>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}