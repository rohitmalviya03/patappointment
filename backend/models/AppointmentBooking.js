module.exports = (sequelize, DataTypes) => {
  const AppointmentBooking = sequelize.define(
    'AppointmentBooking',
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
      patientAddress: {
        type: DataTypes.TEXT,
        defaultValue: ''
      },
      service: {
        type: DataTypes.STRING,
        allowNull: false
      },
      appointmentDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      startTime: {
        type: DataTypes.STRING,
        allowNull: false
      },
      endTime: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
        defaultValue: 'pending'
      },
      notes: {
        type: DataTypes.TEXT,
        defaultValue: ''
      }
    },
    {
      tableName: 'appointment_bookings',
      timestamps: true
    }
  );

  AppointmentBooking.prototype.toJSON = function toJSON() {
    const values = { ...this.get() };
    values._id = values.id;
    delete values.id;
    return values;
  };

  return AppointmentBooking;
};
