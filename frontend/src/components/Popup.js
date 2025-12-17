"use client"

import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Grid,
  Button,
  IconButton
} from '@mui/material'

import InstructorIcon from '@mui/icons-material/AccountCircleOutlined';
import CheckmarkIcon from '@mui/icons-material/CheckTwoTone';
import CloseIcon from '@mui/icons-material/Close';
import styles from './Popup.module.css'

export default function Popup({ open, onClose, courses = [] }) {
  if (!open) return null;

  return (
    <Box className={styles.overlay} onClick={onClose}>
      <Box className={styles.popupContainer} onClick={(e) => e.stopPropagation()}>
        <Box className={styles.popupHeader}>
          <Typography className={styles.popupTitle}>
            Courses Found
          </Typography>
          <IconButton className={styles.closeButton} onClick={onClose}>
            <CloseIcon className={styles.closeIcon} />
          </IconButton>
        </Box>

        <Box className={styles.popupContent}>
          {courses.length > 0 ? (
            <Grid container spacing={1.5} className={styles.coursesGrid}>
              {courses.map((course, index) => (
                <Grid item size={12} key={index}>
                  <Box className={styles.courseCard}>
                    <Typography className={styles.courseCode}>
                      {course.code}
                    </Typography>
                    <Typography className={styles.courseTitle}>
                      {course.title}
                    </Typography>
                    <Box className={styles.courseInstructor}>
                      <InstructorIcon className={styles.instructorIcon} />
                      <Typography className={styles.courseDescription}>
                        {course.instructor}
                      </Typography>
                    </Box>
                    <Box className={styles.courseMembersContainer}>
                      <span className={styles.greenDot}></span>
                      <Typography className={styles.courseMembers}>
                        {course.members} Members
                      </Typography>
                    </Box>
                    <Button className={`${styles.joinButton} ${course.joined ? styles.joined : ''}`}>
                      {course.joined ? 
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
          ) : (
            <Typography className={styles.noCoursesText}>
              No courses found
            </Typography>
          )}
        </Box>

        <Box className={styles.popupFooter}>
          <Typography className={styles.coursesCountText}>
            {courses.length} courses found
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

