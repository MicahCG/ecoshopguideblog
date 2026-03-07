import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { reviews, users, reviewAuditLog } from '../shared/schema';
import { eq, and, inArray } from 'drizzle-orm';

config();

const WALL_HANGER_PRODUCT_ID = 'shopify_10237502816545';
const SEED_MARKER = 'wall-hanger-seed'; // Used to identify seeded reviews for cleanup

// Diverse reviewer names - realistic, casual formats
const reviewerNames = [
  'Adetayo', 'priya', 'Marcus', 'Yuki', 'fatima',
  'DeShawn', 'Costa', 'Mei', 'carlos', 'Amara',
  'Tabish', 'elena', 'Kwame', 'Sanjay', 'Rosa',
];

// Reviews WITH photos - realistic customer photos
const reviewsWithPhotos = [
  {
    title: "Perfect for my outdoor patio!",
    comment: `This is exactly what my patio was missing! I hung it on the wooden fence and put my trailing ivy in it - looks absolutely beautiful. The rustic wood blends right in with the outdoor vibe and the glass jar is thick enough that I'm not worried about it in the weather. My ivy is thriving and the vines are starting to trail down which looks so pretty. Great size too, doesn't overwhelm the space but definitely makes a statement. Already ordered a second one!`,
    rating: 5,
    reviewerName: "Tariq",
    photoFilename: "review_patio_ivy.png",
    isRealCustomerPhoto: true,
    fixedDate: new Date('2026-02-03'), // Most recent - appears at top
  },
  {
    title: "Perfect with dried botanicals!",
    comment: `I added dried eucalyptus and pampas grass to mine and I'm obsessed with how it turned out! The combination of the soft fluffy pampas with the silvery eucalyptus leaves looks so elegant against the rustic wood. The dark stained wood really makes the neutral tones of the dried arrangement pop. I have it hanging in my living room and I get compliments every time someone visits. Best part? No watering needed and it'll last forever! The rope hanger is super sturdy and the metal clamp holds the glass jar perfectly. Already thinking about getting another one for my bedroom!`,
    rating: 5,
    reviewerName: "ashley",
    photoFilename: "review_photo_real_customer_eucalyptus_pampas.png",
    isRealCustomerPhoto: true,
    fixedDate: new Date('2026-02-02'), // Second most recent
  },
  {
    title: "Perfect for my small bathroom",
    comment: `I put dried eucalyptus in mine instead of fresh flowers and it makes my bathroom smell amazing! The rustic wood goes perfect with my farmhouse style. It's mounted next to my mirror and I love how it looks. The glass jar does get water spots but that's easy to wipe off. The rope is sturdy and hasn't frayed much. Really happy with this little addition to my space.`,
    rating: 5,
    reviewerName: "Aisha",
    photoFilename: "review_1_heatherm.png",
  },
  {
    title: "Great propagation station!",
    comment: `I use this to propagate my pothos cuttings and it works amazing! The glass jar is the perfect size for small cuttings and I can watch the roots grow. I have it hung in my kitchen near the window and it gets just enough light. The water does get a bit cloudy after a week or so but that's normal for propagation. Love that it's functional AND decorative. Already bought a second one for more cuttings!`,
    rating: 5,
    reviewerName: "nicole",
    photoFilename: "review_2_nicoler.png",
  },
  {
    title: "Love it with fresh flowers from the garden",
    comment: `Every week I put fresh flowers from my garden in this and it makes me so happy. Right now I have some daisies and little wildflowers. The jar is a good size - not too big that it looks overpowering on the wall. Some petals do fall on the floor when the flowers start wilting but that's just flowers being flowers lol. The wood has such a nice rustic look that goes great with my farmhouse decor. Definitely recommend!`,
    rating: 5,
    reviewerName: "Yuki",
    photoFilename: "review_3_lindas.png",
  },
  {
    title: "Bought two - look great together!",
    comment: `I bought two of these for my dining room and I love how they look! I put dried lavender in one and some wheat stalks in the other for that farmhouse look. They're not perfectly matched since they're handmade looking wood but honestly that adds to the charm. Mine aren't hanging perfectly level but my husband says only I notice that haha. The rope is super sturdy. Great value for the price - I might get two more for my kitchen!`,
    rating: 5,
    reviewerName: "karen",
    photoFilename: "review_4_karent.png",
  },
  {
    title: "Nice quality for the price",
    comment: `Wanted to share a close-up of the quality because I was impressed. The wood has real character - you can see the grain and there's even a small knot which I think looks cool. The metal clamp holding the jar is sturdy, though I noticed the screw has a tiny bit of rust starting already (might want to seal it). The rope feels thick and strong. For under $30 I think it's great quality. Already hung it up and it's holding a jar of water with no leaks.`,
    rating: 4,
    reviewerName: "DeShawn",
    photoFilename: "review_5_robertj.png",
  },
];

