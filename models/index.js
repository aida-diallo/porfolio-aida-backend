const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  },
});

// --- Modèles ---
const Profile = require('./Profile')(sequelize);
const Project = require('./Project')(sequelize);
const Experience = require('./Experience')(sequelize);
const SkillCategory = require('./SkillCategory')(sequelize);
const Skill = require('./Skill')(sequelize);

// --- Relations ---
SkillCategory.hasMany(Skill, { as: 'skills', foreignKey: 'categoryId', onDelete: 'CASCADE' });
Skill.belongsTo(SkillCategory, { foreignKey: 'categoryId' });

module.exports = { sequelize, Profile, Project, Experience, SkillCategory, Skill };
