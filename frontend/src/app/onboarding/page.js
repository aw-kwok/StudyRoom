"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './onboarding.module.css';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

// Departments by school
const departmentsBySchool = {
  'The Fu Foundation School of Engineering and Applied Science (SEAS)': [
    'Applied Physics and Applied Mathematics',
    'Biomedical Engineering',
    'Chemical Engineering',
    'Civil Engineering and Engineering Mechanics',
    'Computer Science',
    'Earth and Environmental Engineering',
    'Electrical Engineering',
    'Industrial Engineering and Operations Research',
    'Mechanical Engineering',
  ],
  'Columbia College (CC)': [
    'African American and African Diaspora Studies',
    'American Studies',
    'Anthropology',
    'Art History and Archaeology',
    'Asian and Middle Eastern Cultures',
    'Astronomy',
    'Biological Sciences',
    'Chemistry',
    'Classics',
    'Comparative Literature and Society',
    'Computer Science',
    'East Asian Languages and Cultures',
    'Economics',
    'English and Comparative Literature',
    'Film and Media Studies',
    'French and Romance Philology',
    'Germanic Languages',
    'History',
    'Latin American and Iberian Cultures',
    'Mathematics',
    'Middle Eastern, South Asian, and African Studies',
    'Music',
    'Philosophy',
    'Physics',
    'Political Science',
    'Psychology',
    'Religion',
    'Slavic Languages',
    'Sociology',
    'Statistics',
    'Theatre',
    'Visual Arts',
  ],
  'School of General Studies (GS)': [
    'Same departments as Columbia College',
  ],
  'Barnard College': [
    'Africana Studies',
    'American Studies',
    'Anthropology',
    'Architecture',
    'Art History',
    'Asian and Middle Eastern Cultures',
    'Biological Sciences',
    'Chemistry',
    'Classics',
    'Comparative Literature',
    'Computer Science',
    'Dance',
    'Economics',
    'Education',
    'English',
    'Environmental Science',
    'Film Studies',
    'French',
    'German',
    'History',
    'Human Rights',
    'Italian',
    'Mathematics',
    'Music',
    'Neuroscience',
    'Philosophy',
    'Physics',
    'Political Science',
    'Psychology',
    'Religion',
    'Sociology',
    'Spanish and Latin American Cultures',
    'Statistics',
    'Theatre',
    'Urban Studies',
    'Women\'s, Gender, and Sexuality Studies',
  ],
  'Graduate School of Arts and Sciences (GSAS)': [
    'All CC departments plus graduate programs',
  ],
  'Columbia Business School (CBS)': [
    'Accounting',
    'Decision, Risk, and Operations',
    'Economics',
    'Finance',
    'Management',
    'Marketing',
  ],
  'Columbia Law School': [
    'Law',
  ],
  'Columbia Journalism School': [
    'Journalism',
  ],
  'Mailman School of Public Health': [
    'Biostatistics',
    'Environmental Health Sciences',
    'Epidemiology',
    'Health Policy and Management',
    'Population and Family Health',
    'Sociomedical Sciences',
  ],
  'School of International and Public Affairs (SIPA)': [
    'International Affairs',
    'Public Administration',
    'Public Policy',
  ],
  'Teachers College': [
    'Arts and Humanities',
    'Biobehavioral Sciences',
    'Counseling and Clinical Psychology',
    'Curriculum and Teaching',
    'Education Policy and Social Analysis',
    'Health and Behavior Studies',
    'Human Development',
    'International and Transcultural Studies',
    'Mathematics, Science and Technology',
    'Organization and Leadership',
  ],
  'Columbia University Irving Medical Center': [
    'Anesthesiology',
    'Biochemistry and Molecular Biophysics',
    'Biomedical Informatics',
    'Dermatology',
    'Genetics and Development',
    'Medicine',
    'Microbiology and Immunology',
    'Neurological Surgery',
    'Neurology',
    'Neuroscience',
    'Obstetrics and Gynecology',
    'Ophthalmology',
    'Orthopedic Surgery',
    'Otolaryngology',
    'Pathology and Cell Biology',
    'Pediatrics',
    'Pharmacology',
    'Physiology and Cellular Biophysics',
    'Psychiatry',
    'Radiation Oncology',
    'Radiology',
    'Rehabilitation and Regenerative Medicine',
    'Surgery',
    'Systems Biology',
    'Urology',
  ],
};

