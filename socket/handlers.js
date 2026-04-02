const Notification = require('../models/Notification');

/**
 * Socket.io Event Handlers
 * Real-time notifications, class updates, and chat
 * 
 * Usage in server.js:
 * const socketHandlers = require('./socket/handlers');
 * socketHandlers.initializeHandlers(io);
 */

exports.initializeHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket] User connected: ${socket.id}`);

    /**
     * === ROOM MANAGEMENT ===
     */

    /**
     * User joins their notification room
     * Allows server to send personal notifications
     * Event: client emits 'joinUserRoom' with userId
     */
    socket.on('joinUserRoom', (userId) => {
      const userRoom = `user:${userId}`;
      socket.join(userRoom);
      console.log(`[Socket] User ${userId} joined room: ${userRoom}`);

      // Emit acknowledgment
      socket.emit('joinUserRoom:success', {
        message: 'Joined notification room',
        room: userRoom,
      });
    });

    /**
     * User joins a class room for live updates
     * Event: client emits 'joinClassRoom' with classId
     */
    socket.on('joinClassRoom', (classId) => {
      const classRoom = `class:${classId}`;
      socket.join(classRoom);
      console.log(`[Socket] Client joined class room: ${classRoom}`);

      socket.emit('joinClassRoom:success', {
        message: 'Joined class room',
        room: classRoom,
      });
    });

    /**
     * User leaves a class room
     * Event: client emits 'leaveClassRoom' with classId
     */
    socket.on('leaveClassRoom', (classId) => {
      const classRoom = `class:${classId}`;
      socket.leave(classRoom);
      console.log(`[Socket] Client left class room: ${classRoom}`);
    });

    /**
     * === CLASS UPDATES ===
     */

    /**
     * Broadcast class seat update
     * Called when someone books/cancels a class
     * 
     * Payload: classId, seatsTaken, seatsAvailable, capacity
     */
    socket.on('class:updateSeats', (data) => {
      const { classId, seatsTaken, seatsAvailable, capacity } = data;
      const classRoom = `class:${classId}`;

      // Emit to all users in the class room
      io.to(classRoom).emit('class:seatUpdate', {
        classId,
        seatsTaken,
        seatsAvailable,
        capacity,
        timestamp: new Date(),
      });

      console.log(
        `[Socket] Class ${classId} seats updated: ${seatsTaken}/${capacity}`
      );
    });

    /**
     * === NOTIFICATIONS ===
     */

    /**
     * Send notification to specific user
     * Server-side: Use io.to(`user:${userId}`).emit('notification:new', data)
     * Client receives: 'notification:new' event with notification data
     */
    socket.on('notification:markAsRead', async (notificationId) => {
      try {
        // Update in database
        await Notification.findByIdAndUpdate(notificationId, {
          read: true,
          readAt: new Date(),
        });

        console.log(
          `[Socket] Notification ${notificationId} marked as read`
        );
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    });

    /**
     * Get unread notification count
     * Client emits: 'notification:getUnreadCount' with userId
     * Server responds: 'notification:unreadCount' with count
     */
    socket.on('notification:getUnreadCount', async (userId) => {
      try {
        const count = await Notification.countDocuments({
          userId,
          read: false,
        });

        socket.emit('notification:unreadCount', { count, userId });
      } catch (error) {
        console.error('Error getting unread count:', error);
        socket.emit('notification:unreadCount', { count: 0, error: true });
      }
    });

    /**
     * === TRAINER CHAT ===
     */

    /**
     * Join trainer-member private chat room
     * Room format: trainer:{trainerId}:member:{memberId}
     * 
     * Event: client emits 'chat:joinRoom' with trainerId and memberId
     */
    socket.on('chat:joinRoom', (data) => {
      const { trainerId, memberId } = data;
      const chatRoom = `trainer:${trainerId}:member:${memberId}`;

      socket.join(chatRoom);
      console.log(
        `[Socket] Chat room joined: ${chatRoom} by socket ${socket.id}`
      );

      socket.emit('chat:joinRoom:success', {
        message: 'Joined chat room',
        room: chatRoom,
      });
    });

    /**
     * Leave trainer-member chat room
     * Event: client emits 'chat:leaveRoom' with trainerId and memberId
     */
    socket.on('chat:leaveRoom', (data) => {
      const { trainerId, memberId } = data;
      const chatRoom = `trainer:${trainerId}:member:${memberId}`;

      socket.leave(chatRoom);
      console.log(
        `[Socket] Chat room left: ${chatRoom} by socket ${socket.id}`
      );
    });

    /**
     * Send a message in trainer chat
     * Persists to MongoDB and broadcasts to room
     * 
     * Payload: { trainerId, memberId, message, senderId }
     */
    socket.on('chat:sendMessage', async (data) => {
      try {
        const { trainerId, memberId, message, senderId } = data;
        const chatRoom = `trainer:${trainerId}:member:${memberId}`;

        const messageData = {
          senderId,
          message,
          timestamp: new Date(),
          senderType: trainerId === senderId ? 'trainer' : 'member',
        };

        // TODO: Save to MongoDB TrainerMessage collection
        // const savedMessage = await TrainerMessage.create({
        //   trainerId,
        //   memberId,
        //   ...messageData
        // });

        // Broadcast to chat room
        io.to(chatRoom).emit('chat:messageReceived', messageData);

        console.log(
          `[Socket] Message sent in ${chatRoom}: "${message.substring(0, 50)}..."`
        );
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('chat:error', {
          message: 'Failed to send message',
          error: error.message,
        });
      }
    });

    /**
     * === AVAILABILITY UPDATES ===
     */

    /**
     * Trainer updates availability
     * Broadcast to all users viewing trainer profile
     * 
     * Event: 'trainer:availabilityUpdate' with trainerId and availability data
     */
    socket.on('trainer:availabilityUpdate', (data) => {
      const { trainerId, availableSlots } = data;
      const trainerRoom = `trainer:${trainerId}`;

      io.to(trainerRoom).emit('trainer:availabilityChanged', {
        trainerId,
        availableSlots,
        timestamp: new Date(),
      });

      console.log(
        `[Socket] Trainer ${trainerId} availability updated`
      );
    });

    /**
     * User joins trainer profile room to see live availability
     * Event: client emits 'trainer:joinRoom' with trainerId
     */
    socket.on('trainer:joinRoom', (trainerId) => {
      const trainerRoom = `trainer:${trainerId}`;
      socket.join(trainerRoom);
      console.log(`[Socket] Joined trainer room: ${trainerRoom}`);
    });

    /**
     * === GYM UPDATES ===
     */

    /**
     * Gym broadcasts live member count update
     * Useful for showing "X members currently checked in"
     * 
     * Event: 'gym:memberCountUpdate' with gymId and count
     */
    socket.on('gym:memberCountUpdate', (data) => {
      const { gymId, checkedInCount, totalMembers } = data;
      const gymRoom = `gym:${gymId}`;

      io.to(gymRoom).emit('gym:memberCountChanged', {
        gymId,
        checkedInCount,
        totalMembers,
        timestamp: new Date(),
      });

      console.log(
        `[Socket] Gym ${gymId} member count: ${checkedInCount}/${totalMembers}`
      );
    });

    /**
     * User joins gym room for live updates
     * Event: client emits 'gym:joinRoom' with gymId
     */
    socket.on('gym:joinRoom', (gymId) => {
      const gymRoom = `gym:${gymId}`;
      socket.join(gymRoom);
      console.log(`[Socket] Joined gym room: ${gymRoom}`);
    });

    /**
     * === ADMIN NOTIFICATIONS ===
     */

    /**
     * Admin joins admin room for system alerts
     * Requires admin role verification on client
     * Event: client emits 'admin:joinRoom'
     */
    socket.on('admin:joinRoom', (data) => {
      const { userId, role } = data;
      // TODO: Verify admin role on server side

      const adminRoom = `admin:${userId}`;
      socket.join(adminRoom);
      console.log(`[Socket] Admin user ${userId} joined admin room`);
    });

    /**
     * === CONNECTION LIFECYCLE ===
     */

    /**
     * Client sends heartbeat to keep connection alive
     * Server responds with pong
     */
    socket.on('ping', () => {
      socket.emit('pong');
    });

    /**
     * Client disconnect
     */
    socket.on('disconnect', () => {
      console.log(`[Socket] User disconnected: ${socket.id}`);
    });

    /**
     * Error handling
     */
    socket.on('error', (error) => {
      console.error(`[Socket] Error for socket ${socket.id}:`, error);
    });
  });
};

/**
 * Helper Functions - Call these from controllers to emit events
 */

/**
 * Send notification to user via Socket.io
 * @param {Object} io - Socket.io instance
 * @param {string} userId - User ID
 * @param {Object} notification - Notification data
 */
exports.sendNotificationToUser = (io, userId, notification) => {
  const userRoom = `user:${userId}`;

  io.to(userRoom).emit('notification:new', {
    ...notification,
    timestamp: new Date(),
  });

  console.log(`[Socket] Notification sent to user: ${userId}`);
};

/**
 * Broadcast class seat update to all subscribers
 * @param {Object} io - Socket.io instance
 * @param {string} classId - Class ID
 * @param {Object} seatData - Seat information
 */
exports.broadcastClassSeatUpdate = (io, classId, seatData) => {
  const classRoom = `class:${classId}`;

  io.to(classRoom).emit('class:seatUpdate', {
    ...seatData,
    timestamp: new Date(),
  });

  console.log(`[Socket] Class seat update broadcasted: ${classId}`);
};

/**
 * Broadcast trainer availability change
 * @param {Object} io - Socket.io instance
 * @param {string} trainerId - Trainer ID
 * @param {Array} availableSlots - Available time slots
 */
exports.broadcastTrainerAvailabilityChange = (
  io,
  trainerId,
  availableSlots
) => {
  const trainerRoom = `trainer:${trainerId}`;

  io.to(trainerRoom).emit('trainer:availabilityChanged', {
    trainerId,
    availableSlots,
    timestamp: new Date(),
  });

  console.log(
    `[Socket] Trainer availability update broadcasted: ${trainerId}`
  );
};

/**
 * Broadcast gym member count update
 * @param {Object} io - Socket.io instance
 * @param {string} gymId - Gym ID
 * @param {number} checkedInCount - Current checked-in count
 * @param {number} totalMembers - Total members
 */
exports.broadcastGymMemberCountUpdate = (
  io,
  gymId,
  checkedInCount,
  totalMembers
) => {
  const gymRoom = `gym:${gymId}`;

  io.to(gymRoom).emit('gym:memberCountChanged', {
    checkedInCount,
    totalMembers,
    timestamp: new Date(),
  });

  console.log(
    `[Socket] Gym member count update broadcasted: ${gymId}`
  );
};

/**
 * Send message in trainer chat
 * @param {Object} io - Socket.io instance
 * @param {string} trainerId - Trainer ID
 * @param {string} memberId - Member ID
 * @param {Object} messageData - Message information
 */
exports.sendTrainerChatMessage = (
  io,
  trainerId,
  memberId,
  messageData
) => {
  const chatRoom = `trainer:${trainerId}:member:${memberId}`;

  io.to(chatRoom).emit('chat:messageReceived', {
    ...messageData,
    timestamp: new Date(),
  });

  console.log(
    `[Socket] Message sent in trainer chat: ${trainerId} <-> ${memberId}`
  );
};
