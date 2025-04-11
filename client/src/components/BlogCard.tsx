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
    <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <img 
        src={post.imageUrl} 
        alt={post.title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="text-sm text-neutral-500 mb-2">{formatDate(post.publishedAt)}</div>
        <h3 className="text-xl font-semibold mb-2">
          <Link href={`/blog/${post.slug}`} className="hover:text-neutral-600">
            {post.title}
          </Link>
        </h3>
        <p className="text-neutral-600 mb-4">
          {post.excerpt}
        </p>
        <Link 
          href={`/blog/${post.slug}`} 
          className="text-black inline-flex items-center hover:underline"
        >
          Read More <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </article>
  );
}
