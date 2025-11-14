// services/notificationService.js
import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:example@yourdomain.org',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export async function sendPushNotification(userId, message) {
  const subscription = await Subscription.findOne({ userId });
  if (subscription) {
    await webpush.sendNotification(subscription, JSON.stringify({ title: 'Habit Tracker', body: message }));
  }
}