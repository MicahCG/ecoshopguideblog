import { config } from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';

config();

const GEMINI_API_KEY = 'AIzaSyBJv2m1LtIVYHksfwEqyd4YG3GLGkE9XyY';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const WALL_HANGER_PRODUCT_ID = 'shopify_10237502816545';

// JSON structure for realistic review photos
interface ReviewPhotoPrompt {
  subject: {
    what_customer_noticed: string;
    emotional_context: string;
    reason_for_photo: string;
  };
  product: {
    description: string;
    real_life_appearance: string;
    visible_details: string;
    minor_imperfections: string;
  };
  environment: {
    room_type: string;
    placement: string;
    surrounding_objects: string[];
    accidental_context: string[];
    time_of_day: string;
  };
  camera: {
    device: string;
    angle: string;
    distance: string;
    focus: string;
    artifacts: string[];
  };
  realism_rules: {
    must_include: string[];
    must_avoid: string[];
  };
}

// Review scenarios for the Modern Wooden Wall Plant Hanger
const reviewPhotoScenarios: Array<{
  promptJson: ReviewPhotoPrompt;
  review: {
    title: string;
    comment: string;
    rating: number;
    reviewerName: string;
  };
}> = [
  // NOTE: Photo 1 is the REAL customer photo provided by user - sunflowers in hallway
  // We'll reference this as "PROVIDED_BY_USER" and use the actual uploaded photo
  {
    promptJson: {
      subject: {
        what_customer_noticed: "Showing the wall hanger with dried eucalyptus in the bathroom",
        emotional_context: "Pleased with how spa-like it makes the bathroom feel",
        reason_for_photo: "Demonstrating alternative use with dried botanicals"
      },
      product: {
        description: "Rustic wooden wall plaque with glass jar vase and rope hanger, holding dried eucalyptus stems",
        real_life_appearance: "Dark weathered wood grain visible, glass jar clear with some water spots, cream-colored rope slightly frayed at ends",
        visible_details: "Wood grain texture, metal clamp holding jar, dried eucalyptus leaves drooping naturally, small nail in wall visible",
        minor_imperfections: "Slight water spots on glass jar, one eucalyptus leaf starting to curl, wood has natural knot visible"
      },
      environment: {
        room_type: "Small bathroom near mirror or sink",
        placement: "Mounted on wall next to bathroom mirror or above toilet",
        surrounding_objects: ["bathroom mirror edge visible", "wall sconce or light fixture", "towel rack or towel in background", "beige or white tile"],
        accidental_context: ["toothbrush holder edge", "soap dispenser", "hand towel", "light switch"],
        time_of_day: "Daytime bathroom lighting, slightly yellow"
      },
      camera: {
        device: "Phone snapshot, bathroom selfie style",
        angle: "Slightly angled up, standing in small bathroom",
        distance: "2-3 feet, cramped space",
        focus: "Product reasonably sharp, background slightly soft",
        artifacts: ["bathroom lighting yellow cast", "slight mirror reflection", "mild noise in shadows"]
      },
      realism_rules: {
        must_include: ["typical bathroom context", "dried botanical alternative use", "real water spots on glass", "visible hanging hardware"],
        must_avoid: ["styled bathroom photoshoot", "perfect spa aesthetic", "professional product photography", "too clean and staged"]
      }
    },
    review: {
      title: "Perfect for my small bathroom",
      comment: "I put dried eucalyptus in mine instead of fresh flowers and it makes my bathroom smell amazing! The rustic wood goes perfect with my farmhouse style. It's mounted next to my mirror and I love how it looks. The glass jar does get water spots but that's easy to wipe off. The rope is sturdy and hasn't frayed much. Really happy with this little addition to my space.",
      rating: 5,
      reviewerName: "Heather M."
    }
  },
  {
    promptJson: {
      subject: {
        what_customer_noticed: "Wall hanger with small succulent cutting in water on the kitchen wall",
        emotional_context: "Proud of creative plant propagation display",
        reason_for_photo: "Showing it works great for propagating plant cuttings"
      },
      product: {
        description: "Wooden wall vase with clear glass jar holding a small pothos cutting rooting in water",
        real_life_appearance: "Weathered wood with warm brown tones, glass jar half-filled with water, visible roots growing on cutting",
        visible_details: "Pothos leaves trailing slightly, white roots visible through glass, water level below top of jar, wood grain natural variation",
        minor_imperfections: "Water slightly cloudy from root growth, small air bubbles on glass inside, one leaf yellowing"
      },
      environment: {
        room_type: "Kitchen wall near window",
        placement: "Hung on kitchen wall between window and cabinet",
        surrounding_objects: ["kitchen cabinet edge", "window frame", "countertop below", "kitchen tile backsplash"],
        accidental_context: ["fruit bowl on counter", "paper towels", "coffee maker cord", "kitchen magnet on nearby fridge"],
        time_of_day: "Morning kitchen light, natural from window"
      },
      camera: {
        device: "Quick phone photo while making coffee",
        angle: "Straight on or slightly below eye level",
        distance: "About 2 feet",
        focus: "Focused on plant, background kitchen blur",
        artifacts: ["window light causing slight overexposure", "warm morning light", "phone camera grain"]
      },
      realism_rules: {
        must_include: ["propagation station use", "real kitchen environment", "slightly cloudy propagation water", "visible roots"],
        must_avoid: ["perfectly clear water", "styled kitchen photo", "professional plant photography", "isolated product"]
      }
    },
    review: {
      title: "Great propagation station!",
      comment: "I use this to propagate my pothos cuttings and it works amazing! The glass jar is the perfect size for small cuttings and I can watch the roots grow. I have it hung in my kitchen near the window and it gets just enough light. The water does get a bit cloudy after a week or so but that's normal for propagation. Love that it's functional AND decorative. Already bought a second one for more cuttings!",
      rating: 5,
      reviewerName: "Nicole R."
    }
  },
  {
    promptJson: {
      subject: {
        what_customer_noticed: "Wall hanger displayed in living room with fresh wildflowers",
        emotional_context: "Showing off the farmhouse aesthetic in the home",
        reason_for_photo: "Capturing how it looks with seasonal wildflowers"
      },
      product: {
        description: "Rustic wooden wall vase with glass jar holding small bouquet of fresh wildflowers",
        real_life_appearance: "Dark reclaimed-look wood, clear jar with water and green stems visible, colorful wildflowers slightly wilting",
        visible_details: "Rope texture visible, metal hose clamp holding jar, mixed flowers (daisies, small wildflowers), some petals falling",
        minor_imperfections: "A few flower petals on floor below, some flowers past prime, water getting slightly green tinted"
      },
      environment: {
        room_type: "Living room or family room wall",
        placement: "Hung on living room wall near couch or chair",
        surrounding_objects: ["part of couch visible", "throw pillow edge", "baseboards", "another piece of wall art nearby"],
        accidental_context: ["TV remote on couch", "magazine on side table", "lamp base", "family photo frame nearby"],
        time_of_day: "Afternoon indoor lighting, lamp light mixed with daylight"
      },
      camera: {
        device: "Phone photo from couch",
        angle: "Looking up at wall from sitting position",
        distance: "4-5 feet",
        focus: "Wall hanger in focus, living room slightly blurred",
        artifacts: ["mixed indoor lighting", "slight noise", "warm color temperature from lamps"]
      },
      realism_rules: {
        must_include: ["lived-in living room", "flowers at various freshness stages", "real home context", "casual living room items visible"],
        must_avoid: ["fresh flower photoshoot", "perfectly arranged flowers", "studio lighting", "cleared room"]
      }
    },
    review: {
      title: "Love it with fresh flowers from the garden",
      comment: "Every week I put fresh flowers from my garden in this and it makes me so happy. Right now I have some daisies and little wildflowers. The jar is a good size - not too big that it looks overpowering on the wall. Some petals do fall on the floor when the flowers start wilting but that's just flowers being flowers lol. The wood has such a nice rustic look that goes great with my farmhouse decor. Definitely recommend!",
      rating: 5,
      reviewerName: "Linda S."
    }
  },
  {
    promptJson: {
      subject: {
        what_customer_noticed: "Showing the set of two wall hangers on the dining room wall",
        emotional_context: "Satisfied with buying two to create a matched set",
        reason_for_photo: "Displaying how two look together"
      },
      product: {
        description: "Two wooden wall vases hung side by side, one with lavender sprigs, one with wheat stalks",
        real_life_appearance: "Matching rustic wood pieces, slightly different grain patterns, both with cream rope, glass jars at same height",
        visible_details: "Slight variation in wood color between the two, dried lavender and wheat creating different textures, nails visible in wall",
        minor_imperfections: "Hung not perfectly level, one rope slightly longer than other, some dried lavender fallen in jar"
      },
      environment: {
        room_type: "Dining room or breakfast nook wall",
        placement: "Mounted on wall in dining area, side by side with small gap",
        surrounding_objects: ["dining table edge visible below", "chair back", "window or light fixture", "wall paint texture"],
        accidental_context: ["salt and pepper shakers on table", "napkin holder", "fruit in bowl on table", "placemat edge"],
        time_of_day: "Evening, dining room chandelier lighting"
      },
      camera: {
        device: "Standing phone photo",
        angle: "Eye level, stepping back to fit both",
        distance: "5-6 feet to capture both pieces",
        focus: "Both hangers in focus, slight depth of field on dining table",
        artifacts: ["chandelier creating warm overhead light", "slight shadows from overhead lighting", "evening indoor ambiance"]
      },
      realism_rules: {
        must_include: ["imperfect hanging alignment", "natural variation between matching pieces", "dining room context", "dried botanical use"],
        must_avoid: ["perfectly aligned gallery wall", "professional interior photography", "matching accessories", "cleared dining table"]
      }
    },
    review: {
      title: "Bought two - look great together!",
      comment: "I bought two of these for my dining room and I love how they look! I put dried lavender in one and some wheat stalks in the other for that farmhouse look. They're not perfectly matched since they're handmade looking wood but honestly that adds to the charm. Mine aren't hanging perfectly level but my husband says only I notice that haha. The rope is super sturdy. Great value for the price - I might get two more for my kitchen!",
      rating: 5,
      reviewerName: "Karen T."
    }
  },
  {
    promptJson: {
      subject: {
        what_customer_noticed: "Close-up of the wood grain and construction quality",
        emotional_context: "Impressed by the quality details up close",
        reason_for_photo: "Documenting the craftsmanship and materials"
      },
      product: {
        description: "Close-up detail shot of the wooden back panel, rope attachment, and glass jar clamp",
        real_life_appearance: "Weathered wood grain clearly visible, rope knot detail, metal hose clamp securing glass jar",
        visible_details: "Wood grain lines, small knots in wood, rope fibers, metal clamp screw, glass jar thickness",
        minor_imperfections: "Small chip in wood edge, slight rust starting on clamp screw, rope slightly uneven"
      },
      environment: {
        room_type: "Somewhere during unboxing or just installed",
        placement: "Held in hand or just mounted",
        surrounding_objects: ["hands holding product or wall texture", "packaging in background", "floor or table surface"],
        accidental_context: ["cardboard box visible", "bubble wrap", "instruction paper", "hanging nail and hammer"],
        time_of_day: "Indoor daytime, overhead lighting"
      },
      camera: {
        device: "Phone held close for detail",
        angle: "Angled to show construction details",
        distance: "Less than 1 foot, macro-ish",
        focus: "Sharp on wood grain, shallow depth of field",
        artifacts: ["harsh indoor shadows", "phone camera struggling with close focus", "some blur on edges"]
      },
      realism_rules: {
        must_include: ["real material textures", "visible construction details", "unboxing or install context", "natural imperfections in materials"],
        must_avoid: ["professional product detail shot", "studio macro photography", "isolated against white", "perfect lighting"]
      }
    },
    review: {
      title: "Nice quality for the price",
      comment: "Wanted to share a close-up of the quality because I was impressed. The wood has real character - you can see the grain and there's even a small knot which I think looks cool. The metal clamp holding the jar is sturdy, though I noticed the screw has a tiny bit of rust starting already (might want to seal it). The rope feels thick and strong. For under $30 I think it's great quality. Already hung it up and it's holding a jar of water with no leaks.",
      rating: 4,
      reviewerName: "Robert J."
    }
  }
];

