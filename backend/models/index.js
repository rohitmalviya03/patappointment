const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = require('./User')(sequelize, DataTypes);
const Lab = require('./Lab')(sequelize, DataTypes);
const OTP = require('./OTP')(sequelize, DataTypes);
const Appointment = require('./Appointment')(sequelize, DataTypes);
const AppointmentBooking = require('./AppointmentBooking')(sequelize, DataTypes);
const CallbackRequest = require('./CallbackRequest')(sequelize, DataTypes);
const SampleCollection = require('./SampleCollection')(sequelize, DataTypes);

Appointment.belongsTo(User, { foreignKey: 'patient', as: 'patientUser' });
Appointment.belongsTo(Lab, { foreignKey: 'lab', as: 'labDetails' });

module.exports = {
  sequelize,
  User,
  Lab,
  OTP,
  Appointment,
  AppointmentBooking,
  CallbackRequest,
  SampleCollection
};
