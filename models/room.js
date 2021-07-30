"use strict";
module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define(
    "Room",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
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
  Room.associate = function (models) {
    Room.belongsTo(models.User, {
      as: "createdBy",
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  };
  return Room;
};
