"use client"

import Navbar from './navbar'
import Popup from './Popup'
import { useState, useEffect, useRef } from 'react'

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

import axios from 'axios';
const BACKEND_URL = 'http://localhost:4000';

export default function Landing() {
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState('');
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupCourses, setPopupCourses] = useState([]);
  const router = useRouter();

  const fileInputRef = useRef(null);
  
  const filteredClasses = classes.filter(classItem =>
    classItem.id.toLowerCase().includes(search.toLowerCase()) ||
    classItem.course_name.toLowerCase().includes(search.toLowerCase()) ||
    classItem.instructor.toLowerCase().includes(search.toLowerCase())
  );

  const extractUniqueCourseCodesAndNames = (icsText) => {
    const summaryLines = icsText.match(/^SUMMARY:(.+)$/gm);
    if (!summaryLines) return [];

    const courseMap = new Map();
    summaryLines.forEach(line => {
      const parts = line.replace('SUMMARY:', '').split('•').map(s => s.trim());
      if (parts.length >= 2) {
        const code = parts[0];
        const courseName = parts[parts.length - 1];
        courseMap.set(code, courseName);
      }
    });

    // Return as array of objects: [{ code, title }]
    return Array.from(courseMap.entries()).map(([code, courseName]) => ({ code, courseName }));
  }

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const text = await file.text();
    const courses = extractUniqueCourseCodesAndNames(text);

    console.log(courses)

    const foundCourses = [];
    for (const course of courses) {
      if (classes.some(c => c.course_name.toLowerCase() === course.courseName.toLowerCase())) {
        foundCourses.push({
          code: classes.find(c => c.course_name.toLowerCase() === course.courseName.toLowerCase()).id,
          title: classes.find(c => c.course_name.toLowerCase() === course.courseName.toLowerCase()).course_name,
          instructor: classes.find(c => c.course_name.toLowerCase() === course.courseName.toLowerCase()).instructor,
          members: classes.find(c => c.course_name.toLowerCase() === course.courseName.toLowerCase()).members,
          joined: classes.find(c => c.course_name.toLowerCase() === course.courseName.toLowerCase()).joined
        });
      }
    }
    console.log(foundCourses);
    setPopupCourses(foundCourses);
    setPopupOpen(true);
    e.target.value = ''; // reset input so same file can be uploaded again
  };

  const handleJoinClick = async (classCode, redirect = true) => {
    const classItem = classes.find(c => c.id === classCode);
    if (!classItem) return;
    
    const newJoinedState = !classItem.joined;
    
    if (newJoinedState) {
      // Create chat when joining a course
      try {
        await axios.post(BACKEND_URL + `/api/chats/class/${classCode}/join`);
      } catch (error) {
        console.error('Error creating chat:', error);
      }
      
      const joinedCourses = JSON.parse(localStorage.getItem('joinedCourses') || '{}');
      joinedCourses[classCode] = true;
      localStorage.setItem('joinedCourses', JSON.stringify(joinedCourses));
      
      if (redirect) router.push('/chat?class=' + classCode);
    } else {
      const joinedCourses = JSON.parse(localStorage.getItem('joinedCourses') || '{}');
      delete joinedCourses[classCode];
      localStorage.setItem('joinedCourses', JSON.stringify(joinedCourses));
    }
    
    setClasses(prevClasses => {
      const updatedClasses = prevClasses.map(item => {
        if (item.id === classCode) {
          return { ...item, joined: newJoinedState };
        }
        return item;
      });
      setPopupCourses(popupCourses.map(course => {
        const updated = updatedClasses.find(c => c.id === course.code);
        return updated ? { ...course, joined: updated.joined } : course;
      }));
      return updatedClasses;
    });
  };

  useEffect(() => {
    const fetchClasses = async () => {
      // const classData = [
      //   { code: "COMS4170", title: 'User Interface Design', instructor: 'Brian Smith (bas2137)', members: 18, joined: false },
      //   { code: "PHYSUN1494", title: 'Intro to Exp Phys-Lab', instructor: 'Giuseppina Cambareri (gc2019)', members: 42, joined: false },
      //   { code: "PHYSUN2801", title: 'Accelerated Physics I', instructor: 'Yury Levin (yl3470)', members: 13, joined: false },
      // ];
      const res = await axios.get(BACKEND_URL + '/api/classes');
      const classData = res.data.classes;
      
      const joinedCourses = JSON.parse(localStorage.getItem('joinedCourses') || '{}');
      
      const updatedClassData = classData.map(classItem => ({
        ...classItem,
        joined: joinedCourses[classItem.id] || false
      }));
      
      setClasses(updatedClassData);
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
          <Button className={styles.uploadButton} onClick={handleUploadClick}> 
            <UploadIcon className={styles.uploadIcon} />
            Upload from ICS
          </Button>
          <input
            type="file"
            accept=".ics"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </Box>

        { classes.length !== 0 &&
          <Grid container spacing={1.5} className={styles.classesGrid}>
            <Grid size={12}>
              <Typography className={styles.coursesFoundText}>{filteredClasses.length} courses found</Typography>
            </Grid>
            {filteredClasses.map((classItem, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Box className={styles.classCard}>
                  <Typography className={styles.classCode}>
                    {classItem.id}
                  </Typography>
                  <Typography className={styles.classTitle}>
                    {classItem.course_name}
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
                  <Button className={`${styles.joinButton} ${classItem.joined ? styles.joined : ''}`} onClick={() => handleJoinClick(classItem.id)}>
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
        handleJoinClick={handleJoinClick}
      />
    </>
  )
}