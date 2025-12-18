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
import CloseIcon from '@mui/icons-material/Close'
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

  const skills = [
    { name: 'TypeScript', checked: true },
    { name: 'JavaScript', checked: false },
    { name: 'Python', checked: true },
    { name: 'Dart', checked: false },
    { name: 'SQL', checked: false },
    { name: 'C++', checked: false },
    { name: 'Research', checked: false },
    { name: 'HTML', checked: false },
    { name: 'SolidWorks', checked: true },
    { name: 'HTML/CSS', checked: false },
    { name: 'SwiftUI', checked: false },
    { name: 'Django', checked: false },
  ]

  const preferredMethods = [
    { name: 'Online', checked: false },
    { name: 'Synchronous', checked: false },
    { name: 'Asynchronous', checked: true },
    { name: 'Hybrid', checked: true },
  ]

  const hobbies = [
    { name: 'Design', checked: true },
    { name: 'Travelling', checked: true },
    { name: 'Collecting', checked: true },
    { name: 'Cooking', checked: true },
    { name: 'Volunteering', checked: true },
    { name: 'Writing', checked: false },
    { name: 'Fitness', checked: true },
    { name: 'Art', checked: true },
    { name: 'Skill Building', checked: true },
    { name: 'Sports', checked: true },
    { name: 'Music', checked: true },
    { name: 'Gaming', checked: true },
  ]

  const roomsOfInterest = [
    { category: 'Mathematics', expanded: false },
    { category: 'Physics', expanded: true, items: [
      { name: 'Intro Elec/Mag...', checked: true },
      { name: 'Acc Physics I', checked: true },
      { name: 'Intro to Exp Phys...', checked: true },
      { name: 'Intro to Mech &...', checked: false },
      { name: 'Phys I: Mech...', checked: false, count: 3 },
    ]},
    { category: 'Chemistry / Biology', expanded: false },
    { category: 'University Writing', expanded: false },
    { category: 'Non-Technical', expanded: false },
    { category: 'Technical', expanded: false },
    { category: 'Computer Science', expanded: false },
    { category: 'The Art of Engineering', expanded: false },
    { category: 'Required', expanded: false },
  ]

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

  const CustomCheckbox = ({ checked }) => (
    <Box className={`${styles.customCheckbox} ${checked ? styles.checked : ''}`}></Box>
  )

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

        <Box className={styles.middlePanel}>
          <Typography className={styles.editLink}>Edit</Typography>

          <Box className={styles.formRow}>
            <Typography className={styles.formLabel}>Graduating year</Typography>
            <Typography className={styles.formValue}>2025</Typography>
          </Box>

          <Box className={styles.formSection}>
            <Typography className={styles.formLabel}>Skills</Typography>
            <Box className={styles.checkboxGrid}>
              {skills.map((skill, i) => (
                <Box key={i} className={styles.checkboxItem}>
                  <CustomCheckbox checked={skill.checked} />
                  <Typography className={styles.checkboxLabel}>{skill.name}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Box className={styles.formSection}>
            <Typography className={styles.formLabel}>Preferred Method</Typography>
            <Box className={styles.preferredGrid}>
              {preferredMethods.map((method, i) => (
                <Box key={i} className={styles.checkboxItem}>
                  <CustomCheckbox checked={method.checked} />
                  <Typography className={styles.checkboxLabel}>{method.name}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Box className={styles.formSection}>
            <Typography className={styles.formLabel}>Hobbies</Typography>
            <Box className={styles.checkboxGrid}>
              {hobbies.map((hobby, i) => (
                <Box key={i} className={styles.checkboxItem}>
                  <CustomCheckbox checked={hobby.checked} />
                  <Typography className={styles.checkboxLabel}>{hobby.name}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Box className={styles.formSection}>
            <Typography className={styles.formLabel}>Rooms of Interest</Typography>
            <Box className={styles.roomsList}>
              {roomsOfInterest.map((room, i) => (
                <Box key={i} className={styles.roomCategory}>
                  <Box className={styles.roomCategoryHeader}>
                    <Typography className={styles.roomCategoryName}>{room.category}</Typography>
                    {room.expanded ? (
                      <CloseIcon className={styles.expandIcon} />
                    ) : (
                      <AddIcon className={styles.expandIcon} />
                    )}
                  </Box>
                  {room.expanded && room.items && (
                    <Box className={styles.roomItems}>
                      {room.items.map((item, j) => (
                        <Box key={j} className={styles.roomItem}>
                          <CustomCheckbox checked={item.checked} />
                          <Typography className={styles.checkboxLabel}>{item.name}</Typography>
                          {item.count && (
                            <Box className={styles.countBadge}>{item.count}</Box>
                          )}
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
