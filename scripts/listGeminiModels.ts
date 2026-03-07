import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = 'AIzaSyBJv2m1LtIVYHksfwEqyd4YG3GLGkE9XyY';

async function listModels() {
  console.log('🔍 Checking available Gemini models...\n');

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`
    );
    const data = await response.json();

    if (data.models) {
      console.log('Available models:\n');
      for (const model of data.models) {
        console.log(`📌 ${model.name}`);
        console.log(`   Display: ${model.displayName}`);
        console.log(`   Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
        console.log('');
      }

      // Check for image generation capable models
      console.log('\n🎨 Models with image generation:');
      const imageModels = data.models.filter((m: any) =>
        m.supportedGenerationMethods?.includes('generateImages') ||
        m.name.includes('imagen')
      );

      if (imageModels.length > 0) {
        imageModels.forEach((m: any) => console.log(`  - ${m.name}`));
      } else {
        console.log('  None found with explicit image generation support');
      }
    } else {
      console.log('Response:', data);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

listModels();
