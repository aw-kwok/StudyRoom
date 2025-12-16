"use client";

import {
  Box,
  List,
  ListItem,
  ListItemIcon, 
  ListItemText
} from '@mui/material'

import HomeIcon from '@mui/icons-material/HomeOutlined';
import ChatIcon from '@mui/icons-material/ChatBubbleOutline';
import ProfileIcon from '@mui/icons-material/PersonOutline';
import HomeFilledIcon from '@mui/icons-material/Home';
import ChatFilledIcon from '@mui/icons-material/ChatBubble';
import ProfileFilledIcon from '@mui/icons-material/Person';

import styles from './navbar.module.css'

import Link from 'next/link'
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  return (
    <Box className={styles.navbarContainer}>
      <List className={styles.navList}>
        <ListItem>
          <Link href="/chat">
            <ListItemIcon sx={{ minWidth: 'auto' }}>
              {pathname === '/chat' ? (
                <ChatFilledIcon className={`${styles.navIcon} ${styles.filledIcon}`} />
              ) : (
                <ChatIcon className={`${styles.navIcon}`} />
              )}
            </ListItemIcon>
          </Link>
        </ListItem>
        <ListItem>
          <Link href="/">
            <ListItemIcon sx={{ minWidth: 'auto' }}>
              {pathname === '/' ? (
                <HomeFilledIcon className={`${styles.navIcon} ${styles.filledIcon}`} />
              ) : (
                <HomeIcon className={`${styles.navIcon}`} />
              )}
            </ListItemIcon>
          </Link>
        </ListItem>
        <ListItem>
          <Link href="/profile">
            <ListItemIcon sx={{ minWidth: 'auto' }}>
              {pathname === '/profile' ? (
                <ProfileFilledIcon className={`${styles.navIcon} ${styles.filledIcon}`} />
              ) : (
                <ProfileIcon className={`${styles.navIcon}`} />
              )}
            </ListItemIcon>
          </Link>
        </ListItem>
      </List>
    </Box>
  )
}