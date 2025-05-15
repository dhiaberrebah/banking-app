import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Add this to your .env file
});

// Generate response using OpenAI
export const generateChatbotResponse = async (userMessage) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful banking assistant for AMEN Bank. Provide concise, accurate information about banking services, account management, and general financial advice. For security reasons, never ask for or discuss specific account details, passwords, or personal information. If users ask about complex issues requiring human assistance, guide them to contact customer service at +216 71 123 456."
        },
        { role: "user", content: userMessage }
      ],
      max_tokens: 300,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "I'm sorry, I'm having trouble processing your request right now. Please try again later or contact our customer service.";
  }
}