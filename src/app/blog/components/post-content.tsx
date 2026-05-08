"use client"
import React from 'react';

interface PostContentProps {
  content: string;
}

export default function PostContent({ content }: PostContentProps) {
  return (
    <div
      className="mb-8 max-w-none text-gray-700 leading-8 [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:pl-5 [&_blockquote]:italic [&_h1]:mb-5 [&_h1]:mt-8 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:mb-4 [&_h2]:mt-7 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mb-4 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-bold [&_img]:my-6 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl [&_li]:mb-2 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-5 [&_p]:text-base [&_p]:leading-8 [&_strong]:font-bold [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
