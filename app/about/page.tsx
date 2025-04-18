'use client';

import Link from 'next/link';

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-slate-900 text-white p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">HAL149</h1>
            <p className="mt-1">Next.js Migration (Test)</p>
          </div>
          <Link href="/" className="text-white hover:text-slate-300">
            Home
          </Link>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-6">
        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-4">About HAL149</h2>
          <div className="bg-slate-100 p-6 rounded-lg">
            <p className="mb-4">
              HAL149 is a cutting-edge AI agency focused on delivering exceptional AI-powered solutions 
              to clients across various industries. Our team of experienced AI engineers, data scientists, 
              and business strategists work collaboratively to unlock the full potential of artificial 
              intelligence for your business.
            </p>
            <p className="mb-4">
              From custom AI applications and workflow automations to strategic training programs, 
              HAL149 helps businesses harness the transformative power of AI technology to achieve 
              competitive advantages in their markets.
            </p>
            <div className="mt-6 mb-4 border-t border-slate-300 pt-4">
              <h3 className="font-semibold text-xl mb-2">Our Approach</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Human-centered AI development that puts people first</li>
                <li>Transparent and explainable AI systems</li>
                <li>Ethical considerations at every stage</li>
                <li>Continuous learning and adaptation</li>
                <li>Measurable business outcomes</li>
              </ul>
            </div>
          </div>
        </section>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold mb-2 text-xl">Our Team</h3>
            <p className="mb-4">
              Our multidisciplinary team brings together expertise in machine learning, 
              natural language processing, computer vision, and business transformation.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold mb-2 text-xl">Our Mission</h3>
            <p className="mb-4">
              To democratize AI technology and make it accessible, understandable, 
              and valuable for businesses of all sizes.
            </p>
          </div>
        </div>
      </main>
      
      <footer className="bg-slate-900 text-white p-6">
        <div className="container mx-auto">
          <p>© 2025 HAL149. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}