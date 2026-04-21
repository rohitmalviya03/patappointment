module.exports = (sequelize, DataTypes) => {
  const SampleCollection = sequelize.define(
    'SampleCollection',
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
      address: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {}
      },
      sampleType: {
        type: DataTypes.STRING,
        allowNull: false
      },
      preferredDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      preferredTime: {
        type: DataTypes.ENUM('morning', 'afternoon', 'evening'),
        defaultValue: 'morning'
      },
      testName: {
        type: DataTypes.STRING,
        defaultValue: ''
      },
      notes: {
        type: DataTypes.TEXT,
        defaultValue: ''
      },
      status: {
        type: DataTypes.ENUM('pending', 'scheduled', 'completed', 'cancelled'),
        defaultValue: 'pending'
      },
      collectionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
      }
    },
    {
      tableName: 'sample_collections',
      timestamps: true
    }
  );

  SampleCollection.prototype.toJSON = function toJSON() {
    const values = { ...this.get() };
    values._id = values.id;
    delete values.id;
    return values;
  };

  return SampleCollection;
};
