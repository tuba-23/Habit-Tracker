import Habit from '../models/habitModel.js';
import User from '../models/userModel.js';
import { analyzeHabit } from '../services/aiService.js';
import { z } from 'zod';

const habitSchema = z.object({
  description: z.string().min(1, 'Habit description is required').max(500, 'Description too long'),
  category: z
    .string()
    .optional()
    .refine(
      (val) => !val || ['Health', 'Productivity', 'Hobby', 'Social'].includes(val),
      { message: 'Invalid category' }
    ),
});

export const getHabits = async (req, res) => {
  const userId = req.user.id;
  try {
    const habits = await Habit.find({ userId }).sort({ createdAt: -1 });
    res.json({ habits });
  } catch (error) {
    console.error('Error fetching habits:', error);
    res.status(500).json({ message: 'Failed to fetch habits' });
  }
};

export const addHabit = async (req, res) => {
  const userId = req.user.id;
  try {
    const { description, category } = habitSchema.parse(req.body);

    let aiResult;
    try {
      aiResult = await analyzeHabit(description);
    } catch (aiError) {
      console.warn('AI analysis failed, using fallback:', aiError);
      aiResult = {
        weirdnessScore: Math.floor(Math.random() * 100),
        group: ['Early Bird', 'Night Owl', 'Speedster', 'Binge Master'][Math.floor(Math.random() * 4)],
        aiComment: 'This habit is interesting! Keep it up!',
      };
    }

    const habit = new Habit({
      userId,
      description,
      category: category || '',
      weirdnessScore: aiResult.weirdnessScore,
      group: aiResult.group,
      aiComment: aiResult.aiComment,
      xpEarned: 10,
    });

    await habit.save();
    await User.findByIdAndUpdate(userId, { $inc: { xp: 10 } });

    const io = req.app.get('io');
    io.to(userId).emit('habitAdded', habit);

    res.status(201).json({ habit, xpEarned: 10 });
  } catch (error) {
    console.error('Error adding habit:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0].message });
    } else {
      res.status(500).json({ message: 'Failed to add habit' });
    }
  }
};

export const deleteHabit = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const habit = await Habit.findOneAndDelete({ _id: id, userId });
    if (!habit) return res.status(400).json({ message: 'Habit not found' });

    const io = req.app.get('io');
    io.to(userId).emit('habitDeleted', id);

    res.json({ message: 'Habit deleted' });
  } catch (error) {
    console.error('Error deleting habit:', error);
    res.status(500).json({ message: 'Failed to delete habit' });
  }
};

export const toggleHabitCompletion = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const habit = await Habit.findOne({ _id: id, userId });
    if (!habit) return res.status(400).json({ message: 'Habit not found' });

    habit.completed = !habit.completed;
    let xpEarned = 0;
    if (habit.completed) {
      habit.streak = (habit.streak || 0) + 1;
      habit.xpEarned = (habit.xpEarned || 0) + 10;
      xpEarned = 10;
      await User.findByIdAndUpdate(userId, { $inc: { xp: 10 } });
    } else {
      habit.streak = Math.max(0, (habit.streak || 0) - 1);
    }

    await habit.save();

    const io = req.app.get('io');
    io.to(userId).emit('habitUpdated', habit);

    res.json({ habit, xpEarned });
  } catch (error) {
    console.error('Error toggling habit:', error);
    res.status(500).json({ message: 'Failed to toggle habit' });
  }
};

export const getUserXpHistory = async (req, res) => {
  const userId = req.user.id;
  try {
    const habits = await Habit.find({ userId }).select('xpEarned createdAt');
    const history = habits.reduce((acc, habit) => {
      const date = habit.createdAt.toISOString().split('T')[0];
      const existing = acc.find((entry) => entry.date === date);
      if (existing) {
        existing.xp += habit.xpEarned || 0;
      } else {
        acc.push({ date, xp: habit.xpEarned || 0 });
      }
      return acc;
    }, []);

    res.json({ history });
  } catch (error) {
    console.error('Error fetching XP history:', error);
    res.status(500).json({ message: 'Failed to fetch XP history' });
  }
};