import { NextResponse } from 'next/server';
import CommunityService from '@/lib/communityService';

// POST /api/communities - Create a new community
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { category, name, city, description, socialMedia, privacy } = body;
    
    if (!category || !name || !city || !description || !privacy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create community data
    const communityData = {
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

    const community = await CommunityService.createCommunity(communityData);
    
    return NextResponse.json(
      { 
        message: 'Community created successfully',
        community 
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error creating community:', error);
    return NextResponse.json(
      { error: 'Failed to create community' },
      { status: 500 }
    );
  }
}

// GET /api/communities - Get all communities
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const city = searchParams.get('city');
    const privacy = searchParams.get('privacy');
    const search = searchParams.get('search');
    
    let communities;
    
    if (search) {
      communities = await CommunityService.searchCommunities(search);
    } else if (category) {
      communities = await CommunityService.getCommunitiesByCategory(category);
    } else if (city) {
      communities = await CommunityService.getCommunitiesByCity(city);
    } else if (privacy) {
      communities = await CommunityService.getCommunitiesByPrivacy(privacy);
    } else {
      communities = await CommunityService.getAllCommunities();
    }
    
    return NextResponse.json({ communities });
    
  } catch (error) {
    console.error('Error fetching communities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch communities' },
      { status: 500 }
    );
  }
}
