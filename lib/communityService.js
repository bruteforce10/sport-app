import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CommunityService {
  // Create a new community
  static async createCommunity(communityData) {
    try {
      const { socialMedia, ...communityFields } = communityData;
      
      const community = await prisma.community.create({
        data: {
          ...communityFields,
          socialMedia: {
            create: socialMedia
          }
        },
        include: {
          socialMedia: true
        }
      });
      
      return community;
    } catch (error) {
      console.error('Error creating community:', error);
      throw new Error('Failed to create community');
    }
  }

  // Get all communities
  static async getAllCommunities() {
    try {
      const communities = await prisma.community.findMany({
        include: {
          socialMedia: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return communities;
    } catch (error) {
      console.error('Error fetching communities:', error);
      throw new Error('Failed to fetch communities');
    }
  }

  // Get community by ID
  static async getCommunityById(id) {
    try {
      const community = await prisma.community.findUnique({
        where: { id },
        include: {
          socialMedia: true
        }
      });
      
      return community;
    } catch (error) {
      console.error('Error fetching community:', error);
      throw new Error('Failed to fetch community');
    }
  }

  // Get communities by category
  static async getCommunitiesByCategory(category) {
    try {
      const communities = await prisma.community.findMany({
        where: { category },
        include: {
          socialMedia: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return communities;
    } catch (error) {
      console.error('Error fetching communities by category:', error);
      throw new Error('Failed to fetch communities by category');
    }
  }

  // Get communities by city
  static async getCommunitiesByCity(city) {
    try {
      const communities = await prisma.community.findMany({
        where: { city },
        include: {
          socialMedia: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return communities;
    } catch (error) {
      console.error('Error fetching communities by city:', error);
      throw new Error('Failed to fetch communities by city');
    }
  }

  // Update community
  static async updateCommunity(id, updateData) {
    try {
      const { socialMedia, ...communityFields } = updateData;
      
      const community = await prisma.community.update({
        where: { id },
        data: {
          ...communityFields,
          socialMedia: {
            upsert: {
              create: socialMedia,
              update: socialMedia
            }
          }
        },
        include: {
          socialMedia: true
        }
      });
      
      return community;
    } catch (error) {
      console.error('Error updating community:', error);
      throw new Error('Failed to update community');
    }
  }

  // Delete community
  static async deleteCommunity(id) {
    try {
      await prisma.community.delete({
        where: { id }
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting community:', error);
      throw new Error('Failed to delete community');
    }
  }

  // Update community rating
  static async updateRating(id, newRating) {
    try {
      const community = await prisma.community.update({
        where: { id },
        data: { rating: newRating }
      });
      
      return community;
    } catch (error) {
      console.error('Error updating rating:', error);
      throw new Error('Failed to update rating');
    }
  }

  // Update member count
  static async updateMemberCount(id, increment = true) {
    try {
      const community = await prisma.community.update({
        where: { id },
        data: {
          members: {
            increment: increment ? 1 : -1
          }
        }
      });
      
      return community;
    } catch (error) {
      console.error('Error updating member count:', error);
      throw new Error('Failed to update member count');
    }
  }

  // Search communities
  static async searchCommunities(query) {
    try {
      const communities = await prisma.community.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { city: { contains: query, mode: 'insensitive' } },
            { category: { contains: query, mode: 'insensitive' } }
          ]
        },
        include: {
          socialMedia: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return communities;
    } catch (error) {
      console.error('Error searching communities:', error);
      throw new Error('Failed to search communities');
    }
  }

  // Get top rated communities
  static async getTopRatedCommunities(limit = 10) {
    try {
      const communities = await prisma.community.findMany({
        where: {
          rating: { gt: 0 }
        },
        include: {
          socialMedia: true
        },
        orderBy: {
          rating: 'desc'
        },
        take: limit
      });
      
      return communities;
    } catch (error) {
      console.error('Error fetching top rated communities:', error);
      throw new Error('Failed to fetch top rated communities');
    }
  }

  // Get communities by privacy
  static async getCommunitiesByPrivacy(privacy) {
    try {
      const communities = await prisma.community.findMany({
        where: { privacy },
        include: {
          socialMedia: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return communities;
    } catch (error) {
      console.error('Error fetching communities by privacy:', error);
      throw new Error('Failed to fetch communities by privacy');
    }
  }
}

export default CommunityService;
