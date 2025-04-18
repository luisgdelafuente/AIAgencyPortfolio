import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "../../../../server/db";
import { users } from "../../../../shared/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // Get the session cookie
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({
        authenticated: false,
        user: null,
      });
    }

    // Parse the user ID from the session cookie
    const userId = parseInt(sessionCookie, 10);

    if (isNaN(userId)) {
      return NextResponse.json({
        authenticated: false,
        user: null,
      });
    }

    // Fetch the user from the database
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const user = result[0];

    if (!user) {
      return NextResponse.json({
        authenticated: false,
        user: null,
      });
    }

    // Return user data without the password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      authenticated: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      {
        authenticated: false,
        user: null,
        message: "An error occurred during authentication check",
      },
      { status: 500 }
    );
  }
}