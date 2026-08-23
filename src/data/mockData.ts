import { Subject, ResourceDocument, ResourceRequest, UserProfile } from '../types';

export const SUBJECTS_DATA: Subject[] = [
  {
    id: 'math-4024',
    name: 'Mathematics D',
    syllabusCode: '4024',
    level: 'O Level',
    tagline: 'Complete syllabus notes, worksheets, and past papers organized for effective O Level preparation.',
    description: 'A precision archive of O Level academic resources. Structured for rigor, designed for clarity.',
    pattern: 'math',
    documentCount: 142,
    directories: ['Notes', 'Worksheets', 'Yearlies', 'Past Papers', 'Marking Schemes', 'Topical Past Papers'],
    topics: ['Algebra & Functions', 'Trigonometry', 'Coordinate Geometry', 'Vectors & Transformations', 'Probability & Statistics', 'Number Sequences'],
    popularResources: ['Algebra Notes.pdf', 'Trigonometry Worksheet.pdf', 'Past Paper June 2023.pdf']
  },
  {
    id: 'physics-5054',
    name: 'Physics',
    syllabusCode: '5054',
    level: 'O Level',
    tagline: 'Curated essential past papers, revision notes, and marking schemes organizing physics concepts.',
    description: 'Curate essential past papers, and marking schemes, organizing into a coherent archive for focused study.',
    pattern: 'physics',
    documentCount: 89,
    directories: ['Notes', 'Worksheets', 'Yearlies', 'Past Papers', 'Marking Schemes', 'Topical Past Papers'],
    topics: ['Kinematics & Dynamics', 'Forces & Energy', 'Thermal Physics', 'Waves & Optics', 'Electricity & Magnetism', 'Nuclear Physics'],
    popularResources: ['Physics - Forces Topic Notes.pdf', 'Kinematics Summary & Worked Examples.pdf', 'Physics Past Paper 2022.pdf']
  },
  {
    id: 'chemistry-5070',
    name: 'Chemistry',
    syllabusCode: '5070',
    level: 'O Level',
    tagline: 'Reaction mechanisms, stoichiometry, qualitative analysis, and comprehensive formula sheets.',
    description: 'Master organic synthesis, moles calculation, chemical energetics, and periodic trends.',
    pattern: 'chemistry',
    documentCount: 96,
    directories: ['Notes', 'Worksheets', 'Yearlies', 'Past Papers', 'Marking Schemes'],
    topics: ['Stoichiometry & Moles', 'Organic Chemistry', 'Acids, Bases & Salts', 'Electrochemistry', 'Chemical Energetics', 'Metals & Metallurgy'],
    popularResources: ['Chemistry - Organic Compounds Summary.pdf', 'Qualitative Analysis Identification Chart.pdf', 'Mole Concept Master Notes.pdf']
  },
  {
    id: 'biology-5090',
    name: 'Biology',
    syllabusCode: '5090',
    level: 'O Level',
    tagline: 'Biology revision and compact past notes, essential past notes, and marking microscope.',
    description: 'In-depth diagrams, cellular biology summaries, physiology flowcharts, and genetics drills.',
    pattern: 'biology',
    documentCount: 112,
    directories: ['Notes', 'Worksheets', 'Yearlies', 'Past Papers', 'Marking Schemes'],
    topics: ['Cell Structure & Transport', 'Enzymes & Nutrition', 'Human Physiology', 'Plant Transport & Photosynthesis', 'Genetics & Inheritance', 'Ecology'],
    popularResources: ['Biology - Past Papers Archive (2018-2022).pdf', 'Human Circulatory & Respiratory Systems.pdf', 'Genetics & Punnett Squares.pdf']
  },
  {
    id: 'cs-2210',
    name: 'Computer Science',
    syllabusCode: '2210',
    level: 'O Level',
    tagline: 'Logic gates, Boolean algebra, algorithms, Python pseudocode, and computer architecture.',
    description: 'Hardware concepts, data representation, logic circuits, and algorithmic problem solving.',
    pattern: 'cs',
    documentCount: 78,
    directories: ['Notes', 'Worksheets', 'Yearlies', 'Past Papers', 'Topical Past Papers'],
    topics: ['Data Representation', 'Logic Gates & Boolean Algebra', 'Processor Architecture', 'Networks & Security', 'Algorithms & Flowcharts', 'Databases & SQL'],
    popularResources: ['Logic Gates & Boolean Algebra Topical Pack.pdf', 'Pseudocode Standard Reference Guide.pdf', 'Hexadecimal & Binary Conversion Notes.pdf']
  },
  {
    id: 'addmath-4037',
    name: 'Additional Mathematics',
    syllabusCode: '4037',
    level: 'O Level',
    tagline: 'Advanced calculus, binomial expansions, circular measure, and kinematic vectors.',
    description: 'Rigorous mathematical methods for candidates pursuing advanced engineering and analytical pathways.',
    pattern: 'additional_math',
    documentCount: 104,
    directories: ['Notes', 'Worksheets', 'Yearlies', 'Past Papers', 'Marking Schemes'],
    topics: ['Differentiation & Applications', 'Integration & Area under Curves', 'Binomial Theorem', 'Trigonometric Identities & Equations', 'Permutations & Combinations', 'Logarithms & Indices'],
    popularResources: ['Revision notes for Kinematics and Integration.pdf', 'Calculus Mastery Compendium.pdf', 'Vectors & Circular Measure.pdf']
  },
  {
    id: 'english-1123',
    name: 'English Language',
    syllabusCode: '1123',
    level: 'O Level',
    tagline: 'Directed writing formats, reading comprehension techniques, summary writing, and exemplar essays.',
    description: 'Editorial vocabulary banks, discursive writing templates, narrative structures, and mark schemes.',
    pattern: 'english',
    documentCount: 65,
    directories: ['Notes', 'Worksheets', 'Past Papers', 'Marking Schemes'],
    topics: ['Directed Writing (Letters, Reports, Speeches)', 'Narrative & Descriptive Essays', 'Summary Writing Masterclass', 'Reading Comprehension Strategies', 'Grammar & Syntax'],
    popularResources: ['Directed Writing Formats & Sample Answers.pdf', 'Summary Writing 5-Step Formula.pdf', 'High Band Vocabulary Handbook.pdf']
  },
  {
    id: 'pakstudies-2059',
    name: 'Pakistan Studies',
    syllabusCode: '2059',
    level: 'O Level',
    tagline: 'Chronological historical source analysis and economic geography case studies.',
    description: 'Complete Paper 1 timeline analysis (1600-1999) and Paper 2 natural resource distributions.',
    pattern: 'general',
    documentCount: 88,
    directories: ['Notes', 'Worksheets', 'Yearlies', 'Past Papers', 'Marking Schemes'],
    topics: ['Decline of Mughals & British Rule', 'Sir Syed & Pakistan Movement', 'Post-1947 Political History', 'Topography & Climate', 'Water Resources & Agriculture', 'Industrial Development'],
    popularResources: ['Complete Paper 1 4-7-14 Mark Questions Bank.pdf', 'Geography Map Skills & Climate Notes.pdf', 'Sir Syed & Two Nation Theory.pdf']
  }
];

