import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
  try {
    // Create a response and delete the session cookie from it
    const response = NextResponse.json({ message: "Logout successful" });
    response.cookies.delete("session");
    
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "An error occurred during logout" },
      { status: 500 }
    );
  }
}