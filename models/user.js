"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      socketId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {}
  );

  return User;
};
