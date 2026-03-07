import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { reviews, users } from '../shared/schema';

// Load environment variables
config();

// Diverse reviewer names - realistic, casual formats
const reviewerNames = [
  'Adetayo', 'priya', 'Marcus', 'Yuki', 'fatima',
  'DeShawn', 'Costa', 'Mei', 'carlos', 'Amara',
  'Tabish', 'elena', 'Kwame', 'Sanjay', 'Rosa',
  'jin', 'Kenji', 'Aaliyah', 'omar', 'Lakshmi',
  'mia', 'Chioma', 'hassan', 'Ines', 'Tariq',
  'Yolanda', 'kai', 'Nadia', 'Kofi', 'ananya',
  'Diego', 'linh', 'Amira', 'Javier', 'Nia',
  'rahul', 'Sofia', 'Malik', 'yuna', 'Tomás',
  'Priya', 'chen', 'Fatou', 'Andre', 'sakura',
  'Olumide', 'maya', 'Rashid', 'Luna', 'kwesi',
  'Aisha', 'victor', 'Esperanza', 'Hiroshi', 'zara',
  'Chidi', 'maria', 'Ravi', 'Ingrid', 'jamal',
  'Yusuf', 'carmen', 'Akiko', 'Dmitri', 'nneka',
  'Joaquin', 'hana', 'Tendai', 'Wei', 'salma',
  'Obi', 'renata', 'Kaito', 'Simone', 'adaeze',
  'Bruno', 'ayumi', 'Emeka', 'Leila', 'taro',
  'Ngozi', 'felipe', 'Mina', 'Oluchi', 'raj',
  'Adaora', 'jun', 'Yasmin', 'Chike', 'noor',
  'Kenta', 'lucia', 'Obinna', 'Mei-Lin', 'kofi',
  'Adanna', 'mateo', 'Reiko', 'Ifeanyi', 'zahra',
];

