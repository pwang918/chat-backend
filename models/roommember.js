"use strict";
module.exports = (sequelize, DataTypes) => {
  const RoomMember = sequelize.define(
    "RoomMember",
    {
      roomId: {
        type: DataTypes.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "Rooms",
          key: "id",
        },
      },
      memberId: {
        type: DataTypes.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "Users",
          key: "id",
        },
      },
    },
    { paranoid: true }
  );
  RoomMember.associate = function (models) {
    RoomMember.belongsTo(models.Room, {
      as: "room",
      foreignKey: "roomId",
      onDelete: "CASCADE",
    });
    RoomMember.belongsTo(models.User, {
      as: "user",
      foreignKey: "memberId",
      onDelete: "CASCADE",
    });
  };
  return RoomMember;
};
