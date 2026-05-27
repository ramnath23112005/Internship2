const Notification = require('../models/Notification');

let ioInstance = null;

const setIO = (io) => {
  ioInstance = io;
};

const getIO = () => ioInstance;

const createNotification = async ({ recipient, type, title, message, data }) => {
  try {
    const notification = await Notification.create({ recipient, type, title, message, data });

    if (ioInstance) {
      ioInstance.to(recipient.toString()).emit('notification', notification);
    }

    return notification;
  } catch (error) {
    console.error('Notification creation failed:', error.message);
  }
};

module.exports = { createNotification, setIO, getIO };
