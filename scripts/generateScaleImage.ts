import { config } from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';

config();

const GEMINI_API_KEY = 'AIzaSyBJv2m1LtIVYHksfwEqyd4YG3GLGkE9XyY';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Scale reference prompts showing the plant stand with person/furniture for size context
const scalePrompts = [
  {
    name: 'scale_with_person',
    prompt: `Create a photorealistic interior photo showing scale and size: A woman (approximately 5'6" tall) stands next to a tall 7-tier black metal plant stand in her living room. The plant stand is almost as tall as she is (about 6 feet tall), clearly demonstrating its impressive height. The stand has dark wooden shelves filled with various green houseplants. She is smiling and gently touching one of the plants. The room is bright with natural light, modern minimalist decor with white walls and warm wood flooring. This image should clearly show the scale and proportion of the plant stand relative to a person. Professional lifestyle photography, warm and inviting.`,
  },
  {
    name: 'scale_room_context',
    prompt: `Create a photorealistic wide-angle interior photo showing room context: A tall 7-tier black metal plant stand in a cozy bedroom corner next to a standard height nightstand and bed. The plant stand towers above the nightstand, showing it is approximately 6 feet tall (70 inches). The stand has dark wooden shelves filled with lush green indoor plants. The bedroom features a queen bed with neutral bedding, a window with sheer curtains letting in soft light. This image should clearly demonstrate how tall the plant stand is compared to standard bedroom furniture. Professional interior design photography, scale reference shot.`,
  },
];

async function generateScaleImage(prompt: string, name: string): Promise<string | null> {
  try {
    console.log(`\n🎨 Generating: ${name}...`);

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
          const outputDir = path.join(process.cwd(), 'generated-images');
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }

          const extension = part.inlineData.mimeType.split('/')[1] || 'png';
          const filename = `plant_stand_${name}.${extension}`;
          const filepath = path.join(outputDir, filename);

          const imageBuffer = Buffer.from(part.inlineData.data!, 'base64');
          fs.writeFileSync(filepath, imageBuffer);

          console.log(`✅ Saved: ${filepath}`);
          return filepath;
        }
      }
    }

    console.log(`⚠️ No image data in response for ${name}`);
    return null;
  } catch (error: any) {
    console.error(`❌ Error generating ${name}:`, error.message || error);
    return null;
  }
}

async function main() {
  console.log('📏 Plant Stand Scale Reference Image Generator\n');
  console.log('===============================================\n');

  const generatedImages: string[] = [];

  for (const { name, prompt } of scalePrompts) {
    const result = await generateScaleImage(prompt, name);
    if (result) {
      generatedImages.push(result);
    }
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  console.log('\n===============================================');
  console.log(`🎉 Generated ${generatedImages.length} scale reference images!\n`);

  if (generatedImages.length > 0) {
    console.log('Files created:');
    generatedImages.forEach(img => console.log(`  - ${path.basename(img)}`));
  }
}

main().catch(console.error);
