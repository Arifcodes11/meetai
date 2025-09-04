import { GoogleGenerativeAI } from "@google/generative-ai";

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const geminiModel = gemini.getGenerativeModel({
  model: "gemini-1.5-flash", // or gemini-1.5-pro if you want deeper reasoning
});
