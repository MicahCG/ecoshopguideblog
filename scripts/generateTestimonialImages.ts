import { config } from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';

config();

const GEMINI_API_KEY = 'AIzaSyBJv2m1LtIVYHksfwEqyd4YG3GLGkE9XyY';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const OUTPUT_DIR = path.resolve(import.meta.dirname, '..', 'client', 'public', 'testimonials');

// Testimonial lifestyle image prompts - each shows a specific product in the customer's described space
const testimonialPrompts = [
  {
    name: 'wedding_macrame_chandelier',
    collection: 'Wedding',
    prompt: `Create a photorealistic lifestyle image of a beautiful boho outdoor wedding reception. A woven macramé hanging chandelier with natural cotton cord is the centerpiece, suspended over a rustic wooden farm table decorated with candles, eucalyptus garland, and dried flowers. The setting is an intimate garden wedding with string lights in the background, warm golden hour sunlight, and natural greenery surrounding the space. The macramé chandelier has intricate knotwork and hangs from a wooden pergola beam. Guests' chairs have simple linen draping. The overall aesthetic is eco-friendly, romantic, and intentional. Professional wedding photography style, warm tones, shallow depth of field on the chandelier. No text or watermarks.`,
  },
  {
    name: 'small_spaces_wall_planter',
    collection: 'Small Spaces',
    prompt: `Create a photorealistic interior photograph of a cozy 400 square foot studio apartment. A modern wooden wall-mounted plant hanger is prominently displayed on a white wall, holding trailing pothos and small succulents in terracotta pots. The wall planter has a minimalist design with warm-toned wood shelves and clean lines. The studio apartment features a compact living area with a small loveseat, a tiny bistro dining table, and efficient use of vertical space. Natural light streams through a single large window. The space feels intentional and well-organized despite being small. Warm, lived-in atmosphere with plants adding life to the compact space. Apartment Therapy editorial photography style. No text or watermarks.`,
  },
  {
    name: 'home_boho_rug',
    collection: 'Home',
    prompt: `Create a photorealistic interior design photograph of a warm, inviting living room centered around a beautiful boho medallion area rug with earthy tones and geometric patterns. The rug anchors a cozy seating area with a mid-century modern sofa with linen cushions and a wooden coffee table with a small plant and coffee mug on it. Natural light fills the room from large windows. The space has warm oak hardwood floors visible at the rug edges, a few throw pillows on the sofa, and a relaxed bohemian-meets-modern aesthetic. The room feels like a newly decorated first home - fresh but lived-in. Professional interior design magazine photography, warm afternoon light. No text or watermarks.`,
  },
  {
    name: 'dorms_chunky_blanket',
    collection: 'Dorms',
    prompt: `Create a photorealistic photograph of a college dorm room bed that has been made cozy and personal. A thick merino wool style chunky knit blanket in a warm cream/ivory color is draped artfully across the bed. The dorm has warm LED fairy lights strung along the wall above the bed, a few photos pinned on a small corkboard, and a tiny bedside shelf with a succulent and a book. The standard dorm bed frame and basic mattress are transformed into something inviting and personal. The blanket's large cable-knit texture is the hero of the image, making the small dorm space feel warm and homey. Cozy lifestyle photography, warm indoor lighting, college aesthetic. No text or watermarks.`,
  },
  {
    name: 'wellness_incense_burner',
    collection: 'Wellness',
    prompt: `Create a photorealistic photograph of a peaceful meditation corner in an apartment. A Nepali-style brass incense burner sits on a small wooden shelf or side table, with a thin wisp of smoke rising from it. Nearby is a Himalayan salt lamp casting a warm amber glow, a meditation cushion on the floor, and perhaps a small potted plant. The corner is minimal and intentional, with soft natural textures like a jute rug and a linen curtain. Warm morning light filters through. The space feels like a personal sanctuary - calm, grounding, and mindful. Wellness lifestyle photography, soft warm tones, peaceful atmosphere. No text or watermarks.`,
  },
];

async function generateImage(name: string, prompt: string): Promise<void> {
  const outputPath = path.join(OUTPUT_DIR, `${name}.png`);

  // Skip if already generated
  if (fs.existsSync(outputPath)) {
    console.log(`⏭️  Skipping ${name} (already exists)`);
    return;
  }

  console.log(`🎨 Generating ${name}...`);

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp-image-generation',
      generationConfig: {
        // @ts-ignore - image generation config
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    const result = await model.generateContent(prompt);
    const response = result.response;

    // Extract image from response
    for (const candidate of response.candidates || []) {
      for (const part of candidate.content?.parts || []) {
        if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, 'base64');
          fs.writeFileSync(outputPath, buffer);
          console.log(`✅ Saved ${name}.png (${(buffer.length / 1024).toFixed(0)}KB)`);
          return;
        }
      }
    }

    console.log(`⚠️  No image data in response for ${name}`);
  } catch (error: any) {
    console.error(`❌ Failed to generate ${name}:`, error.message);
  }
}

async function main() {
  console.log('=== Generating Testimonial Lifestyle Images ===\n');

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  for (const { name, collection, prompt } of testimonialPrompts) {
    console.log(`\n📸 ${collection} Collection:`);
    await generateImage(name, prompt);

    // Small delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n=== Done! ===');
  console.log(`Images saved to: ${OUTPUT_DIR}`);
}

main().catch(console.error);
