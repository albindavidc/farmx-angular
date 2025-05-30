export interface Community {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  createdBy: string; //User Id
  isActive: boolean;
  memberCount: number;
  imageUrl?: string;
  categories?: string[]; //eg: organic farming, sustainable agriculture
}


export interface createCommunityRequest{
  name: string;
  description: string;
  categories?: string[];
  image?: File;
}