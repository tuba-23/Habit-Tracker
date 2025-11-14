// controllers/challengeController.js
export const createChallenge = async (req, res) => {
  const { name, description, duration, xpReward } = req.body;
  const challenge = new Challenge({ name, description, duration, xpReward, creatorId: req.user.id });
  await challenge.save();
  res.status(201).json(challenge);
};