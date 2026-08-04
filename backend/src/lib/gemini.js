// This is your new `gemini.js` file

import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

// Initialize the real Google AI Client with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Create a function that takes a prompt and calls the Gemini API
export const generateContentFromGemini = async (prompt) => {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    
    // Send the prompt to Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Return the text content from the response
    return response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get response from Gemini.");
  }
};
