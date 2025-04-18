import { NextRequest, NextResponse } from 'next/server';

// This is a catch-all route handler for API requests
// It will proxy requests to the Express backend
export async function GET(request: NextRequest) {
  try {
    // Get the path from the URL
    const path = request.nextUrl.pathname;
    
    // Forward the request to our Express backend
    const response = await fetch(`http://localhost:5000${path}`);
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the path from the URL
    const path = request.nextUrl.pathname;
    const body = await request.json();
    
    // Forward the request to our Express backend
    const response = await fetch(`http://localhost:5000${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get the path from the URL
    const path = request.nextUrl.pathname;
    const body = await request.json();
    
    // Forward the request to our Express backend
    const response = await fetch(`http://localhost:5000${path}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get the path from the URL
    const path = request.nextUrl.pathname;
    
    // Forward the request to our Express backend
    const response = await fetch(`http://localhost:5000${path}`, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Get the path from the URL
    const path = request.nextUrl.pathname;
    const body = await request.json();
    
    // Forward the request to our Express backend
    const response = await fetch(`http://localhost:5000${path}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}