"use client"

import Navbar from '../../components/navbar'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Typography,
  TextField,
  InputAdornment
} from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'
import LogoutIcon from '@mui/icons-material/Logout'
import InstagramIcon from '@mui/icons-material/Instagram'
import TwitterIcon from '@mui/icons-material/Twitter'
import AddIcon from '@mui/icons-material/Add'
import CheckIcon from '@mui/icons-material/Check'
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import GridViewIcon from '@mui/icons-material/GridView'
import LinkIcon from '@mui/icons-material/Link'
import Link from 'next/link'

import styles from './profile.module.css'

export default function ProfilePage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  const user = {
    name: 'John Doe',
    school: 'The Fu Foundation School of Engineering and Applied Science, Columbia University',
    degrees: [
      'Computer Science, BS (2025)',
      'Industrial Engineering, MSIE (2027)'
    ],
    karma: '1,250',
    rooms: 16,
    year: 'Sophomore',
    about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  }

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

  const handleSkillChange = (skill) => {
    setSkills(prev => ({ ...prev, [skill]: !prev[skill] }));
  };

  const handleMethodChange = (method) => {
    setPreferredMethod(prev => ({ ...prev, [method]: !prev[method] }));
  };

  const handleHobbyChange = (hobby) => {
    setHobbies(prev => ({ ...prev, [hobby]: !prev[hobby] }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    // Save changes here (you can add API call or state management)
    console.log('Saving changes:', { skills, preferredMethod, hobbies, rooms });
    setIsEditing(false);
  };

  const matches = [
    { name: 'Richard Roe', hobbies: 6, rooms: 3, online: true, hasMessage: true },
    { name: 'Tommy Atkins', hobbies: 2, rooms: 7, online: false, invited: true },
    { name: 'Jane Bloggs', hobbies: 9, rooms: 5, online: true, invited: true },
    { name: 'Joe Bloggs', hobbies: 3, rooms: 3, online: false },
    { name: 'Alan Smithee', hobbies: 2, rooms: 3, online: false },
    { name: 'Joe Shmoe', hobbies: 6, rooms: 4, online: false },
    { name: 'Fred Bloggs', hobbies: 7, rooms: 2, online: false },
    { name: 'Alan Smithee', hobbies: 8, rooms: 2, online: false },
  ]

  return (
    <Box className={styles.container}>
      <Navbar />
      
      <header className={styles.topHeader}>
        <Link href="/" className={styles.logo}>Study Room</Link>
        <button className={styles.logoutButton} onClick={() => router.push('/signin')}>
          <LogoutIcon />
        </button>
      </header>

      <Typography className={styles.pageTitle}>Profile</Typography>

      <Box className={styles.mainContent}>
        <Box className={styles.leftPanel}>
          <Box className={styles.profileImageContainer}>
            <Box className={styles.profileImage}></Box>
            <Box className={styles.onlineIndicator}></Box>
          </Box>

          <Typography className={styles.userName}>{user.name}</Typography>

          <Typography className={styles.schoolText}>{user.school}</Typography>
          <Box className={styles.degreesContainer}>
            {user.degrees.map((degree, i) => (
              <Typography key={i} className={styles.degreeText}>{degree}</Typography>
            ))}
          </Box>

          <Box className={styles.divider}></Box>

          <Box className={styles.statsRow}>
            <Box className={styles.statItem}>
              <EmojiEventsIcon className={styles.statIcon} />
              <Box className={styles.statText}>
                <Typography className={styles.statValue}>{user.karma}</Typography>
                <Typography className={styles.statLabel}>Karma</Typography>
              </Box>
            </Box>
            <Box className={styles.statItem}>
              <GridViewIcon className={styles.statIcon} />
              <Box className={styles.statText}>
                <Typography className={styles.statValue}>{user.rooms}</Typography>
                <Typography className={styles.statLabel}>Rooms</Typography>
              </Box>
            </Box>
            <Box className={styles.statItem}>
              <MenuBookIcon className={styles.statIcon} />
              <Box className={styles.statText}>
                <Typography className={styles.statValue}>{user.year}</Typography>
                <Typography className={styles.statLabel}>Year</Typography>
              </Box>
            </Box>
          </Box>

          <Box className={styles.divider}></Box>

          <Box className={styles.aboutSection}>
            <Typography className={styles.aboutTitle}>About</Typography>
            <Typography className={styles.aboutText}>{user.about}</Typography>
          </Box>

          <Box className={styles.socialIcons}>
            <InstagramIcon className={styles.socialIcon} />
            <TwitterIcon className={styles.socialIcon} />
            <LinkIcon className={styles.socialIcon} />
          </Box>
        </Box>

        <Box className={`${styles.middlePanel} ${isEditing ? styles.editing : ''}`}>
          <Typography 
            className={styles.editLink} 
            onClick={isEditing ? handleSaveClick : handleEditClick}
            style={{ cursor: 'pointer' }}
          >
            {isEditing ? 'Save' : 'Edit'}
          </Typography>

          <Box className={styles.formRow}>
            <Typography className={styles.formLabel}>Graduating year</Typography>
            <Typography className={styles.formValue}>2025</Typography>
          </Box>

          <Box className={styles.formSection}>
            <Typography className={styles.formLabel}>Skills</Typography>
            <Box className={styles.checkboxGrid}>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={skills.typescript} onChange={() => handleSkillChange('typescript')} disabled={!isEditing} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>TypeScript</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={skills.sql} onChange={() => handleSkillChange('sql')} disabled={!isEditing} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>SQL</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={skills.solidworks} onChange={() => handleSkillChange('solidworks')} disabled={!isEditing} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>SolidWorks</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={skills.javascript} onChange={() => handleSkillChange('javascript')} disabled={!isEditing} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>JavaScript</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={skills.cPlusPlus} onChange={() => handleSkillChange('cPlusPlus')} disabled={!isEditing} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>C++</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={skills.htmlCss} onChange={() => handleSkillChange('htmlCss')} disabled={!isEditing} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>HTML/CSS</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={skills.python} onChange={() => handleSkillChange('python')} disabled={!isEditing} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>Python</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={skills.research} onChange={() => handleSkillChange('research')} disabled={!isEditing} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>Research</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={skills.swiftUI} onChange={() => handleSkillChange('swiftUI')} disabled={!isEditing} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>SwiftUI</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={skills.dart} onChange={() => handleSkillChange('dart')} disabled={!isEditing} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>Dart</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={skills.html} onChange={() => handleSkillChange('html')} disabled={!isEditing} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>HTML</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={skills.django} onChange={() => handleSkillChange('django')} disabled={!isEditing} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>Django</Typography>
              </Box>
            </Box>
          </Box>

          <Box className={styles.formSection}>
            <Typography className={styles.formLabel}>Preferred Method</Typography>
            <Box className={styles.preferredGrid}>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={preferredMethod.online} onChange={() => handleMethodChange('online')} disabled={!isEditing} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>Online</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={preferredMethod.synchronous} onChange={() => handleMethodChange('synchronous')} disabled={!isEditing} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>Synchronous</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={preferredMethod.asynchronous} onChange={() => handleMethodChange('asynchronous')} disabled={!isEditing} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>Asynchronous</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={preferredMethod.hybrid} onChange={() => handleMethodChange('hybrid')} disabled={!isEditing} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>Hybrid</Typography>
              </Box>
            </Box>
          </Box>

          <Box className={styles.formSection}>
            <Typography className={styles.formLabel}>Hobbies</Typography>
            <Box className={styles.checkboxGrid}>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={hobbies.design} onChange={() => handleHobbyChange('design')} disabled={!isEditing} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>Design</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={hobbies.volunteering} onChange={() => handleHobbyChange('volunteering')} disabled={!isEditing} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>Volunteering</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={hobbies.skillBuilding} onChange={() => handleHobbyChange('skillBuilding')} disabled={!isEditing} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>Skill Building</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={hobbies.travelling} onChange={() => handleHobbyChange('travelling')} disabled={!isEditing} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>Travelling</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={hobbies.writing} onChange={() => handleHobbyChange('writing')} disabled={!isEditing} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>Writing</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={hobbies.sports} onChange={() => handleHobbyChange('sports')} disabled={!isEditing} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>Sports</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={hobbies.collecting} onChange={() => handleHobbyChange('collecting')} disabled={!isEditing} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>Collecting</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={hobbies.fitness} onChange={() => handleHobbyChange('fitness')} disabled={!isEditing} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>Fitness</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={hobbies.music} onChange={() => handleHobbyChange('music')} disabled={!isEditing} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>Music</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={hobbies.cooking} onChange={() => handleHobbyChange('cooking')} disabled={!isEditing} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>Cooking</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={hobbies.art} onChange={() => handleHobbyChange('art')} disabled={!isEditing} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>Art</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={hobbies.gaming} onChange={() => handleHobbyChange('gaming')} disabled={!isEditing} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>Gaming</Typography>
              </Box>
            </Box>
          </Box>

          <Box className={styles.formSection}>
            <Typography className={styles.formLabel}>Rooms of Interest</Typography>
            <Box className={styles.roomsList}>
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
                <Box key={key} className={styles.roomCategory}>
                  <Box 
                    className={styles.roomCategoryHeader} 
                    onClick={() => toggleRoom(key)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Typography className={styles.roomCategoryName}>{label}</Typography>
                    <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {rooms[key].courses.length > 0 && (
                        <Box className={styles.countBadge}>{rooms[key].courses.length}</Box>
                      )}
                      <AddIcon className={`${styles.expandIcon} ${rooms[key].expanded ? styles.rotated : ''}`} />
                    </Box>
                  </Box>
                  {rooms[key].expanded && (
                    <Box className={styles.roomItems}>
                      {coursesBySubject[key].map((course, index) => (
                        <Box key={index} className={styles.roomItem}>
                          <input
                            type="checkbox"
                            checked={rooms[key].courses.includes(course)}
                            onChange={() => toggleCourse(key, course)}
                            disabled={!isEditing}
                            className={styles.checkbox}
                          />
                          <Typography className={styles.checkboxLabel}>{course}</Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        <Box className={styles.rightPanel}>
          <Box className={styles.matchesHeader}>
            <Typography className={styles.matchesTitle}>Matches</Typography>
            <Typography className={styles.matchesSubtitle}>Based on Hobbies and Rooms of Interest</Typography>
          </Box>

          <Box className={styles.matchesSearchRow}>
            <TextField
              variant="outlined"
              placeholder="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              size="small"
              className={styles.matchesSearch}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon className={styles.searchIcon} />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Box className={styles.inviteButton}>Invite</Box>
          </Box>

          <Box className={styles.matchesList}>
            {matches.map((match, i) => (
              <Box key={i} className={styles.matchItem}>
                <Box className={styles.matchAvatar}>
                  {match.online && <Box className={styles.matchOnline}></Box>}
                </Box>
                <Box className={styles.matchInfo}>
                  <Typography className={styles.matchName}>{match.name}</Typography>
                  <Typography className={styles.matchDetails}>
                    {match.hobbies} Hobbies and {match.rooms} Rooms of Interest
                  </Typography>
                </Box>
                {match.invited ? (
                  <Box className={styles.invitedIcon}>
                    <CheckIcon className={styles.checkIcon} />
                  </Box>
                ) : (
                  <Box className={styles.addMatchIcon}>
                    <AddIcon className={styles.plusIcon} />
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <DarkModeIcon className={styles.darkModeIcon} />
    </Box>
  )
}
