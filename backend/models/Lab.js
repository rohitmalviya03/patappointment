const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const Lab = sequelize.define(
    'Lab',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      labCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        set(value) {
          this.setDataValue('labCode', value ? value.toUpperCase().trim() : value);
        }
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        set(value) {
          this.setDataValue('username', value ? value.toLowerCase().trim() : value);
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false
      },
      address: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {}
      },
      description: {
        type: DataTypes.TEXT,
        defaultValue: ''
      },
      services: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
      },
      workingHours: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {}
      },
      holidays: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
      },
      appointmentDuration: {
        type: DataTypes.INTEGER,
        defaultValue: 30
      },
      maxAppointmentsPerSlot: {
        type: DataTypes.INTEGER,
        defaultValue: 5
      },
      admin: {
        type: DataTypes.UUID,
        allowNull: true
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      tableName: 'labs',
      timestamps: true
    }
  );

  Lab.beforeCreate(async (lab) => {
    const salt = await bcrypt.genSalt(10);
    lab.password = await bcrypt.hash(lab.password, salt);
  });

  Lab.beforeUpdate(async (lab) => {
    if (lab.changed('password')) {
      const salt = await bcrypt.genSalt(10);
      lab.password = await bcrypt.hash(lab.password, salt);
    }
  });

  Lab.prototype.comparePassword = async function comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };

  Lab.prototype.toJSON = function toJSON() {
    const values = { ...this.get() };
    values._id = values.id;
    delete values.id;
    delete values.password;
    return values;
  };

  return Lab;
};
