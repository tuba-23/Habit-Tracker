import { GoogleGenerativeAI } from '@google/generative-ai';
import Redis from 'ioredis';
import dotenv from 'dotenv';
import Habit from '../models/habitModel.js';

dotenv.config();
const aiClient = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
const redis = new Redis(process.env.REDIS_URL);

export async function recommendHabits(userData) {
  const model = aiClient.getGenerativeModel({ model: 'gemini-pro' });
  const prompt = `
    Suggest 3 new habits for a user with profile: ${JSON.stringify(userData)}.
    Return JSON: { habits: [{ description: string, category: string, frequency: string }] }
  `;
  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}

export async function analyzeHabit(habitData, userData) {
  const cacheKey = `habit_analysis:${userData.id}:${habitData.description}`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  try {
    const model = aiClient.getGenerativeModel({ model: 'gemini-pro' });
    const userHabits = await Habit.find({ userId: userData.id }).limit(10);
    const prompt = `
      **Role:** You are an advanced AI habit coach.
      **User:** ${JSON.stringify(userData, null, 2)}
      **Recent Habits:** ${JSON.stringify(userHabits, null, 2)}
      **New Habit:** ${JSON.stringify(habitData, null, 2)}
      **Task:**
      1. Provide a tailored comment (100 words max) praising the habit, noting challenges, and suggesting sustainable practices.
      2. Assign a group tag based on habit patterns.
      3. Generate a weirdness score (1-100) with a reason.
      4. Suggest XP reward (10-50 based on difficulty).
      5. Detect potential profile shift.
      **Output:** JSON with keys: comment, groupTag, weirdnessScore, xpReward, profileShift
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const analysis = JSON.parse(text);
    await redis.setex(cacheKey, 3600, JSON.stringify(analysis)); // Cache for 1 hour
    return analysis;
  } catch (error) {
    console.error('AI Analysis Error:', error);
    return {
      comment: 'Awesome habit! Stay consistent for great results.',
      groupTag: 'Consistency Champ',
      weirdnessScore: 50,
      xpReward: 10,
      profileShift: null,
    };
  }
}