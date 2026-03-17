const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Project', {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, defaultValue: '' },
    tech: { type: DataTypes.TEXT, defaultValue: '[]', get() { try { return JSON.parse(this.getDataValue('tech')); } catch { return []; } }, set(val) { this.setDataValue('tech', JSON.stringify(val)); } },
    github: { type: DataTypes.STRING, defaultValue: '' },
    live: { type: DataTypes.STRING, defaultValue: '' },
    featured: { type: DataTypes.BOOLEAN, defaultValue: false },
    displayOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
  });
};
