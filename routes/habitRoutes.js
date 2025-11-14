import express from 'express';
import {
  getHabits,
  addHabit,
  deleteHabit,
  toggleHabitCompletion,
  getUserXpHistory,
} from '../controllers/habitController.js';

const router = express.Router();

router.get('/', getHabits);
router.post('/', addHabit);
router.delete('/:id', deleteHabit);
router.put('/:id/toggle', toggleHabitCompletion);
router.get('/xp-history', getUserXpHistory);

export default router;