export const RESOURCE_DOCUMENTS: ResourceDocument[] = [
  // Mathematics 4024 documents
  {
    id: 'doc-math-algebra',
    title: 'Algebra Notes.pdf',
    filename: 'Algebra Notes.pdf',
    subjectId: 'math-4024',
    subjectName: 'Mathematics D',
    syllabusCode: '4024',
    directory: 'Notes',
    topic: 'Algebra & Functions',
    fileType: 'PDF',
    size: '2.4 MB',
    updatedAt: 'Updated Oct 12, 2023',
    uploadGroup: 'recently_added',
    downloadCount: 1420,
    description: 'Comprehensive notes on algebraic manipulation, simultaneous equations, quadratic formulae, and algebraic fractions.',
    pageCount: 28,
    solvedStatus: 'Fully Solved',
    previewSnippet: [
      '1. Quadratic Equations: Standard form ax² + bx + c = 0',
      '2. Factorization Techniques: Difference of two squares, splitting middle term, grouping.',
      '3. Quadratic Formula: x = (-b ± √(b² - 4ac)) / (2a)',
      '4. Algebraic Fractions: Finding common denominator, LCM simplification, and restrictions on domain.'
    ]
  },
  {
    id: 'doc-math-trig',
    title: 'Trigonometry Worksheet.pdf',
    filename: 'Trigonometry Worksheet.pdf',
    subjectId: 'math-4024',
    subjectName: 'Mathematics D',
    syllabusCode: '4024',
    directory: 'Worksheets',
    topic: 'Trigonometry',
    fileType: 'PDF',
    size: '1.1 MB',
    updatedAt: 'Updated Sep 05, 2023',
    uploadGroup: 'recently_added',
    downloadCount: 980,
    description: 'Practice problems covering Sine Rule, Cosine Rule, Bearings, 3D Trigonometry, and Angle of Elevation/Depression.',
    pageCount: 16,
    solvedStatus: 'Marking Scheme Attached',
    previewSnippet: [
      'Question 1: In triangle ABC, AB = 8.5 cm, BC = 12.2 cm and angle B = 64°. Calculate length AC.',
      'Question 2: An observer at point P sees a tower on a bearing of 048°. The angle of elevation of the top of the tower is 28°...',
      'Question 3: Three-dimensional coordinate geometry and spatial diagonals calculations.'
    ]
  },
  {
    id: 'doc-math-pp-2023',
    title: 'Past Paper June 2023.pdf',
    filename: 'Past Paper June 2023.pdf',
    subjectId: 'math-4024',
    subjectName: 'Mathematics D',
    syllabusCode: '4024',
    directory: 'Past Papers',
    topic: 'Yearlies',
    fileType: 'PDF',
    size: '5.6 MB',
    updatedAt: 'Updated Jun 20, 2023',
    uploadGroup: 'earlier',
    downloadCount: 3240,
    description: 'Cambridge O Level Mathematics (Syllabus D) 4024/12 & 4024/22 May/June 2023 official examination paper with marking scheme.',
    pageCount: 32,
    year: '2023',
    session: 'May/June',
    solvedStatus: 'Fully Solved',
    previewSnippet: [
      'Paper 1 (Non-Calculator) — 80 Marks, 2 Hours',
      'Paper 2 (Calculator) — 100 Marks, 2 Hours 30 Minutes',
      'Examiner Report & Common Pitfalls Commentary Included.'
    ]
  },
  {
    id: 'doc-math-vectors',
    title: 'Vectors & Transformations Notes.pdf',
    filename: 'Vectors & Transformations Notes.pdf',
    subjectId: 'math-4024',
    subjectName: 'Mathematics D',
    syllabusCode: '4024',
    directory: 'Notes',
    topic: 'Vectors & Transformations',
    fileType: 'PDF',
    size: '3.1 MB',
    updatedAt: 'Updated Nov 02, 2023',
    uploadGroup: 'recently_added',
    downloadCount: 840,
    description: 'Column vectors, magnitude calculations, parallel vector proofs, matrix transformations (reflections, rotations, shears, enlargements).',
    pageCount: 22
  },
  {
    id: 'doc-math-stats',
    title: 'Maths - Statistics Worksheet.pdf',
    filename: 'Maths - Statistics Worksheet.pdf',
    subjectId: 'math-4024',
    subjectName: 'Mathematics D',
    syllabusCode: '4024',
    directory: 'Worksheets',
    topic: 'Probability & Statistics',
    fileType: 'PDF',
    size: '1.8 MB',
    updatedAt: 'Uploaded 5 days ago',
    uploadGroup: 'recently_added',
    downloadCount: 650,
    description: 'Histograms with unequal class intervals, cumulative frequency curves, box-and-whisker plots, interquartile ranges, and probability trees.'
  },

  // Physics 5054 documents
  {
    id: 'doc-phys-forces',
    title: 'Physics - Forces Topic Notes.pdf',
    filename: 'Physics - Forces Topic Notes.pdf',
    subjectId: 'physics-5054',
    subjectName: 'Physics',
    syllabusCode: '5054',
    directory: 'Notes',
    topic: 'Forces & Energy',
    fileType: 'PDF',
    size: '3.4 MB',
    updatedAt: 'Uploaded 2 days ago',
    uploadGroup: 'recently_added',
    downloadCount: 1820,
    description: 'Newton’s three laws of motion, friction, terminal velocity calculations, moments, center of mass, Hooke’s Law, and pressure.',
    pageCount: 24,
    previewSnippet: [
      '1. Resultant Force: F = ma (where mass is in kg, acceleration in m/s²).',
      '2. Principle of Moments: For an object in rotational equilibrium, Clockwise Moments = Anticlockwise Moments.',
      '3. Hooke’s Law: F = kx (valid up to the limit of proportionality).'
    ]
  },
  {
    id: 'doc-phys-pp-2022',
    title: 'Physics - Past Paper 2022.pdf',
    filename: 'Physics - Past Paper 2022.pdf',
    subjectId: 'physics-5054',
    subjectName: 'Physics',
    syllabusCode: '5054',
    directory: 'Past Papers',
    topic: 'Yearlies',
    fileType: 'PDF',
    size: '4.8 MB',
    updatedAt: 'May/June 2022',
    uploadGroup: 'earlier',
    downloadCount: 2950,
    year: '2022',
    session: 'May/June',
    description: 'Official Cambridge O Level Physics 5054 Paper 1 MCQ, Paper 2 Theory, and Paper 4 Alternative to Practical with verified marking schemes.'
  },
  {
    id: 'doc-phys-waves',
    title: 'Waves & Light Optics Summary.pdf',
    filename: 'Waves & Light Optics Summary.pdf',
    subjectId: 'physics-5054',
    subjectName: 'Physics',
    syllabusCode: '5054',
    directory: 'Notes',
    topic: 'Waves & Optics',
    fileType: 'PDF',
    size: '2.9 MB',
    updatedAt: 'Updated Aug 14, 2023',
    uploadGroup: 'earlier',
    downloadCount: 1140,
    description: 'Transverse vs Longitudinal waves, Snell’s Law n = sin(i)/sin(r), critical angle calculation, thin converging lens ray diagrams.'
  },

  // Chemistry 5070 documents
  {
    id: 'doc-chem-organic',
    title: 'Chemistry - Organic Compounds Summary.pdf',
    filename: 'Chemistry - Organic Compounds Summary.pdf',
    subjectId: 'chemistry-5070',
    subjectName: 'Chemistry',
    syllabusCode: '5070',
    directory: 'Notes',
    topic: 'Organic Chemistry',
    fileType: 'PDF',
    size: '4.1 MB',
    updatedAt: 'Uploaded 8 days ago',
    uploadGroup: 'last_week',
    downloadCount: 1630,
    description: 'Alkanes, Alkenes, Alcohols, Carboxylic Acids, Esters, Synthetic and Natural Polymers (Nylon, Terylene, Proteins). Full reaction pathways.',
    pageCount: 30,
    previewSnippet: [
      'Homologous Series: Same functional group, same general formula, gradation in physical properties.',
      'Addition Polymerization: Ethene monomer -> Poly(ethene).',
      'Condensation Polymerization: Dicarboxylic acid + Diol -> Polyester + H2O.'
    ]
  },
  {
    id: 'doc-chem-moles',
    title: 'Stoichiometry & Mole Calculations.pdf',
    filename: 'Stoichiometry & Mole Calculations.pdf',
    subjectId: 'chemistry-5070',
    subjectName: 'Chemistry',
    syllabusCode: '5070',
    directory: 'Worksheets',
    topic: 'Stoichiometry & Moles',
    fileType: 'PDF',
    size: '1.9 MB',
    updatedAt: 'Updated Sep 20, 2023',
    uploadGroup: 'earlier',
    downloadCount: 1480,
    description: 'Step-by-step mole calculation drills: Molar gas volume (24 dm³ at rtp), percentage yield, limiting reagents, and titration mathematics.'
  },

  // Biology 5090 documents
  {
    id: 'doc-bio-pp-archive',
    title: 'Biology - Past Papers Archive (2018-2022).pdf',
    filename: 'Biology - Past Papers Archive (2018-2022).pdf',
    subjectId: 'biology-5090',
    subjectName: 'Biology',
    syllabusCode: '5090',
    directory: 'Past Papers',
    topic: 'Yearlies',
    fileType: 'PDF',
    size: '8.4 MB',
    updatedAt: 'Uploaded 10 days ago',
    uploadGroup: 'last_week',
    downloadCount: 2410,
    description: 'Curated 5-year chronological archive of Cambridge 5090 Paper 1, Paper 2, and Paper 6 with examiner mark schemes and model answer annotations.'
  },
  {
    id: 'doc-bio-cell',
    title: 'Cell Structure & Plant Physiology.pdf',
    filename: 'Cell Structure & Plant Physiology.pdf',
    subjectId: 'biology-5090',
    subjectName: 'Biology',
    syllabusCode: '5090',
    directory: 'Notes',
    topic: 'Cell Structure & Transport',
    fileType: 'PDF',
    size: '3.2 MB',
    updatedAt: 'Updated Jul 18, 2023',
    uploadGroup: 'earlier',
    downloadCount: 970,
    description: 'Organelles (mitochondria, ribosomes, chloroplasts), Osmosis, Active Transport, Xylem and Phloem translocation, Stomatal regulation.'
  },

  // Computer Science 2210 documents
  {
    id: 'doc-cs-logic',
    title: 'Logic Gates & Boolean Algebra Topical Pack.pdf',
    filename: 'Logic Gates & Boolean Algebra Topical Pack.pdf',
    subjectId: 'cs-2210',
    subjectName: 'Computer Science',
    syllabusCode: '2210',
    directory: 'Topical Past Papers',
    topic: 'Logic Gates & Boolean Algebra',
    fileType: 'PDF',
    size: '2.6 MB',
    updatedAt: 'Updated Oct 28, 2023',
    uploadGroup: 'recently_added',
    downloadCount: 1190,
    description: 'AND, OR, NOT, NAND, NOR, XOR truth tables, truth table construction from problem statements, and Boolean logic algebraic simplification.'
  },

  // Additional Mathematics 4037 documents
  {
    id: 'doc-addmath-calc',
    title: 'Revision notes for Kinematics and Integration.pdf',
    filename: 'Revision notes for Kinematics and Integration.pdf',
    subjectId: 'addmath-4037',
    subjectName: 'Additional Mathematics',
    syllabusCode: '4037',
    directory: 'Notes',
    topic: 'Integration & Area under Curves',
    fileType: 'PDF',
    size: '3.8 MB',
    updatedAt: 'Updated Sep 12, 2023',
    uploadGroup: 'earlier',
    downloadCount: 1750,
    description: 'Integration by substitution, definite integrals, displacement s = ∫v dt, velocity v = ∫a dt, particle motion turning points, and shaded area calculation.'
  }
];

