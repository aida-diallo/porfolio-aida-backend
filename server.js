require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize, Profile, Project, Experience, SkillCategory, Skill } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ==================== HEALTH CHECK ====================
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Portfolio API de Aida Diallo' });
});

// ==================== PROFILE ====================
// Helper : convertir le profil DB → format frontend
const formatProfile = (p) => ({
  name: p.name,
  title: p.title,
  greeting: p.greeting,
  description: p.description,
  about: [p.about1, p.about2, p.about3].filter(Boolean),
  location: p.location,
  specialty: p.specialty,
  availability: p.availability,
  email: p.email,
  github: p.github,
  linkedin: p.linkedin,
  twitter: p.twitter,
  stats: {
    years: p.statYears,
    projects: p.statProjects,
    technologies: p.statTechnologies,
    engagement: p.statEngagement,
  },
});

app.get('/api/profile', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) profile = await Profile.create({});
    res.json(formatProfile(profile));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/profile', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) profile = await Profile.create({});
    const body = req.body;
    const updateData = { ...body };
    // Convertir le format frontend → DB
    if (body.about) {
      updateData.about1 = body.about[0] || '';
      updateData.about2 = body.about[1] || '';
      updateData.about3 = body.about[2] || '';
      delete updateData.about;
    }
    if (body.stats) {
      updateData.statYears = body.stats.years || '';
      updateData.statProjects = body.stats.projects || '';
      updateData.statTechnologies = body.stats.technologies || '';
      updateData.statEngagement = body.stats.engagement || '';
      delete updateData.stats;
    }
    await profile.update(updateData);
    res.json(formatProfile(profile));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== PROJECTS ====================
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.findAll({ order: [['displayOrder', 'ASC'], ['createdAt', 'DESC']] });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ error: 'Projet non trouvé' });
    await project.update(req.body);
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ error: 'Projet non trouvé' });
    await project.destroy();
    res.json({ message: 'Projet supprimé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== EXPERIENCES ====================
app.get('/api/experiences', async (req, res) => {
  try {
    const experiences = await Experience.findAll({ order: [['displayOrder', 'ASC'], ['createdAt', 'DESC']] });
    res.json(experiences);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/experiences', async (req, res) => {
  try {
    const exp = await Experience.create(req.body);
    res.status(201).json(exp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/experiences/:id', async (req, res) => {
  try {
    const exp = await Experience.findByPk(req.params.id);
    if (!exp) return res.status(404).json({ error: 'Expérience non trouvée' });
    await exp.update(req.body);
    res.json(exp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/experiences/:id', async (req, res) => {
  try {
    const exp = await Experience.findByPk(req.params.id);
    if (!exp) return res.status(404).json({ error: 'Expérience non trouvée' });
    await exp.destroy();
    res.json({ message: 'Expérience supprimée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== SKILLS ====================
app.get('/api/skills', async (req, res) => {
  try {
    const categories = await SkillCategory.findAll({
      include: [{ model: Skill, as: 'skills' }],
      order: [['id', 'ASC']],
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/skills', async (req, res) => {
  try {
    // Remplacer toutes les compétences
    await Skill.destroy({ where: {} });
    await SkillCategory.destroy({ where: {} });
    for (const cat of req.body) {
      const created = await SkillCategory.create({ category: cat.category, icon: cat.icon });
      for (const skill of cat.skills) {
        await Skill.create({ name: skill.name, level: skill.level, categoryId: created.id });
      }
    }
    const categories = await SkillCategory.findAll({
      include: [{ model: Skill, as: 'skills' }],
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== CONTACT ====================
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Champs requis manquants' });
  }
  console.log('Nouveau message de contact:', { name, email, subject, message });
  res.json({ success: true, message: 'Message reçu avec succès !' });
});

// ==================== START ====================
const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion MySQL OK');
    await sequelize.sync();
    console.log('Tables synchronisées');
    app.listen(PORT, () => {
      console.log(`Serveur portfolio demarre sur le port ${PORT}`);
    });
  } catch (err) {
    console.error('Erreur de connexion MySQL:', err.message);
    process.exit(1);
  }
};

start();