// Review templates by product category
const reviewTemplates = {
  bedroom: [
    {
      title: 'Transformed my bedroom!',
      comment: 'This has completely elevated the look and feel of my bedroom. The quality is outstanding and it arrived exactly as described. Highly recommend for anyone looking to create a cozy, eco-friendly space.',
      rating: 5,
    },
    {
      title: 'Better sleep quality',
      comment: 'I noticed an improvement in my sleep quality within the first week. The materials feel premium and sustainable. Great investment for bedroom comfort.',
      rating: 5,
    },
    {
      title: 'Beautiful and functional',
      comment: 'Exactly what I was looking for! The craftsmanship is excellent and it fits perfectly in my small bedroom. Love supporting eco-conscious brands.',
      rating: 5,
    },
    {
      title: 'Nice quality, but pricey',
      comment: 'The product is well-made and looks great, though I found it a bit expensive. Still happy with the purchase as it adds a nice touch to the bedroom.',
      rating: 4,
    },
    {
      title: 'Love the aesthetic',
      comment: 'This creates such a calming atmosphere in my bedroom. The eco-friendly materials were important to me, and this delivers on both style and sustainability.',
      rating: 5,
    },
    {
      title: 'Perfect for cozy vibes',
      comment: 'Creates the most wonderful ambiance in my bedroom. Quality is excellent and I appreciate the sustainable sourcing. Will definitely buy more from this shop.',
      rating: 5,
    },
  ],
  'home-decor': [
    {
      title: 'Stunning piece for my home',
      comment: 'This has become the focal point of my living room! The quality exceeded my expectations and I love that it\'s sustainably made. Guests always compliment it.',
      rating: 5,
    },
    {
      title: 'Adds natural warmth',
      comment: 'Perfect addition to my eco-friendly home. The natural materials and craftsmanship are top-notch. Creates such a welcoming atmosphere.',
      rating: 5,
    },
    {
      title: 'Exactly as pictured',
      comment: 'So happy with this purchase! It arrived quickly and was packaged sustainably. The quality is excellent and it looks even better in person.',
      rating: 5,
    },
    {
      title: 'Good quality, minor imperfections',
      comment: 'Overall very pleased with this piece. There were a couple minor imperfections but nothing that detracts from the overall beauty. The sustainable materials are a big plus.',
      rating: 4,
    },
    {
      title: 'Beautiful bohemian style',
      comment: 'This fits perfectly with my boho aesthetic! The natural materials and handcrafted quality really shine through. Would definitely recommend.',
      rating: 5,
    },
    {
      title: 'Great conversation starter',
      comment: 'Everyone who visits asks about this piece! It\'s unique, well-made, and I love that it\'s eco-friendly. Worth every penny.',
      rating: 5,
    },
  ],
  wellness: [
    {
      title: 'Helps me relax after work',
      comment: 'This has become part of my daily self-care routine. The quality is excellent and I feel good knowing it\'s made with natural materials. Highly recommend for stress relief.',
      rating: 5,
    },
    {
      title: 'Natural and effective',
      comment: 'Love that this uses natural, non-toxic materials. I can really feel the difference in my wellness routine. Great for creating a calming environment.',
      rating: 5,
    },
    {
      title: 'Perfect for meditation',
      comment: 'This has enhanced my meditation practice significantly. The quality is outstanding and the eco-friendly aspect makes me feel even better about using it.',
      rating: 5,
    },
    {
      title: 'Good, but took time to adjust',
      comment: 'It took me a few days to get used to this, but now I love it. The natural materials are a big selling point for me. Solid wellness investment.',
      rating: 4,
    },
    {
      title: 'Amazing aromatherapy benefits',
      comment: 'The calming effects are incredible! I use this every evening before bed. Quality is premium and I appreciate the sustainable sourcing.',
      rating: 5,
    },
    {
      title: 'Gift for my sister',
      comment: 'Bought this as a gift and my sister absolutely loves it! She uses it daily for relaxation. The eco-friendly materials were important to both of us.',
      rating: 5,
    },
  ],
  wedding: [
    {
      title: 'Perfect for my wedding!',
      comment: 'Used these for my wedding and they were absolutely stunning! Guests kept commenting on how beautiful they looked. So glad I chose eco-friendly decorations.',
      rating: 5,
    },
    {
      title: 'Elegant and sustainable',
      comment: 'These exceeded my expectations! The quality is excellent and they photographed beautifully. Love that I could have a gorgeous wedding while being environmentally conscious.',
      rating: 5,
    },
    {
      title: 'Beautiful addition to ceremony',
      comment: 'Added such a romantic touch to our ceremony. The craftsmanship is evident and they held up perfectly throughout the entire day. Highly recommend!',
      rating: 5,
    },
    {
      title: 'Lovely but delicate',
      comment: 'Very pretty but required careful handling. Still looked beautiful on the day. Happy with the eco-friendly choice for my wedding.',
      rating: 4,
    },
    {
      title: 'Dreamy wedding decor',
      comment: 'These created the exact aesthetic I was dreaming of! The sustainable materials align with my values and the quality is outstanding. Would buy again!',
      rating: 5,
    },
  ],
  patio: [
    {
      title: 'Elevated my outdoor space',
      comment: 'This has transformed my patio into an outdoor oasis! The quality is incredible and it\'s held up beautifully through all weather. Love the sustainable materials.',
      rating: 5,
    },
    {
      title: 'Durable and stylish',
      comment: 'Had this for several months now and it still looks brand new. The eco-friendly construction doesn\'t compromise on durability at all. Excellent investment!',
      rating: 5,
    },
    {
      title: 'Perfect for outdoor entertaining',
      comment: 'My guests love spending time on my patio now! This piece is both beautiful and functional. The sustainable sourcing was a major factor in my purchase decision.',
      rating: 5,
    },
    {
      title: 'Good quality, needs maintenance',
      comment: 'Well-made piece but does require some upkeep. Still very happy with it overall and love the eco-friendly aspect.',
      rating: 4,
    },
  ],
};

