require('dotenv').config();
const { sequelize, Profile, Project, Experience, SkillCategory, Skill } = require('./models');

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion PostgreSQL OK');

    // Recréer les tables
    await sequelize.sync({ force: true });
    console.log('Tables créées');

    // --- Profil ---
    await Profile.create({
      name: 'Aida Diallo',
      title: 'Développeuse Full-Stack & DevOps',
      greeting: 'Bonjour, je suis',
      description:
        "Passionnée par la création d'applications web modernes, performantes et élégantes. Je conçois des solutions full-stack de bout en bout, de l'interface utilisateur jusqu'au déploiement de l'infrastructure.",
      about1:
        "Je suis Aida Diallo, développeuse full-stack basée au Sénégal. Titulaire d'une Licence en Multimédia, Internet et Communication et actuellement en Master de conception et développement d'applications web (full-stack & gaming), je conçois des applications web modernes du frontend jusqu'au déploiement.",
      about2:
        "Mon expérience couvre toute la chaîne : interfaces React / Next.js soignées et responsives, APIs robustes en Node.js, Express, Laravel ou NestJS, et bases de données MongoDB, MySQL ou PostgreSQL. J'ai également une casquette DevOps : conteneurisation Docker, cache Redis et mise en place d'infrastructures auto-hébergées.",
      about3:
        "Mon parcours en infographie (Photoshop, Illustrator, Figma) me permet d'allier rigueur technique et sens du design. Déterminée, autonome et passionnée, je m'investis pleinement dans chaque projet.",
      location: 'Saly Carrefour, Sénégal',
      specialty: 'Développement Full-Stack & DevOps',
      availability: 'Ouverte aux opportunités',
      email: 'daida7118@gmail.com',
      github: '',
      linkedin: '',
      twitter: '',
      statYears: '2+',
      statProjects: '12+',
      statTechnologies: '20+',
      statEngagement: '100%',
    });
    console.log('Profil créé');

    // --- Projets (liens volontairement vides : description seule) ---
    await Project.bulkCreate([
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
          "Projet DevOps : solution de géocodage auto-hébergée basée sur Nominatim / OpenStreetMap pour Jolof Mobility, réduisant de 80 à 90 % les coûts d'API de géolocalisation face à Google Places. Conception d'une API wrapper (NestJS), mise en place d'un cache Redis, conteneurisation Docker et back-office d'administration.",
        tech: ['NestJS', 'Docker', 'Redis', 'Nominatim', 'OpenStreetMap'],
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
          "API backend haute performance de la plateforme LooY développée en Go et conteneurisée avec Docker, exposant les services métier et la logique d'authentification.",
        tech: ['Go', 'REST API', 'Docker'],
        github: '',
        live: '',
        featured: false,
        displayOrder: 8,
      },
      {
        name: 'LooY App',
        description:
          "Application mobile LooY développée avec Flutter (iOS & Android), offrant une expérience cartographique et des services géolocalisés aux utilisateurs.",
        tech: ['Flutter', 'Dart', 'Mobile'],
        github: '',
        live: '',
        featured: false,
        displayOrder: 9,
      },
      {
        name: "OPA'S IMMO",
        description:
          "Site web complet de l'agence immobilière OPA'S IMMO (Nianing, Mbour). Plateforme full-stack : recherche et présentation de biens, articles, services et messagerie, avec un espace d'administration dédié. Frontend Next.js et API Express / Prisma sur Supabase (PostgreSQL).",
        tech: ['Next.js', 'Express', 'Prisma', 'Supabase', 'PostgreSQL'],
        github: '',
        live: '',
        featured: true,
        displayOrder: 10,
      },
      {
        name: 'Global Business Immo',
        description:
          "Plateforme immobilière full-stack : catalogue de biens (vente / location), fiches détaillées avec galeries photos (Cloudinary), tableau de bord d'administration et notifications par email. Frontend React / Vite (Material UI, React Query) et API Node.js / Express / Sequelize (MySQL). Déployée en auto-hébergement sur VPS Hostinger, domaine OVHcloud et Cloudflare.",
        tech: ['React', 'Vite', 'Material UI', 'Node.js', 'Express', 'Sequelize', 'MySQL', 'Cloudinary'],
        github: '',
        live: '',
        featured: true,
        displayOrder: 11,
      },
      {
        name: 'Jolof Admin',
        description:
          "Espace d'administration de la plateforme VTC Jolof (Dakar) : supervision en temps réel (KPI, carte interactive, surge, chauffeurs, alertes SOS), gestion des notifications et authentification sécurisée. Développé en Next.js (App Router), TypeScript et Tailwind CSS.",
        tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Google Maps'],
        github: '',
        live: '',
        featured: false,
        displayOrder: 12,
      },
      {
        name: 'Jolof Partner',
        description:
          "Back-office partenaire de la flotte VTC Jolof (Dakar & régions) : gestion des chauffeurs, des véhicules, du wallet, de la tarification et des accès collaborateurs. Développé en Next.js, React, TypeScript, Tailwind CSS et Leaflet, conteneurisé avec Docker.",
        tech: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Leaflet', 'Docker'],
        github: '',
        live: '',
        featured: false,
        displayOrder: 13,
      },
    ]);
    console.log('Projets créés');

    // --- Expériences ---
    await Experience.bulkCreate([
      {
        period: 'Février 2025 — Présent',
        role: 'Développeuse Full-Stack & DevOps',
        company: 'Subito',
        description:
          "Développement d'applications web et de plateformes SaaS de bout en bout au sein de l'écosystème Subito (Numi, MySubito, LooY, Jolof Mobility). Conception d'interfaces React / Next.js, développement d'APIs (Node.js, NestJS, Go) et mise en place d'infrastructures DevOps : conteneurisation Docker, cache Redis et solution de géocodage auto-hébergée (Nominatim / OpenStreetMap) réduisant les coûts d'API jusqu'à 90 %.",
        tags: ['React', 'Next.js', 'Node.js', 'NestJS', 'Docker', 'Redis', 'PostgreSQL'],
        displayOrder: 1,
      },
      {
        period: '2024 — 2025',
        role: 'Stagiaire en Développement Web',
        company: 'Volkeno',
        description:
          "Participation à des projets web en équipe. Intégration de maquettes avec HTML, CSS, React et Laravel, et collaboration étroite avec les développeurs et designers de l'entreprise.",
        tags: ['HTML', 'CSS', 'React', 'Laravel'],
        displayOrder: 2,
      },
      {
        period: '2024',
        role: 'Développeuse Full-Stack — Projet e-learning',
        company: 'Bakeli School of Technology',
        description:
          "Création d'un site web e-learning dans le cadre du projet de validation de fin de formation. Responsable du développement frontend (React, Bootstrap) avec participation au backend (Node.js, MongoDB) : API, base de données et conception d'une interface fluide, responsive et accessible.",
        tags: ['React', 'Bootstrap', 'Node.js', 'MongoDB'],
        displayOrder: 3,
      },
      {
        period: '2024 — 2025',
        role: "Projet de fin d'études — Site WordPress",
        company: 'Licence MIC — Université Cheikh Hamidou Kane (ex-UVS)',
        description:
          "Rédaction du cahier des charges détaillant les besoins fonctionnels et techniques, amélioration du design et de l'ergonomie d'un site WordPress pour une meilleure expérience utilisateur, et rédaction du mémoire de fin d'études présentant la démarche de conception et les choix techniques.",
        tags: ['WordPress', 'UX/UI', 'Gestion de projet'],
        displayOrder: 4,
      },
      {
        period: '2023',
        role: 'Projet audiovisuel — Brief documentaire',
        company: 'Projet universitaire',
        description:
          "Réalisation d'un reportage vidéo sur d'anciens étudiants devenus entrepreneurs dans l'infographie : conduite d'interviews, montage avec Adobe Premiere Pro, travail d'équipe et gestion de projet.",
        tags: ['Adobe Premiere Pro', 'Montage vidéo', 'Gestion de projet'],
        displayOrder: 5,
      },
    ]);
    console.log('Expériences créées');

    // --- Compétences ---
    const frontend = await SkillCategory.create({ category: 'Front-End', icon: 'code' });
    const backend = await SkillCategory.create({ category: 'Back-End', icon: 'server' });
    const devops = await SkillCategory.create({ category: 'DevOps & Cloud', icon: 'cloud' });
    const mobile = await SkillCategory.create({ category: 'Développement Mobile', icon: 'mobile' });
    const design = await SkillCategory.create({ category: 'Design & Infographie', icon: 'design' });
    const langues = await SkillCategory.create({ category: 'Langues & Bureautique', icon: 'globe' });

    await Skill.bulkCreate([
      // Front-End
      { name: 'HTML5 / CSS3', level: 5, categoryId: frontend.id },
      { name: 'JavaScript / ES6+', level: 5, categoryId: frontend.id },
      { name: 'React.js', level: 4, categoryId: frontend.id },
      { name: 'Next.js', level: 4, categoryId: frontend.id },
      { name: 'Bootstrap', level: 4, categoryId: frontend.id },
      { name: 'Tailwind CSS', level: 4, categoryId: frontend.id },
      { name: 'Styled-components', level: 4, categoryId: frontend.id },
      { name: 'TypeScript', level: 3, categoryId: frontend.id },

      // Back-End
      { name: 'Node.js', level: 4, categoryId: backend.id },
      { name: 'Express.js', level: 4, categoryId: backend.id },
      { name: 'Laravel', level: 4, categoryId: backend.id },
      { name: 'Filament', level: 3, categoryId: backend.id },
      { name: 'NestJS', level: 3, categoryId: backend.id },
      { name: 'MongoDB', level: 4, categoryId: backend.id },
      { name: 'MySQL', level: 4, categoryId: backend.id },
      { name: 'PostgreSQL', level: 3, categoryId: backend.id },

      // DevOps & Cloud
      { name: 'Docker', level: 3, categoryId: devops.id },
      { name: 'Redis', level: 3, categoryId: devops.id },
      { name: 'Linux', level: 3, categoryId: devops.id },
      { name: 'Git / GitHub', level: 5, categoryId: devops.id },
      { name: 'Déploiement (Vercel / Render)', level: 4, categoryId: devops.id },
      { name: 'VPS Hostinger', level: 4, categoryId: devops.id },
      { name: 'OVHcloud (domaines / DNS)', level: 4, categoryId: devops.id },
      { name: 'Cloudflare', level: 4, categoryId: devops.id },

      // Développement Mobile
      { name: 'Flutter', level: 4, categoryId: mobile.id },
      { name: 'Dart', level: 4, categoryId: mobile.id },
      { name: 'Android & iOS', level: 4, categoryId: mobile.id },
      { name: 'Apps multiplateformes', level: 4, categoryId: mobile.id },

      // Design & Infographie
      { name: 'Photoshop', level: 4, categoryId: design.id },
      { name: 'Illustrator', level: 4, categoryId: design.id },
      { name: 'After Effects', level: 3, categoryId: design.id },
      { name: 'Adobe Premiere Pro', level: 3, categoryId: design.id },
      { name: 'Figma', level: 4, categoryId: design.id },
      { name: 'Canva', level: 4, categoryId: design.id },
      { name: 'WordPress', level: 4, categoryId: design.id },

      // Langues & Bureautique
      { name: 'Français (natif)', level: 5, categoryId: langues.id },
      { name: 'Anglais (débutant)', level: 2, categoryId: langues.id },
      { name: 'Word / Excel / PowerPoint', level: 4, categoryId: langues.id },
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
