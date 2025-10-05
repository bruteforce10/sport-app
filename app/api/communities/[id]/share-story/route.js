// Ensure this only runs on server side
export const runtime = 'nodejs';

import fs from 'fs';
import path from 'path';

// Utility untuk wrap text ke beberapa baris
function wrapText(text, maxWidth, fontSize) {
  const charWidth = fontSize * 0.55; // estimasi lebar per karakter
  const words = text.split(' ');
  let lines = [];
  let currentLine = '';

  words.forEach(word => {
    let testLine = currentLine ? currentLine + ' ' + word : word;
    let testWidth = testLine.length * charWidth;

    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });

  if (currentLine) lines.push(currentLine);
  return lines;
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name') || 'Community Name';
    const category = searchParams.get('category') || 'Sports';
    const avatar = searchParams.get('avatar') || '';
    const members = searchParams.get('members') || 0;
    const activityTags = searchParams.get('activityTags') || '';

    // Read and convert background image to base64
    let backgroundImageDataUri = '';
    try {
      const imagePath = path.join(process.cwd(), 'public', 'bg-cover-share.png');
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');
      backgroundImageDataUri = `data:image/png;base64,${base64Image}`;
    } catch (imageError) {
      console.error('Error reading background image:', imageError);
    }

    // Convert logo/avatar to base64 if provided
    let avatarDataUri = '';
    if (avatar) {
      try {
        const avatarResponse = await fetch(avatar);
        if (avatarResponse.ok) {
          const avatarBuffer = await avatarResponse.arrayBuffer();
          const avatarBase64 = Buffer.from(avatarBuffer).toString('base64');
          const imageType = avatar.includes('.png') ? 'png' : 
                          avatar.includes('.gif') ? 'gif' : 'jpeg';
          avatarDataUri = `data:image/${imageType};base64,${avatarBase64}`;
        }
      } catch (avatarError) {
        console.error('Error converting avatar to base64:', avatarError);
      }
    }

    // Sanitize text
    const sanitizeText = (text) => {
      return text
        .replace(/[<>]/g, '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    };

    const safeName = sanitizeText(name);
    const safeCategory = sanitizeText(category);

    // Initials fallback
    const initials = name.split(' ').map(word => word[0]).join('').slice(0, 3);

    // Avatar element
    let avatarElement = '';
    if (avatarDataUri) {
      avatarElement = `
      <g transform="translate(0, -80)">
        <defs>
          <clipPath id="circleClip">
            <circle cx="0" cy="0" r="100"/>
          </clipPath>
        </defs>
        <image href="${avatarDataUri}" x="-100" y="100" width="200" height="200" preserveAspectRatio="xMidYMid slice" clip-path="url(#circleClip)"/>
        </g>
      `;
    } else {
      avatarElement = `
        <g transform="translate(0, -80)">
        <circle cx="0" cy="0" r="100" fill="#CCCCCC"/>
        <text x="0" y="15" text-anchor="middle" font-family="system-ui, sans-serif" font-size="48" font-weight="bold" fill="white">${initials}</text>
        </g>
      `;
    }

    // Wrap Nama Komunitas
    const fontSize = 90;
    const maxWidth = 800;
    const nameLines = wrapText(safeName, maxWidth, fontSize);

    let nameElement = `
      <text x="0" y="120" text-anchor="middle" font-family="system-ui, sans-serif" 
        font-size="${fontSize}" font-weight="bold" fill="white">
        ${nameLines.map((line, i) => `
          <tspan x="0" dy="${i === 0 ? 0 : fontSize + 10}">${line}</tspan>
        `).join('')}
      </text>
    `;

    // Activity Tags with auto-wrap
    const tags = activityTags.split(',').map(tag => tag.trim()).filter(Boolean);
    let tagsElement = '';
    if (tags.length > 0) {
      const spacingX = 20;
      const spacingY = -20;
      const tagHeight = 60;
      const maxWidthTags = 800;
      let x = 0;
      let y = 270;
      let lineGroups = [];
      let currentLine = '';
      let currentLineWidth = 0;

      tags.forEach((tag, i) => {
        const textWidth = tag.length * 20;
        const tagWidth = textWidth + 80;

        if (currentLineWidth + tagWidth + spacingX > maxWidthTags && currentLine !== '') {
          lineGroups.push({ content: currentLine, width: currentLineWidth });
          currentLine = '';
          currentLineWidth = 0;
          y += tagHeight + spacingY;
          x = 0;
        }

        currentLine += `
          <g transform="translate(${x},${y})">
            <rect x="0" y="0" rx="30" ry="30" width="${tagWidth}" height="${tagHeight}" fill="blue"/>
            <text x="${tagWidth/2}" y="42" text-anchor="middle" font-family="system-ui, sans-serif" font-size="45" font-weight="500" fill="#FFF">
              ${tag}
            </text>
          </g>
        `;
        x += tagWidth + spacingX;
        currentLineWidth += tagWidth + spacingX;

        if (i === tags.length - 1) {
          lineGroups.push({ content: currentLine, width: currentLineWidth });
        }
      });

      tagsElement = lineGroups.map((line, idx) => {
        return `
          <g transform="translate(-${line.width / 2}, ${310 + idx * (tagHeight + spacingY)} )">
            ${line.content}
          </g>
        `;
      }).join('');
    }

    // Final SVG
    const svg = `
      <svg width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
        <!-- Background -->
        <image href="${backgroundImageDataUri}" width="1080" height="1920" preserveAspectRatio="xMidYMid slice"/>

        <!-- Konten Tengah -->
        <g transform="translate(530,550)">
          <!-- Avatar -->
          ${avatarElement}

          <!-- Nama Komunitas -->
          ${nameElement}

          
          <!-- Kategori -->
          <text x="0" y="${90 + (nameLines.length * (fontSize + 10)) + 50}" text-anchor="middle" 
            font-family="system-ui, sans-serif" font-size="50" fill="white" font-weight="bold">
            ${safeCategory}
          </text>

          <!-- Anggota -->
          <text x="0" y="${120 + (nameLines.length * (fontSize + 10)) + 100}" text-anchor="middle" 
            font-family="system-ui, sans-serif" font-size="50" fill="white">
            (${members} Anggota)
          </text>


          <!-- Activity Tags -->
          ${tagsElement}


          <text x="0" y="850" text-anchor="middle" 
            font-family="system-ui, sans-serif" font-size="65" font-weight="bold" fill="white">
           Gabung Sekarang
          </text>

          <!-- Tombol CTA -->
          <g transform="translate(0, 950) scale(1.4)">
            <rect x="-200" y="-50" width="400" height="80" rx="20" fill="#FFFF00"/>
            <text x="0" y="0" text-anchor="middle" font-family="system-ui, sans-serif" font-size="36" font-weight="bold" fill="#000000">
              www.sportapp.id
            </text>
          </g>
        </g>
      </svg>
    `;

    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating share story:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate story image',
      message: error.message 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
