import { UserRole } from './user-role';

export interface Post {
  id?: string;
  text: string;
  imageUrl?: string;
  createdAt: Date;
  userId: string;
  userName: string;
  userRole: UserRole;
  communityId: string;
  isEdited?: boolean;
  lastEditedAt?: Date;
}