// Text-only reviews for variety
const textOnlyReviews = [
  {
    title: "Exactly what I wanted",
    comment: "I've been looking for something like this forever! The rustic wood look is perfect for my farmhouse kitchen. I put a small bouquet of baby's breath in it and it's so pretty. Easy to hang and sturdy. Very happy with my purchase.",
    rating: 5,
  },
  {
    title: "Cute and functional",
    comment: "This is such a sweet little accent piece. I have it in my entryway with some faux greenery. The wood grain is beautiful and each one is slightly unique which I appreciate. The glass jar is a good quality and the rope feels sturdy. Would recommend!",
    rating: 5,
  },
  {
    title: "Great gift idea",
    comment: "I bought this as a housewarming gift for my friend and she loved it! The packaging was nice and it arrived quickly without any damage. She put some dried flowers in it and it looks amazing in her home. Will definitely buy more for gifts.",
    rating: 5,
  },
  {
    title: "Good but jar is smaller than expected",
    comment: "Love the look of this but the glass jar is a bit smaller than I thought it would be from the photos. Still works fine for small flower arrangements or single stems. The wood and rope quality is nice. Just wish it was a bit bigger.",
    rating: 4,
  },
  {
    title: "So charming!",
    comment: "This little wall vase adds so much charm to my guest bedroom. I change out the flowers seasonally - right now I have some dried cotton stems in it. The rustic wood has a nice weathered look without being too distressed. Love it!",
    rating: 5,
  },
  {
    title: "Simple and elegant",
    comment: "Not too big, not too small - just right for adding a little touch of nature to my office. I put a single stem in it and it's perfect. The installation was super easy, just one nail. Nice product for the price.",
    rating: 5,
  },
  {
    title: "Wood quality varies",
    comment: "The one I received has some darker spots in the wood that weren't shown in the photos. It's not bad looking but just different than expected. Otherwise the product is well made and sturdy. The rope and jar are nice quality.",
    rating: 4,
  },
  {
    title: "Perfect farmhouse decor",
    comment: "This fits my farmhouse aesthetic perfectly! I have it hanging in my dining room with some wheat stalks. The wood has nice texture and the rope is thick and secure. It's a small detail that makes a big difference in the room.",
    rating: 5,
  },
];

function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

