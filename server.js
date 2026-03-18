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
        <div style="font-family: 'Georgia', 'Times New Roman', serif; max-width: 600px; margin: 0 auto; background: #faf8f5; border-radius: 16px; overflow: hidden; border: 1px solid #e8e2da;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #b08968 0%, #ddb892 100%); padding: 32px 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;">Nouveau message</h1>
            <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">depuis votre portfolio</p>
          </div>

          <!-- Body -->
          <div style="padding: 32px 24px;">
            <!-- Info cards -->
            <div style="background: #ffffff; border-radius: 12px; padding: 20px; margin-bottom: 16px; border: 1px solid #e8e2da;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #b08968; font-size: 13px; font-weight: 600; width: 80px; vertical-align: top;">Nom</td>
                  <td style="padding: 8px 0; color: #2b2b2b; font-size: 14px;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #b08968; font-size: 13px; font-weight: 600; vertical-align: top;">Email</td>
                  <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #8a6a4e; text-decoration: none; font-size: 14px;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #b08968; font-size: 13px; font-weight: 600; vertical-align: top;">Sujet</td>
                  <td style="padding: 8px 0; color: #2b2b2b; font-size: 14px;">${subject || 'Non spécifié'}</td>
                </tr>
              </table>
            </div>

            <!-- Message -->
            <div style="background: #ffffff; border-radius: 12px; padding: 20px; border: 1px solid #e8e2da;">
              <p style="color: #b08968; font-size: 13px; font-weight: 600; margin: 0 0 12px;">Message</p>
              <p style="color: #2b2b2b; font-size: 14px; line-height: 1.7; margin: 0;">${message.replace(/\n/g, '<br>')}</p>
            </div>

            <!-- Reply button -->
            <div style="text-align: center; margin-top: 24px;">
              <a href="mailto:${email}" style="display: inline-block; background: linear-gradient(135deg, #b08968 0%, #ddb892 100%); color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-size: 14px; font-weight: 600;">Repondre a ${name}</a>
            </div>
          </div>

          <!-- Footer -->
          <div style="padding: 16px 24px; text-align: center; border-top: 1px solid #e8e2da;">
            <p style="color: #9a9a9a; font-size: 12px; margin: 0;">Portfolio Aida Diallo</p>
          </div>
        </div>
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
