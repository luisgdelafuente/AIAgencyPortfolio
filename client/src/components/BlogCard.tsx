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
        <span className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full mb-4">
          {formatDate(post.publishedAt)}
        </span>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        <Link 
          href={`/blog/${post.slug}/`} 
          aria-label={`Read more about ${post.title} article`}
          title={`Read more about ${post.title}`}
          className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm font-normal py-1 px-2 hover:bg-gray-50 rounded-md"
        >
          <span>Read more about {post.title}</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
