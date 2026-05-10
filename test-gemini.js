const { GoogleGenerativeAI } = require('@google/generative-ai');

async function run() {
  const genAI = new GoogleGenerativeAI('AIzaSyBKA5eLNUIFRChZWNP1Hih9nm9XLdfBouQ');
  
  const modelsToTest = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-flash-8b', 'gemini-2.0-flash-exp', 'gemini-pro'];
  
  for (const modelName of modelsToTest) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Hi');
      console.log(`✅ Success with model: ${modelName}`);
      console.log(result.response.text());
      return;
    } catch (e) {
      console.log(`❌ Failed with model: ${modelName} - ${e.message}`);
    }
  }
}

run();
