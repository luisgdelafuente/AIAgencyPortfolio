import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/server/db";
import { users } from "@/shared/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = cookies().get("session");
    
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ 
        authenticated: false,
        user: null 
      });
    }
    
    const userId = parseInt(sessionCookie.value);
    
    if (isNaN(userId)) {
      return NextResponse.json({ 
        authenticated: false,
        user: null 
      });
    }
    
    const userResults = await db.select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    
    if (userResults.length === 0) {
      return NextResponse.json({ 
        authenticated: false,
        user: null 
      });
    }
    
    const user = userResults[0];
    
    // Don't send password back to client
    const { password, ...userWithoutPassword } = user;
    
    return NextResponse.json({ 
      authenticated: true,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Error checking authentication:", error);
    return NextResponse.json(
      { 
        authenticated: false,
        user: null,
        error: "Error checking authentication"
      },
      { status: 500 }
    );
  }
}