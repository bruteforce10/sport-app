import { NextResponse } from 'next/server';
import CommunityService from '@/lib/communityService';

// PUT /api/communities/[id]/members - Update member count
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const { action } = body; // 'join' or 'leave'
    
    if (!action || !['join', 'leave'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be either "join" or "leave"' },
        { status: 400 }
      );
    }

    const increment = action === 'join';
    const community = await CommunityService.updateMemberCount(id, increment);
    
    return NextResponse.json(
      { 
        message: `Member ${action === 'join' ? 'joined' : 'left'} successfully`,
        community 
      }
    );
    
  } catch (error) {
    console.error('Error updating member count:', error);
    return NextResponse.json(
      { error: 'Failed to update member count' },
      { status: 500 }
    );
  }
}