// Programs by department
const programsByDepartment = {
  'Computer Science': [
    'Computer Science, BA',
    'Computer Science, BS',
    'Computer Science, MS',
    'Computer Science, PhD',
  ],
  'Applied Physics and Applied Mathematics': [
    'Applied Physics, BS',
    'Applied Mathematics, BS',
    'Applied Physics, MS',
    'Applied Mathematics, MS',
    'Applied Physics, PhD',
    'Applied Mathematics, PhD',
  ],
  'Biomedical Engineering': [
    'Biomedical Engineering, BS',
    'Biomedical Engineering, MS',
    'Biomedical Engineering, PhD',
  ],
  'Chemical Engineering': [
    'Chemical Engineering, BS',
    'Chemical Engineering, MS',
    'Chemical Engineering, PhD',
  ],
  'Civil Engineering and Engineering Mechanics': [
    'Civil Engineering, BS',
    'Civil Engineering, MS',
    'Engineering Mechanics, MS',
    'Civil Engineering, PhD',
  ],
  'Earth and Environmental Engineering': [
    'Earth and Environmental Engineering, BS',
    'Earth and Environmental Engineering, MS',
    'Earth and Environmental Engineering, PhD',
  ],
  'Electrical Engineering': [
    'Electrical Engineering, BS',
    'Electrical Engineering, MS',
    'Electrical Engineering, PhD',
  ],
  'Industrial Engineering and Operations Research': [
    'Industrial Engineering, BS',
    'Operations Research, BS',
    'Industrial Engineering, MS',
    'Operations Research, MS',
    'Industrial Engineering, PhD',
  ],
  'Mechanical Engineering': [
    'Mechanical Engineering, BS',
    'Mechanical Engineering, MS',
    'Mechanical Engineering, PhD',
  ],
  'Economics': [
    'Economics, BA',
    'Economics, MA',
    'Economics, PhD',
  ],
  'Mathematics': [
    'Mathematics, BA',
    'Mathematics, MA',
    'Mathematics, PhD',
  ],
  'Physics': [
    'Physics, BA',
    'Physics, MA',
    'Physics, PhD',
  ],
  'Political Science': [
    'Political Science, BA',
    'Political Science, MA',
    'Political Science, PhD',
  ],
  'Psychology': [
    'Psychology, BA',
    'Psychology, MA',
    'Psychology, PhD',
  ],
  'Biological Sciences': [
    'Biological Sciences, BA',
    'Biological Sciences, MA',
    'Biological Sciences, PhD',
  ],
  'Chemistry': [
    'Chemistry, BA',
    'Chemistry, MA',
    'Chemistry, PhD',
  ],
  'English and Comparative Literature': [
    'English, BA',
    'Comparative Literature, BA',
    'English, MA',
    'Comparative Literature, MA',
    'English, PhD',
  ],
  'History': [
    'History, BA',
    'History, MA',
    'History, PhD',
  ],
  'Philosophy': [
    'Philosophy, BA',
    'Philosophy, MA',
    'Philosophy, PhD',
  ],
  'Sociology': [
    'Sociology, BA',
    'Sociology, MA',
    'Sociology, PhD',
  ],
  'Accounting': [
    'Accounting, MBA',
  ],
  'Finance': [
    'Finance, MBA',
    'Financial Economics, PhD',
  ],
  'Marketing': [
    'Marketing, MBA',
    'Marketing, PhD',
  ],
  'Management': [
    'Management, MBA',
    'Management, PhD',
  ],
  'Law': [
    'Juris Doctor (JD)',
    'Master of Laws (LLM)',
    'Doctor of Juridical Science (JSD)',
  ],
  'Journalism': [
    'Journalism, MS',
    'Data Journalism, MS',
    'Documentary, MA',
  ],
  'Biostatistics': [
    'Biostatistics, MPH',
    'Biostatistics, MS',
    'Biostatistics, DrPH',
    'Biostatistics, PhD',
  ],
  'Epidemiology': [
    'Epidemiology, MPH',
    'Epidemiology, MS',
    'Epidemiology, DrPH',
    'Epidemiology, PhD',
  ],
  'International Affairs': [
    'International Affairs, MIA',
  ],
  'Public Administration': [
    'Public Administration, MPA',
  ],
  'Public Policy': [
    'Public Policy, MPP',
  ],
};