export const INITIAL_REQUESTS: ResourceRequest[] = [
  {
    id: 'req-1',
    subjectType: 'existing',
    subjectName: 'Computer Science (2210)',
    syllabusCode: '2210',
    details: 'Topical past papers for Logic Gates and Boolean Algebra.',
    categoryTag: 'Topical Past Papers',
    requestedAt: 'Requested on Oct 24, 2023',
    status: 'In Progress',
    requesterEmail: 'ayyanh34@gmail.com'
  },
  {
    id: 'req-2',
    subjectType: 'existing',
    subjectName: 'Additional Mathematics (4037)',
    syllabusCode: '4037',
    details: 'Revision notes for Kinematics and Integration.',
    categoryTag: 'Revision Notes',
    requestedAt: 'Requested on Sep 12, 2023',
    status: 'Fulfilled',
    requesterEmail: 'alex.scholar@cambridge.org'
  },
  {
    id: 'req-3',
    subjectType: 'new',
    subjectName: 'Environmental Management',
    syllabusCode: '5014',
    details: 'New subject syllabus addition request.',
    categoryTag: 'Syllabus Addition',
    requestedAt: 'Requested on Aug 05, 2023',
    status: 'Closed',
    requesterEmail: 'student.study@cambridge.org'
  },
  {
    id: 'req-4',
    subjectType: 'existing',
    subjectName: 'Urdu First Language (3247 / 3248)',
    syllabusCode: '3248',
    details: '2022 May/June & Oct/Nov complete past papers and solved translation essays.',
    categoryTag: 'Past Papers',
    requestedAt: 'Requested on Nov 04, 2023',
    status: 'Under Review',
    requesterEmail: 'ayyanh34@gmail.com'
  }
];

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Alex',
  email: 'alex.scholar@cambridge.org',
  role: 'Student',
  isLoggedIn: true,
  activeSubjects: [
    {
      subjectId: 'math-4024',
      subjectName: 'Mathematics D',
      syllabusCode: '4024',
      currentTopic: 'Trigonometry',
      progressPercent: 68,
      lastAccessed: '2 hours ago'
    },
    {
      subjectId: 'physics-5054',
      subjectName: 'Physics',
      syllabusCode: '5054',
      currentTopic: 'Kinematics',
      progressPercent: 44,
      lastAccessed: 'Yesterday'
    }
  ],
  recentlyViewed: [
    {
      documentId: 'doc-math-algebra',
      title: 'Algebra Notes - Unit 3',
      subjectName: 'Math D',
      fileType: 'PDF',
      viewedAt: 'Today at 09:14'
    },
    {
      documentId: 'doc-phys-pp-2022',
      title: 'Physics Past Paper 2023',
      subjectName: 'Physics',
      fileType: 'PDF',
      viewedAt: 'Yesterday'
    },
    {
      documentId: 'doc-bio-pp-archive',
      title: 'Biology Mark Schemes',
      subjectName: 'Folder • 12 Files',
      fileType: 'Folder',
      viewedAt: '3 days ago'
    }
  ],
  pendingRequests: [
    {
      subject: 'Urdu (3248)',
      code: '3248',
      title: '2022 Notes',
      status: 'Under Review by Archival Team'
    }
  ],
  monthlyExploredCount: 42
};
