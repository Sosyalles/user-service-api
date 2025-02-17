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
  interests?: string[];
  notificationPreferences?: NotificationPreferencesDTO;
}

export interface UserDetailResponseDTO {
  id: number;
  userId: number;
  bio: string | null;
  location: string | null;
  profilePhoto: string | null;
  profilePhotos: string[];
  interests: string[];
  notificationPreferences: NotificationPreferencesDTO;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
} 