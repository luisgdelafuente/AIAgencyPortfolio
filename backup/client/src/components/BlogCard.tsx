import React from 'react';
import { Link } from 'wouter';
import { ChevronRight } from 'lucide-react';
import type { BlogPost } from '@shared/schema';
import { formatDate } from '@shared/utils';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
      <div className="relative overflow-hidden">
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-6">
        <div className="mb-3">
          <span className="text-sm text-gray-500">
            {formatDate(post.publishedAt)}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          <Link 
            href={`/blog/${post.slug}/`}
            aria-label={`Read more about ${post.title} article`}
            title={`Read more about ${post.title}`}
            className="hover:text-gray-600 transition-colors"
          >
            {post.title}
          </Link>
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>
      </div>
    </div>
  );
}
