require('dotenv').config();
const { sequelize, Project } = require('./models');

// Projets réels issus du dossier "Subito".
// github / live sont laissés vides : à compléter via l'admin si les dépôts
// ou les URLs de production doivent être affichés publiquement.
const projects = [
  {
    name: 'Numi',
    description:
      "Plateforme SaaS de comptabilité et de gestion financière pour les PME et cabinets d'expertise de la zone OHADA / UEMOA : facturation, paie, trésorerie, fiscalité (TVA, IS, CNSS / IPRES), clôture d'exercice SYSCOHADA et GED intelligente.",
    tech: ['React', 'Vite', 'Radix UI', 'Tailwind CSS'],
    github: '',
    live: '',
    featured: true,
    displayOrder: 1,
  },
  {
    name: 'Numi API',
    description:
      "API backend de la plateforme Numi construite avec Express et PostgreSQL (Sequelize) : authentification JWT, documentation Swagger et logique métier comptable.",
    tech: ['Node.js', 'Express', 'PostgreSQL', 'Sequelize', 'JWT', 'Swagger'],
    github: '',
    live: '',
    featured: false,
    displayOrder: 2,
  },
  {
    name: 'MySubito',
    description:
      "Super-app grand public de réservation de services à Dakar : tourisme, hébergement, location de voiture, billets d'avion, livraison de colis et navette aéroport, dans une interface web moderne.",
    tech: ['Next.js', 'React', 'Base44 SDK', 'Radix UI', 'Tailwind CSS'],
    github: '',
    live: '',
    featured: true,
    displayOrder: 3,
  },
  {
    name: 'Subito Business',
    description:
      "Espace business de Subito : plateforme B2B permettant aux prestataires de gérer leurs offres, réservations et paiements via un tableau de bord dédié.",
    tech: ['Next.js', 'React', 'Radix UI', 'Tailwind CSS'],
    github: '',
    live: '',
    featured: false,
    displayOrder: 4,
  },
  {
    name: 'Jolof Mapping',
    description:
      "Solution de géocodage auto-hébergée basée sur Nominatim / OpenStreetMap pour Jolof Mobility, réduisant de 80 à 90 % les coûts d'API de géolocalisation face à Google Places, avec API wrapper (NestJS), cache Redis et back-office d'administration.",
    tech: ['NestJS', 'OpenStreetMap', 'Nominatim', 'Redis', 'Docker'],
    github: '',
    live: '',
    featured: true,
    displayOrder: 5,
  },
  {
    name: 'LooY AI',
    description:
      "Tableau de bord intelligent LooY AI : interface web de visualisation cartographique et de pilotage de données en temps réel, avec cartes interactives Leaflet.",
    tech: ['React', 'Vite', 'Leaflet', 'Tailwind CSS', 'React Router'],
    github: '',
    live: '',
    featured: true,
    displayOrder: 6,
  },
  {
    name: 'LooY Admin',
    description:
      "Interface d'administration de la plateforme LooY : gestion des utilisateurs, des données cartographiques et supervision du système.",
    tech: ['React', 'Vite', 'Leaflet', 'Tailwind CSS'],
    github: '',
    live: '',
    featured: false,
    displayOrder: 7,
  },
  {
    name: 'LooY API',
    description:
      "API backend haute performance de la plateforme Looy développée en Go et conteneurisée avec Docker, exposant les services métier et la logique d'authentification.",
    tech: ['Go', 'REST API', 'Docker'],
    github: '',
    live: '',
    featured: false,
    displayOrder: 8,
  },
  {
    name: 'LooY App',
    description:
      "Application mobile Looy développée avec Flutter (iOS & Android), offrant une expérience cartographique et des services géolocalisés aux utilisateurs.",
    tech: ['Flutter', 'Dart', 'Mobile'],
    github: '',
    live: '',
    featured: false,
    displayOrder: 9,
  },
];

const seedProjects = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la base OK');

    // Crée la table Projects si elle n'existe pas, sans toucher aux autres tables.
    await Project.sync();

    // Supprime les projets existants (placeholders) puis insère les projets réels.
    await Project.destroy({ where: {}, truncate: true });
    console.log('Anciens projets supprimés');

    await Project.bulkCreate(projects);
    console.log(`${projects.length} projets insérés avec succès !`);

    process.exit(0);
  } catch (err) {
    console.error('Erreur:', err.message);
    process.exit(1);
  }
};

seedProjects();