async function seedWallHangerReviews() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not found in environment variables');
    process.exit(1);
  }

  const client = postgres(process.env.DATABASE_URL);
  const db = drizzle(client);

  try {
    console.log('🌻 Seeding reviews for Modern Wooden Wall Plant Hanger...\n');
    console.log(`Product ID: ${WALL_HANGER_PRODUCT_ID}\n`);

    // ============================================
    // CLEANUP: Delete existing seeded reviews
    // ============================================
    console.log('🧹 Cleaning up existing seeded reviews...\n');

    // Find reviews for this product that were seeded (check audit log)
    const existingReviews = await db
      .select({ id: reviews.id })
      .from(reviews)
      .where(eq(reviews.productId, WALL_HANGER_PRODUCT_ID));

    if (existingReviews.length > 0) {
      const reviewIds = existingReviews.map(r => r.id);

      // Find which ones were seeded by checking audit log
      const seededAuditEntries = await db
        .select({ reviewId: reviewAuditLog.reviewId })
        .from(reviewAuditLog)
        .where(
          and(
            inArray(reviewAuditLog.reviewId, reviewIds),
            eq(reviewAuditLog.performedBy, 'system-seed')
          )
        );

      const seededReviewIds = [...new Set(seededAuditEntries.map(e => e.reviewId))];

      if (seededReviewIds.length > 0) {
        // Delete audit log entries first (foreign key)
        await db.delete(reviewAuditLog).where(inArray(reviewAuditLog.reviewId, seededReviewIds));
        // Delete the reviews
        await db.delete(reviews).where(inArray(reviews.id, seededReviewIds));
        console.log(`   Deleted ${seededReviewIds.length} existing seeded reviews\n`);
      } else {
        console.log('   No existing seeded reviews found\n');
      }
    } else {
      console.log('   No existing reviews for this product\n');
    }

    // Date range: 3 months ago to today
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);

    let createdCount = 0;

    // Photos are served from client/public/review-photos/
    const PHOTO_BASE_URL = '/review-photos/';

    // ============================================
    // PHASE 1: Create reviews WITH photos
    // ============================================
    console.log('📸 Creating reviews with photos...\n');

    for (const photoReview of reviewsWithPhotos) {
      try {
        const userResult = await db
          .insert(users)
          .values({
            username: `user_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            fullName: photoReview.reviewerName,
            email: `${photoReview.reviewerName.toLowerCase().replace(/[^a-z]/g, '')}${Math.floor(Math.random() * 9999)}@example.com`,
          })
          .returning();

        const user = userResult[0];
        // Use fixed date if specified, otherwise random
        const reviewDate = photoReview.fixedDate || getRandomDate(startDate, endDate);

        // Photo URL - photos served from client/public/review-photos/
        const photoUrl = [`${PHOTO_BASE_URL}${photoReview.photoFilename}`];

        const [newReview] = await db.insert(reviews).values({
          productId: WALL_HANGER_PRODUCT_ID,
          userId: user.id,
          rating: photoReview.rating,
          title: photoReview.title,
          comment: photoReview.comment,
          isVerifiedPurchase: true,
          createdAt: reviewDate,
          photos: photoUrl,
        }).returning();

        await db.insert(reviewAuditLog).values({
          reviewId: newReview.id,
          action: 'CREATE',
          performedBy: 'system-seed',
          previousData: null,
          newData: newReview,
          reason: `Seeded ${photoReview.isRealCustomerPhoto ? 'REAL customer' : 'generated'} photo review`,
          ipAddress: 'localhost',
        });

        createdCount++;
        const photoTag = photoReview.isRealCustomerPhoto ? '📷 REAL' : '🎨';
        console.log(`  ${photoTag} Created: "${photoReview.title}" by ${photoReview.reviewerName} (${photoReview.rating}★)`);
      } catch (error) {
        console.error(`❌ Error creating photo review:`, error);
      }
    }

    // ============================================
    // PHASE 2: Create text-only reviews
    // ============================================
    console.log('\n📝 Creating text-only reviews...\n');

    const shuffledReviews = shuffleArray(textOnlyReviews);
    const shuffledNames = shuffleArray(reviewerNames);

    for (let i = 0; i < shuffledReviews.length; i++) {
      const reviewTemplate = shuffledReviews[i];
      const reviewerName = shuffledNames[i % shuffledNames.length];

      try {
        const userResult = await db
          .insert(users)
          .values({
            username: `user_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            fullName: reviewerName,
            email: `${reviewerName.toLowerCase().replace(/[^a-z]/g, '')}${Math.floor(Math.random() * 9999)}@example.com`,
          })
          .returning();

        const user = userResult[0];
        const reviewDate = getRandomDate(startDate, endDate);
        const isVerified = Math.random() > 0.2; // 80% verified

        const [newReview] = await db.insert(reviews).values({
          productId: WALL_HANGER_PRODUCT_ID,
          userId: user.id,
          rating: reviewTemplate.rating,
          title: reviewTemplate.title,
          comment: reviewTemplate.comment,
          isVerifiedPurchase: isVerified,
          createdAt: reviewDate,
          photos: [],
        }).returning();

        await db.insert(reviewAuditLog).values({
          reviewId: newReview.id,
          action: 'CREATE',
          performedBy: 'system-seed',
          previousData: null,
          newData: newReview,
          reason: 'Seeded text review for wall hanger',
          ipAddress: 'localhost',
        });

        createdCount++;
        console.log(`  ✓ Created: "${reviewTemplate.title}" by ${reviewerName} (${reviewTemplate.rating}★)`);
      } catch (error) {
        console.error(`❌ Error creating text review:`, error);
      }
    }

    // ============================================
    // Summary
    // ============================================
    console.log('\n=========================================');
    console.log(`🎉 Created ${createdCount} reviews for Wall Hanger!\n`);

    console.log('📊 Review breakdown:');
    console.log(`   📷 Real customer photo: 1`);
    console.log(`   🎨 Generated photos: ${reviewsWithPhotos.length - 1}`);
    console.log(`   📝 Text only: ${textOnlyReviews.length}`);
    console.log(`   Total: ${createdCount}\n`);

    // Rating distribution
    const allReviews = [...reviewsWithPhotos, ...textOnlyReviews];
    console.log('⭐ Rating distribution:');
    console.log(`   5★: ${allReviews.filter(r => r.rating === 5).length}`);
    console.log(`   4★: ${allReviews.filter(r => r.rating === 4).length}`);

    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    console.log(`   Average: ${avgRating.toFixed(1)}/5.0\n`);

    console.log('📷 Photo reviews will use images from /review-photos/');
    console.log('   Make sure images are in client/public/review-photos/\n');

    await client.end();
  } catch (error) {
    console.error('❌ Error seeding reviews:', error);
    await client.end();
    process.exit(1);
  }
}

seedWallHangerReviews();
