const Notification = require('../models/Notification');

const createNotification = async (type, message, relatedId = null) => {
  try {
    await Notification.create({ type, message, relatedId });
  } catch (err) {
    console.error('Failed to create notification:', err.message);
  }
};

module.exports = createNotification;