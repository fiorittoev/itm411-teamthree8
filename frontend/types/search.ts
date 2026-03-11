// types/search.ts

export interface SearchItemResult {
  id: string;
  name: string;
  price: string;
  description: string;
  category: string;
  image: string;
  owner_id: string;
  owner_username: string;
  created_at: string;
}

export interface SearchUserResult {
  id: string;
  username: string;
  bio: string;
  profile_image_url: string;
  address: string;
}

export interface SearchCommunityResult {
  id: string;
  name: string;
  description: string;
  lake_name: string;
  member_count: number;
}

export type SearchResult = SearchItemResult | SearchUserResult | SearchCommunityResult;

export type SearchCategory = 'items' | 'users' | 'communities';
export type CommunityFilter = 'all' | 'my-community';
