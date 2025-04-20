'use client';

import React from 'react';
import Link from 'next/link';
import { formatDate } from '@/shared/utils';
import { BlogPost } from '@/shared/schema';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-shadow hover:shadow-md group">
      {post.imageUrl && (
        <div className="h-48 relative overflow-hidden">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-6">
        <span className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 rounded-full mb-3">
          {formatDate(post.publishedAt)}
        </span>
        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
        <Link
          href={`/blog/${post.slug}/`}
          className="inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-600"
          aria-label={`Read more about ${post.title} article`}
          title={`Read more about ${post.title}`}
        >
          Read more about {post.title}
          <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}