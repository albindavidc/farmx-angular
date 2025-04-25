export interface Community {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  createdBy: string; //User Id
  memberCount: number;
  imageUrl?: string;
  categories?: string[];
}
