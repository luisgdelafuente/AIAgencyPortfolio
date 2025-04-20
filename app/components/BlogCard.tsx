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
        <h3 className="text-xl font-bold mb-2">
          <Link
            href={`/blog/${post.slug}/`}
            className="hover:text-gray-600 transition-colors"
            aria-label={`Read more about ${post.title} article`}
            title={`Read more about ${post.title}`}
          >
            {post.title}
          </Link>
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
      </div>
    </div>
  );
}