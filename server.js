const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_DIR = path.join(__dirname, 'data');

// CORS : autorise le frontend déployé + localhost
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(o => origin.startsWith(o))) {
      callback(null, true);
    } else {
      callback(null, true); // En dev, on autorise tout
    }
  },
}));
app.use(express.json());

// --- Helpers ---
const readData = (file) => fs.readJsonSync(path.join(DATA_DIR, file));
const writeData = (file, data) => fs.writeJsonSync(path.join(DATA_DIR, file), data, { spaces: 2 });

// ==================== HEALTH CHECK ====================
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Portfolio API de Aida Diallo' });
});

// ==================== PROFILE ====================
app.get('/api/profile', (req, res) => {
  res.json(readData('profile.json'));
});

app.put('/api/profile', (req, res) => {
  const profile = { ...readData('profile.json'), ...req.body };
  writeData('profile.json', profile);
  res.json(profile);
});

// ==================== PROJECTS ====================
app.get('/api/projects', (req, res) => {
  res.json(readData('projects.json'));
});

app.get('/api/projects/:id', (req, res) => {
  const projects = readData('projects.json');
  const project = projects.find(p => p.id === parseInt(req.params.id));
  if (!project) return res.status(404).json({ error: 'Projet non trouvé' });
  res.json(project);
});

app.post('/api/projects', (req, res) => {
  const projects = readData('projects.json');
  const newProject = {
    id: projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1,
    name: req.body.name || '',
    description: req.body.description || '',
    tech: req.body.tech || [],
    github: req.body.github || '',
    live: req.body.live || '',
    featured: req.body.featured || false,
  };
  projects.push(newProject);
  writeData('projects.json', projects);
  res.status(201).json(newProject);
});

app.put('/api/projects/:id', (req, res) => {
  const projects = readData('projects.json');
  const index = projects.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Projet non trouvé' });
  projects[index] = { ...projects[index], ...req.body, id: projects[index].id };
  writeData('projects.json', projects);
  res.json(projects[index]);
});

app.delete('/api/projects/:id', (req, res) => {
  let projects = readData('projects.json');
  const index = projects.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Projet non trouvé' });
  projects.splice(index, 1);
  writeData('projects.json', projects);
  res.json({ message: 'Projet supprimé' });
});

// ==================== EXPERIENCES ====================
app.get('/api/experiences', (req, res) => {
  res.json(readData('experiences.json'));
});

app.post('/api/experiences', (req, res) => {
  const experiences = readData('experiences.json');
  const newExp = {
    id: experiences.length > 0 ? Math.max(...experiences.map(e => e.id)) + 1 : 1,
    period: req.body.period || '',
    role: req.body.role || '',
    company: req.body.company || '',
    description: req.body.description || '',
    tags: req.body.tags || [],
  };
  experiences.push(newExp);
  writeData('experiences.json', experiences);
  res.status(201).json(newExp);
});

app.put('/api/experiences/:id', (req, res) => {
  const experiences = readData('experiences.json');
  const index = experiences.findIndex(e => e.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Expérience non trouvée' });
  experiences[index] = { ...experiences[index], ...req.body, id: experiences[index].id };
  writeData('experiences.json', experiences);
  res.json(experiences[index]);
});

app.delete('/api/experiences/:id', (req, res) => {
  let experiences = readData('experiences.json');
  const index = experiences.findIndex(e => e.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Expérience non trouvée' });
  experiences.splice(index, 1);
  writeData('experiences.json', experiences);
  res.json({ message: 'Expérience supprimée' });
});

// ==================== SKILLS ====================
app.get('/api/skills', (req, res) => {
  res.json(readData('skills.json'));
});

app.put('/api/skills', (req, res) => {
  writeData('skills.json', req.body);
  res.json(req.body);
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

app.listen(PORT, () => {
  console.log(`Serveur portfolio demarre sur le port ${PORT}`);
});
