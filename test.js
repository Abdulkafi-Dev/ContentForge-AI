const { GoogleGenerativeAI } = require('@google/generative-ai');

try {
  new GoogleGenerativeAI(undefined);
} catch (e) {
  console.log('Generative AI error:', e.message);
}
