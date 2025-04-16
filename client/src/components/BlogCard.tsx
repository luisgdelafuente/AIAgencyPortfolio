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
    <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <img 
        src={post.imageUrl} 
        alt={post.title} 
        className="w-full h-48 object-cover"
        loading="lazy"
      />
      <div className="p-6">
        <span className="text-sm text-gray-500">{formatDate(post.publishedAt)}</span>
        <h3 className="mt-2 text-xl font-semibold text-gray-900">
          <Link href={`/blog/${post.slug}/`}>
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 text-gray-600 line-clamp-2">
          {post.excerpt}
        </p>
        <Link 
          href={`/blog/${post.slug}/`} 
          className="mt-4 inline-block text-gray-900 hover:text-gray-800"
        >
          Read More →
        </Link>
      </div>
    </article>
  );
}
