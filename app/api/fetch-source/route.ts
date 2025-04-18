import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get URL from query parameter
    const url = request.nextUrl.searchParams.get('url');
    
    if (!url) {
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }
    
    // Format the URL correctly
    let targetUrl = url;
    const currentHost = request.headers.get('host') || 'localhost:5000';
    
    // If it's a relative URL, make it absolute
    if (url.startsWith('/')) {
      const protocol = request.headers.get('x-forwarded-proto') || 'http';
      targetUrl = `${protocol}://${currentHost}${url}`;
    } else if (!url.startsWith('http')) {
      // Assume it's a relative path without leading slash
      const protocol = request.headers.get('x-forwarded-proto') || 'http';
      targetUrl = `${protocol}://${currentHost}/${url}`;
    }
    
    console.log(`Fetching source from: ${targetUrl}`);
    
    // Fetch the HTML
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'HAL149-SEO-Checker/1.0',
      },
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.status} ${response.statusText}` }, 
        { status: response.status }
      );
    }
    
    // Get the HTML content
    const html = await response.text();
    
    // Return the HTML content as text
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error fetching source:', error);
    return NextResponse.json(
      { error: `Failed to fetch source: ${error instanceof Error ? error.message : 'Unknown error'}` }, 
      { status: 500 }
    );
  }
}