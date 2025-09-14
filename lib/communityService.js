import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CommunityService {
  static async upsertRating({ communityId, userId, value, comment }) {
    if (value < 1 || value > 5) {
      throw new Error('Rating value must be between 1 and 5');
    }

    // upsert rating for (userId, communityId)
    const rating = await prisma.rating.upsert({
      where: {
        userId_communityId: { userId, communityId }
      },
      create: { userId, communityId, value, comment },
      update: { value, comment }
    });

    // recompute average
    const agg = await prisma.rating.aggregate({
      where: { communityId },
      _avg: { value: true },
      _count: { value: true }
    });

    const average = agg._avg.value ?? 0;

    // persist average into Community.rating for quick reads
    await prisma.community.update({
      where: { id: communityId },
      data: { rating: average }
    });

    return {
      rating,
      averageRating: average,
      totalRatings: agg._count.value
    };
  }

  // Authorization helper: check if user is admin or owner of a community
  static async isAdminOrOwner({ communityId, userId }) {
    // Owner check via community.userId
    const community = await prisma.community.findUnique({
      where: { id: communityId },
      select: { userId: true }
    });
    if (!community) return false;
    if (community.userId === userId) return true;

    // Membership role check
    const membership = await prisma.communityMember.findUnique({
      where: { userId_communityId: { userId, communityId } },
      select: { role: true }
    });
    return Boolean(membership && (membership.role === 'admin' || membership.role === 'owner'));
  }

  // Messages: create a message in a community by a user
  static async createMessage({ communityId, userId, content }) {
    if (!content || content.trim().length === 0) {
      throw new Error('Message content is required');
    }

    // Optional: enforce membership before posting
    const membership = await prisma.communityMember.findUnique({
      where: { userId_communityId: { userId, communityId } }
    });
    if (!membership) {
      throw new Error('User is not a member of this community');
    }

    return prisma.message.create({
      data: { communityId, userId, content }
    });
  }

  // Messages: list messages for a community
  static async listMessages(communityId, { take = 50, skip = 0 } = {}) {
    return prisma.message.findMany({
      where: { communityId },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      include: {
        user: {
          select: { id: true, name: true, avatar: true }
        }
      }
    });
  }

  // Messages: delete a message (owner or admin only)
  static async deleteMessage({ messageId, requesterId }) {
    const message = await prisma.message.findUnique({ where: { id: messageId } });
    if (!message) throw new Error('Message not found');

    // Allow if requester is author
    if (message.userId === requesterId) {
      await prisma.message.delete({ where: { id: messageId } });
      return { success: true };
    }

    // Or if requester is admin/owner in that community
    const membership = await prisma.communityMember.findUnique({
      where: { userId_communityId: { userId: requesterId, communityId: message.communityId } }
    });
    if (!membership || (membership.role !== 'admin' && membership.role !== 'owner')) {
      throw new Error('Not authorized to delete this message');
    }

    await prisma.message.delete({ where: { id: messageId } });
    return { success: true };
  }

  static async getCommunityAverage(communityId) {
    const agg = await prisma.rating.aggregate({
      where: { communityId },
      _avg: { value: true },
      _count: { value: true }
    });
    return {
      averageRating: agg._avg.value ?? 0,
      totalRatings: agg._count.value
    };
  }
  // Create a new community
  static async createCommunity(communityData) {
    try {
      const { socialMedia, userId, ...communityFields } = communityData;

      // create community and creator membership as admin/owner in a single tx
      const result = await prisma.$transaction(async (tx) => {
        const community = await tx.community.create({
          data: {
            ...communityFields,
            userId,
            socialMedia: socialMedia ? { create: socialMedia } : undefined
          },
          include: { socialMedia: true }
        });

        // creator becomes owner (or admin per requirement)
        await tx.communityMember.create({
          data: {
            userId,
            communityId: community.id,
            role: 'admin'
          }
        });

        return community;
      });

      return result;
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
          socialMedia: true,
          memberships: {
            include: {
              user: {
                select: {
                  avatar: true
                }
              }
            }
          }
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
