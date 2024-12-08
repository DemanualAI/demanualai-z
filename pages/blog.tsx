import React from 'react';
import Layout from '../components/Layout/Layout';

export default function Blog() {
  const posts = [
    {
      title: "Getting Started with AI Automation",
      excerpt: "Learn the basics of implementing AI automation in your business.",
      date: "2024-01-15"
    },
    {
      title: "Maximizing Efficiency with DemanualAI",
      excerpt: "Discover how to get the most out of your automation tools.",
      date: "2024-01-10"
    },
    {
      title: "The Future of Business Automation",
      excerpt: "Explore upcoming trends in business process automation.",
      date: "2024-01-05"
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-12">Blog</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <span className="text-sm text-gray-500">{post.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
} 