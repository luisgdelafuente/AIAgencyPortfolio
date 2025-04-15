import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from "react-helmet";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
}

interface AboutContent {
  title?: string;
  mission?: string;
  vision?: string;
  history?: string;
  team?: TeamMember[];
  [key: string]: any;
}

export default function About() {
  const [content, setContent] = useState<AboutContent>({
    title: "About HAL149",
    mission: "Our mission is to democratize artificial intelligence and make its benefits accessible to businesses of all sizes.",
    vision: "We envision a future where AI enhances human potential rather than replacing it, creating more opportunities for innovation and growth.",
    history: "Founded in 2020, our team of AI specialists and industry experts has been at the forefront of developing practical applications of machine learning that solve real business problems.",
    team: [
      {
        name: "Dr. Sarah Chen",
        role: "CEO & Co-founder",
        bio: "Former AI Research Lead at a major tech company"
      },
      {
        name: "Michael Rodriguez",
        role: "CTO & Co-founder",
        bio: "15 years of experience building enterprise software"
      },
      {
        name: "Dr. James Wilson",
        role: "Chief Research Officer",
        bio: "Specializing in neural network architecture"
      }
    ]
  });
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/page-contents/about');
        if (response.ok) {
          const data = await response.json();
          const parsedContent = JSON.parse(data.content);
          setContent(parsedContent);
        }
      } catch (error) {
        console.log('Error fetching about content:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContent();
  }, []);
  
  return (
    <>
      <Helmet>
        <title>About | HAL149</title>
        <meta name="description" content="Learn about HAL149, our mission, vision, and the team behind our industry-specific AI applications." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow pt-28">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                {content.title || "About HAL149"}
              </h1>
              <p className="text-lg text-gray-600">
                Pioneering the future of AI with industry-specific solutions
              </p>
            </div>
            
            <div>
              <div className="prose prose-gray max-w-none">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-gray-600 mb-10 leading-relaxed">
                  {content.mission || "At HAL149, our mission is to democratize access to cutting-edge artificial intelligence solutions by creating tailored applications for specific industries. We believe that the transformative power of AI should be accessible to businesses of all sizes, not just tech giants with vast resources."}
                </p>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
                <p className="text-gray-600 mb-10 leading-relaxed">
                  {content.vision || "We envision a future where AI enhances human potential rather than replacing it, creating more opportunities for innovation and growth."}
                </p>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our History</h2>
                <p className="text-gray-600 mb-10 leading-relaxed">
                  {content.history || "Founded in 2020, our team of AI specialists and industry experts has been at the forefront of developing practical applications of machine learning that solve real business problems."}
                </p>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Leadership Team</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Our team brings together experts from both the AI research community and various industries, creating a unique blend of technical innovation and practical business experience.
                </p>
                <ul className="space-y-4 mb-10">
                  {content.team && content.team.map((member, index) => (
                    <li key={index} className="flex items-start">
                      <span className="bg-gray-100 rounded-full p-1 mr-3 mt-1">
                        <svg className="w-4 h-4 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <p className="text-gray-600">
                        <strong className="font-semibold text-gray-900">{member.name}</strong> – {member.role}, {member.bio}
                      </p>
                    </li>
                  ))}
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