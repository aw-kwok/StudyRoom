"use client"

import Navbar from '../../components/navbar'
import { useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Grid
} from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'
import NotificationsIcon from '@mui/icons-material/NotificationsNoneOutlined'
import EditIcon from '@mui/icons-material/EditOutlined'
import InstructorIcon from '@mui/icons-material/AccountCircleOutlined'
import StarIcon from '@mui/icons-material/Star'

import styles from './profile.module.css'

export default function ProfilePage() {
  const [search, setSearch] = useState('')

  const user = {
    name: 'John Doe',
    university: 'Columbia University',
    major: 'Computer Science',
    classOf: '2025',
    aboutMe: "Hi, I'm John! I'm passionate about coding and love collaborating on projects. Looking for study partners for my CS courses.",
    karmaPoints: 1250
  }

  const courses = [
    { code: 'COMS 4170', title: 'User Interface Design', instructor: 'Smith, Brian (bas2137)', members: 18 },
    { code: 'COMS 3998', title: 'Undergraduate Project', instructor: 'Lydia Chilton (lc3251)', members: 25 },
    { code: 'COMS 4170', title: 'User Interface Design', instructor: 'Smith, Brian (bas2137)', members: 18 },
    { code: 'COMS 3998', title: 'Undergraduate Project', instructor: 'Lydia Chilton (lc3251)', members: 25 },
  ]

  return (
    <>
      <Navbar />
      <Box className={styles.profileContainer}>
        <Box className={styles.header}>
          <Typography className={styles.pageTitle}>My Profile</Typography>
          <Box className={styles.headerRight}>
            <TextField
              variant="outlined"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              size="small"
              className={styles.searchBar}
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
            <NotificationsIcon className={styles.headerIcon} />
            <Box className={styles.mailPlaceholder}>
              <Box className={styles.mailLine1}></Box>
              <Box className={styles.mailLine2}></Box>
            </Box>
          </Box>
        </Box>

        <Box className={styles.mainContent}>
          <Box className={styles.profileCard}>
            <Box className={styles.profileImageContainer}>
              <Box className={styles.profileImagePlaceholder}>
                <Box className={styles.placeholderX}>
                  <Box className={styles.line1}></Box>
                  <Box className={styles.line2}></Box>
                </Box>
              </Box>
            </Box>

            <Box className={styles.nameRow}>
              <Typography className={styles.userName}>{user.name}</Typography>
              <EditIcon className={styles.editIcon} />
            </Box>

            <Typography className={styles.universityText}>{user.university}</Typography>
            <Typography className={styles.majorText}>{user.major}, Class of {user.classOf}</Typography>

            <Box className={styles.aboutSection}>
              <Box className={styles.aboutHeader}>
                <Typography className={styles.sectionTitle}>About Me</Typography>
                <EditIcon className={styles.editIconSmall} />
              </Box>
              <Typography className={styles.aboutText}>{user.aboutMe}</Typography>
            </Box>

            <Box className={styles.karmaSection}>
              <Typography className={styles.sectionTitle}>Karma Points</Typography>
              <Box className={styles.karmaRow}>
                <StarIcon className={styles.starIcon} />
                <Typography className={styles.karmaPoints}>{user.karmaPoints}</Typography>
              </Box>
            </Box>
          </Box>

          <Box className={styles.coursesSection}>
            <Box className={styles.coursesCard}>
              <Typography className={styles.coursesTitle}>My Courses</Typography>
              <Grid container spacing={2}>
                {courses.map((course, index) => (
                  <Grid item size={{ xs: 12, sm: 6 }} key={index}>
                    <Box className={styles.courseCard}>
                      <Typography className={styles.courseCode}>{course.code} - {course.title}</Typography>
                      <Box className={styles.instructorRow}>
                        <InstructorIcon className={styles.instructorIcon} />
                        <Typography className={styles.instructorText}>{course.instructor}</Typography>
                      </Box>
                      <Box className={styles.membersRow}>
                        <span className={styles.greenDot}></span>
                        <Typography className={styles.membersText}>{course.members} Members</Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}
