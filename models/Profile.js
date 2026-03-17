const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Profile', {
    name: { type: DataTypes.STRING, defaultValue: 'Aida Diallo' },
    title: { type: DataTypes.STRING, defaultValue: 'Développeuse Full Stack' },
    greeting: { type: DataTypes.STRING, defaultValue: 'Bonjour, je suis' },
    description: { type: DataTypes.TEXT, defaultValue: '' },
    about1: { type: DataTypes.TEXT, defaultValue: '' },
    about2: { type: DataTypes.TEXT, defaultValue: '' },
    about3: { type: DataTypes.TEXT, defaultValue: '' },
    location: { type: DataTypes.STRING, defaultValue: 'Sénégal' },
    specialty: { type: DataTypes.STRING, defaultValue: 'Développement Full Stack' },
    availability: { type: DataTypes.STRING, defaultValue: 'Ouverte aux opportunités' },
    email: { type: DataTypes.STRING, defaultValue: '' },
    github: { type: DataTypes.STRING, defaultValue: '' },
    linkedin: { type: DataTypes.STRING, defaultValue: '' },
    twitter: { type: DataTypes.STRING, defaultValue: '' },
    statYears: { type: DataTypes.STRING, defaultValue: '2+' },
    statProjects: { type: DataTypes.STRING, defaultValue: '10+' },
    statTechnologies: { type: DataTypes.STRING, defaultValue: '5+' },
    statEngagement: { type: DataTypes.STRING, defaultValue: '100%' },
  });
};
