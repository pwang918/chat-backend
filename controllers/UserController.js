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
  static async sendChat({ socket, message }) {
    const user = await User.findOne({ where: { socketId: socket.id } });
    if (!user) {
      console.error("No active user: ", socket.id);
      return;
    }
  }
}

module.exports = UserController;
