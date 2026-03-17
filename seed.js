require('dotenv').config();
const { sequelize, Profile, Project, Experience, SkillCategory, Skill } = require('./models');

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion MySQL OK');

    // Recréer les tables
    await sequelize.sync({ force: true });
    console.log('Tables créées');

    // --- Profil ---
    await Profile.create({
      name: 'Aida Diallo',
      title: 'Développeuse Full Stack',
      greeting: 'Bonjour, je suis',
      description: "Passionnée par la création d'expériences numériques élégantes et performantes. Je transforme les idées en solutions web modernes.",
      about1: "Je suis une développeuse passionnée par la technologie et l'innovation. Mon parcours m'a permis de développer une expertise solide dans la conception et le développement d'applications web modernes.",
      about2: "J'aime relever des défis techniques et créer des solutions élégantes qui allient performance et esthétique. Chaque projet est pour moi une opportunité d'apprendre et de repousser mes limites.",
      about3: "Mon approche se concentre sur la qualité du code, l'expérience utilisateur et les bonnes pratiques de développement.",
      location: 'Sénégal',
      specialty: 'Développement Full Stack',
      availability: 'Ouverte aux opportunités',
      email: 'votre.email@example.com',
      github: 'https://github.com/aida-diallo',
      linkedin: '',
      twitter: '',
      statYears: '2+',
      statProjects: '10+',
      statTechnologies: '5+',
      statEngagement: '100%',
    });
    console.log('Profil créé');

    // --- Projets ---
    await Project.bulkCreate([
      {
        name: 'E-Commerce Platform',
        description: "Plateforme e-commerce complète avec système de paiement intégré, gestion de panier et tableau de bord administrateur.",
        tech: JSON.stringify(['React', 'Node.js', 'MongoDB', 'Stripe']),
        github: 'https://github.com/aida-diallo',
        live: 'https://example.com',
        featured: true,
        displayOrder: 1,
      },
      {
        name: 'Application de Gestion',
        description: "Application de gestion de tâches et de projets avec authentification, collaboration en temps réel et notifications.",
        tech: JSON.stringify(['React', 'Firebase', 'Material UI', 'WebSocket']),
        github: 'https://github.com/aida-diallo',
        live: 'https://example.com',
        featured: true,
        displayOrder: 2,
      },
      {
        name: 'Portfolio Créatif',
        description: "Portfolio personnel avec design moderne, animations fluides et une expérience utilisateur immersive.",
        tech: JSON.stringify(['React', 'Framer Motion', 'CSS3', 'Express']),
        github: 'https://github.com/aida-diallo',
        live: 'https://example.com',
        featured: false,
        displayOrder: 3,
      },
      {
        name: 'API RESTful',
        description: "API backend complète avec authentification JWT, gestion des rôles et documentation Swagger intégrée.",
        tech: JSON.stringify(['Node.js', 'Express', 'PostgreSQL', 'JWT']),
        github: 'https://github.com/aida-diallo',
        live: 'https://example.com',
        featured: false,
        displayOrder: 4,
      },
    ]);
    console.log('Projets créés');

    // --- Expériences ---
    await Experience.bulkCreate([
      {
        period: '2024 — Présent',
        role: 'Développeuse Full Stack',
        company: 'Projet Personnel / Freelance',
        description: "Conception et développement d'applications web complètes. Mise en place d'architectures modernes et de solutions performantes pour divers clients.",
        tags: JSON.stringify(['React', 'Node.js', 'MongoDB', 'REST API']),
        displayOrder: 1,
      },
      {
        period: '2023 — 2024',
        role: 'Développeuse Front-End',
        company: 'Stage / Projet Académique',
        description: "Développement d'interfaces utilisateur réactives et modernes. Collaboration avec les équipes design pour créer des expériences utilisateur optimales.",
        tags: JSON.stringify(['JavaScript', 'React', 'CSS3', 'Figma']),
        displayOrder: 2,
      },
      {
        period: '2022 — 2023',
        role: 'Formation en Développement Web',
        company: 'Parcours Académique',
        description: "Apprentissage approfondi des fondamentaux du développement web, des bases de données et des méthodologies de développement agile.",
        tags: JSON.stringify(['HTML/CSS', 'JavaScript', 'Python', 'SQL']),
        displayOrder: 3,
      },
    ]);
    console.log('Expériences créées');

    // --- Compétences ---
    const frontend = await SkillCategory.create({ category: 'Front-End', icon: 'code' });
    const backend = await SkillCategory.create({ category: 'Back-End', icon: 'server' });
    const tools = await SkillCategory.create({ category: 'Outils & Autres', icon: 'tool' });

    await Skill.bulkCreate([
      { name: 'React.js', level: 4, categoryId: frontend.id },
      { name: 'JavaScript / ES6+', level: 5, categoryId: frontend.id },
      { name: 'HTML5 / CSS3', level: 5, categoryId: frontend.id },
      { name: 'TypeScript', level: 3, categoryId: frontend.id },
      { name: 'Tailwind CSS', level: 4, categoryId: frontend.id },
      { name: 'Node.js', level: 4, categoryId: backend.id },
      { name: 'Python', level: 4, categoryId: backend.id },
      { name: 'Express.js', level: 4, categoryId: backend.id },
      { name: 'MongoDB', level: 3, categoryId: backend.id },
      { name: 'MySQL', level: 4, categoryId: backend.id },
      { name: 'Git / GitHub', level: 5, categoryId: tools.id },
      { name: 'Figma', level: 3, categoryId: tools.id },
      { name: 'Docker', level: 2, categoryId: tools.id },
      { name: 'Linux', level: 3, categoryId: tools.id },
      { name: 'Méthode Agile', level: 4, categoryId: tools.id },
    ]);
    console.log('Compétences créées');

    console.log('\nSeed terminé avec succès !');
    process.exit(0);
  } catch (err) {
    console.error('Erreur:', err.message);
    process.exit(1);
  }
};

seed();
