import { NextRequest, NextResponse } from "next/server";

import { db } from "@/server/db";
import { users } from "@/shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    // Fetch user from database
    const result = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    const user = result[0];

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Return user data without the password
    const { password: _, ...userWithoutPassword } = user;

    // Create a response with the session cookie
    const response = NextResponse.json({
      message: "Login successful",
      user: userWithoutPassword,
    });

    // Set cookie on the response
    response.cookies.set({
      name: "session",
      value: String(user.id),
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "An error occurred during login" },
      { status: 500 }
    );
  }
}