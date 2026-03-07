import 'dotenv/config';
import { db, requireDb } from '../server/db';
import { reviews, users } from '@shared/schema';
import { eq } from 'drizzle-orm';

async function main() {
  const database = requireDb();
  const productId = 'shopify_10243302424865';

  const result = await database
    .select({
      title: reviews.title,
      rating: reviews.rating,
      photos: reviews.photos,
      userName: users.fullName,
    })
    .from(reviews)
    .leftJoin(users, eq(reviews.userId, users.id))
    .where(eq(reviews.productId, productId));

  console.log('Total reviews:', result.length);
  console.log('\nReviews:');
  result.forEach(r => {
    const hasPhoto = r.photos && r.photos.length > 0 ? '📷' : '';
    console.log(`- ${r.title} by ${r.userName} (${r.rating}★) ${hasPhoto}`);
  });
  process.exit(0);
}
main().catch(console.error);
