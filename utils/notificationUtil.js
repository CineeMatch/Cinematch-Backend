import Notification from "../models/notification.js";
export const createNotification =async(type_id,sender_id,reciver_id)=>
    {
        try {
    await Notification.create({
      sender_id: sender_id,
      reciver_id: reciver_id,
      type_id: type_id,
      isRead: false
    });
        } catch (error) {
            console.log("notfication cannot be created due to ",error);
        }
    }