require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Resend } = require('resend');
const { sequelize, Profile, Project, Experience, SkillCategory, Skill } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'portfolio-secret-key-change-me';

app.use(cors());
app.use(express.json());

// ==================== AUTH MIDDLEWARE ====================
const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Accès non autorisé' });
  }
  try {
    const token = header.split(' ')[1];
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};

// ==================== LOGIN ====================
app.post('/api/auth/login', async (req, res) => {
  const { password } = req.body;
  const adminHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminHash) {
    return res.status(500).json({ error: 'Mot de passe admin non configuré' });
  }

  const valid = await bcrypt.compare(password, adminHash);
  if (!valid) {
    return res.status(401).json({ error: 'Mot de passe incorrect' });
  }

  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
});

// Route utilitaire pour générer un hash (à utiliser une seule fois)
app.post('/api/auth/hash', (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Mot de passe requis' });
  const hash = bcrypt.hashSync(password, 10);
  res.json({ hash });
});

// ==================== HEALTH CHECK ====================
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Portfolio API de Aida Diallo' });
});

// ==================== PROFILE ====================
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

app.put('/api/profile', auth, async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) profile = await Profile.create({});
    const body = req.body;
    const updateData = { ...body };
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

app.post('/api/projects', auth, async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/projects/:id', auth, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ error: 'Projet non trouvé' });
    await project.update(req.body);
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/projects/:id', auth, async (req, res) => {
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

app.post('/api/experiences', auth, async (req, res) => {
  try {
    const exp = await Experience.create(req.body);
    res.status(201).json(exp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/experiences/:id', auth, async (req, res) => {
  try {
    const exp = await Experience.findByPk(req.params.id);
    if (!exp) return res.status(404).json({ error: 'Expérience non trouvée' });
    await exp.update(req.body);
    res.json(exp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/experiences/:id', auth, async (req, res) => {
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

app.put('/api/skills', auth, async (req, res) => {
  try {
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

// ==================== CONTACT (envoi par email via Resend) ====================
const resend = new Resend(process.env.RESEND_API_KEY);

app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Champs requis manquants' });
  }

  try {
    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: process.env.MAIL_TO,
      replyTo: email,
      subject: `[Portfolio] ${subject || 'Nouveau message'} - de ${name}`,
      html: `
        <h2>Nouveau message depuis votre portfolio</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Sujet :</strong> ${subject || 'Non spécifié'}</p>
        <hr />
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    res.json({ success: true, message: 'Message envoyé avec succès !' });
  } catch (err) {
    console.error('Erreur envoi email:', err.message);
    res.status(500).json({ error: 'Erreur lors de l\'envoi du message' });
  }
});

// ==================== START ====================
const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion PostgreSQL OK');
    await sequelize.sync();
    console.log('Tables synchronisées');
    app.listen(PORT, () => {
      console.log(`Serveur portfolio demarre sur le port ${PORT}`);
    });
  } catch (err) {
    console.error('Erreur de connexion:', err.message);
    process.exit(1);
  }
};

start();
