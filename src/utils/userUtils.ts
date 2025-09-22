import { User } from '@/types';

/**
 * Get display name for a user based on firstName and lastName
 * @param user - User object with firstName and lastName
 * @returns Formatted display name
 */
export const getUserDisplayName = (user: User): string => {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  } else if (user.firstName) {
    return user.firstName;
  } else if (user.lastName) {
    return user.lastName;
  } else {
    // Fallback to email prefix if no name is available
    return user.email.split('@')[0];
  }
};

/**
 * Get user initials for avatar display
 * @param user - User object with firstName and lastName
 * @returns User initials (max 2 characters)
 */
export const getUserInitials = (user: User): string => {
  const firstName = user.firstName?.trim();
  const lastName = user.lastName?.trim();

  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  } else if (firstName) {
    return firstName[0].toUpperCase();
  } else if (lastName) {
    return lastName[0].toUpperCase();
  } else {
    // Fallback to email initial
    return user.email[0].toUpperCase();
  }
};

/**
 * Get user's profile image URL or null
 * @param user - User object with profileImage
 * @returns Profile image URL or null
 */
export const getUserProfileImage = (user: User): string | null => {
  return user.profileImage || null;
};
