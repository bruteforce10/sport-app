import { NextResponse } from 'next/server';
import CommunityService from '@/lib/communityService';
import { currentUser } from '@clerk/nextjs/server';
import { getUserByClerkId, syncUserFromClerk } from '@/lib/userService';

// GET /api/communities/[id] - Get community by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const community = await CommunityService.getCommunityById(id);
    
    if (!community) {
      return NextResponse.json(
        { error: 'Community not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ community });
    
  } catch (error) {
    console.error('Error fetching community:', error);
    return NextResponse.json(
      { error: 'Failed to fetch community' },
      { status: 500 }
    );
  }
}

// PUT /api/communities/[id] - Update community
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    // Ensure user is authenticated via Clerk
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    // Find or create corresponding app user
    let appUser = await getUserByClerkId(clerkUser.id);
    if (!appUser) {
      appUser = await syncUserFromClerk(clerkUser);
    }
    const body = await request.json();
    
    // Validate required fields
    const { category, name, city, description, socialMedia, privacy } = body;
    
    if (!category || !name || !city || !description || !privacy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update community data
    const updateData = {
      category,
      name,
      city,
      description,
      socialMedia: {
        instagram: socialMedia?.instagram || '',
        facebook: socialMedia?.facebook || '',
        tiktok: socialMedia?.tiktok || ''
      },
      privacy
    };

    // Authorization: only owner/admin can update
    const allowed = await CommunityService.isAdminOrOwner({ communityId: id, userId: appUser.id });
    if (!allowed) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const community = await CommunityService.updateCommunity(id, updateData);
    
    return NextResponse.json(
      { 
        message: 'Community updated successfully',
        community 
      }
    );
    
  } catch (error) {
    console.error('Error updating community:', error);
    return NextResponse.json(
      { error: 'Failed to update community' },
      { status: 500 }
    );
  }
}

// DELETE /api/communities/[id] - Delete community
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    // Ensure user is authenticated via Clerk
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    // Find or create corresponding app user
    let appUser = await getUserByClerkId(clerkUser.id);
    if (!appUser) {
      appUser = await syncUserFromClerk(clerkUser);
    }

    // Authorization: only owner/admin can delete
    const allowed = await CommunityService.isAdminOrOwner({ communityId: id, userId: appUser.id });
    if (!allowed) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await CommunityService.deleteCommunity(id);
    
    return NextResponse.json(
      { message: 'Community deleted successfully' }
    );
    
  } catch (error) {
    console.error('Error deleting community:', error);
    return NextResponse.json(
      { error: 'Failed to delete community' },
      { status: 500 }
    );
  }
}
