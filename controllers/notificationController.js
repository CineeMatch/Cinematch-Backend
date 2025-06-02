import Notification from "../models/notification.js";
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll();
    return res.status(200).json(notifications);
  }
  catch (error) {
    console.error('Fetch Error:', error);
    return res.status(500).json({ error: 'Notifications cannot be found.' });
  }
};
export const getNotification = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (notification) {
      return res.status(200).json(notification);
    } else {
      return res.status(404).json({ error: `Notification not found.` });
    }
  } catch (error) {
    console.error('Fetch Error:', error);
    return res.status(500).json({ error: 'Notification cannot be found.' });
  }
};

export const getNotificationsForUser = async (req, res) => {
  const user = req.user.id
  try {
    const notifications = await Notification.findAll({
      where: {
        reciver_id: user
      }
    });

    if (notifications.length === 0) {
      return res.status(404).json({ message: "There isn't any notification for this user." });
    }

    return res.status(200).json({ message: "Notifications listed successfully.", notifications });
  } catch (error) {
    console.error('Fetch Error:', error);
    return res.status(500).json({ error: "Notifications couldn't be listed." });
  }
};

export const createNotification = async (req, res) => {
  const sender_id = req.user.id;

  try {
    const { reciver_id, type_id } = req.body;
    if (!reciver_id || !type_id) {
      return res.status(400).json({ error: "Required fields are missing." });
    }
    const notification = await Notification.findOne({
      where: {
        sender_id: sender_id,
        type_id: type_id,
        reciver_id: reciver_id,
      }
    });

    if (notification) {
      return res.status(409).json({ error: "This notification already exists." });
    }

    const newNotification = await Notification.create({ ...req.body, sender_id: sender_id, isRead: false });
    return res.status(201).json({ message: "New notification created successfully!", notification: newNotification });
  } catch (error) {
    console.error('Create Error:', error);
    return res.status(500).json({ error: 'Notification could not be created.' });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.destroy({
      where: { id: req.params.id }
    });

    if (notification) {
      return res.status(200).json({ message: "Notification deleted successfully." });
    } else {
      return res.status(404).json({ message: "This notification not found." });
    }
  } catch (error) {
    console.error('Delete Error:', error);
    return res.status(500).json({ error: 'Notification could not be deleted.' });
  }
};

export const updateNotificationToRead = async (req, res) => {
  try {
    const notification = await Notification.update(
      { isRead: true },
      { where: { id: req.params.id } }
    );

    if (notification[0] === 0) {
      return res.status(404).json({ message: "Notification not found or not updated." });
    }

    return res.status(200).json({ message: `Notification updated to read.` });
  } catch (error) {
    console.error('Update Error:', error);
    return res.status(500).json({ error: 'Notification could not be updated.' });
  }
};

