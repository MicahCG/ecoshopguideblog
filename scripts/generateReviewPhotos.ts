import { config } from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';

config();

const GEMINI_API_KEY = 'AIzaSyBJv2m1LtIVYHksfwEqyd4YG3GLGkE9XyY';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// JSON structure for realistic review photo generation
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

// Review photo scenarios with matching review content
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
        what_customer_noticed: "Just finished setting up the plant stand and wanted to capture how it looks with all my plants on it",
        emotional_context: "Proud of the setup, excited to share",
        reason_for_photo: "Showing off completed assembly with plants arranged"
      },
      product: {
        description: "7-tier black metal plant stand with dark wooden shelves, approximately 6 feet tall, ladder style design",
        real_life_appearance: "The black metal has a slight matte finish, shelves show natural wood grain variation, some plants are still being positioned",
        visible_details: "Metal frame joints visible, shelf edges, a few empty spots on tiers, plant pots of different sizes and materials",
        minor_imperfections: "One shelf slightly dusty from assembly, a small scratch near the base from moving it into position, some soil scattered on one shelf from repotting"
      },
      environment: {
        room_type: "Living room corner near a window",
        placement: "Slightly angled in the corner, not perfectly aligned with the wall",
        surrounding_objects: ["beige couch arm visible on left edge", "window with blinds partially open", "hardwood floor with some dust", "white wall with slight scuff marks"],
        accidental_context: ["tv remote on couch cushion", "phone charger cable trailing on floor", "house plant care book on couch"],
        time_of_day: "Late afternoon, warm natural light mixed with indoor lamp"
      },
      camera: {
        device: "iPhone held at chest height",
        angle: "Slightly looking up at the tall stand, not perfectly centered",
        distance: "About 5 feet back to fit the whole stand",
        focus: "Middle shelves sharp, top and bottom slightly soft",
        artifacts: ["mild grain in shadow areas", "slight warmth from mixed lighting", "minor lens flare from window light"]
      },
      realism_rules: {
        must_include: ["uneven shadow distribution", "visible floor texture", "plants at different growth stages", "some shelves more full than others", "casual phone photo composition"],
        must_avoid: ["studio lighting", "perfect symmetry", "floating isolated product", "overly crisp textures", "showroom staging", "all plants perfectly healthy and uniform"]
      }
    },
    review: {
      title: "Finally got all my plants organized!",
      comment: "Just finished putting this together and had to share. Took me about 20 minutes to assemble, which was easier than expected. I love how it fits in this awkward corner by my window - my plants are going to be so happy with all that light. The shelves are sturdy enough for my heavy terracotta pots. Only thing is I got a tiny scratch on the base while moving it into place, but you can barely see it. Already planning what plants to add to the empty spots!",
      rating: 5,
      reviewerName: "Michelle K."
    }
  },
  {
    promptJson: {
      subject: {
        what_customer_noticed: "Showing how much the stand holds - filled every shelf with my plant collection",
        emotional_context: "Satisfied with the purchase, impressed by capacity",
        reason_for_photo: "Demonstrating weight capacity with real plants"
      },
      product: {
        description: "Tall 7-tier black metal plant shelf fully loaded with various potted plants",
        real_life_appearance: "Stand is holding significant weight, slight flex is normal, all tiers occupied with different sized pots",
        visible_details: "Mix of ceramic, terracotta, and plastic pots, trailing vines hanging over edges, some water marks on shelves from watering",
        minor_imperfections: "Water stains on a couple shelves, some dried soil bits, one pot slightly too big hanging over shelf edge"
      },
      environment: {
        room_type: "Sunroom or bright living area",
        placement: "Against a wall with large window to the side",
        surrounding_objects: ["wicker basket on floor nearby", "watering can visible", "window with sheer curtains", "tile or laminate flooring"],
        accidental_context: ["stack of old magazines on floor", "dog toy barely visible in corner", "electrical outlet with multiple plugs"],
        time_of_day: "Mid-morning, bright indirect sunlight"
      },
      camera: {
        device: "Android phone, vertical orientation",
        angle: "Standing back at slight angle to show depth",
        distance: "6-7 feet to capture full height",
        focus: "Decent overall but not tack sharp",
        artifacts: ["slight overexposure near window", "color cast from window light", "compression artifacts in shadows"]
      },
      realism_rules: {
        must_include: ["real water marks from plant care", "trailing plant vines", "variety of pot styles not matching", "some yellowing leaves on plants", "visible wall texture behind"],
        must_avoid: ["matching designer pots", "perfectly healthy plants only", "symmetrical arrangement", "professional lighting", "clean pristine shelves"]
      }
    },
    review: {
      title: "Holds all 14 of my plants!",
      comment: "I was worried this wouldn't hold all my plants but wow, I fit 14 pots on here ranging from small succulents to my big peace lily. The shelves have some water marks now from watering day but that's my fault for not being careful. It's been two months and no wobbling or sagging. My pothos is loving the height and trailing down beautifully. The only reason I'm not giving 5 stars is I wish the shelves were slightly wider for my one pot that hangs over the edge a bit.",
      rating: 4,
      reviewerName: "David R."
    }
  },
  {
    promptJson: {
      subject: {
        what_customer_noticed: "Capturing how the stand looks in my small apartment bedroom",
        emotional_context: "Happy it fits the small space, showing space-saving benefits",
        reason_for_photo: "Proving it works in a tiny bedroom corner"
      },
      product: {
        description: "Tall black metal plant stand tucked into a small bedroom corner",
        real_life_appearance: "Stand appears tall but slim, takes up minimal floor space, holds several plants vertically",
        visible_details: "About 6-7 plants visible, mix of trailing and upright plants, some decorative items on lower shelves",
        minor_imperfections: "Stand slightly tilted on uneven floor, one shelf has a small chip on corner, assembly instructions paper visible on nearby surface"
      },
      environment: {
        room_type: "Small apartment bedroom",
        placement: "Squeezed between nightstand and wall corner",
        surrounding_objects: ["edge of bed with rumpled gray comforter", "small nightstand with lamp and phone", "wall with poster partially visible", "beige carpet with vacuum lines"],
        accidental_context: ["phone charger on nightstand", "water glass on nightstand", "slippers on floor", "closet door slightly ajar in background"],
        time_of_day: "Evening, warm lamp light mixed with overhead light"
      },
      camera: {
        device: "iPhone from bed position",
        angle: "Sitting on bed looking across at stand, slightly low angle",
        distance: "About 4 feet, cramped room",
        focus: "Stand mostly in focus, background slightly blurred",
        artifacts: ["warm color temperature from lamps", "slight motion blur", "visible noise in darker areas"]
      },
      realism_rules: {
        must_include: ["cramped room feeling", "personal items visible", "lived-in bedroom messiness", "warm evening lighting", "reflection of light on metal frame"],
        must_avoid: ["spacious room", "perfectly made bed", "minimalist staging", "daylight photography", "professional composition"]
      }
    },
    review: {
      title: "Perfect for my tiny bedroom",
      comment: "My bedroom is maybe 10x10 and I thought there was no way I could have plants in here. This stand changed everything - it takes up like 1 square foot of floor space but I now have 7 plants in my room. I keep it between my nightstand and the corner. Had to put a little cardboard under one leg because my floor is uneven but it's stable now. The warm light from my lamp makes it look really cozy at night. Assembly was straightforward, took maybe 25 min.",
      rating: 5,
      reviewerName: "Jessica T."
    }
  },
  {
    promptJson: {
      subject: {
        what_customer_noticed: "Just unboxed and assembled - showing the build quality up close",
        emotional_context: "Examining quality after assembly, documenting condition",
        reason_for_photo: "Close-up of shelf and frame construction"
      },
      product: {
        description: "Close-up detail shot of plant stand shelf and metal frame connection",
        real_life_appearance: "Dark wood shelf surface with visible grain, black powder-coated metal frame, visible screws and joints",
        visible_details: "Shelf thickness, metal tube diameter, screw heads, wood grain pattern, slight manufacturing marks",
        minor_imperfections: "Small bubble in powder coat finish, minor wood grain variation, tiny gap where shelf meets frame bracket"
      },
      environment: {
        room_type: "Living room floor during assembly",
        placement: "Stand laying partially assembled or just finished on floor",
        surrounding_objects: ["cardboard box and packaging nearby", "instruction manual", "screwdriver", "carpet or floor visible"],
        accidental_context: ["packing tape", "twist ties from packaging", "shoe visible at edge", "coffee mug in background"],
        time_of_day: "Daytime, indoor overhead lighting"
      },
      camera: {
        device: "Phone held close for detail shot",
        angle: "Crouching down, angled to show joint detail",
        distance: "About 1-2 feet from shelf surface",
        focus: "Sharp on shelf edge, background soft",
        artifacts: ["shallow depth of field", "slight hand shake blur", "harsh indoor lighting shadows"]
      },
      realism_rules: {
        must_include: ["packaging materials visible", "assembly context", "real material textures", "slight dust from cardboard", "casual documentation angle"],
        must_avoid: ["product photography lighting", "isolated product shot", "perfect angles", "clean background", "marketing style composition"]
      }
    },
    review: {
      title: "Solid build quality for the price",
      comment: "Just finished assembling and wanted to share a close-up of the quality. The shelves are thicker than I expected - feels like real wood not flimsy particle board. The metal frame is sturdy powder-coated steel, you can see the joints are well made. I noticed a tiny bubble in the coating on one leg but it's barely visible. All the screws were included plus a couple extras which was nice. The instructions were clear enough. Overall impressed with the construction, especially compared to cheaper stands I've seen at big box stores.",
      rating: 5,
      reviewerName: "Brian M."
    }
  },
  {
    promptJson: {
      subject: {
        what_customer_noticed: "Morning light hitting the plants on my new stand",
        emotional_context: "Peaceful morning moment, aesthetic appreciation",
        reason_for_photo: "Capturing how good the plants look with morning sun"
      },
      product: {
        description: "7-tier plant stand positioned near window catching morning sunlight",
        real_life_appearance: "Silhouette effect from backlighting, plants glowing with light through leaves, metal frame creating shadows",
        visible_details: "Light streaming through translucent leaves, dust particles in light beam, shadows on wall behind",
        minor_imperfections: "Some leaves have brown tips, dust visible on shelf surfaces in the light, one plant leaning toward window"
      },
      environment: {
        room_type: "Kitchen or dining area near window",
        placement: "Next to window, catching direct morning light",
        surrounding_objects: ["window frame and sill visible", "wall corner", "part of chair or table edge", "kitchen items in soft background"],
        accidental_context: ["coffee cup steam visible", "mail on counter in background", "keys on hook", "morning newspaper"],
        time_of_day: "Early morning, direct sunlight streaming in"
      },
      camera: {
        device: "Phone capturing moment spontaneously",
        angle: "Slightly side angle to catch light rays",
        distance: "About 4-5 feet",
        focus: "Silhouette style, not all details crisp",
        artifacts: ["lens flare from sun", "blown out highlights near window", "warm morning color cast", "slight haze effect"]
      },
      realism_rules: {
        must_include: ["authentic morning light quality", "visible dust in sunbeam", "plants reacting to light", "cozy lived-in kitchen context", "spontaneous capture feeling"],
        must_avoid: ["studio backlighting", "perfect exposure", "clean dust-free scene", "staged morning setup", "professional silhouette photography"]
      }
    },
    review: {
      title: "My plants are so happy by the window",
      comment: "Had to snap a pic this morning - the way the light comes through my kitchen window and hits all the plants is just beautiful. I moved the stand here last week and already notice my plants perking up. You can see in the photo how the light filters through the leaves. My pothos has grown like 3 inches already! The stand is tall enough that even the top shelf gets good light. Only downside is I can see all the dust on the shelves now lol time to clean. Worth every penny though.",
      rating: 5,
      reviewerName: "Amanda L."
    }
  },
  {
    promptJson: {
      subject: {
        what_customer_noticed: "Showing how I styled the stand in my apartment entryway",
        emotional_context: "Proud of the design choice, sharing decor inspiration",
        reason_for_photo: "Demonstrating versatile placement option"
      },
      product: {
        description: "Plant stand used as entryway display with plants and decorative items",
        real_life_appearance: "Mix of plants and small decor items on shelves, keys bowl on one shelf, small plant collection",
        visible_details: "Combination of greenery and practical items, varying pot sizes, small framed photo on one shelf",
        minor_imperfections: "Some clutter, items not perfectly arranged, one plant needs water (drooping slightly)"
      },
      environment: {
        room_type: "Apartment entryway or small hallway",
        placement: "Against wall near front door",
        surrounding_objects: ["front door edge visible", "coat hooks with jackets", "shoe rack or shoes on floor", "welcome mat edge"],
        accidental_context: ["umbrella leaning against wall", "amazon package on floor", "dog leash hanging nearby", "light switch plate visible"],
        time_of_day: "Afternoon, artificial hallway lighting"
      },
      camera: {
        device: "Quick phone snap while leaving",
        angle: "Standing in hallway, slightly rushed angle",
        distance: "3-4 feet, tight hallway space",
        focus: "Generally acceptable, not perfectly sharp",
        artifacts: ["flat indoor lighting", "slight yellow cast from bulbs", "mild noise", "not perfectly level horizon"]
      },
      realism_rules: {
        must_include: ["functional entryway items", "signs of daily life", "coat and shoe context", "practical mixed use of shelves", "hallway lighting quality"],
        must_avoid: ["styled entryway photoshoot", "cleared of personal items", "perfect plant arrangements", "designer decor only", "bright natural light"]
      }
    },
    review: {
      title: "Not just for plants - great entryway piece",
      comment: "I didn't want a boring entryway table so I got this instead. I use it for plants AND practical stuff - there's a bowl for keys on one shelf, a little tray for mail, and the rest is plants. It's narrow enough that it doesn't block the hallway in my small apartment. My only complaint is I wish there was one more shelf at hip height for setting things down when I walk in. The droopy plant in the pic needs water, not the stand's fault haha. Great purchase for apartment living.",
      rating: 4,
      reviewerName: "Chris P."
    }
  }
];

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

