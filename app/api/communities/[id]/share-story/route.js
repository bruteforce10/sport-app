// Ensure this only runs on server side
export const runtime = 'nodejs';

import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name') || 'Community Name';
    const category = searchParams.get('category') || 'Sports';
    
    // Read and convert background image to base64
    let backgroundImageDataUri = '';
    try {
      const imagePath = path.join(process.cwd(), 'public', 'bg-cover-share.png');
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');
      backgroundImageDataUri = `data:image/png;base64,${base64Image}`;
    } catch (imageError) {
      console.error('Error reading background image:', imageError);
      // Fallback: will use gradient only
    }
    
    // Sanitize text to prevent SVG injection
    const sanitizeText = (text) => {
      return text
        .replace(/[<>]/g, '') // Remove potential HTML/SVG tags
        .replace(/&/g, '&amp;') // Escape ampersand
        .replace(/"/g, '&quot;') // Escape quotes
        .replace(/'/g, '&#39;'); // Escape single quotes
    };
    
    const safeName = sanitizeText(name);
    const safeCategory = sanitizeText(category);

    // Create SVG with background image
    const svg = `
      <svg width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Gradient background -->
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#4A90E2;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#7B68EE;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:1" />
          </linearGradient>
        <!-- Background image -->
        <image id="bgImage" href="${backgroundImageDataUri}" width="1080" height="1920" preserveAspectRatio="xMidYMid slice"/>
        </defs>
        
        <!-- Background gradient -->
        <rect width="1080" height="1920" fill="url(#bgGradient)"/>
        <!-- Background image - try direct image element -->
        <image href="${backgroundImageDataUri}" width="1080" height="1920" preserveAspectRatio="xMidYMid slice"/>
        
        <!-- Dark overlay for better text visibility -->
        <rect width="100%" height="100%" fill="rgba(0,0,0,0.4)"/>
        
        <!-- Top section with name and category -->
        <g transform="translate(540, 400)">
          <text x="0" y="0" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="56" font-weight="bold" fill="white">
            ${safeName} 
          </text>
          <text x="0" y="80" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="28" fill="#CCCCCC" opacity="0.9">
            ${safeCategory}
          </text>
        </g>
        
        <!-- Bottom section with button -->
        <g transform="translate(540, 1500)">
          <rect x="-140" y="-30" width="280" height="60" rx="20" fill="#8B5CF6"/>
          <text x="0" y="8" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="bold" fill="white">
            Gabung Sekarang
          </text>
        </g>
        
        <!-- Decorative elements -->
        <circle cx="200" cy="300" r="100" fill="#8B5CF6" opacity="0.1"/>
        <circle cx="880" cy="1400" r="80" fill="#8B5CF6" opacity="0.1"/>
        <circle cx="150" cy="1600" r="60" fill="#8B5CF6" opacity="0.1"/>
      </svg>
    `;

    console.log('Generated SVG for:', { id, name: safeName, category: safeCategory });
    
    // Return SVG for now - we'll handle PNG conversion in the frontend
    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error generating share story:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      params: { id: params?.id }
    });
    
    return new Response(JSON.stringify({ 
      error: 'Failed to generate story image',
      message: error.message 
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
