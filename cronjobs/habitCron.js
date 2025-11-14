import Habit from '../models/habitModel.js';
import User from '../models/userModel.js';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: 'cron.log' })],
});

export async function updateDailyTasksAndRankings() {
  try {
    logger.info('Starting daily habit cron job');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const habits = await Habit.find({ status: 'active' });

    for (const habit of habits) {
      try {
        const lastCompletion = habit.completions[habit.completions.length - 1];
        if (!lastCompletion) continue;

        const lastCompletionDate = new Date(lastCompletion.date);
        lastCompletionDate.setHours(0, 0, 0, 0);
        const daysSinceCompletion = Math.floor((today - lastCompletionDate) / (1000 * 60 * 60 * 24));

        let shouldResetStreak = false;
        if (habit.frequency === 'daily' && daysSinceCompletion > 1) {
          shouldResetStreak = true;
        } else if (habit.frequency === 'weekly' && daysSinceCompletion > 7) {
          shouldResetStreak = true;
        } else if (habit.frequency === 'monthly' && daysSinceCompletion > 30) {
          shouldResetStreak = true;
        }

        if (shouldResetStreak) {
          habit.streak = 0;
          await habit.save();
          logger.info(`Reset streak for habit ${habit._id}`);

          const user = await User.findById(habit.userId);
          if (user) {
            const userHabits = await Habit.find({ userId: user._id });
            user.stats.currentStreak = Math.max(...userHabits.map(h => h.streak || 0), 0);
            await user.save();
            logger.info(`Updated user streak for ${user._id}`);
          }
        }
      } catch (err) {
        logger.error(`Error processing habit ${habit._id}: ${err.message}`);
      }
    }

    logger.info('Daily habit cron job completed');
  } catch (error) {
    logger.error('Cron job failed:', error);
  }
}