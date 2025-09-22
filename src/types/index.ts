export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  profileImage: string | null;
  provider: string;
  providerId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface WardrobeItem {
  id: string;
  imageUrl: string;
  category: ClothingCategory;
  color: string;
  season: Season;
  status: ProcessingStatus;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Outfit {
  id: string;
  name: string;
  items: WardrobeItem[];
  imageUrl?: string;
  occasion: string;
  createdAt: string;
}

export enum ClothingCategory {
  TOP = 'top',
  BOTTOM = 'bottom',
  SHOES = 'shoes',
  ACCESSORIES = 'accessories',
  OUTERWEAR = 'outerwear',
  DRESS = 'dress',
  UNDERGARMENT = 'undergarment',
}

export enum Season {
  SPRING = 'spring',
  SUMMER = 'summer',
  FALL = 'fall',
  WINTER = 'winter',
  ALL_SEASON = 'all_season',
}

export enum ProcessingStatus {
  UPLOADING = 'uploading',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface APIResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface CreateWardrobeItemRequest {
  image: string; // base64 or file path
  category?: ClothingCategory;
  tags?: string[];
}

export interface GenerateOutfitRequest {
  occasion?: string;
  season?: Season;
  preferredColors?: string[];
  excludeItems?: string[];
}

export interface ImagePickerResult {
  uri: string;
  width: number;
  height: number;
  type: 'image' | 'video';
  fileSize?: number;
}
