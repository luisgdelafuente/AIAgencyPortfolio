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
        
        <main className="flex-grow">
          <section className="bg-neutral-50 py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                About HAL149
              </h1>
              <p className="text-neutral-600 text-lg md:text-xl max-w-3xl mx-auto">
                Pioneering the future of AI with industry-specific solutions
              </p>
            </div>
          </section>
          
          <section className="py-16 md:py-24">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="prose max-w-none">
                <h2>Our Mission</h2>
                <p>
                  At HAL149, our mission is to democratize access to cutting-edge artificial intelligence solutions by creating tailored applications for specific industries. We believe that the transformative power of AI should be accessible to businesses of all sizes, not just tech giants with vast resources.
                </p>
                
                <h2>Our Story</h2>
                <p>
                  Founded in 2022 by a team of AI researchers and industry veterans, HAL149 emerged from the recognition that while general-purpose AI tools are powerful, the most impactful solutions are those designed with deep domain expertise for specific business contexts.
                </p>
                <p>
                  We began by partnering with companies in healthcare and finance to develop proof-of-concept applications. The results were transformative – our partners reported significant improvements in efficiency, accuracy, and decision-making capabilities. This early success fueled our growth into additional sectors.
                </p>
                
                <h2>Our Approach</h2>
                <p>
                  We combine deep technical expertise in machine learning with extensive domain knowledge to create solutions that address real-world business challenges. Our collaborative development process ensures that our AI applications align perfectly with the workflows, regulations, and unique needs of each industry we serve.
                </p>
                <p>
                  Our commitment to ethical AI development means that all our solutions are designed with fairness, transparency, privacy, and human oversight as core principles.
                </p>
                
                <h2>Leadership Team</h2>
                <p>
                  Our team brings together experts from both the AI research community and various industries, creating a unique blend of technical innovation and practical business experience.
                </p>
                <ul>
                  <li><strong>Dr. Sarah Chen</strong> – CEO & Co-founder, former AI Research Lead at a major tech company</li>
                  <li><strong>Michael Rodriguez</strong> – CTO & Co-founder, with 15 years of experience building enterprise software</li>
                  <li><strong>Dr. James Wilson</strong> – Chief Research Officer, specializing in neural network architecture</li>
                  <li><strong>Aisha Patel</strong> – Chief Commercial Officer, with extensive experience in healthcare technology</li>
                </ul>
                
                <h2>Join Us</h2>
                <p>
                  We're always looking for talented individuals who share our passion for AI and our commitment to creating impactful solutions. If you're interested in joining our team, check out our careers page or reach out directly.
                </p>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
