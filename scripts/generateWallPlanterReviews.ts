/**
 * Generate realistic customer review photos for Boho Luxe Planter Vase
 * (Indoor Wall Hanging Planter Wooden Vase)
 *
 * Run with: npx tsx scripts/generateWallPlanterReviews.ts
 */

import { config } from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';

config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBJv2m1LtIVYHksfwEqyd4YG3GLGkE9XyY';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const WALL_PLANTER_PRODUCT_ID = 'shopify_10243302424865';

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
    wood_color: string;
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

const reviewPhotoScenarios: Array<{
  promptJson: ReviewPhotoPrompt;
  review: {
    title: string;
    comment: string;
    rating: number;
    reviewerName: string;
  };
}> = [
  {
    promptJson: {
      subject: {
        what_customer_noticed: "Walnut wooden wall planter with dried pampas grass above couch",
        emotional_context: "Excited about boho living room decor",
        reason_for_photo: "Showing off the boho aesthetic"
      },
      product: {
        description: "Wooden wall-mounted planter vase with U-shaped slot for test tube",
        real_life_appearance: "Tall elongated shape with FLAT TOP EDGE and ROUNDED CURVED BOTTOM like a pill capsule, vertical U-shaped channel in center that is OPEN at top, glass test tube inside holding dried pampas grass",
        visible_details: "Walnut wood grain, the U-channel slot visible, dried pampas stems, small mounting hole near top right",
        minor_imperfections: "Slight dust, pampas feathers messy",
        wood_color: "WALNUT BROWN - rich dark brown wood with visible grain"
      },
      environment: {
        room_type: "Living room corner near window",
        placement: "Mounted on light wall above beige couch",
        surrounding_objects: ["couch arm visible", "throw pillow edge", "window frame"],
        accidental_context: ["phone charger on couch", "coffee mug", "houseplant"],
        time_of_day: "Late afternoon golden light"
      },
      camera: {
        device: "iPhone snapshot",
        angle: "Looking slightly up, off-center",
        distance: "4-5 feet",
        focus: "Planter sharp, background soft",
        artifacts: ["warm afternoon light", "mild grain"]
      },
      realism_rules: {
        must_include: ["U-shaped slot OPEN at top", "flat top edge", "rounded bottom", "natural home lighting"],
        must_avoid: ["studio lighting", "oval shape", "rounded top edge", "white background"]
      }
    },
    review: {
      title: "Perfect boho touch for my living room!",
      comment: "Finally found the perfect accent piece for above my couch! The walnut finish goes beautifully with my boho decor. I put some dried pampas grass in it and it looks amazing. The wood quality is great - you can see the real grain. It's compact (22cm) but makes such a statement.",
      rating: 5,
      reviewerName: "Amanda J."
    }
  },
  {
    promptJson: {
      subject: {
        what_customer_noticed: "Black planter as propagation station in kitchen",
        emotional_context: "Excited about plant propagation use",
        reason_for_photo: "Showing pothos cutting with roots"
      },
      product: {
        description: "Wooden wall-mounted planter vase with U-shaped slot for test tube",
        real_life_appearance: "Tall elongated shape with FLAT TOP EDGE and ROUNDED CURVED BOTTOM like a capsule, vertical U-shaped channel in center OPEN at top, glass test tube with pothos cutting and visible white roots in water",
        visible_details: "Matte black wood, U-channel clearly visible, water and roots in tube, mounting hole",
        minor_imperfections: "Water drip marks, dust on black surface",
        wood_color: "MATTE BLACK - deep black painted wood"
      },
      environment: {
        room_type: "Kitchen near window",
        placement: "Hung on white kitchen wall",
        surrounding_objects: ["cabinet edge", "window", "countertop"],
        accidental_context: ["fruit bowl", "dish towel", "appliance cord"],
        time_of_day: "Morning light"
      },
      camera: {
        device: "Phone photo at eye level",
        angle: "Straight on, slightly from left",
        distance: "2 feet close-up",
        focus: "Sharp on planter and roots",
        artifacts: ["window overexposure", "grain in shadows"]
      },
      realism_rules: {
        must_include: ["U-slot OPEN at top", "flat top edge", "rounded bottom", "visible roots in water", "kitchen context"],
        must_avoid: ["wrong shape", "styled photo", "isolated product"]
      }
    },
    review: {
      title: "Love it as a propagation station!",
      comment: "I got the black one and it's perfect for propagating my pothos cuttings! The minimalist look goes great in my modern kitchen. You can see the roots growing through the glass which is so cool. The wood quality is solid and the matte black finish looks more expensive than it is.",
      rating: 5,
      reviewerName: "Marcus T."
    }
  },
  {
    promptJson: {
      subject: {
        what_customer_noticed: "Grey planter in bathroom with dried lavender",
        emotional_context: "Happy with spa-like bathroom feel",
        reason_for_photo: "Bathroom decor showcase"
      },
      product: {
        description: "Wooden wall-mounted planter vase with U-shaped slot for test tube",
        real_life_appearance: "Tall elongated shape with FLAT TOP EDGE and ROUNDED CURVED BOTTOM, vertical U-channel OPEN at top, glass tube holding dried lavender sprigs",
        visible_details: "Grey weathered wood, U-slot visible, dried lavender, mounting hole",
        minor_imperfections: "Humidity marks, dried petals fallen",
        wood_color: "GREY - soft weathered grey wood tone"
      },
      environment: {
        room_type: "Small bathroom",
        placement: "Beside bathroom mirror at eye level",
        surrounding_objects: ["mirror edge", "white tile", "towel"],
        accidental_context: ["soap dispenser", "toothbrush holder", "bathroom shelf"],
        time_of_day: "Bathroom overhead lighting"
      },
      camera: {
        device: "Phone photo at sink",
        angle: "Slightly angled",
        distance: "2-3 feet",
        focus: "Planter in focus, fixtures soft",
        artifacts: ["yellowish bathroom light", "shadows"]
      },
      realism_rules: {
        must_include: ["U-slot OPEN at top", "flat top", "rounded bottom", "bathroom context"],
        must_avoid: ["wrong shape", "professional photo"]
      }
    },
    review: {
      title: "Makes my bathroom feel like a spa",
      comment: "Put this grey one in my bathroom with some dried lavender and I love it! The grey color matches my bathroom perfectly. Makes the space feel more intentional and spa-like. Great size for a small bathroom.",
      rating: 5,
      reviewerName: "Rachel K."
    }
  },
  {
    promptJson: {
      subject: {
        what_customer_noticed: "Two planters together - walnut and cream on bedroom wall",
        emotional_context: "Proud of wall styling",
        reason_for_photo: "Showing paired planters"
      },
      product: {
        description: "TWO wooden wall-mounted planter vases with U-shaped slots",
        real_life_appearance: "Both tall elongated shapes with FLAT TOP EDGES and ROUNDED CURVED BOTTOMS, both with vertical U-channels OPEN at top, glass tubes with dried eucalyptus and dried lavender",
        visible_details: "Two different wood tones side by side, both showing U-slots, dried botanicals",
        minor_imperfections: "Hung slightly uneven, dried buds dropping",
        wood_color: "TWO PLANTERS: One WALNUT BROWN, one CREAM/LIGHT PINE pale blonde wood"
      },
      environment: {
        room_type: "Bedroom above nightstand",
        placement: "Two planters arranged organically on wall",
        surrounding_objects: ["nightstand below", "lamp", "bed headboard"],
        accidental_context: ["book", "phone charger", "water glass"],
        time_of_day: "Evening lamp light"
      },
      camera: {
        device: "Phone from bed",
        angle: "Slightly looking up",
        distance: "5-6 feet for both",
        focus: "Both planters in focus",
        artifacts: ["warm lamp light", "shadows", "slight grain"]
      },
      realism_rules: {
        must_include: ["both with U-slots OPEN at top", "flat tops", "rounded bottoms", "bedroom ambiance", "two different wood colors"],
        must_avoid: ["perfect alignment", "professional interior shot"]
      }
    },
    review: {
      title: "Bought two - absolutely love the combo!",
      comment: "Got the walnut and the cream light wood and they look so good together above my nightstand! I love how the different wood tones complement each other. Put dried eucalyptus in one and dried lavender in the other. The wood quality on both is excellent.",
      rating: 5,
      reviewerName: "Jennifer M."
    }
  },
  {
    promptJson: {
      subject: {
        what_customer_noticed: "Cream/light wood planter in entryway with fresh daisy",
        emotional_context: "Delighted by simple elegance",
        reason_for_photo: "Fresh flower use"
      },
      product: {
        description: "Wooden wall-mounted planter vase with U-shaped slot for test tube",
        real_life_appearance: "Tall elongated shape with FLAT TOP EDGE and ROUNDED CURVED BOTTOM like a capsule, vertical U-channel OPEN at top, glass tube with water holding single fresh daisy stem",
        visible_details: "Pale cream/blonde wood grain, U-slot visible, water in tube, white daisy, mounting hole",
        minor_imperfections: "Water slightly cloudy, petal drooping",
        wood_color: "CREAM/LIGHT PINE - pale blonde natural wood"
      },
      environment: {
        room_type: "Entryway hallway",
        placement: "Eye level on hallway wall",
        surrounding_objects: ["coat hooks", "door frame", "key holder"],
        accidental_context: ["shoes on floor", "jacket hanging", "mail"],
        time_of_day: "Daytime natural light"
      },
      camera: {
        device: "Quick phone snap",
        angle: "Standing looking at wall",
        distance: "3-4 feet",
        focus: "Flower and planter sharp",
        artifacts: ["natural daylight", "photographer shadow"]
      },
      realism_rules: {
        must_include: ["U-slot OPEN at top", "flat top", "rounded bottom", "entryway setting", "fresh flower"],
        must_avoid: ["styled shoot", "cleared hallway"]
      }
    },
    review: {
      title: "Simple and beautiful in my entryway",
      comment: "I keep this in my hallway with whatever flower is in season. The light wood is so pretty and Scandinavian. It's the first thing guests see when they come in and everyone asks about it! The tube holds enough water for a single stem to last almost a week.",
      rating: 5,
      reviewerName: "Emma S."
    }
  }
];

