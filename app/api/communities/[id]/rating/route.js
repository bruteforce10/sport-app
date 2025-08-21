import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { getUserByClerkId, syncUserFromClerk } from '@/lib/userService';
import { CommunityService } from '@/lib/communityService';


export async function POST(_request, { params }) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure app user exists
    let appUser = await getUserByClerkId(clerkUser.id);
    if (!appUser) {
      appUser = await syncUserFromClerk(clerkUser);
    }

    const { id: communityId } = params;

    const body = await _request.json();
    const value = Number(body?.value);
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      return NextResponse.json({ error: 'Rating must be an integer 1-5' }, { status: 400 });
    }

    const result = await CommunityService.upsertRating({
      communityId,
      userId: appUser.id,
      value
    });

    return NextResponse.json({
      message: 'Rating submitted',
      ...result
    }, { status: 201 });
  } catch (error) {
    console.error('Error submitting rating:', error);
    return NextResponse.json({ error: 'Failed to submit rating' }, { status: 500 });
  }
}


// PUT /api/communities/[id]/rating - Update community rating
export async function PUT(request, { params }) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // pastikan user ada
    let appUser = await getUserByClerkId(clerkUser.id);
    if (!appUser) {
      appUser = await syncUserFromClerk(clerkUser);
    }

    const { id: communityId } = params;
    const body = await request.json();
    const value = Number(body?.value);


    if (!Number.isInteger(value) || value < 1 || value > 5) {
      return NextResponse.json(
        { error: 'Rating must be an integer 1-5' },
        { status: 400 }
      );
    }
    
   // upsert rating
   const result = await CommunityService.upsertRating({
    communityId,
    userId: appUser.id,
    value
  });

  return NextResponse.json({
    message: 'Rating updated successfully',
    ...result
  }, { status: 200 });
    
  } catch (error) {
    console.error('Error updating rating:', error);
    return NextResponse.json(
      { error: 'Failed to update rating' },
      { status: 500 }
    );
  }
}
