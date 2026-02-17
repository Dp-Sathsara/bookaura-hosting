export interface Book {
  id: string | number; // Support both for now to avoid breaking legacy code
  _id?: string; // MongoDB ID
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  category: string;
  description?: string;
  image?: string; // Frontend uses 'image', backend 'imageUrl' mapped to 'image' via JsonProperty
  imageUrl?: string; // Backend field name
  stock?: number;
  isFeatured?: boolean;
  rating?: number;
  soldCount?: number;
  isChoice?: boolean;
  keywords?: string[];
}