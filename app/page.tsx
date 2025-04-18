import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-slate-900 text-white p-6">
        <div className="container mx-auto flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">HAL149</h1>
            <p className="mt-1">Next.js Migration (Test)</p>
          </div>
          <nav className="mt-4 sm:mt-0">
            <ul className="flex space-x-6">
              <li>
                <Link href="/" className="text-white hover:text-slate-300 font-medium">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white hover:text-slate-300 font-medium">
                  About
                </Link>
              </li>
              <li>
                <a href="#" className="text-white hover:text-slate-300 font-medium">
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-6">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Next.js Migration Success!</h2>
          <p className="mb-4">
            This is a simplified test page for the Next.js migration. The original site with all features
            will be available once we complete the migration process.
          </p>
          <div className="bg-slate-100 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Migration Status</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>✓ Next.js setup complete</li>
              <li>✓ App Router structure implemented</li>
              <li>✓ Configuration files updated</li>
              <li>→ Components migration in progress</li>
              <li>→ API integration in progress</li>
            </ul>
          </div>
        </section>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/about" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="font-bold mb-2">About</h3>
            <p>Learn more about HAL149 and our AI-powered solutions.</p>
          </Link>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold mb-2">Projects</h3>
            <p>Explore our featured projects and case studies.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold mb-2">Blog</h3>
            <p>Read our latest articles and insights.</p>
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