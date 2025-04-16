# HAL149 - AI Agency Website

## Project Overview

HAL149 is a modern, performant website built for an AI agency to showcase their services, projects, and insights. The platform features a comprehensive content management system with a focus on performance optimization and SEO.

![HAL149 Website](./generated-icon.png)

## Features

### Frontend
- **Responsive Design**: Mobile-first approach with a clean, professional aesthetic
- **Dynamic Content**: All content is loaded from the database, enabling easy updates without code changes
- **Blog System**: Full-featured blog with categories, formatting, and SEO metadata
- **Project Portfolio**: Showcase AI implementations with detailed case studies
- **SEO Optimization**: Advanced metadata management with a four-tier inheritance system
- **Performance**: Optimized for Google PageSpeed with minimal JavaScript and efficient rendering

### Admin Dashboard
- **Content Management**: Easy-to-use interface for managing all website content
- **SEO Tools**: Comprehensive metadata management for all pages and content items
- **Blog Editor**: Rich text editor with preview functionality
- **Project Management**: Create and update portfolio items with detailed information
- **Contact Management**: View and respond to inquiries from the contact form
- **Settings**: Configure site-wide defaults and section-specific content

### Backend
- **Express API**: RESTful API endpoints for all data operations
- **PostgreSQL Database**: Robust data storage with Supabase integration
- **Authentication**: Secure admin authentication system
- **Drizzle ORM**: Type-safe database operations with schema validation
- **CORS Support**: Configured for secure cross-origin requests in production

## Technology Stack

- **Frontend**: React with TypeScript
- **UI Components**: Tailwind CSS with shadcn/ui
- **State Management**: TanStack Query for server state
- **Routing**: wouter for lightweight routing
- **Backend**: Node.js with Express
- **Database**: PostgreSQL with Supabase integration
- **ORM**: Drizzle with Zod validation
- **Deployment**: Multi-environment support (development, staging, production)

## Architecture

The application follows a modern web architecture pattern:

1. **Data Layer**: PostgreSQL database accessed through Drizzle ORM
2. **API Layer**: Express.js backend providing RESTful endpoints
3. **Frontend Layer**: React with component-based architecture
4. **Deployment Layer**: Optimized for various hosting environments

## SEO Features

The platform implements a sophisticated metadata inheritance system with four tiers:
1. **Site Defaults**: Global fallback values for all pages
2. **Section Pages**: Page-specific metadata for sections like Blog or Projects
3. **Content Items**: Individual metadata for blog posts and projects
4. **Social Media**: Specialized metadata for social sharing

All pages feature proper semantic HTML, canonical URLs, structured data where appropriate, and optimized meta tags for search engines and social media platforms.

## Performance

The website is built with performance as a priority:
- Minimal JavaScript footprint
- Efficient rendering patterns
- Optimized image loading
- Caching strategies for API responses
- Server-side rendering for key pages

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL database

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/hal149.git
cd hal149
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your database credentials and other configuration
```

4. Initialize the database
```bash
npm run db:push
```

5. Run the development server
```bash
npm run dev
```

### Deployment

The application can be deployed to any Node.js hosting provider. For production deployment:

```bash
npm run build
npm start
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any inquiries about this project, please contact [your-email@example.com](mailto:your-email@example.com).