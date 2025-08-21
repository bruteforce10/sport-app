import { currentUser } from "@clerk/nextjs/server";
import { syncUserFromClerk } from "@/lib/userService";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Get current user from Clerk
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Sync user data to Prisma
    const user = await syncUserFromClerk(clerkUser);

    return NextResponse.json({
      success: true,
      user,
      message: "User synced successfully"
    });

  } catch (error) {
    console.error("Error in user sync API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get current user from Clerk
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Return current user info
    return NextResponse.json({
      success: true,
      user: {
        id: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        name: clerkUser.firstName || clerkUser.username,
        avatar: clerkUser.imageUrl
      }
    });

  } catch (error) {
    console.error("Error in user get API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
