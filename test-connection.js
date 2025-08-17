import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔄 Testing Prisma connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Prisma connected successfully!');
    
    // Test if we can query the database
    const userCount = await prisma.user.count();
    console.log(`📊 User count: ${userCount}`);
    
    // Test if we can create a test record (optional)
    console.log('🧪 Testing database write...');
    const testUser = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com'
      }
    });
    console.log('✅ Write test successful:', testUser);
    
    // Clean up test data
    await prisma.user.delete({
      where: { id: testUser.id }
    });
    console.log('🧹 Test data cleaned up');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.code === 'P1013') {
      console.error('🔧 Database URL is invalid. Check your DATABASE_URL in .env file');
    } else if (error.code === 'P1001') {
      console.error('🔧 Cannot connect to database. Check if MongoDB is running and accessible');
    } else if (error.code === 'P1002') {
      console.error('🔧 Database connection timed out');
    } else if (error.code === 'P1008') {
      console.error('🔧 Database operations timed out');
    }
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Prisma disconnected');
  }
}

testConnection();