function buildPromptFromJson(promptJson: ReviewPhotoPrompt): string {
  return `
SUBJECT:
- What customer is showing: ${promptJson.subject.what_customer_noticed}
- Emotional context: ${promptJson.subject.emotional_context}
- Reason for photo: ${promptJson.subject.reason_for_photo}

PRODUCT DETAILS:
- Wood color: ${promptJson.product.wood_color}
- Description: ${promptJson.product.description}
- Real life appearance: ${promptJson.product.real_life_appearance}
- Visible details: ${promptJson.product.visible_details}
- Minor imperfections: ${promptJson.product.minor_imperfections}

ENVIRONMENT:
- Room: ${promptJson.environment.room_type}
- Placement: ${promptJson.environment.placement}
- Surrounding objects: ${promptJson.environment.surrounding_objects.join(', ')}
- Accidental context: ${promptJson.environment.accidental_context.join(', ')}
- Time of day: ${promptJson.environment.time_of_day}

CAMERA:
- Device: ${promptJson.camera.device}
- Angle: ${promptJson.camera.angle}
- Distance: ${promptJson.camera.distance}
- Focus: ${promptJson.camera.focus}
- Artifacts: ${promptJson.camera.artifacts.join(', ')}

MUST INCLUDE: ${promptJson.realism_rules.must_include.join(', ')}
MUST AVOID: ${promptJson.realism_rules.must_avoid.join(', ')}`;
}

