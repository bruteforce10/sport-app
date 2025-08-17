import { NextResponse } from 'next/server';
import CommunityService from '@/lib/communityService';

// PUT /api/communities/[id]/rating - Update community rating
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const { rating } = body;
    
    if (typeof rating !== 'number' || rating < 0 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be a number between 0 and 5' },
        { status: 400 }
      );
    }

    const community = await CommunityService.updateRating(id, rating);
    
    return NextResponse.json(
      { 
        message: 'Rating updated successfully',
        community 
      }
    );
    
  } catch (error) {
    console.error('Error updating rating:', error);
    return NextResponse.json(
      { error: 'Failed to update rating' },
      { status: 500 }
    );
  }
}
