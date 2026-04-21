module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define(
    'Appointment',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      patient: {
        type: DataTypes.UUID,
        allowNull: false
      },
      lab: {
        type: DataTypes.UUID,
        allowNull: false
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
        type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled', 'no-show'),
        defaultValue: 'pending'
      },
      notes: {
        type: DataTypes.TEXT,
        defaultValue: ''
      },
      testResults: {
        type: DataTypes.TEXT,
        defaultValue: ''
      },
      isReminderSent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      tableName: 'appointments',
      timestamps: true
    }
  );

  Appointment.prototype.toJSON = function toJSON() {
    const values = { ...this.get() };
    values._id = values.id;
    delete values.id;
    return values;
  };

  return Appointment;
};
