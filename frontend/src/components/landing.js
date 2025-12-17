"use client"

import Navbar from './navbar'
import Popup from './Popup'
import { useState, useEffect } from 'react'

import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  InputAdornment
} from '@mui/material'

import { useRouter } from 'next/navigation';

import InstructorIcon from '@mui/icons-material/AccountCircleOutlined';
import CheckmarkIcon from '@mui/icons-material/CheckTwoTone';
import SearchIcon from '@mui/icons-material/Search';
import UploadIcon from '@mui/icons-material/Upload';
import styles from './landing.module.css'

export default function Landing() {
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState('');
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupCourses, setPopupCourses] = useState([]);
  const router = useRouter();
  
  const filteredClasses = classes.filter(classItem =>
    classItem.code.toLowerCase().includes(search.toLowerCase()) ||
    classItem.title.toLowerCase().includes(search.toLowerCase()) ||
    classItem.instructor.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    // Simulate fetching class data
    const fetchClasses = async () => {
      // Replace with actual data fetching logic
      const classData = [
        { code: "COMS4170", title: 'User Interface Design', instructor: 'Brian Smith (bas2137)', members: 18, joined: true },
        { code: "PHYSUN1494", title: 'Intro to Exp Phys-Lab', instructor: 'Giuseppina Cambareri', members: 42, joined: false },
        { code: "PHYSUN2801", title: 'Accelerated Physics I', instructor: 'Yury Levin', members: 13, joined: false },
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

        <Box className={styles.searchContainer}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search your classes"
            value={search}
            onChange={e => setSearch(e.target.value)}
            size="small"
            className={styles.searchBar}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button className={styles.uploadButton} onClick={() => {
            const icsCourses = [
              { code: "PHYSUN1402", title: 'Intro Elec/Mag & Optcs', instructor: 'Allan Blaer (mes2253)', members: 50, joined: false },
              { code: "MATHUN1102", title: 'Calculus II', instructor: 'Peter Woit (pgw2)', members: 21, joined: false },
              { code: "APMAE2000", title: 'Multv. Calc. for Eng & Sc', instructor: 'Curtiss Lyman (cl4746)', members: 18, joined: false },
            ];
            setPopupCourses(icsCourses);
            setPopupOpen(true);
          }}>
            <UploadIcon className={styles.uploadIcon} />
            Upload from ICS
          </Button>
        </Box>

        { classes.length !== 0 &&
          <Grid container spacing={1.5} className={styles.classesGrid}>
            <Grid item size={12}>
              <Typography className={styles.coursesFoundText}>{filteredClasses.length} courses found</Typography>
            </Grid>
            {filteredClasses.map((classItem, index) => (
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
      <Popup 
        open={popupOpen} 
        onClose={() => setPopupOpen(false)}
        courses={popupCourses}
      />
    </>
  )
}