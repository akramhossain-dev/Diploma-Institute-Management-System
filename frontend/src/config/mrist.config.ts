/**
 * mrist.config.ts
 *
 * Central MRIST public content configuration.
 * All public pages and components should consume from here.
 * This is the single source of truth for institute identity.
 *
 * Based on: Dr. Mahbubur Rahman Mollah Institute of Science and Technology
 * Official site: https://mrist.edu.bd
 */

export const MRIST = {
  // ── Identity ──────────────────────────────────────────────────────────────
  fullName: 'Dr. Mahbubur Rahman Mollah Institute of Science and Technology',
  shortName: 'MRIST',
  tagline: 'আমরা আগামীর — Building Tomorrow\'s Engineers',
  taglineEn: 'Building Tomorrow\'s Engineers',
  established: '2021',
  type: 'Polytechnic Institute',
  program: '4-Year Diploma in Engineering',
  affiliation: 'Bangladesh Technical Education Board (BTEB)',
  affiliationShort: 'BTEB',
  ministry: 'Ministry of Education, Government of Bangladesh',
  emisCode: 'MRIST-2021-DHA',

  // ── Contact ───────────────────────────────────────────────────────────────
  contact: {
    address: '64 No. Ward, Matuail, Demra Road, Jatrabari, Dhaka-1362, Bangladesh',
    addressShort: 'Matuail, Jatrabari, Dhaka-1362',
    phone: '+880 1234-567890',
    phone2: '+880 9876-543210',
    email: 'info@mrist.edu.bd',
    admissionEmail: 'admission@mrist.edu.bd',
    website: 'https://mrist.edu.bd',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.9025305834!2d90.44601931498187!3d23.711419684588!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b39d9f0001%3A0x89cd5e54e54e5e54!2sJatrabari%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd',
  },

  // ── Social Links ──────────────────────────────────────────────────────────
  social: {
    facebook: 'https://facebook.com/mrist.edu.bd',
    youtube: 'https://youtube.com/@mrist',
  },

  // ── About / History ───────────────────────────────────────────────────────
  about: {
    intro:
      'MRIST is one of the best polytechnic institutes in Dhaka, Bangladesh. MRIST is a very well-known institute for developing skilled engineers in different sectors and also for professional and leadership development training programs.',
    history:
      'Dr. Mahbubur Rahman Mollah Institute of Science and Technology (MRIST) was established in 2021 with a visionary mission to provide world-class technical education to the youth of Bangladesh. Founded by a group of dedicated educators and industry leaders, MRIST began its journey in Jatrabari, Dhaka with a commitment to academic excellence and hands-on engineering education. Since its inception, the institute has rapidly grown into one of the most recognized polytechnic institutes in the country, affiliated with the Bangladesh Technical Education Board (BTEB) under the Ministry of Education.',
    mission:
      'To deliver high-quality technical education through modern curricula, experienced faculty, and state-of-the-art laboratory infrastructure — equipping students with real-world engineering competencies, professional values, and entrepreneurial vision to serve Bangladesh and the global economy.',
    vision:
      'To be the leading polytechnic institute in Bangladesh that transforms aspiring students into skilled, innovative, and self-reliant engineers and entrepreneurs, contributing to national development and the advancement of technology.',
    values: [
      'Academic Excellence',
      'Integrity and Transparency',
      'Practical Skill Development',
      'Industry-Academic Partnership',
      'Inclusive and Merit-based Education',
    ],
  },

  // ── At a Glance Stats ─────────────────────────────────────────────────────
  atAGlance: {
    established: '2021',
    affiliation: 'BTEB',
    programs: '5 Diploma Programs',
    departments: 5,
    classrooms: '12+',
    labs: '10+',
    seminarHall: 1,
    conferenceHall: 1,
    library: true,
    digitalLab: true,
    institutesBus: true,
    canteen: true,
    clubs: ['Computer Club', 'Science Club', 'Debating Club', 'Cultural Club', 'Sports Club'],
    totalStudents: '1,000+',
    totalFaculty: '40+',
  },

  // ── Departments / Technologies ────────────────────────────────────────────
  departments: [
    {
      code: 'CST',
      name: 'Computer Science and Technology',
      shortDesc: 'Software, networking, databases, and modern computing systems.',
      description:
        'The CST department prepares students with a strong foundation in programming, software engineering, database management, networking, and web/mobile application development. Graduates are equipped for roles in software companies, IT firms, and tech startups across Bangladesh and abroad.',
      icon: 'Monitor',
      color: 'text-[#1D4ED8]',
      bgColor: 'bg-[#DBEAFE]',
      keyAreas: ['Programming & Algorithms', 'Database Management', 'Networking & Security', 'Web & Mobile Development'],
    },
    {
      code: 'ET',
      name: 'Electrical Technology',
      shortDesc: 'Power systems, circuits, electrical machines, and energy management.',
      description:
        'The ET department covers fundamental and applied electrical engineering topics including AC/DC circuits, power systems, electrical machines, industrial wiring, and energy-efficient technologies. Students gain hands-on laboratory experience across power generation and distribution systems.',
      icon: 'Zap',
      color: 'text-[#D97706]',
      bgColor: 'bg-[#FEF3C7]',
      keyAreas: ['Power Systems', 'Electrical Machines', 'Circuit Analysis', 'Industrial Wiring'],
    },
    {
      code: 'CT',
      name: 'Civil Technology',
      shortDesc: 'Structural design, surveying, construction materials, and CAD.',
      description:
        'The CT department trains students in construction engineering, surveying techniques, structural analysis, building materials, AutoCAD drawing, and project management. Graduates work in construction companies, government infrastructure projects, and urban planning agencies.',
      icon: 'Building2',
      color: 'text-[#059669]',
      bgColor: 'bg-[#D1FAE5]',
      keyAreas: ['Structural Design', 'Surveying', 'Construction Technology', 'AutoCAD & Drafting'],
    },
    {
      code: 'MT',
      name: 'Mechanical Technology',
      shortDesc: 'Machine tools, thermodynamics, manufacturing, and industrial systems.',
      description:
        'The MT department covers thermodynamics, fluid mechanics, machine tools, manufacturing processes, and industrial automation. Students gain practical workshop experience in CNC machining, welding, casting, and precision engineering, preparing them for the manufacturing sector.',
      icon: 'Settings',
      color: 'text-[#7C3AED]',
      bgColor: 'bg-[#EDE9FE]',
      keyAreas: ['Thermodynamics', 'Machine Tools', 'Manufacturing Processes', 'Industrial Automation'],
    },
    {
      code: 'AT',
      name: 'Automobile Technology',
      shortDesc: 'Vehicle systems, engine mechanics, diagnostics, and transport engineering.',
      description:
        'The AT department provides comprehensive training in automotive engineering including engine systems, vehicle diagnostics, transmission, electrical systems, and modern hybrid/EV technologies. Graduates find opportunities in automobile workshops, transport companies, and automotive manufacturing.',
      icon: 'Car',
      color: 'text-[#DC2626]',
      bgColor: 'bg-[#FEE2E2]',
      keyAreas: ['Engine Systems', 'Vehicle Diagnostics', 'Transmission & Drive', 'Electrical & Hybrid Systems'],
    },
  ],

  // ── Facilities ───────────────────────────────────────────────────────────
  facilities: [
    { icon: 'Bus', label: 'Institute Bus', desc: 'Daily transport for students and faculty.' },
    { icon: 'FlaskConical', label: 'Enriched Labs', desc: 'Well-equipped engineering labs across all departments.' },
    { icon: 'UtensilsCrossed', label: 'Healthy Canteen', desc: 'Clean, nutritious meals at affordable prices.' },
    { icon: 'BookOpen', label: 'Central Library', desc: 'Thousands of technical books and digital resources.' },
    { icon: 'Wifi', label: 'Digital Campus', desc: 'High-speed internet and digital learning resources.' },
    { icon: 'GraduationCap', label: 'Positive Learning', desc: 'Experienced faculty committed to student excellence.' },
  ],

  // ── Why Choose MRIST ─────────────────────────────────────────────────────
  whyChoose: [
    {
      title: 'Quality Education',
      desc: 'MRIST offers well-structured programs with experienced faculty members so that students achieve a strong academic foundation in their chosen field, with a focus on practical skills and industry-relevant knowledge.',
    },
    {
      title: 'Modern Campus',
      desc: 'A modern campus with well-equipped classrooms, laboratories, library, and digital resources significantly enhances the student learning experience and promotes academic excellence.',
    },
    {
      title: 'Industry Links',
      desc: 'Strong links with industries open doors for internships, jobs, and industry collaborations, helping students transition smoothly from academic training to professional engineering careers.',
    },
    {
      title: 'Affordability & Scholarships',
      desc: 'Reasonable tuition fees, combined with merit-based scholarships and financial support programs, make quality technical education at MRIST accessible to all deserving students.',
    },
    {
      title: 'Extracurricular Activities',
      desc: 'Participation in clubs, societies, sports, and cultural events is encouraged — contributing to personal growth, leadership development, and professional networking opportunities.',
    },
    {
      title: 'BTEB Affiliation',
      desc: 'MRIST is fully affiliated with the Bangladesh Technical Education Board (BTEB), ensuring nationally recognized diploma qualifications that open pathways to further education and employment.',
    },
  ],

  // ── Admission Info ────────────────────────────────────────────────────────
  admission: {
    intro:
      'MRIST welcomes applications from students who have completed SSC or equivalent examination. Admission is merit-based and subject to Bangladesh Technical Education Board (BTEB) guidelines.',
    eligibility: [
      'Minimum SSC or equivalent (Science/General group) with GPA 2.0 or above',
      'Students from 2022 batch onwards are eligible to apply',
      'No age bar for admission',
      'Both male and female students are welcome',
    ],
    requiredDocuments: [
      'SSC Mark Sheet (attested photocopy)',
      'SSC Certificate or Admit Card',
      'Recent passport-size photograph (4 copies)',
      'Birth Certificate',
      'National ID of guardian (photocopy)',
      'Application form (available online or from institute)',
    ],
    steps: [
      { step: '01', title: 'Choose Technology', desc: 'Select your preferred technology from CST, ET, CT, MT, or AT.' },
      { step: '02', title: 'Submit Online Application', desc: 'Fill in the online admission form on the MRIST portal.' },
      { step: '03', title: 'Upload Documents', desc: 'Upload SSC marksheet, photo, and required certificates.' },
      { step: '04', title: 'Track Application Status', desc: 'Use your application ID to track status via the admission portal.' },
      { step: '05', title: 'Admission Confirmation', desc: 'Complete admission by paying the required fees after selection.' },
    ],
    helpline: '+880 1234-567890 (Available: 9 AM – 5 PM, Sun–Thu)',
    note: 'Admission is subject to BTEB regulations and seat availability. Merit list will be published as per BTEB schedule.',
  },
} as const;

export type MristDepartment = (typeof MRIST.departments)[number];
export default MRIST;
