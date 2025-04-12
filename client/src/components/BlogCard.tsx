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
    <article className="bg-white overflow-hidden border border-gray-100 rounded">
      <img 
        src={post.imageUrl} 
        alt={post.title} 
        className="w-full h-44 object-cover"
      />
      <div className="p-4">
        <div className="text-xs text-gray-500 mb-1">{formatDate(post.publishedAt)}</div>
        <h3 className="text-base font-medium mb-1">
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {post.excerpt}
        </p>
        <Link 
          href={`/blog/${post.slug}`} 
          className="text-sm text-black inline-flex items-center"
        >
          Read More <ChevronRight className="w-3 h-3 ml-1" />
        </Link>
      </div>
    </article>
  );
}
