import { UserRole } from "./user-role";

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  phone: string;
  role: UserRole;
  isVerified: boolean;
  isAdmin?: boolean;
  isBlocked?: boolean;
  googleId?: string;

  isFarmer?: boolean;
  farmerRegId?: string;
  experience?: number;
  qualification?: string;
  expertise?: string[];
  awards?: string[];
  farmerStatus?: FarmerStatus;
  profilePhoto?: string;
  bio?: string;
  courseProgress?: CourseProgress[];
  reason?: string;
  courseCertificate?: UserCertificate[];
}

export enum FarmerStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface CourseProgress {
  courseId: string;
  progress: number;
  completedChapters: string[];
  totalChapters: number;
}
export interface UserCertificate {
  courseId: string;
  status: 'approved' | 'unavailable';
  certificateUrl?: string;
  issusedDate?: Date;
  approvedBy?: string;
}

export interface UserFilter {
  search?: string;
  isActive?: boolean;
}

export interface ApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'dec';
}
