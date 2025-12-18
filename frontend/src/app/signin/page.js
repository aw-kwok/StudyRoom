"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './signin.module.css';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [keepSignedIn, setKeepSignedIn] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle sign in logic here
    console.log('Sign in with:', email, 'Keep signed in:', keepSignedIn);
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <h1 className={styles.logo}>Study Room</h1>
      </div>
      
      <div className={styles.rightSection}>
        <div className={styles.signInCard}>
          <h2 className={styles.title}>Sign in</h2>
          
          <form onSubmit={handleSubmit}>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                placeholder=".edu Email or Phone Number"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className={styles.arrowButton}>
                <ArrowForwardIcon />
              </button>
            </div>
            
            <div className={styles.checkboxWrapper}>
              <input
                type="checkbox"
                id="keepSignedIn"
                checked={keepSignedIn}
                onChange={(e) => setKeepSignedIn(e.target.checked)}
                className={styles.checkbox}
              />
              <label htmlFor="keepSignedIn" className={styles.checkboxLabel}>
                Keep me signed in
              </label>
            </div>
            
            <div className={styles.links}>
              <span className={styles.link} style={{ cursor: 'default' }}>
                Forgotten your password?
              </span>
              <Link href="/signup" className={styles.link}>
                Create new account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
