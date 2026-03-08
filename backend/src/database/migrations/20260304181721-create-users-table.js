"use strict";

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
        allowNull: false,
      },

      fullName: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      profileImage: {
        type: Sequelize.STRING,
      },

      role: {
        type: Sequelize.ENUM("user", "admin"),
        defaultValue: "user",
      },

      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },

      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      lastLogin: {
        type: Sequelize.DATE,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("users");
  },
};