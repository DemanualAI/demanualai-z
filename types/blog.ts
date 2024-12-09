export interface Author {
  name: string;
  role: string;
  image: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  role: string;
  image: string;
  contentHtml?: string;
} 