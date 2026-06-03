// Notification service placeholder
module.exports = {
  sendPushNotification: async (userId, title, body) => {
    console.log(`[Notification Service] Sending push notification to ${userId}: ${title} - ${body}`);
    return Promise.resolve(true);
  }
};