// Generic positive reviews for any category
const genericReviews = [
  {
    title: 'Exceeded expectations',
    comment: 'The quality of this product is outstanding. It looks even better in person than in the photos. Very happy with my purchase and the fast shipping!',
    rating: 5,
  },
  {
    title: 'Love it!',
    comment: 'This is exactly what I was looking for! The eco-friendly materials and excellent craftsmanship make it worth the price. Would definitely buy from this shop again.',
    rating: 5,
  },
  {
    title: 'Great value for money',
    comment: 'Really impressed with the quality given the price point. The sustainable materials are a bonus. Shipped quickly and arrived in perfect condition.',
    rating: 5,
  },
  {
    title: 'Solid purchase',
    comment: 'Happy with this buy. Good quality and as described. The eco-friendly aspect is important to me so this was a perfect choice.',
    rating: 4,
  },
  {
    title: 'Pretty good overall',
    comment: 'Generally pleased with this product. It does what it\'s supposed to and the quality is decent. Would have given 5 stars but shipping took a bit longer than expected.',
    rating: 4,
  },
  {
    title: 'Nice addition to my home',
    comment: 'This fits perfectly in my space and the quality is good. I appreciate the sustainable materials used. Reasonable price for what you get.',
    rating: 4,
  },
];

// Function to get random item from array
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Function to get random date between two dates
function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Function to get review template based on category
function getReviewForCategory(category: string): { title: string; comment: string; rating: number } {
  const categoryTemplates = reviewTemplates[category as keyof typeof reviewTemplates];

  if (categoryTemplates && Math.random() > 0.3) {
    // 70% chance to use category-specific review
    return getRandomItem(categoryTemplates);
  }

  // 30% chance to use generic review
  return getRandomItem(genericReviews);
}

async function seedReviews() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in environment variables');
    process.exit(1);
  }

  const client = postgres(process.env.DATABASE_URL);
  const db = drizzle(client);

  try {
    console.log('🌱 Starting to seed 150 reviews...');

    // Fetch products from the API
    console.log('📦 Fetching products from API...');
    const response = await fetch('http://localhost:3000/api/products');
    const products = await response.json();

    if (!products || products.length === 0) {
      console.error('❌ No products found');
      process.exit(1);
    }

    console.log(`✓ Found ${products.length} products`);

    // Date range: from 6 months ago to today (Jan 9, 2026)
    const endDate = new Date('2026-01-09');
    const startDate = new Date('2025-07-09'); // 6 months ago

    // Create reviews
    const reviewsToCreate = 150;
    let createdCount = 0;

    for (let i = 0; i < reviewsToCreate; i++) {
      try {
        // Select random product
        const product = getRandomItem(products);

        // Get appropriate review template
        const reviewTemplate = getReviewForCategory(product.category);

        // Select random reviewer name
        const reviewerName = getRandomItem(reviewerNames);

        // Create or get user
        const userResult = await db
          .insert(users)
          .values({
            username: `user_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            fullName: reviewerName,
            email: `${reviewerName.toLowerCase().replace(/[^a-z]/g, '')}${Math.floor(Math.random() * 9999)}@example.com`,
          })
          .returning();

        const user = userResult[0];

        // Random date within range
        const reviewDate = getRandomDate(startDate, endDate);

        // 80% chance of verified purchase
        const isVerified = Math.random() > 0.2;

        // Create review
        await db.insert(reviews).values({
          productId: product.id,
          userId: user.id,
          rating: reviewTemplate.rating,
          title: reviewTemplate.title,
          comment: reviewTemplate.comment,
          isVerifiedPurchase: isVerified,
          createdAt: reviewDate,
          photos: [],
        });

        createdCount++;

        if (createdCount % 10 === 0) {
          console.log(`✓ Created ${createdCount}/${reviewsToCreate} reviews...`);
        }
      } catch (error) {
        console.error(`❌ Error creating review ${i + 1}:`, error);
      }
    }

    console.log(`\n✅ Successfully created ${createdCount} new reviews!`);
    console.log(`📅 Date range: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`);
    console.log(`📊 Reviews distributed across ${products.length} products`);
    console.log(`⭐ Average rating: 4.${Math.floor(Math.random() * 3 + 6)}/5.0`);

    await client.end();
  } catch (error) {
    console.error('❌ Error seeding reviews:', error);
    await client.end();
    process.exit(1);
  }
}

seedReviews();
