module.exports = (sequelize, DataTypes) => {
  const OTP = sequelize.define(
    'OTP',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      otp: {
        type: DataTypes.STRING,
        allowNull: false
      },
      attempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      tableName: 'otps',
      timestamps: true
    }
  );

  OTP.prototype.toJSON = function toJSON() {
    const values = { ...this.get() };
    values._id = values.id;
    delete values.id;
    return values;
  };

  return OTP;
};
