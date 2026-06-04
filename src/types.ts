export type Region = 
  | 'Tokyo' 
  | 'Osaka' 
  | 'Nara' 
  | 'Ibaraki' 
  | 'Tsukuba' 
  | 'Ushiku' 
  | 'Sapporo' 
  | 'Otaru' 
  | 'Fukuoka' 
  | 'Saitama' 
  | 'Mito' 
  | 'Kobe' 
  | 'Toyama' 
  | 'Shirakawago' 
  | 'Kanagawa';

export interface Post {
  id: string;
  title: string;
  content: string;
  region: Region;
  imageUrl: string;
  createdAt: number;
}

export interface Recommendation {
  id: string;
  name: string;
  category: 'Food' | 'Cafe';
  description: string;
  imageUrl: string;
  region: 'Tokyo' | 'Tsukuba';
  likesCount: number;
  createdAt: any;
  lat?: number;
  lng?: number;
}

export type Category = 
  | 'Home' 
  | 'Posts' 
  | 'Weather' 
  | 'Exchange' 
  | 'News' 
  | 'Translator' 
  | 'Recommendations'
  | 'Community';

export interface SiteConfig {
  authorName: string;
  authorIntro: string;
  statusMessage: string;
}

export interface TranslationRecord {
  id: string;
  original: string;
  translated: string;
  createdAt: any;
  userId: string;
}