async function generateReviewPhoto(promptJson: ReviewPhotoPrompt, name: string): Promise<string | null> {
  try {
    console.log(`\n📸 Generating: ${name}...`);

    const prompt = buildPromptFromJson(promptJson);

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
          const outputDir = path.join(process.cwd(), 'generated-images', 'review-photos');
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
  console.log('📸 Realistic Customer Review Photo Generator\n');
  console.log('=============================================\n');
  console.log('Generating photos that look like real customer submissions...\n');

  const results: Array<{
    imagePath: string | null;
    review: typeof reviewPhotoScenarios[0]['review'];
    promptJson: ReviewPhotoPrompt;
  }> = [];

  for (let i = 0; i < reviewPhotoScenarios.length; i++) {
    const scenario = reviewPhotoScenarios[i];
    const name = `photo_${i + 1}_${scenario.review.reviewerName.toLowerCase().replace(/[^a-z]/g, '')}`;

    const imagePath = await generateReviewPhoto(scenario.promptJson, name);

    results.push({
      imagePath,
      review: scenario.review,
      promptJson: scenario.promptJson,
    });

    // Rate limiting
    console.log('⏳ Waiting 3 seconds...\n');
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  console.log('\n=============================================');
  console.log('🎉 Generation Complete!\n');

  const successfulResults = results.filter(r => r.imagePath);
  console.log(`Generated ${successfulResults.length} of ${results.length} review photos\n`);

  if (successfulResults.length > 0) {
    console.log('📁 Files saved to: ./generated-images/review-photos/\n');

    // Output the reviews with their photos for seeding
    console.log('📝 Reviews to seed (copy this for the seeding script):\n');
    console.log('const reviewsWithPhotos = [');

    for (const result of successfulResults) {
      const photoFilename = path.basename(result.imagePath!);
      console.log(`  {`);
      console.log(`    title: "${result.review.title}",`);
      console.log(`    comment: \`${result.review.comment}\`,`);
      console.log(`    rating: ${result.review.rating},`);
      console.log(`    reviewerName: "${result.review.reviewerName}",`);
      console.log(`    photoFilename: "${photoFilename}",`);
      console.log(`    // Photo context: ${result.promptJson.subject.what_customer_noticed}`);
      console.log(`  },`);
    }

    console.log('];');
  }

  // Save the full results as JSON for reference
  const outputPath = path.join(process.cwd(), 'generated-images', 'review-photos', 'reviews-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(results.map(r => ({
    imagePath: r.imagePath,
    review: r.review,
    photoContext: r.promptJson.subject.what_customer_noticed,
    environment: r.promptJson.environment.room_type,
  })), null, 2));

  console.log(`\n📋 Review data saved to: ${outputPath}`);
}

main().catch(console.error);
