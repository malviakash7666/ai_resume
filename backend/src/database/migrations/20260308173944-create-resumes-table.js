"use strict";

export async function up(queryInterface, Sequelize) {

  await queryInterface.createTable("resumes", {

    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    userId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    fileName: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    fileUrl: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    fileType: {
      type: Sequelize.STRING,
    },

    fileSize: {
      type: Sequelize.INTEGER,
    },

    analysisScore: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },

    status: {
      type: Sequelize.ENUM("uploaded", "analyzed"),
      defaultValue: "uploaded",
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

}

export async function down(queryInterface, Sequelize) {

  await queryInterface.dropTable("resumes");

}