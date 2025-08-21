import { prisma } from './prisma';

/**
 * Sync user data from Clerk to Prisma database
 * @param {Object} clerkUser - User object from Clerk
 * @returns {Object} - Created or updated user
 */
export async function syncUserFromClerk(clerkUser) {
  try {
    const email = clerkUser.emailAddresses[0]?.emailAddress;
    const avatar = clerkUser.imageUrl;
    const name = clerkUser.firstName || clerkUser.username || '';
    const clerkId = clerkUser.id;

    if (!email || !clerkId) {
      throw new Error('Email and Clerk ID are required');
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { clerkId }
    });

    if (existingUser) {
      // Update existing user
      const updatedUser = await prisma.user.update({
        where: { clerkId },
        data: {
          email,
          name,
          avatar,
          updatedAt: new Date()
        }
      });
      return updatedUser;
    } else {
      // Create new user
      const newUser = await prisma.user.create({
        data: {
          clerkId,
          email,
          name,
          avatar
        }
      });
      return newUser;
    }
  } catch (error) {
    console.error('Error syncing user from Clerk:', error);
    throw error;
  }
}

/**
 * Get user by Clerk ID
 * @param {string} clerkId - Clerk user ID
 * @returns {Object|null} - User object or null
 */
export async function getUserByClerkId(clerkId) {
  try {
    return await prisma.user.findUnique({
      where: { clerkId }
    });
  } catch (error) {
    console.error('Error getting user by Clerk ID:', error);
    throw error;
  }
}

/**
 * Get user by email
 * @param {string} email - User email
 * @returns {Object|null} - User object or null
 */
export async function getUserByEmail(email) {
  try {
    return await prisma.user.findUnique({
      where: { email }
    });
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
}


