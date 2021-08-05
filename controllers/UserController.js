const { User, Room, RoomMember } = require("../models");

class UserController {
  /**
   * Join a room if exists, otherwise it will create a new room by the user
   *
   * @param {string} username
   * @param {string} roomname
   * @param {object} socket
   */
  static async join({ username, roomname, socket }) {
    try {
      // Create a new user if there are no users with same name
      const [user, created] = await User.findOrCreate({ where: { username } });
      // Update socket info for the user
      await user.update({ socketId: socket.id });

      const activeRooms = await Room.findAll({ where: { name: roomname } });
      const isRoomCreator = activeRooms.length === 0;
      let room;

      if (!isRoomCreator) {
        room = activeRooms[0];
      } else {
        // Create a new room by this user
        room = await Room.create({ name: roomname, userId: user.id });
      }
      // Register as a new room member
      await RoomMember.create({ roomId: room.id, memberId: user.id });

      socket.join(room.id);
      // Display welcome message
      socket.emit("message", {
        userId: user.id,
        username: user.username,
        text: `Welcome ${user.username}`,
        room: room.name,
        private: true,
        isRoomCreator: isRoomCreator,
      });
      // Notify a user is joined to a room if a user is not a room creator
      if (!isRoomCreator) {
        socket.broadcast.to(room.id).emit("message", {
          userId: user.id,
          username: user.username,
          room: room.name,
          text: `${user.username} has joined a chat.`,
        });
      }
    } catch (error) {
      console.error("User Join Error: ", error);
    }
  }

  /**
   * Send a chat to roommates
   */
  static async sendChat({ io, socket, message }) {
    const user = await User.findOne({ where: { socketId: socket.id } });
    if (!user) {
      console.error("No active user: ", socket.id);
      return;
    }
    const activeRoom = await RoomMember.findOne({
      where: { memberId: user.id },
      include: "room",
    });
    if (activeRoom && activeRoom?.room?.id) {
      io.to(activeRoom.room.id).emit("message", {
        userId: user.id,
        username: user.username,
        room: activeRoom.room.name,
        text: message,
      });
    }
  }

  /**
   * Disconnect a user from a room
   */
  static async disconnect({ socket }) {
    const user = await User.findOne({ where: { socketId: socket.id } });
    if (!user) return;
    const [room, roommember] = await Promise.all([
      Room.findOne({ where: { userId: user.id } }),
      RoomMember.findOne({
        where: {
          memberId: user.id,
        },
      }),
    ]);
    let roomId;
    let disconnect = false;

    if (room) {
      roomId = room.id;
      disconnect = true;
      await room.destroy();
    } else if (roommember) {
      roomId = roommember.roomId;
      await roommember.destroy();
    }

    if (roomId) {
      socket.broadcast.to(roomId).emit("message", {
        userId: user.id,
        username: user.username,
        room: "",
        text: `${user.username} has left this room.`,
        // When a room creator is disconnected, disconnect all the roommates fromt the room.
        disconnect,
      });
    }
  }
}

module.exports = UserController;
