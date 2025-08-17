const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create sample communities
  const communities = [
    {
      category: 'Sepak Bola',
      name: 'Komunitas Sepak Bola Bandung',
      city: 'Bandung',
      description: 'Komunitas untuk pecinta sepak bola di Bandung. Kami rutin mengadakan latihan dan pertandingan setiap minggu.',
      privacy: 'open',
      socialMedia: {
        instagram: 'futsalbandung',
        facebook: 'Futsal Bandung Community',
        tiktok: 'futsalbandung'
      }
    },
    {
      category: 'Basket',
      name: 'Basket Jakarta Community',
      city: 'Jakarta Pusat',
      description: 'Komunitas basket untuk semua level, dari pemula hingga advanced. Latihan rutin di GOR Senayan.',
      privacy: 'open',
      socialMedia: {
        instagram: 'basketjakarta',
        facebook: 'Basket Jakarta Community',
        tiktok: ''
      }
    },
    {
      category: 'Badminton',
      name: 'Komunitas Badminton Surabaya',
      city: 'Surabaya',
      description: 'Komunitas badminton yang aktif di Surabaya. Latihan rutin dan turnamen internal setiap bulan.',
      privacy: 'closed',
      socialMedia: {
        instagram: 'badmintonsby',
        facebook: '',
        tiktok: 'badmintonsby'
      }
    },
    {
      category: 'Tenis',
      name: 'Tennis Club Denpasar',
      city: 'Denpasar',
      description: 'Klub tenis premium di Denpasar dengan fasilitas lapangan berkualitas dan pelatih profesional.',
      privacy: 'closed',
      socialMedia: {
        instagram: 'tennisdenpasar',
        facebook: 'Tennis Club Denpasar',
        tiktok: ''
      }
    },
    {
      category: 'Renang',
      name: 'Swimming Community Medan',
      city: 'Medan',
      description: 'Komunitas renang untuk semua umur. Latihan teknik dan stamina di kolam renang umum.',
      privacy: 'open',
      socialMedia: {
        instagram: '',
        facebook: 'Swimming Community Medan',
        tiktok: 'swimmingmedan'
      }
    }
  ];

  for (const communityData of communities) {
    const { socialMedia, ...communityFields } = communityData;
    
    const community = await prisma.community.create({
      data: {
        ...communityFields,
        socialMedia: {
          create: socialMedia
        }
      }
    });
    
    console.log(`✅ Created community: ${community.name}`);
  }

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
