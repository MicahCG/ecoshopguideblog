import "dotenv/config";
import { seedBlogs } from "../server/seedBlogs";
import { seedApartmentBlogs } from "../server/seedApartmentBlogs";
import { seedWeddingBlogs } from "../server/seedWeddingBlogs";

async function seedAllBlogs() {
  console.log("=== Seeding All Blog Posts ===\n");

  try {
    console.log("1. Seeding main eco blogs...");
    await seedBlogs();

    console.log("\n2. Seeding apartment blogs...");
    await seedApartmentBlogs();

    console.log("\n3. Seeding wedding blogs...");
    await seedWeddingBlogs();

    console.log("\n=== All blog posts seeded successfully! ===");
  } catch (error) {
    console.error("Error seeding blogs:", error);
    process.exit(1);
  }

  process.exit(0);
}

seedAllBlogs();
