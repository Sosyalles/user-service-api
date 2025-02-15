export interface SocialLinksDTO {
  instagram?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  facebook?: string | null;
}

export interface NotificationPreferencesDTO {
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyRecommendations: boolean;
}

export interface UpdateUserDetailDTO {
  bio?: string;
  location?: string;
  profilePhoto?: string;
  profilePhotos?: string[];
  socialLinks?: SocialLinksDTO;
  interests?: string[];
  notificationPreferences?: NotificationPreferencesDTO;
}

export interface UserDetailResponseDTO {
  id: number;
  userId: number;
  bio: string | null;
  location: string | null;
  interests: string[];
  socialLinks: SocialLinksDTO;
  notificationPreferences: NotificationPreferencesDTO;
  createdAt: Date;
  updatedAt: Date;
} 