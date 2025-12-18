"use client"

import Navbar from '../../components/navbar'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Typography,
  TextField,
  InputAdornment
} from '@mui/material'
import toast, { Toaster } from 'react-hot-toast'

import SearchIcon from '@mui/icons-material/Search'
import LogoutIcon from '@mui/icons-material/Logout'
import InstagramIcon from '@mui/icons-material/Instagram'
import TwitterIcon from '@mui/icons-material/Twitter'
import AddIcon from '@mui/icons-material/Add'
import CheckIcon from '@mui/icons-material/Check'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import GridViewIcon from '@mui/icons-material/GridView'
import LinkIcon from '@mui/icons-material/Link'
import Link from 'next/link'

import styles from './profile.module.css'

const API_BASE_URL = 'http://localhost:4000/api';

export default function ProfilePage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [invitedUsers, setInvitedUsers] = useState({})
  const [inviteTimestamps, setInviteTimestamps] = useState({}) // For spam protection
  const [userStatuses, setUserStatuses] = useState({}) // Store userStatus for each match

  // Calculate year based on graduation year
  const calculateYear = (graduationYear) => {
    const currentYear = new Date().getFullYear();
    const yearsUntilGraduation = graduationYear - currentYear;
    
    if (yearsUntilGraduation >= 4) {
      return 'Freshman';
    } else if (yearsUntilGraduation === 3) {
      return 'Sophomore';
    } else if (yearsUntilGraduation === 2) {
      return 'Junior';
    } else if (yearsUntilGraduation === 1) {
      return 'Senior';
    } else {
      return 'Graduate';
    }
  };

  // Default values (used for SSR and initial client render)
  const defaultSkills = {
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
  };

  const defaultPreferredMethod = {
    online: false,
    synchronous: false,
    asynchronous: false,
    hybrid: false,
  };

  const defaultHobbies = {
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
  };

  const defaultRooms = {
    mathematics: { expanded: false, courses: [] },
    physics: { expanded: false, courses: [] },
    chemistryBiology: { expanded: false, courses: [] },
    universityWriting: { expanded: false, courses: [] },
    nonTechnical: { expanded: false, courses: [] },
    technical: { expanded: false, courses: [] },
    computerScience: { expanded: false, courses: [] },
    artOfEngineering: { expanded: false, courses: [] },
    required: { expanded: false, courses: [] },
  };

  // Initialize state - use defaults for SSR, then load from localStorage on client
  const [graduationYear, setGraduationYear] = useState(2029);
  const [skills, setSkills] = useState(defaultSkills);
  const [preferredMethod, setPreferredMethod] = useState(defaultPreferredMethod);
  const [hobbies, setHobbies] = useState(defaultHobbies);
  const [rooms, setRooms] = useState(defaultRooms);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load profile data from localStorage after hydration
  useEffect(() => {
    const storedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    
    if (storedProfile.graduationYear) {
      setGraduationYear(storedProfile.graduationYear);
    }
    if (storedProfile.skills) {
      setSkills(storedProfile.skills);
    }
    if (storedProfile.preferredMethod) {
      setPreferredMethod(storedProfile.preferredMethod);
    }
    if (storedProfile.hobbies) {
      setHobbies(storedProfile.hobbies);
    }
    if (storedProfile.rooms) {
      setRooms(storedProfile.rooms);
    }
    setIsHydrated(true);
  }, []);

  // Calculate current year display value - always use default (2028) during SSR/initial render to avoid hydration mismatch
  // After hydration, use the actual graduationYear from state
  const currentYearDisplay = calculateYear(isHydrated ? graduationYear : 2029);

  const user = {
    name: 'John Doe',
    school: 'The Fu Foundation School of Engineering and Applied Science, Columbia University',
    degrees: [
      'Computer Science, BS (2025)',
      'Industrial Engineering, MSIE (2027)'
    ],
    karma: '1,250',
    rooms: 16,
    about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  }

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
    if (!isEditing) {
      showEditWarning();
      return;
    }
    setRooms(prev => {
      const currentCourses = prev[roomKey].courses;
      const newCourses = currentCourses.includes(course)
        ? currentCourses.filter(c => c !== course)
        : [...currentCourses, course];
      const updated = {
        ...prev,
        [roomKey]: { ...prev[roomKey], courses: newCourses }
      };
      // Auto-save to localStorage
      const profileData = JSON.parse(localStorage.getItem('userProfile') || '{}');
      localStorage.setItem('userProfile', JSON.stringify({ ...profileData, rooms: updated }));
      return updated;
    });
  };

  const showEditWarning = () => {
    toast('Please click "Edit" to modify your profile', {
      id: 'edit-warning', // Use a constant ID so only one warning appears at a time
      icon: '⚠️',
      style: {
        background: '#ffc107',
        color: '#000',
        fontWeight: 500,
      },
      position: 'top-center',
      duration: 1000, // Auto-dismiss after 1 second
    });
  };

  const handleSkillChange = (skill) => {
    if (!isEditing) {
      showEditWarning();
      return;
    }
    setSkills(prev => {
      const updated = { ...prev, [skill]: !prev[skill] };
      // Auto-save to localStorage
      const profileData = JSON.parse(localStorage.getItem('userProfile') || '{}');
      localStorage.setItem('userProfile', JSON.stringify({ ...profileData, skills: updated }));
      return updated;
    });
  };

  const handleMethodChange = (method) => {
    if (!isEditing) {
      showEditWarning();
      return;
    }
    setPreferredMethod(prev => {
      const updated = { ...prev, [method]: !prev[method] };
      // Auto-save to localStorage
      const profileData = JSON.parse(localStorage.getItem('userProfile') || '{}');
      localStorage.setItem('userProfile', JSON.stringify({ ...profileData, preferredMethod: updated }));
      return updated;
    });
  };

  const handleHobbyChange = (hobby) => {
    if (!isEditing) {
      showEditWarning();
      return;
    }
    setHobbies(prev => {
      const updated = { ...prev, [hobby]: !prev[hobby] };
      // Auto-save to localStorage
      const profileData = JSON.parse(localStorage.getItem('userProfile') || '{}');
      localStorage.setItem('userProfile', JSON.stringify({ ...profileData, hobbies: updated }));
      return updated;
    });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    // Save all profile changes to localStorage
    const profileData = {
      graduationYear,
      skills,
      preferredMethod,
      hobbies,
      rooms
    };
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    setIsEditing(false);
    toast('Profile saved', {
      id: 'profile-saved',
      style: {
        background: '#34c759',
        color: '#fff',
        fontWeight: 500,
      },
      position: 'top-center',
      duration: 1500,
    });
  };

  const handleGraduationYearChange = (e) => {
    if (!isEditing) {
      showEditWarning();
      return;
    }
    const year = parseInt(e.target.value);
    if (!isNaN(year) && year >= 2020 && year <= 2030) {
      setGraduationYear(year);
      // Auto-save to localStorage
      const profileData = JSON.parse(localStorage.getItem('userProfile') || '{}');
      localStorage.setItem('userProfile', JSON.stringify({ ...profileData, graduationYear: year }));
    }
  };

  const handleInviteClick = async () => {
    const url = 'http://localhost:3000/';
    try {
      await navigator.clipboard.writeText(url);
      toast('Link copied', {
        id: 'link-copied',
        style: {
          background: '#7a7a7a',
          color: '#fff',
          fontWeight: 500,
        },
        position: 'top-center',
        duration: 1000,
      });
    } catch (err) {
      console.error('Failed to copy link:', err);
      toast('Failed to copy link', {
        id: 'link-copy-error',
        style: {
          background: '#ffc107',
          color: '#000',
          fontWeight: 500,
        },
        position: 'top-center',
        duration: 1000,
      });
    }
  };

  // Load invited users from localStorage on mount
  useEffect(() => {
    const storedInvited = JSON.parse(localStorage.getItem('invitedUsers') || '{}');
    setInvitedUsers(storedInvited);
    
    // Fetch userStatus for invited users from their DM conversations
    const invitedUsernames = Object.keys(storedInvited).filter(name => storedInvited[name]);
    invitedUsernames.forEach(async (username) => {
      try {
        const response = await fetch(`${API_BASE_URL}/chats/dm/${encodeURIComponent(username)}`);
        if (response.ok) {
          const data = await response.json();
          const userStatus = data.chat?.userStatus || 'offline';
          setUserStatuses(prev => ({ ...prev, [username]: userStatus }));
        }
      } catch (error) {
        console.error(`Error fetching status for ${username}:`, error);
      }
    });
  }, []);

  const matches = [
    { name: 'Richard Roe', hobbies: 6, rooms: 3, hasMessage: true },
    { name: 'Tommy Atkins', hobbies: 2, rooms: 7 },
    { name: 'Jane Bloggs', hobbies: 9, rooms: 5 },
    { name: 'Joe Bloggs', hobbies: 3, rooms: 3 },
    { name: 'Alan Smithee', hobbies: 2, rooms: 3 },
    { name: 'Joe Shmoe', hobbies: 6, rooms: 4 },
    { name: 'Fred Bloggs', hobbies: 7, rooms: 2 },
    { name: 'Toby Smithee', hobbies: 8, rooms: 2 },
  ]

  const filteredMatches = matches.map(match => {
    const invited = invitedUsers[match.name] || false;
    const userStatus = userStatuses[match.name] || null;
    // Show status indicator for all invited users (online, away, or offline)
    const showStatusDot = invited && userStatus !== null;
    
    return {
      ...match,
      invited,
      userStatus,
      showStatusDot
    };
  }).filter(
    match =>
      match.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleInviteToggle = async (userName) => {
    // Spam protection: prevent rapid toggling (minimum 1 second between actions)
    const now = Date.now();
    const lastAction = inviteTimestamps[userName] || 0;
    if (now - lastAction < 1000) {
      toast('Please wait a moment before toggling again', {
        id: 'spam-protection',
        style: {
          background: '#ffc107',
          color: '#000',
          fontWeight: 500,
        },
        position: 'top-center',
        duration: 1000,
      });
      return;
    }

    setInviteTimestamps(prev => ({ ...prev, [userName]: now }));

    const isCurrentlyInvited = invitedUsers[userName] || false;
    const newInvitedState = !isCurrentlyInvited;

    // Update local state immediately
    const updatedInvited = { ...invitedUsers, [userName]: newInvitedState };
    setInvitedUsers(updatedInvited);
    localStorage.setItem('invitedUsers', JSON.stringify(updatedInvited));

    try {
      // Update backend: find user document and set invited status
      const response = await fetch(`${API_BASE_URL}/users/${encodeURIComponent(userName)}/invite`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ invited: newInvitedState })
      });

      if (!response.ok) {
        // Revert on error
        setInvitedUsers(invitedUsers);
        localStorage.setItem('invitedUsers', JSON.stringify(invitedUsers));
        throw new Error('Failed to update invite status');
      }

      // If inviting, fetch the DM conversation to get userStatus and navigate to chat
      if (newInvitedState) {
        try {
          const dmResponse = await fetch(`${API_BASE_URL}/chats/dm/${encodeURIComponent(userName)}`);
          if (dmResponse.ok) {
            const dmData = await dmResponse.json();
            const userStatus = dmData.chat?.userStatus || 'offline';
            setUserStatuses(prev => ({ ...prev, [userName]: userStatus }));
          }
        } catch (error) {
          console.error(`Error fetching DM status for ${userName}:`, error);
        }
        router.push(`/chat?dm=${encodeURIComponent(userName)}`);
      } else {
        // Remove status when uninviting
        setUserStatuses(prev => {
          const updated = { ...prev };
          delete updated[userName];
          return updated;
        });
      }
    } catch (error) {
      console.error('Error toggling invite:', error);
      toast('Failed to update invite status', {
        id: 'invite-error',
        style: {
          background: '#ffc107',
          color: '#000',
          fontWeight: 500,
        },
        position: 'top-center',
        duration: 2000,
      });
    }
  };

  return (
    <Box className={styles.container}>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#ffc107',
            color: '#000',
          },
        }}
      />
      <Navbar />
      
      <header className={styles.topHeader}>
        <Link href="/" className={styles.logo}>StudyRoom</Link>
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
                <Typography className={styles.statValue} suppressHydrationWarning>{currentYearDisplay}</Typography>
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
            {isEditing ? (
              <input
                type="number"
                value={graduationYear}
                onChange={handleGraduationYearChange}
                min="2020"
                max="2030"
                className={styles.graduationYearInput}
                style={{
                  width: '80px',
                  padding: '4px 8px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            ) : (
              <Typography className={styles.formValue}>{graduationYear}</Typography>
            )}
          </Box>

          <Box className={styles.formSection}>
            <Typography className={styles.formLabel}>Skills</Typography>
            <Box className={styles.checkboxGrid}>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={skills.typescript} onChange={() => handleSkillChange('typescript')} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>TypeScript</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={skills.sql} onChange={() => handleSkillChange('sql')} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>SQL</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={skills.solidworks} onChange={() => handleSkillChange('solidworks')} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>SolidWorks</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={skills.javascript} onChange={() => handleSkillChange('javascript')} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>JavaScript</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={skills.cPlusPlus} onChange={() => handleSkillChange('cPlusPlus')} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>C++</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={skills.htmlCss} onChange={() => handleSkillChange('htmlCss')} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>HTML/CSS</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={skills.python} onChange={() => handleSkillChange('python')} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>Python</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={skills.research} onChange={() => handleSkillChange('research')} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>Research</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={skills.swiftUI} onChange={() => handleSkillChange('swiftUI')} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>SwiftUI</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={skills.dart} onChange={() => handleSkillChange('dart')} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>Dart</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={skills.html} onChange={() => handleSkillChange('html')} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>HTML</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={skills.django} onChange={() => handleSkillChange('django')} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>Django</Typography>
              </Box>
            </Box>
          </Box>

          <Box className={styles.formSection}>
            <Typography className={styles.formLabel}>Preferred Method</Typography>
            <Box className={styles.preferredGrid}>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={preferredMethod.online} onChange={() => handleMethodChange('online')} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>Online</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={preferredMethod.synchronous} onChange={() => handleMethodChange('synchronous')} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>Synchronous</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={preferredMethod.asynchronous} onChange={() => handleMethodChange('asynchronous')} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>Asynchronous</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={preferredMethod.hybrid} onChange={() => handleMethodChange('hybrid')} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>Hybrid</Typography>
              </Box>
            </Box>
          </Box>

          <Box className={styles.formSection}>
            <Typography className={styles.formLabel}>Hobbies</Typography>
            <Box className={styles.checkboxGrid}>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={hobbies.design} onChange={() => handleHobbyChange('design')} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>Design</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={hobbies.volunteering} onChange={() => handleHobbyChange('volunteering')} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>Volunteering</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={hobbies.skillBuilding} onChange={() => handleHobbyChange('skillBuilding')} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>Skill Building</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={hobbies.travelling} onChange={() => handleHobbyChange('travelling')} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>Travelling</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={hobbies.writing} onChange={() => handleHobbyChange('writing')} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>Writing</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={hobbies.sports} onChange={() => handleHobbyChange('sports')} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>Sports</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={hobbies.collecting} onChange={() => handleHobbyChange('collecting')} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>Collecting</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={hobbies.fitness} onChange={() => handleHobbyChange('fitness')} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>Fitness</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={hobbies.music} onChange={() => handleHobbyChange('music')} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>Music</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={hobbies.cooking} onChange={() => handleHobbyChange('cooking')} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>Cooking</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={hobbies.art} onChange={() => handleHobbyChange('art')} className={styles.checkbox} />
                <Typography className={styles.checkboxLabel}>Art</Typography>
              </Box>
              <Box className={styles.checkboxItem}>
                <input type="checkbox" checked={hobbies.gaming} onChange={() => handleHobbyChange('gaming')} className={styles.checkbox} />
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
                html: styles.matchesSearch
              }}
            />
            <Box className={styles.inviteButton} onClick={handleInviteClick}>Invite</Box>
          </Box>

          <Box className={styles.matchesList}>
            {filteredMatches.map((match, i) => (
              <Box key={i} className={styles.matchItem}>
                <Box className={styles.matchAvatar}>
                  {match.showStatusDot && (
                    <Box 
                      className={
                        match.userStatus === 'online' 
                          ? styles.matchOnline 
                          : match.userStatus === 'away'
                          ? styles.matchAway
                          : styles.matchOffline
                      }
                    ></Box>
                  )}
                </Box>
                <Box className={styles.matchInfo}>
                  <Typography className={styles.matchName}>{match.name}</Typography>
                  <Typography className={styles.matchDetails}>
                    {match.hobbies} Hobbies and {match.rooms} Rooms of Interest
                  </Typography>
                </Box>
                {match.invited ? (
                  <Box 
                    className={styles.invitedIcon}
                    onClick={() => handleInviteToggle(match.name)}
                    style={{ cursor: 'pointer' }}
                  >
                    <CheckIcon className={styles.checkIcon} />
                  </Box>
                ) : (
                  <Box 
                    className={styles.addMatchIcon}
                    onClick={() => handleInviteToggle(match.name)}
                    style={{ cursor: 'pointer' }}
                  >
                    <AddIcon className={styles.plusIcon} />
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
