"use client";

import { createContext, useContext, useState } from 'react';

// Initial unread count: Machine Learning(1) + Intro to Python(3) + Discrete Math(1) + Fundamentals(2) = 7
const INITIAL_UNREAD = 7;

const UnreadContext = createContext({
  totalUnreadCount: INITIAL_UNREAD,
  setTotalUnreadCount: () => {}
});

export function UnreadProvider({ children }) {
  const [totalUnreadCount, setTotalUnreadCount] = useState(INITIAL_UNREAD);

  return (
    <UnreadContext.Provider value={{ totalUnreadCount, setTotalUnreadCount }}>
      {children}
    </UnreadContext.Provider>
  );
}

export function useUnread() {
  return useContext(UnreadContext);
}
