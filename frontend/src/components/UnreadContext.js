"use client";

import { createContext, useContext, useState } from 'react';

// Initial unread count: Start with 0, will be updated based on actual unread messages
const INITIAL_UNREAD = 0;

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
