import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost } from '../types/blog';
import Link from 'next/link';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');
const postsImageDirectory = path.join(process.cwd(), 'public/posts/images');

export function getSortedPostsData(): BlogPost[] {
  // Ensure directories exist
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
  }
  if (!fs.existsSync(postsImageDirectory)) {
    fs.mkdirSync(postsImageDirectory, { recursive: true });
  }

  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)
    .filter(fileName => fileName.endsWith('.md'));

  const allPostsData = fileNames.map(fileName => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      title: matterResult.data.title || 'Untitled',
      excerpt: matterResult.data.excerpt || 'No excerpt available',
      date: matterResult.data.date || new Date().toISOString(),
      author: matterResult.data.author || 'Anonymous',
      role: matterResult.data.role || 'Contributor',
      image: matterResult.data.image || '/posts/images/default.jpg'
    } as BlogPost;
  });

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getPostData(id: string) {
  // Get file names under /posts
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    title: matterResult.data.title || 'Untitled',
    excerpt: matterResult.data.excerpt || 'No excerpt available',
    date: matterResult.data.date || new Date().toISOString(),
    author: matterResult.data.author || 'Anonymous',
    role: matterResult.data.role || 'Contributor',
    image: matterResult.data.image || '/posts/images/default.jpg'
  };
} 