const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('SkillCategory', {
    category: { type: DataTypes.STRING, allowNull: false },
    icon: { type: DataTypes.STRING, defaultValue: 'code' },
  });
};
