import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { reviews } from '../shared/schema';
import { isNull, sql } from 'drizzle-orm';

config();

async function countReviews() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found');
    process.exit(1);
  }

  const client = postgres(process.env.DATABASE_URL);
  const db = drizzle(client);

  try {
    // Count total reviews (not deleted)
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(reviews)
      .where(isNull(reviews.deletedAt));

    const totalCount = Number(result[0].count);

    // Count by rating
    const ratingCounts = await db
      .select({
        rating: reviews.rating,
        count: sql<number>`count(*)`,
      })
      .from(reviews)
      .where(isNull(reviews.deletedAt))
      .groupBy(reviews.rating)
      .orderBy(reviews.rating);

    console.log('📊 Review Statistics');
    console.log('='.repeat(40));
    console.log(`Total Reviews: ${totalCount}`);
    console.log('\nBreakdown by Rating:');
    ratingCounts.forEach(r => {
      const stars = '⭐'.repeat(r.rating);
      const percentage = ((Number(r.count) / totalCount) * 100).toFixed(1);
      console.log(`${stars} (${r.rating}): ${r.count} reviews (${percentage}%)`);
    });

    await client.end();
  } catch (error) {
    console.error('❌ Error:', error);
    await client.end();
    process.exit(1);
  }
}

countReviews();
