export default (sequelize, DataTypes) => {

  const Resume = sequelize.define(
    "Resume",
    {

      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      fileName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      fileUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      fileType: {
        type: DataTypes.STRING,
      },

      fileSize: {
        type: DataTypes.INTEGER,
      },

      analysisScore: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },

      status: {
        type: DataTypes.ENUM("uploaded", "analyzed"),
        defaultValue: "uploaded",
      },

    },
    {
      tableName: "resumes",
      timestamps: true,
    }
  );

  Resume.associate = (models) => {

    Resume.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });

  };

  return Resume;
};