// The REAL customer photo provided by user - this will be used directly
// Saved as: review_photo_real_customer_sunflowers.png
const realCustomerReview = {
  title: "Gorgeous in my hallway!",
  comment: "I hung this in my hallway and added some faux sunflowers I had. It looks SO cute! The rustic wood matches my home perfectly and the rope hanger is really sturdy. I was worried about the glass jar falling but the metal clamp holds it securely. You can see in my pic it's right by my family photos and it fits right in with the decor. Super easy to hang - just used one nail. Love it and already want to buy more for other rooms!",
  rating: 5,
  reviewerName: "Ashley K.",
  photoFilename: "review_photo_real_customer_sunflowers.png", // The user's provided photo
  isRealCustomerPhoto: true
};

function buildPromptFromJson(promptJson: ReviewPhotoPrompt): string {
  return `Generate a realistic customer review photo. This should look like a real person took this with their phone in their own home - NOT a professional product photo.

SUBJECT:
- What the customer is capturing: ${promptJson.subject.what_customer_noticed}
- Emotional context: ${promptJson.subject.emotional_context}
- Reason for the photo: ${promptJson.subject.reason_for_photo}

PRODUCT IN THE PHOTO:
- Description: ${promptJson.product.description}
- How it looks in real life: ${promptJson.product.real_life_appearance}
- Visible details: ${promptJson.product.visible_details}
- Minor imperfections to include: ${promptJson.product.minor_imperfections}

ENVIRONMENT:
- Room: ${promptJson.environment.room_type}
- Placement: ${promptJson.environment.placement}
- Surrounding objects: ${promptJson.environment.surrounding_objects.join(', ')}
- Accidental context items: ${promptJson.environment.accidental_context.join(', ')}
- Time of day: ${promptJson.environment.time_of_day}

CAMERA CHARACTERISTICS:
- Device: ${promptJson.camera.device}
- Angle: ${promptJson.camera.angle}
- Distance: ${promptJson.camera.distance}
- Focus: ${promptJson.camera.focus}
- Artifacts to include: ${promptJson.camera.artifacts.join(', ')}

REALISM REQUIREMENTS:
Must include these elements: ${promptJson.realism_rules.must_include.join(', ')}

MUST AVOID (these break realism):
${promptJson.realism_rules.must_avoid.join(', ')}

This is a CASUAL PHONE PHOTO taken by a real customer in their real home. It should feel authentic, slightly imperfect, and lived-in. NOT a product photo, NOT styled, NOT professional.`;
}

