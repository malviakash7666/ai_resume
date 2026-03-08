import { DataTypes } from "sequelize";

const UserModel = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          notEmpty: true,
        },
        set(value) {
          this.setDataValue("email", value.toLowerCase());
        },
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      profileImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      role: {
        type: DataTypes.ENUM("user", "admin"),
        defaultValue: "user",
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },

      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "users",
      timestamps: true,

      defaultScope: {
        attributes: { exclude: ["password"] },
      },

      scopes: {
        withPassword: {
          attributes: { include: ["password"] },
        },
      },
    }
  );

  return User; // 👈 Important
};

export default UserModel;