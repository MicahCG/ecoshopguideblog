import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { reviews, reviewAuditLog, reviewVotes } from '../shared/schema';
import { writeFileSync } from 'fs';

/**
 * Export all review data from Neon database to JSON files
 * Run this BEFORE migrating to Supabase to preserve review data
 */
async function exportReviews() {
  console.log('🔍 Connecting to Neon database...');

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const db = drizzle(sql);

    console.log('✅ Connected! Exporting reviews...');

    // Export reviews
    const allReviews = await db.select().from(reviews);
    console.log(`📝 Found ${allReviews.length} reviews`);

    // Export review audit logs
    const allAuditLogs = await db.select().from(reviewAuditLog);
    console.log(`📋 Found ${allAuditLogs.length} audit log entries`);

    // Export review votes
    const allVotes = await db.select().from(reviewVotes);
    console.log(`👍 Found ${allVotes.length} review votes`);

    // Save to JSON files
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const exportDir = './backups';

    writeFileSync(
      `${exportDir}/reviews-${timestamp}.json`,
      JSON.stringify(allReviews, null, 2)
    );

    writeFileSync(
      `${exportDir}/review-audit-logs-${timestamp}.json`,
      JSON.stringify(allAuditLogs, null, 2)
    );

    writeFileSync(
      `${exportDir}/review-votes-${timestamp}.json`,
      JSON.stringify(allVotes, null, 2)
    );

    console.log('\n✅ Export complete!');
    console.log(`📂 Files saved to ${exportDir}/`);
    console.log(`\nSummary:`);
    console.log(`  - Reviews: ${allReviews.length}`);
    console.log(`  - Audit logs: ${allAuditLogs.length}`);
    console.log(`  - Votes: ${allVotes.length}`);

    // Show review photo URLs
    const photosCount = allReviews.reduce((count, review) => {
      const photos = review.photos as string[] || [];
      return count + photos.length;
    }, 0);

    console.log(`  - Review photos: ${photosCount} URLs found`);

    if (photosCount > 0) {
      console.log('\n📸 Photo URLs found in reviews (will need to migrate to Cloudinary):');
      allReviews.forEach((review, i) => {
        const photos = review.photos as string[] || [];
        if (photos.length > 0) {
          console.log(`  Review ${i + 1}: ${photos.length} photo(s)`);
        }
      });
    }

  } catch (error: any) {
    console.error('❌ Error exporting reviews:', error.message);

    if (error.message?.includes('endpoint has been disabled')) {
      console.log('\n⚠️  The Neon endpoint is disabled.');
      console.log('To enable it:');
      console.log('1. Go to your Replit project');
      console.log('2. Look for Database tab/section');
      console.log('3. Click "Resume" or "Enable" button');
      console.log('4. Run this script again immediately');
    }

    process.exit(1);
  }
}

exportReviews();