async function generateReviewPhoto(
  promptJson: ReviewPhotoPrompt,
  name: string,
  productImagePath: string,
  styleImagePath: string
): Promise<string | null> {
  try {
    console.log(`\n📸 Generating: ${name}...`);

    // Load the product image (shows what the product looks like)
    const productImageBuffer = fs.readFileSync(productImagePath);
    const productImageBase64 = productImageBuffer.toString('base64');
    const productMimeType = productImagePath.endsWith('.webp') ? 'image/webp' : 'image/png';

    // Load the style reference image (real customer photo for aesthetic)
    const styleImageBuffer = fs.readFileSync(styleImagePath);
    const styleImageBase64 = styleImageBuffer.toString('base64');

    const prompt = `I'm providing TWO reference images:

IMAGE 1 (PRODUCT REFERENCE): This shows the actual product - a rustic wooden wall-mounted plant hanger with a glass jar vase and rope hanger. NOTE: The product photo shows 3 hangers but YOU MUST GENERATE ONLY A SINGLE HANGER in your image. Study the product details: the wood grain, the glass jar, the rope, the metal clamp.

IMAGE 2 (STYLE REFERENCE): This is a real customer review photo. Study the casual phone camera quality, natural home lighting, lived-in environment, and authentic "real person took this" aesthetic.

YOUR TASK: Generate a NEW image that:
1. Shows the EXACT PRODUCT from Image 1 (but only ONE single hanger, not three)
2. Matches the casual, authentic, customer-photo STYLE of Image 2

CRITICAL: Show only ONE SINGLE plant hanger, not multiple.

${buildPromptFromJson(promptJson)}

Remember: The product must look like the actual product in Image 1, but the photo style must feel like a real customer took it on their phone (like Image 2). Only ONE hanger in the scene.`;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp-image-generation',
    });

    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType: productMimeType,
              data: productImageBase64
            }
          },
          {
            inlineData: {
              mimeType: 'image/png',
              data: styleImageBase64
            }
          },
          { text: prompt }
        ]
      }],
      generationConfig: {
        // @ts-ignore
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    const response = result.response;

    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.mimeType?.startsWith('image/')) {
          const outputDir = path.join(process.cwd(), 'generated-images', 'review-photos-wall-hanger');
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }

          const extension = part.inlineData.mimeType.split('/')[1] || 'png';
          const filename = `review_${name}.${extension}`;
          const filepath = path.join(outputDir, filename);

          const imageBuffer = Buffer.from(part.inlineData.data!, 'base64');
          fs.writeFileSync(filepath, imageBuffer);

          console.log(`✅ Saved: ${filepath}`);
          return filepath;
        }
      }
    }

    console.log(`⚠️ No image generated for ${name}`);
    return null;
  } catch (error: any) {
    console.error(`❌ Error generating ${name}:`, error.message || error);
    return null;
  }
}

