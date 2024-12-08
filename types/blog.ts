export interface Author {
  name: string;
  role: string;
  image: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  heroImage: string;
  author: Author;
  date: string;
  readTime: number;
  tags?: string[];
} 