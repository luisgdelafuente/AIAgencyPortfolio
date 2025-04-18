import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import { db } from "@/server/db";
import { users } from "@/shared/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username and password are required" },
        { status: 400 }
      );
    }
    
    const userResults = await db.select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    
    if (userResults.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid username or password" },
        { status: 401 }
      );
    }
    
    const user = userResults[0];
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid username or password" },
        { status: 401 }
      );
    }
    
    // Set session cookie with user ID
    cookies().set({
      name: "session",
      value: user.id.toString(),
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    // Don't send password back to client
    const { password: userPassword, ...userWithoutPassword } = user;
    
    return NextResponse.json({ 
      success: true,
      message: "Login successful",
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred during login" },
      { status: 500 }
    );
  }
}