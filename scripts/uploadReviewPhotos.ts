import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { reviews } from '../shared/schema';
import { eq } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config();

const WALL_HANGER_PRODUCT_ID = 'shopify_10237502816545';
const BUCKET_NAME = 'review-photos';

// Map photo filenames to review titles for matching
const photoToReviewMap: Record<string, string> = {
  'review_photo_real_customer_sunflowers.png': 'Gorgeous in my hallway!',
  'review_1_heatherm.png': 'Perfect for my small bathroom',
  'review_2_nicoler.png': 'Great propagation station!',
  'review_3_lindas.png': 'Love it with fresh flowers from the garden',
  'review_4_karent.png': 'Bought two - look great together!',
  'review_5_robertj.png': 'Nice quality for the price',
};

async function uploadReviewPhotos() {
  // Validate environment
  if (!process.env.SUPABASE_URL) {
    console.error('SUPABASE_URL not found in environment variables');
    process.exit(1);
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY === 'YOUR_SERVICE_ROLE_KEY_HERE') {
    console.error('SUPABASE_SERVICE_ROLE_KEY not configured');
    console.error('Please add your service_role key to .env file');
    console.error('Get it from: https://supabase.com/dashboard/project/oqaijevrypgendmuembu/settings/api');
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not found in environment variables');
    process.exit(1);
  }

  // Initialize clients
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const client = postgres(process.env.DATABASE_URL);
  const db = drizzle(client);

  const photosDir = path.join(__dirname, '../generated-images/review-photos-wall-hanger');

  try {
    console.log('📸 Uploading review photos to Supabase Storage...\n');

    // Step 1: Create bucket if it doesn't exist
    console.log(`Creating bucket "${BUCKET_NAME}" if needed...`);
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.name === BUCKET_NAME);

    if (!bucketExists) {
      const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true, // Make photos publicly accessible
        fileSizeLimit: 5242880, // 5MB limit
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
      });

      if (createError) {
        console.error('Error creating bucket:', createError);
        process.exit(1);
      }
      console.log(`✅ Created bucket: ${BUCKET_NAME}`);
    } else {
      console.log(`✅ Bucket exists: ${BUCKET_NAME}`);
    }

    // Step 2: Upload each photo and update review
    const photoFiles = fs.readdirSync(photosDir).filter(f => f.endsWith('.png'));
    console.log(`\nFound ${photoFiles.length} photos to upload\n`);

    let successCount = 0;
    let updateCount = 0;

    for (const filename of photoFiles) {
      const reviewTitle = photoToReviewMap[filename];
      if (!reviewTitle) {
        console.log(`⏭️  Skipping ${filename} (not in review map)`);
        continue;
      }

      const filePath = path.join(photosDir, filename);
      const fileBuffer = fs.readFileSync(filePath);

      // Upload to Supabase Storage
      const storagePath = `wall-hanger/${filename}`;
      console.log(`📤 Uploading ${filename}...`);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(storagePath, fileBuffer, {
          contentType: 'image/png',
          upsert: true, // Overwrite if exists
        });

      if (uploadError) {
        console.error(`   ❌ Upload failed: ${uploadError.message}`);
        continue;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(storagePath);

      const publicUrl = urlData.publicUrl;
      console.log(`   ✅ Uploaded: ${publicUrl}`);
      successCount++;

      // Update review in database
      console.log(`   📝 Updating review: "${reviewTitle}"`);

      const result = await db
        .update(reviews)
        .set({ photos: [publicUrl] })
        .where(eq(reviews.title, reviewTitle))
        .returning();

      if (result.length > 0) {
        console.log(`   ✅ Updated review ID: ${result[0].id}`);
        updateCount++;
      } else {
        console.log(`   ⚠️  Review not found with title: "${reviewTitle}"`);
      }
    }

    // Summary
    console.log('\n=========================================');
    console.log(`✅ Uploaded ${successCount} photos`);
    console.log(`✅ Updated ${updateCount} reviews`);
    console.log('=========================================\n');

    // Verify by fetching reviews with photos
    console.log('Verifying reviews with photos...\n');
    const reviewsWithPhotos = await db
      .select()
      .from(reviews)
      .where(eq(reviews.productId, WALL_HANGER_PRODUCT_ID));

    const withPhotos = reviewsWithPhotos.filter(r => r.photos && r.photos.length > 0);
    console.log(`Reviews for Wall Hanger: ${reviewsWithPhotos.length} total`);
    console.log(`Reviews with photos: ${withPhotos.length}`);

    if (withPhotos.length > 0) {
      console.log('\nReviews with photos:');
      withPhotos.forEach(r => {
        console.log(`  - "${r.title}" by User ${r.userId}`);
        console.log(`    Photo: ${r.photos?.[0]}`);
      });
    }

    await client.end();
  } catch (error) {
    console.error('❌ Error:', error);
    await client.end();
    process.exit(1);
  }
}

uploadReviewPhotos();
