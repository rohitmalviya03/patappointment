module.exports = (sequelize, DataTypes) => {
  const CallbackRequest = sequelize.define(
    'CallbackRequest',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false
      },
      patientName: {
        type: DataTypes.STRING,
        defaultValue: ''
      },
      email: {
        type: DataTypes.STRING,
        defaultValue: ''
      },
      service: {
        type: DataTypes.STRING,
        allowNull: false
      },
      preferredTime: {
        type: DataTypes.ENUM('morning', 'afternoon', 'evening'),
        defaultValue: 'morning'
      },
      preferredDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        defaultValue: ''
      },
      status: {
        type: DataTypes.ENUM('pending', 'accepted', 'scheduled', 'completed', 'cancelled'),
        defaultValue: 'pending'
      }
    },
    {
      tableName: 'callback_requests',
      timestamps: true
    }
  );

  CallbackRequest.prototype.toJSON = function toJSON() {
    const values = { ...this.get() };
    values._id = values.id;
    delete values.id;
    return values;
  };

  return CallbackRequest;
};
