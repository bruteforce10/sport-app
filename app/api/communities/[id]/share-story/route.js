// Ensure this only runs on server side
export const runtime = 'nodejs';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name') || 'Community Name';
    const category = searchParams.get('category') || 'Sports';
    
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

    // Create a simple SVG with black background
    const svg = `
      <svg width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
        <!-- Black background -->
        <rect width="100%" height="100%" fill="#000000"/>
        
        <!-- Top section with name and category -->
        <g transform="translate(540, 400)">
          <text x="0" y="0" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="56" font-weight="bold" fill="white">
            ${safeName}
          </text>
          <text x="0" y="80" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="28" fill="#CCCCCC" opacity="0.8">
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
        'Cache-Control': 'public, max-age=3600',
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