export default function OnboardingPage() {
  const router = useRouter();
  
  const [school, setSchool] = useState('');
  const [department, setDepartment] = useState('');
  const [program, setProgram] = useState('');
  const [graduatingYear, setGraduatingYear] = useState('2025');
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showProgramDropdown, setShowProgramDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  
  const [skills, setSkills] = useState({
    typescript: false,
    javascript: false,
    python: false,
    dart: false,
    sql: false,
    cPlusPlus: false,
    research: false,
    html: false,
    solidworks: false,
    htmlCss: false,
    swiftUI: false,
    django: false,
  });
  
  const [preferredMethod, setPreferredMethod] = useState({
    online: false,
    synchronous: false,
    asynchronous: false,
    hybrid: false,
  });
  
  const [hobbies, setHobbies] = useState({
    design: false,
    travelling: false,
    collecting: false,
    cooking: false,
    volunteering: false,
    writing: false,
    fitness: false,
    art: false,
    skillBuilding: false,
    sports: false,
    music: false,
    gaming: false,
  });

  const [rooms, setRooms] = useState({
    mathematics: { expanded: false, courses: [] },
    physics: { expanded: false, courses: [] },
    chemistryBiology: { expanded: false, courses: [] },
    universityWriting: { expanded: false, courses: [] },
    nonTechnical: { expanded: false, courses: [] },
    technical: { expanded: false, courses: [] },
    computerScience: { expanded: false, courses: [] },
    artOfEngineering: { expanded: false, courses: [] },
    required: { expanded: false, courses: [] },
  });

  // Courses by subject
  const coursesBySubject = {
    mathematics: [
      'MATH UN1101 - Calculus I',
      'MATH UN1102 - Calculus II',
      'MATH UN1201 - Calculus III',
      'MATH UN1202 - Calculus IV',
      'MATH UN2010 - Linear Algebra',
      'MATH UN2500 - Analysis and Optimization',
      'MATH UN3007 - Complex Variables',
      'MATH UN3025 - Making, Breaking Codes',
    ],
    physics: [
      'PHYS UN1201 - General Physics I',
      'PHYS UN1202 - General Physics II',
      'PHYS UN1401 - Intro Elec/Mag, Waves',
      'PHYS UN1402 - Intro to Exp Physics',
      'PHYS UN1601 - Physics I: Mechanics',
      'PHYS UN1602 - Physics II: Thermo',
      'PHYS UN2601 - Intro to Exp Physics',
      'PHYS UN2802 - Accelerated Physics I',
    ],
    chemistryBiology: [
      'CHEM UN1403 - General Chemistry I',
      'CHEM UN1404 - General Chemistry II',
      'CHEM UN2443 - Organic Chemistry I',
      'CHEM UN2444 - Organic Chemistry II',
      'BIOL UN2005 - Intro to Cell & Molecular',
      'BIOL UN2006 - Intro to Genetics & Dev',
      'BIOL UN3004 - Biochemistry',
      'BIOL UN3041 - Cell Biology',
    ],
    universityWriting: [
      'ENGL CC1010 - University Writing',
      'ENGL CC1011 - University Writing Enhanced',
      'ENGL CC1020 - First-Year Writing',
      'ENGL CC3001 - Writing for Sciences',
    ],
    nonTechnical: [
      'ECON UN1105 - Principles of Economics',
      'PSYC UN1001 - Intro to Psychology',
      'POLS UN1501 - Intro to American Politics',
      'SOCI UN1000 - Intro to Sociology',
      'PHIL UN1001 - Intro to Philosophy',
      'HIST UN1001 - History of Western Civ I',
    ],
    technical: [
      'COMS W1004 - Intro to CS & Prog in Java',
      'COMS W3134 - Data Structures in Java',
      'COMS W3157 - Advanced Programming',
      'COMS W3203 - Discrete Mathematics',
      'COMS W3261 - Computer Science Theory',
      'CSEE W3827 - Fundamentals of Computer Systems',
    ],
    computerScience: [
      'COMS W3134 - Data Structures in Java',
      'COMS W3157 - Advanced Programming',
      'COMS W3203 - Discrete Mathematics',
      'COMS W3261 - Computer Science Theory',
      'COMS W4111 - Intro to Databases',
      'COMS W4118 - Operating Systems',
      'COMS W4170 - User Interface Design',
      'COMS W4701 - Artificial Intelligence',
      'COMS W4771 - Machine Learning',
    ],
    artOfEngineering: [
      'ENGI E1006 - Intro to Computing for Eng',
      'ENGI E1102 - Design Fund Using AE Studio',
      'ENGI E3990 - Professional Development',
      'MECE E1001 - The Art of Engineering',
    ],
    required: [
      'CORE CC1101 - Contemporary Civilization I',
      'CORE CC1102 - Contemporary Civilization II',
      'CORE CC1201 - Literature Humanities I',
      'CORE CC1202 - Literature Humanities II',
      'CORE CC3001 - Art Humanities',
      'CORE CC3002 - Music Humanities',
    ],
  };

  const toggleRoom = (roomKey) => {
    setRooms(prev => ({
      ...prev,
      [roomKey]: { ...prev[roomKey], expanded: !prev[roomKey].expanded }
    }));
  };

  const toggleCourse = (roomKey, course) => {
    setRooms(prev => {
      const currentCourses = prev[roomKey].courses;
      const newCourses = currentCourses.includes(course)
        ? currentCourses.filter(c => c !== course)
        : [...currentCourses, course];
      return {
        ...prev,
        [roomKey]: { ...prev[roomKey], courses: newCourses }
      };
    });
  };

  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedPrograms, setSelectedPrograms] = useState([]);

  const handleSchoolSelect = (schoolName) => {
    setSchool(schoolName);
    setSelectedSchool(schoolName);
    setDepartment('');
    setProgram('');
    setShowSchoolDropdown(false);
  };

  const handleDepartmentSelect = (deptName) => {
    setDepartment(deptName);
    setProgram('');
    setShowDepartmentDropdown(false);
  };

  const handleProgramSelect = (progName) => {
    setProgram(progName);
    setShowProgramDropdown(false);
  };

  const handleSkillChange = (skill) => {
    setSkills(prev => ({ ...prev, [skill]: !prev[skill] }));
  };

  const handleMethodChange = (method) => {
    setPreferredMethod(prev => ({ ...prev, [method]: !prev[method] }));
  };

  const handleHobbyChange = (hobby) => {
    setHobbies(prev => ({ ...prev, [hobby]: !prev[hobby] }));
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log('Submitting onboarding data...');
    router.push('/');
  };

  // Get departments for selected school
  const availableDepartments = selectedSchool ? departmentsBySchool[selectedSchool] || [] : [];
  
  // Get programs for selected department
  const availablePrograms = department ? programsByDepartment[department] || [] : [];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>Study Room</Link>
        <button className={styles.logoutButton} onClick={() => router.push('/signin')}>
          <LogoutIcon />
        </button>
      </header>

      <main className={styles.main}>
        <div className={styles.formContainer}>
          {/* School */}
          <div className={styles.formRow}>
            <label className={styles.label}>School</label>
            <div className={styles.inputContainer}>
              <div className={styles.searchInput} onClick={() => setShowSchoolDropdown(!showSchoolDropdown)}>
                <SearchIcon className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder=""
                  value={school}
                  onChange={(e) => {
                    setSchool(e.target.value);
                    setShowSchoolDropdown(true);
                  }}
                  className={styles.input}
                />
              </div>
              {showSchoolDropdown && (
                <div className={styles.dropdown}>
                  <p className={styles.dropdownOption} onClick={() => handleSchoolSelect('The Fu Foundation School of Engineering and Applied Science (SEAS)')}>The Fu Foundation School of Engineering and Applied Science (SEAS)</p>
                  <p className={styles.dropdownOption} onClick={() => handleSchoolSelect('Columbia College (CC)')}>Columbia College (CC)</p>
                  <p className={styles.dropdownOption} onClick={() => handleSchoolSelect('School of General Studies (GS)')}>School of General Studies (GS)</p>
                  <p className={styles.dropdownOption} onClick={() => handleSchoolSelect('Barnard College')}>Barnard College</p>
                  <p className={styles.dropdownOption} onClick={() => handleSchoolSelect('Graduate School of Arts and Sciences (GSAS)')}>Graduate School of Arts and Sciences (GSAS)</p>
                  <p className={styles.dropdownOption} onClick={() => handleSchoolSelect('Columbia Business School (CBS)')}>Columbia Business School (CBS)</p>
                  <p className={styles.dropdownOption} onClick={() => handleSchoolSelect('Columbia Law School')}>Columbia Law School</p>
                  <p className={styles.dropdownOption} onClick={() => handleSchoolSelect('Columbia Journalism School')}>Columbia Journalism School</p>
                  <p className={styles.dropdownOption} onClick={() => handleSchoolSelect('Mailman School of Public Health')}>Mailman School of Public Health</p>
                  <p className={styles.dropdownOption} onClick={() => handleSchoolSelect('School of International and Public Affairs (SIPA)')}>School of International and Public Affairs (SIPA)</p>
                  <p className={styles.dropdownOption} onClick={() => handleSchoolSelect('Teachers College')}>Teachers College</p>
                  <p className={styles.dropdownOption} onClick={() => handleSchoolSelect('Columbia University Irving Medical Center')}>Columbia University Irving Medical Center</p>
                </div>
              )}
            </div>
          </div>

          {/* Department */}
          <div className={styles.formRow}>
            <label className={styles.label}>Department</label>
            <div className={styles.inputContainer}>
              <div className={styles.searchInput} onClick={() => availableDepartments.length > 0 && setShowDepartmentDropdown(!showDepartmentDropdown)}>
                <SearchIcon className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder=""
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    setShowDepartmentDropdown(true);
                  }}
                  className={styles.input}
                />
              </div>
              {showDepartmentDropdown && availableDepartments.length > 0 && (
                <div className={styles.dropdown}>
                  {availableDepartments.map((dept, index) => (
                    <p key={index} className={styles.dropdownOption} onClick={() => handleDepartmentSelect(dept)}>{dept}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Program */}
          <div className={styles.formRow}>
            <label className={styles.label}>Program</label>
            <div className={styles.inputContainer}>
              <div className={styles.searchInput} onClick={() => availablePrograms.length > 0 && setShowProgramDropdown(!showProgramDropdown)}>
                <SearchIcon className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder=""
                  value={program}
                  onChange={(e) => {
                    setProgram(e.target.value);
                    setShowProgramDropdown(true);
                  }}
                  className={styles.input}
                />
              </div>
              {showProgramDropdown && availablePrograms.length > 0 && (
                <div className={styles.dropdown}>
                  {availablePrograms.map((prog, index) => (
                    <p key={index} className={styles.dropdownOption} onClick={() => handleProgramSelect(prog)}>{prog}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Graduating Year */}
          <div className={styles.formRow}>
            <label className={styles.label}>Graduating year</label>
            <div className={styles.inputContainer}>
              <div className={styles.yearSelector} onClick={() => setShowYearDropdown(!showYearDropdown)}>
                <span className={styles.yearText}>{graduatingYear}</span>
              </div>
              {showYearDropdown && (
                <div className={styles.dropdown}>
                  {['2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033', '2034', '2035', '2036', '2037', '2038', '2039', '2040', '2041', '2042', '2043', '2044', '2045'].map((year) => (
                    <p key={year} className={styles.dropdownOption} onClick={() => { setGraduatingYear(year); setShowYearDropdown(false); }}>{year}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          <div className={styles.formRow}>
            <label className={styles.label}>Skills</label>
            <div className={styles.checkboxGrid}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={skills.typescript} onChange={() => handleSkillChange('typescript')} className={styles.checkbox} />
                TypeScript
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={skills.sql} onChange={() => handleSkillChange('sql')} className={styles.checkbox} />
                SQL
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={skills.solidworks} onChange={() => handleSkillChange('solidworks')} className={styles.checkbox} />
                SolidWorks
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={skills.javascript} onChange={() => handleSkillChange('javascript')} className={styles.checkbox} />
                JavaScript
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={skills.cPlusPlus} onChange={() => handleSkillChange('cPlusPlus')} className={styles.checkbox} />
                C++
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={skills.htmlCss} onChange={() => handleSkillChange('htmlCss')} className={styles.checkbox} />
                HTML/CSS
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={skills.python} onChange={() => handleSkillChange('python')} className={styles.checkbox} />
                Python
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={skills.research} onChange={() => handleSkillChange('research')} className={styles.checkbox} />
                Research
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={skills.swiftUI} onChange={() => handleSkillChange('swiftUI')} className={styles.checkbox} />
                SwiftUI
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={skills.dart} onChange={() => handleSkillChange('dart')} className={styles.checkbox} />
                Dart
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={skills.html} onChange={() => handleSkillChange('html')} className={styles.checkbox} />
                HTML
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={skills.django} onChange={() => handleSkillChange('django')} className={styles.checkbox} />
                Django
              </label>
            </div>
          </div>

          {/* Preferred Method */}
          <div className={styles.formRow}>
            <label className={styles.label}>Preferred Method</label>
            <div className={styles.methodGrid}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={preferredMethod.online} onChange={() => handleMethodChange('online')} className={styles.checkbox} />
                Online
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={preferredMethod.synchronous} onChange={() => handleMethodChange('synchronous')} className={styles.checkbox} />
                Synchronous
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={preferredMethod.asynchronous} onChange={() => handleMethodChange('asynchronous')} className={styles.checkbox} />
                Asynchronous
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={preferredMethod.hybrid} onChange={() => handleMethodChange('hybrid')} className={styles.checkbox} />
                Hybrid
              </label>
            </div>
          </div>

          {/* Hobbies */}
          <div className={styles.formRow}>
            <label className={styles.label}>Hobbies</label>
            <div className={styles.checkboxGrid}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={hobbies.design} onChange={() => handleHobbyChange('design')} className={styles.checkbox} />
                Design
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={hobbies.volunteering} onChange={() => handleHobbyChange('volunteering')} className={styles.checkbox} />
                Volunteering
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={hobbies.skillBuilding} onChange={() => handleHobbyChange('skillBuilding')} className={styles.checkbox} />
                Skill Building
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={hobbies.travelling} onChange={() => handleHobbyChange('travelling')} className={styles.checkbox} />
                Travelling
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={hobbies.writing} onChange={() => handleHobbyChange('writing')} className={styles.checkbox} />
                Writing
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={hobbies.sports} onChange={() => handleHobbyChange('sports')} className={styles.checkbox} />
                Sports
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={hobbies.collecting} onChange={() => handleHobbyChange('collecting')} className={styles.checkbox} />
                Collecting
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={hobbies.fitness} onChange={() => handleHobbyChange('fitness')} className={styles.checkbox} />
                Fitness
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={hobbies.music} onChange={() => handleHobbyChange('music')} className={styles.checkbox} />
                Music
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={hobbies.cooking} onChange={() => handleHobbyChange('cooking')} className={styles.checkbox} />
                Cooking
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={hobbies.art} onChange={() => handleHobbyChange('art')} className={styles.checkbox} />
                Art
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={hobbies.gaming} onChange={() => handleHobbyChange('gaming')} className={styles.checkbox} />
                Gaming
              </label>
            </div>
          </div>

          {/* Rooms of Interest */}
          <div className={styles.formRow}>
            <label className={styles.label}>Rooms of Interest</label>
            <div className={styles.roomsList}>
              {Object.entries({
                mathematics: 'Mathematics',
                physics: 'Physics',
                chemistryBiology: 'Chemistry / Biology',
                universityWriting: 'University Writing',
                nonTechnical: 'Non-Technical',
                technical: 'Technical',
                computerScience: 'Computer Science',
                artOfEngineering: 'The Art of Engineering',
                required: 'Required',
              }).map(([key, label]) => (
                <div key={key} className={styles.roomSection}>
                  <div className={styles.roomItem} onClick={() => toggleRoom(key)}>
                    <span>{label}</span>
                    <div className={styles.roomRight}>
                      {rooms[key].courses.length > 0 && (
                        <span className={styles.countBadge}>{rooms[key].courses.length}</span>
                      )}
                      <AddIcon className={`${styles.addIcon} ${rooms[key].expanded ? styles.rotated : ''}`} />
                    </div>
                  </div>
                  {rooms[key].expanded && (
                    <div className={styles.coursesList}>
                      {coursesBySubject[key].map((course, index) => (
                        <label key={index} className={styles.courseItem}>
                          <input
                            type="checkbox"
                            checked={rooms[key].courses.includes(course)}
                            onChange={() => toggleCourse(key, course)}
                            className={styles.checkbox}
                          />
                          {course}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className={styles.buttonRow}>
            <button className={styles.skipButton} onClick={() => router.push('/')}>
              Skip
            </button>
            <button className={styles.doneButton} onClick={handleSubmit}>
              Done
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