async function generateReviewPhoto(
  promptJson: ReviewPhotoPrompt,
  name: string
): Promise<string | null> {
  try {
    console.log(`\n📸 Generating: ${name}...`);

    const prompt = `Generate a realistic customer review photo of a wooden wall planter vase.

CRITICAL PRODUCT SHAPE - YOU MUST GET THIS EXACTLY RIGHT:

The planter shape is like a CAPSULE or PILL:
1. FLAT STRAIGHT TOP EDGE - the top is a straight horizontal line, NOT curved or rounded
2. ROUNDED CURVED BOTTOM - the bottom curves into a smooth U-shape like the bottom of a pill
3. VERTICAL U-SHAPED SLOT - a channel carved into the front face that is:
   - OPEN at the top (you can see down into it)
   - Has a ROUNDED bottom inside the channel
   - A thin glass TEST TUBE sits vertically inside this U-channel to hold water/flowers
4. Small circular SCREW HOLE near the top right corner for wall mounting
5. About 22cm tall, slim and elegant profile

ASCII representation of the shape:
  _________
 |    o    |  <- flat top with mounting hole
 |   | |   |  <- U-slot open at top with test tube inside
 |   | |   |
 |   | |   |
 |   |_|   |  <- slot has rounded bottom
 |         |
  \\_______/   <- planter has rounded curved bottom

${buildPromptFromJson(promptJson)}

This must look like a CASUAL PHONE PHOTO taken by a real customer in their real home.
NOT a product photo, NOT studio lighting, NOT styled or staged.
Include natural imperfections, lived-in home context, phone camera quality.`;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp-image-generation',
    });

    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{ text: prompt }]
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
          const outputDir = path.join(process.cwd(), 'generated-images', 'review-photos-wall-planter');
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
  console.log('🌿 Wall Planter Review Photo Generator\n');
  console.log('=====================================\n');
  console.log('Product: Boho Luxe Planter Vase');
  console.log(`Product ID: ${WALL_PLANTER_PRODUCT_ID}\n`);
  console.log('Shape: FLAT TOP, ROUNDED BOTTOM, U-SLOT OPEN AT TOP\n');

  const results: Array<{
    imagePath: string | null;
    review: typeof reviewPhotoScenarios[0]['review'];
  }> = [];

  console.log('Generating realistic customer review photos (text-only prompts)...\n');

  for (let i = 0; i < reviewPhotoScenarios.length; i++) {
    const scenario = reviewPhotoScenarios[i];
    const name = `${i + 1}_${scenario.review.reviewerName.toLowerCase().replace(/[^a-z]/g, '')}`;

    const imagePath = await generateReviewPhoto(scenario.promptJson, name);

    results.push({
      imagePath,
      review: scenario.review,
    });

    if (i < reviewPhotoScenarios.length - 1) {
      console.log('⏳ Waiting 3 seconds...\n');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  console.log('\n=====================================');
  console.log('🎉 Generation Complete!\n');

  const successfulResults = results.filter(r => r.imagePath);
  console.log(`Generated: ${successfulResults.length}/${results.length} photos\n`);

  console.log('📝 Reviews:\n');
  for (const result of results) {
    if (result.imagePath) {
      const photoFilename = path.basename(result.imagePath);
      console.log(`"${result.review.title}" by ${result.review.reviewerName} (${result.review.rating}★)`);
      console.log(`   Photo: ${photoFilename}\n`);
    }
  }

  const outputDir = path.join(process.cwd(), 'generated-images', 'review-photos-wall-planter');
  const outputPath = path.join(outputDir, 'reviews-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(results.map(r => ({
    imagePath: r.imagePath,
    review: r.review,
  })), null, 2));

  console.log(`📋 Review data saved to: ${outputPath}`);
}

main().catch(console.error);
