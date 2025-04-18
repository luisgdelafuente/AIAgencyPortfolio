import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    // Delete the session cookie
    cookies().delete("session");
    
    return NextResponse.json({ 
      success: true,
      message: "Logged out successfully" 
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred during logout" },
      { status: 500 }
    );
  }
}