const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Experience', {
    period: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false },
    company: { type: DataTypes.STRING, defaultValue: '' },
    description: { type: DataTypes.TEXT, defaultValue: '' },
    tags: { type: DataTypes.JSONB, defaultValue: [] },
    displayOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
  });
};
