import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { reviews, users } from '../shared/schema';
import { readFileSync } from 'fs';
import { eq } from 'drizzle-orm';

/**
 * Import reviews from exported JSON file into Supabase
 */
async function importReviews() {
  console.log('📥 Starting review import to Supabase...\n');

  try {
    const sql = postgres(process.env.DATABASE_URL!);
    const db = drizzle(sql);

    // Read the exported reviews
    const reviewsData = JSON.parse(
      readFileSync('/Users/giraudelc/Downloads/reviews.json', 'utf-8')
    );

    console.log(`📊 Found ${reviewsData.length} reviews to import\n`);

    let successCount = 0;
    let errorCount = 0;
    const userIds = new Set<string>();

    // First, collect all unique user IDs
    reviewsData.forEach((review: any) => {
      userIds.add(review.user_id);
    });

    console.log(`👥 Creating ${userIds.size} user records...\n`);

    // Create user records (guest users for reviews)
    for (const userId of userIds) {
      try {
        // Check if user already exists
        const existingUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);

        if (existingUser.length === 0) {
          await db.insert(users).values({
            id: userId,
            username: `guest_${userId.slice(0, 8)}`,
            // No password needed for guest users who left reviews
          });
        }
      } catch (error: any) {
        // User might already exist, that's okay
        if (!error.message?.includes('duplicate')) {
          console.warn(`Warning creating user ${userId}:`, error.message);
        }
      }
    }

    console.log('✅ User records ready\n');
    console.log('📝 Importing reviews...\n');

    // Import reviews
    for (const review of reviewsData) {
      try {
        await db.insert(reviews).values({
          id: review.id,
          productId: review.product_id,
          userId: review.user_id,
          rating: review.rating,
          title: review.title,
          comment: review.comment,
          photos: review.photos || [],
          isVerifiedPurchase: review.is_verified_purchase || false,
          helpfulCount: review.helpful_count || 0,
          createdAt: new Date(review.created_at),
          deletedAt: review.deleted_at ? new Date(review.deleted_at) : null,
        });

        successCount++;

        // Show progress every 10 reviews
        if (successCount % 10 === 0) {
          console.log(`  ✓ Imported ${successCount}/${reviewsData.length} reviews`);
        }

      } catch (error: any) {
        errorCount++;
        console.error(`  ✗ Error importing review ${review.id}:`, error.message);
      }
    }

    console.log('\n📊 Import Summary:');
    console.log(`  ✅ Successfully imported: ${successCount} reviews`);
    console.log(`  ❌ Errors: ${errorCount}`);

    // Count reviews with photos
    const photosCount = reviewsData.reduce((count: number, review: any) => {
      const photos = review.photos || [];
      return count + photos.length;
    }, 0);

    console.log(`  📸 Review photos to migrate: ${photosCount} URLs`);

    if (photosCount > 0) {
      console.log('\n📋 Reviews with photos (need Cloudinary migration):');
      reviewsData.forEach((review: any) => {
        const photos = review.photos || [];
        if (photos.length > 0) {
          console.log(`  - Review "${review.title}" (${review.id}): ${photos.length} photo(s)`);
          photos.forEach((photoUrl: string) => {
            console.log(`    ${photoUrl}`);
          });
        }
      });
    }

    console.log('\n✅ Import complete!');

  } catch (error: any) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

importReviews();
