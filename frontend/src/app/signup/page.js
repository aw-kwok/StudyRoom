"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './signup.module.css';

export default function SignUpPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verifyMethod, setVerifyMethod] = useState('text');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle sign up logic here
    console.log('Sign up:', { firstName, lastName, email, phoneNumber, verifyMethod });
    router.push('/onboarding');
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <h1 className={styles.logo}>Study Room</h1>
      </div>
      
      <div className={styles.rightSection}>
        <div className={styles.signUpCard}>
          <h2 className={styles.title}>Sign up</h2>
          
          <Link href="/signin" className={styles.signInLink}>
            Already have an account? Sign in
          </Link>
          
          <form onSubmit={handleSubmit}>
            <div className={styles.nameRow}>
              <input
                type="text"
                placeholder="First Name"
                className={styles.nameInput}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Last Name"
                className={styles.nameInput}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            
            <input
              type="email"
              placeholder=".edu Email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <div className={styles.divider}></div>
            
            <input
              type="tel"
              placeholder="Phone Number"
              className={styles.input}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            
            <p className={styles.phoneNote}>
              Enter a phone number where you can receive verification codes via text or a phone call when signing in.
            </p>
            
            <div className={styles.verifySection}>
              <p className={styles.verifyLabel}>Verify with a:</p>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="verifyMethod"
                    value="text"
                    checked={verifyMethod === 'text'}
                    onChange={(e) => setVerifyMethod(e.target.value)}
                    className={styles.radio}
                  />
                  Text message
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="verifyMethod"
                    value="call"
                    checked={verifyMethod === 'call'}
                    onChange={(e) => setVerifyMethod(e.target.value)}
                    className={styles.radio}
                  />
                  Phone call
                </label>
              </div>
            </div>
            
            <div className={styles.buttonRow}>
              <Link href="/signin" className={styles.cancelButton}>
                Cancel
              </Link>
              <button type="submit" className={styles.continueButton}>
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