async function main() {
  console.log('🌻 Wall Hanger Review Photo Generator\n');
  console.log('=====================================\n');
  console.log('Product: Modern Wooden Wall Plant Hanger');
  console.log('Product ID: shopify_10237502816545\n');

  const results: Array<{
    imagePath: string | null;
    review: typeof reviewPhotoScenarios[0]['review'];
    isRealPhoto?: boolean;
  }> = [];

  // First, add the REAL customer photo
  console.log('📷 Real customer photo already provided:');
  console.log('   - review_photo_real_customer_sunflowers.png (sunflowers in hallway)');
  console.log('   - This authentic photo will be used as-is\n');

  results.push({
    imagePath: path.join(process.cwd(), 'generated-images', 'review-photos-wall-hanger', 'review_photo_real_customer_sunflowers.png'),
    review: realCustomerReview,
    isRealPhoto: true
  });

  // Generate additional photos using both product photo and customer photo as references
  console.log('Generating additional realistic review photos...\n');
  console.log('Using two references:');
  console.log('  1. Product photo - for accurate product appearance');
  console.log('  2. Customer photo - for authentic style/aesthetic\n');

  const productImagePath = path.join(process.cwd(), 'generated-images', 'plant hanger.webp');
  const styleImagePath = path.join(process.cwd(), 'generated-images', 'review-photos-wall-hanger', 'review_photo_real_customer_sunflowers.png');

  if (!fs.existsSync(productImagePath)) {
    console.error('❌ Product image not found:', productImagePath);
    process.exit(1);
  }

  if (!fs.existsSync(styleImagePath)) {
    console.error('❌ Style reference image not found:', styleImagePath);
    console.error('   Please ensure the real customer photo is saved first.');
    process.exit(1);
  }

  console.log('Product reference: plant hanger.webp (will show SINGLE hanger, not three)');
  console.log('Style reference: review_photo_real_customer_sunflowers.png\n');

  for (let i = 0; i < reviewPhotoScenarios.length; i++) {
    const scenario = reviewPhotoScenarios[i];
    const name = `${i + 1}_${scenario.review.reviewerName.toLowerCase().replace(/[^a-z]/g, '')}`;

    const imagePath = await generateReviewPhoto(scenario.promptJson, name, productImagePath, styleImagePath);

    results.push({
      imagePath,
      review: scenario.review,
      isRealPhoto: false
    });

    console.log('⏳ Waiting 3 seconds...\n');
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  console.log('\n=====================================');
  console.log('🎉 Generation Complete!\n');

  const successfulResults = results.filter(r => r.imagePath || r.isRealPhoto);
  console.log(`Total reviews: ${successfulResults.length}`);
  console.log(`  - Real customer photo: 1`);
  console.log(`  - Generated photos: ${successfulResults.length - 1}\n`);

  // Output the reviews
  console.log('📝 Reviews for Wall Hanger:\n');

  for (const result of results) {
    if (result.imagePath || result.isRealPhoto) {
      const photoFilename = result.imagePath ? path.basename(result.imagePath) : 'review_photo_real_customer_sunflowers.png';
      console.log(`"${result.review.title}" by ${result.review.reviewerName} (${result.review.rating}★)`);
      console.log(`   Photo: ${photoFilename}`);
      console.log(`   ${result.isRealPhoto ? '📷 REAL CUSTOMER PHOTO' : '🎨 Generated'}`);
      console.log('');
    }
  }

  // Save results as JSON
  const outputPath = path.join(process.cwd(), 'generated-images', 'review-photos-wall-hanger', 'reviews-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(results.map(r => ({
    imagePath: r.imagePath,
    review: r.review,
    isRealPhoto: r.isRealPhoto || false,
  })), null, 2));

  console.log(`📋 Review data saved to: ${outputPath}`);
}

main().catch(console.error);
