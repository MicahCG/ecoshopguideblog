import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { reviews, users } from '../shared/schema';
import { eq, isNull } from 'drizzle-orm';

// Load environment variables
config();

// Sample realistic names for reviews
const realisticNames = [
  'Sarah M.',
  'Jennifer L.',
  'Michael R.',
  'Emily K.',
  'David C.',
  'Jessica T.',
  'Christopher B.',
  'Amanda W.',
  'Matthew S.',
  'Lisa H.',
  'James P.',
  'Ashley D.',
  'Daniel F.',
  'Nicole G.',
  'Robert J.',
  'Rachel N.',
  'Ryan V.',
  'Lauren E.',
  'Kevin M.',
  'Megan A.',
  'Brian K.',
  'Stephanie R.',
  'Thomas H.',
  'Katie S.',
  'Andrew C.',
  'Michelle B.',
  'Steven L.',
  'Samantha P.',
  'Joshua W.',
  'Elizabeth F.',
];

async function updateReviewNames() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in environment variables');
    process.exit(1);
  }

  const client = postgres(process.env.DATABASE_URL);
  const db = drizzle(client);

  try {
    console.log('🔍 Fetching all reviews with user information...');

    // Get all reviews with their associated users
    const allReviews = await db
      .select({
        id: reviews.id,
        title: reviews.title,
        userId: reviews.userId,
        fullName: users.fullName,
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(isNull(reviews.deletedAt));

    console.log(`📊 Found ${allReviews.length} reviews`);

    // Filter reviews where fullName is null
    const reviewsNeedingNames = allReviews.filter(r => !r.fullName);
    console.log(`🔧 ${reviewsNeedingNames.length} reviews need name updates`);

    if (reviewsNeedingNames.length === 0) {
      console.log('✅ All reviews already have names!');
      await client.end();
      return;
    }

    // Update each user's fullName in the users table
    let updatedCount = 0;
    const nameIndex = new Map<string, number>(); // Track which name to use for each user

    for (const review of reviewsNeedingNames) {
      // Get consistent name for this userId
      let nameIdx = nameIndex.get(review.userId);
      if (nameIdx === undefined) {
        nameIdx = nameIndex.size % realisticNames.length;
        nameIndex.set(review.userId, nameIdx);
      }

      const newName = realisticNames[nameIdx];

      // Update the user's fullName
      await db
        .update(users)
        .set({ fullName: newName })
        .where(eq(users.id, review.userId));

      console.log(`✓ Updated user ${review.userId.substring(0, 8)}... with name: ${newName}`);
      updatedCount++;
    }

    console.log(`\n✅ Successfully updated ${updatedCount} user names!`);
    console.log('🎉 All reviews now have proper names');

    await client.end();
  } catch (error) {
    console.error('❌ Error updating review names:', error);
    await client.end();
    process.exit(1);
  }
}

updateReviewNames();
