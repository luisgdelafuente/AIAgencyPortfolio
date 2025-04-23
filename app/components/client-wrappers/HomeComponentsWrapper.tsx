'use client';

import React from 'react';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import ProjectsSection from '@/components/ProjectsSection';
import BlogSection from '@/components/BlogSection';
import { Project, BlogPost } from '@/shared/schema';

interface HomeComponentsWrapperProps {
  pageContent: any;
  pageContentLoaded: boolean;
  featuredProjects: Project[];
  projectsLoaded: boolean;
  blogPosts: BlogPost[];
  blogPostsLoaded: boolean;
}

export default function HomeComponentsWrapper({
  pageContent,
  pageContentLoaded,
  featuredProjects,
  projectsLoaded,
  blogPosts,
  blogPostsLoaded
}: HomeComponentsWrapperProps) {
  return (
    <>
      {/* Hero section */}
      <Hero content={pageContent} isLoading={!pageContentLoaded} />
      
      {/* Features section */}
      <Features content={pageContent} isLoading={!pageContentLoaded} />
      
      {/* Projects section */}
      <ProjectsSection projects={featuredProjects} isLoading={!projectsLoaded} />
      
      {/* Blog section */}
      <BlogSection posts={blogPosts} isLoading={!blogPostsLoaded} />
    </>
  );
}