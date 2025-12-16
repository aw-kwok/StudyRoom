"use client"

import Navbar from './navbar'
import { useState, useEffect } from 'react'

import {
  Box,
  Typography,
  Grid,
  Button
} from '@mui/material'

import { useRouter } from 'next/navigation';

import InstructorIcon from '@mui/icons-material/AccountCircleOutlined';
import CheckmarkIcon from '@mui/icons-material/CheckTwoTone';
import styles from './landing.module.css'

export default function Landing() {
  const [classes, setClasses] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Simulate fetching class data
    const fetchClasses = async () => {
      // Replace with actual data fetching logic
      const classData = [
        { code: "COMS4170", title: 'User Interface Design', instructor: 'Brian Smith (bas2137)', members: 18, joined: true },
        { code: "COMS4170", title: 'User Interface Design', instructor: 'Brian Smith (bas2137)', members: 18, joined: false },
        { code: "COMS4170", title: 'User Interface Design', instructor: 'Brian Smith (bas2137)', members: 18, joined: false },
      ];
      setClasses(classData);
    }
    fetchClasses();
  }, []);

  return (
    <>
      <Navbar />
      <Box className={styles.landingContainer}>
        <Typography className={styles.logoText}>
          StudyRoom
        </Typography>
        <Typography className={styles.taglineText}>
          All your class group chats in one place.
        </Typography>
        { classes.length !== 0 &&
          <Grid container spacing={1.5} className={styles.classesGrid}>
            {classes.map((classItem, index) => (
              <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Box className={styles.classCard}>
                  <Typography className={styles.classCode}>
                    {classItem.code}
                  </Typography>
                  <Typography className={styles.classTitle}>
                    {classItem.title}
                  </Typography>
                  <Box>
                    <InstructorIcon className={styles.instructorIcon} />
                    <Typography className={styles.classDescription}>
                      {classItem.instructor}
                    </Typography>
                  </Box>
                  <Box>
                    <span className={styles.greenDot}></span>
                    <Typography className={styles.classMembers}>
                      {classItem.members} members
                    </Typography>
                  </Box>
                  <Button className={`${styles.joinButton} ${classItem.joined ? styles.joined : ''}`} onClick={() => router.push('/chat?class=' + classItem.code)}>
                    {classItem.joined ? 
                    <>
                      <CheckmarkIcon className={styles.checkmark} />
                      Joined
                    </>
                      :
                      'Join'
                    }
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
        }
      </Box>
    </>
  )
}