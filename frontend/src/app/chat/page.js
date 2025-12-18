"use client"

import React, { useState, useEffect, Suspense, useMemo, memo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '../../components/navbar';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import AddCommentIcon from '@mui/icons-material/AddComment';
import ImageIcon from '@mui/icons-material/Image';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import TurnLeftIcon from '@mui/icons-material/TurnLeft';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import MicIcon from '@mui/icons-material/MicNoneOutlined';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import Link from 'next/link';
import styles from './chat.module.css';
import { useUnread } from '../../components/UnreadContext';

const API_BASE_URL = 'http://localhost:4000/api';

// Memoized Conversation Item Component for better performance
const ConversationItem = memo(({ conv, isSelected, onSelect }) => {
  return (
    <div
      key={conv.id}
      className={`${styles.conversationItem} ${isSelected ? styles.conversationItemActive : ''}`}
      onClick={() => onSelect(conv.id)}
    >
      <div className={styles.avatarWrapper}>
        <div className={styles.avatar}>
          {conv.isGroup ? (
            <GroupsIcon className={styles.avatarIcon} />
          ) : (
            <PersonIcon className={styles.avatarIcon} />
          )}
        </div>
        {conv.unreadCount > 0 && (
          <span className={styles.unreadBadgeAvatar}>{conv.unreadCount > 9 ? '9+' : conv.unreadCount}</span>
        )}
      </div>
      <div className={styles.conversationInfo}>
        <div className={styles.conversationHeader}>
          <span className={`${styles.conversationName} ${conv.unread ? styles.conversationNameUnread : ''}`}>{conv.name}</span>
          <span className={styles.conversationTime}>{conv.time || ''}</span>
        </div>
        <div className={`${styles.conversationPreview} ${conv.unread ? styles.conversationPreviewUnread : ''}`}>{conv.preview}</div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memo
  return (
    prevProps.conv.id === nextProps.conv.id &&
    prevProps.conv.name === nextProps.conv.name &&
    prevProps.conv.preview === nextProps.conv.preview &&
    prevProps.conv.time === nextProps.conv.time &&
    prevProps.conv.unread === nextProps.conv.unread &&
    prevProps.conv.unreadCount === nextProps.conv.unreadCount &&
    prevProps.isSelected === nextProps.isSelected
  );
});

ConversationItem.displayName = 'ConversationItem';


// Simple emoji list
const emojis = ['😀', '😂', '😍', '🥳', '👍', '👋', '🎉', '❤️', '🔥', '💯', '🙌', '😎', '🤔', '👀', '✨', '💪'];

function ChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const classId = searchParams.get('class');
  const dmUsername = searchParams.get('dm');
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [allMessages, setAllMessages] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatName, setNewChatName] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const fileInputRef = React.useRef(null);

  const selectedConversation = conversations.find(c => c.id === selectedChat);
  const currentMessages = allMessages[selectedChat] || [];
  const { setTotalUnreadCount } = useUnread();
  const totalUnreadCount = conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);

  // Memoize filtered conversations for performance
  const filteredConversations = useMemo(() => {
    if (!searchQuery) return conversations;
    const query = searchQuery.toLowerCase();
    return conversations.filter(conv => 
      conv.name.toLowerCase().includes(query)
    );
  }, [conversations, searchQuery]);

  const scrollToBottom = () => {
    setTimeout(() => {
      const messagesContainer = document.querySelector(`.${styles.messagesContainer}`);
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 100);
  };

  // Fetch chats on component mount
  useEffect(() => {
    fetchChats();
  }, []);

  // Handle class-based routing
  useEffect(() => {
    if (classId) {
      handleClassChat(classId);
    }
  }, [classId]);

  // Handle DM-based routing
  useEffect(() => {
    if (dmUsername) {
      handleDMChat(dmUsername);
    }
  }, [dmUsername]);

  // Fetch messages when chat is selected
  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat);
    }
  }, [selectedChat]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (selectedChat && currentMessages.length > 0) {
      scrollToBottom();
    }
  }, [currentMessages.length, selectedChat]);

  // Update timestamps dynamically on render and periodically
  // Only updates "Now" to actual times, preserves existing formatted times
  useEffect(() => {
    const updateTimestamps = () => {
      setConversations(prev => {
        let hasChanges = false;
        const updated = prev.map(chat => {
          // Only recalculate if current time is "Now" - preserve all other formatted times
          // Don't touch empty strings, formatted times like "4:09 AM", "Yesterday", etc.
          if (chat.time === 'Now') {
            // Recalculate time based on stored timestamp
            if (chat._lastMessageTime || chat._lastMessageTimestamp) {
              const timestamp = chat._lastMessageTimestamp 
                ? chat._lastMessageTimestamp * 1000 
                : chat._lastMessageTime;
              
              if (timestamp && timestamp > 0) {
                const date = new Date(timestamp);
                
                // Only update if date is valid
                if (isNaN(date.getTime())) {
                  return chat; // Keep original if invalid
                }
                
                // Calculate difference in milliseconds
                const now = new Date();
                const diffMs = now.getTime() - date.getTime();
                const diffMins = Math.floor(diffMs / 60000);
                const diffHours = Math.floor(diffMins / 60);
                const diffDays = Math.floor(diffHours / 24);
                
                let newTime;
                // Only show "Now" if message is actually less than 1 minute old
                if (diffMins < 1 && diffMins >= 0 && diffMs >= 0) {
                  newTime = 'Now'; // Keep as "Now" if still recent
                } else if (diffDays === 0 && diffMs >= 0) {
                  // Same day - show time in 12-hour format with AM/PM (Eastern Time)
                  newTime = date.toLocaleString('en-US', { 
                    timeZone: 'America/New_York',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  });
                } else if (diffDays === 1) {
                  newTime = 'Yesterday';
                } else if (diffDays < 7 && diffDays > 0) {
                  newTime = date.toLocaleDateString('en-US', { 
                    timeZone: 'America/New_York',
                    weekday: 'long' 
                  });
                } else {
                  // Older dates
                  const msgET = new Date(date.toLocaleString('en-US', { timeZone: 'America/New_York' }));
                  const month = (msgET.getMonth() + 1).toString().padStart(2, '0');
                  const day = msgET.getDate().toString().padStart(2, '0');
                  const year = msgET.getFullYear();
                  newTime = `${month}/${day}/${year}`;
                }
                
                if (newTime && chat.time !== newTime) {
                  hasChanges = true;
                  return {
                    ...chat,
                    time: newTime
                  };
                }
              }
            }
          }
          // Keep existing formatted time (don't recalculate) - preserve "4:09 AM", "Yesterday", etc.
          return chat;
        });
        
        return hasChanges ? updated : prev;
      });
    };

    // Don't update immediately - wait a bit to avoid overriding backend times
    // Update every 30 seconds to keep timestamps fresh (only updates "Now" to actual times)
    const interval = setInterval(updateTimestamps, 30000);

    return () => clearInterval(interval);
  }, [conversations.length]); // Re-run when conversations change

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return ''; // Return empty string for missing timestamps
    
    try {
      // Handle different timestamp formats
      let date;
      if (typeof timestamp === 'string') {
        // Try parsing ISO string or other formats
        date = new Date(timestamp);
        // If ISO string parsing fails, try other formats
        if (isNaN(date.getTime()) && timestamp.includes('T')) {
          // Might be ISO without timezone, try adding Z
          date = new Date(timestamp + 'Z');
        }
      } else if (typeof timestamp === 'number') {
        // Unix timestamp (in seconds or milliseconds)
        date = new Date(timestamp > 1000000000000 ? timestamp : timestamp * 1000);
      } else if (timestamp instanceof Date) {
        date = timestamp;
      } else {
        date = new Date(timestamp);
      }
      
      if (isNaN(date.getTime())) {
        // If it's already a formatted string from backend, return it
        if (typeof timestamp === 'string') {
          // Check if it's a time format (HH:MM AM/PM or HH:MM)
          if (timestamp.match(/^\d{1,2}:\d{2}\s*(AM|PM)$/i) || timestamp.match(/^\d{1,2}:\d{2}$/)) {
            return timestamp;
          }
          // Check if it's a day name or "Yesterday"
          if (timestamp === 'Yesterday' || timestamp.match(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$/)) {
            return timestamp;
          }
          // Check if it's a date format (MM/DD/YYYY)
          if (timestamp.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
            return timestamp;
          }
        }
        console.warn('Invalid timestamp format, cannot parse:', timestamp, 'Type:', typeof timestamp);
        return ''; // Return empty string for invalid timestamps
      }
      
      // Convert to Eastern Time for display
      const easternDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/New_York' }));
      const nowEastern = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
      
      const diffMs = nowEastern - easternDate;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      
      // Match backend format: HH:MM for today, Yesterday, day name, or date
      // Only show "Now" for messages less than 1 minute old (actual recent messages)
      if (diffMins < 1 && diffMins >= 0) return 'Now';
      
      // Same day - show time in 12-hour format with AM/PM (Eastern Time)
      if (diffDays === 0) {
        // Use Eastern Time for display
        const easternTimeStr = date.toLocaleString('en-US', { 
          timeZone: 'America/New_York',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        return easternTimeStr;
      }
      
      // Yesterday
      if (diffDays === 1) {
        return 'Yesterday';
      }
      
      // This week - show day name
      if (diffDays < 7) {
        return date.toLocaleDateString('en-US', { weekday: 'long' });
      }
      
      // Older - show date in MM/DD/YYYY format
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    } catch (error) {
      console.error('Error formatting timestamp:', timestamp, error);
      return ''; // Return empty string on error
    }
  };

  const parseChatTime = (timeStr) => {
    if (!timeStr || timeStr === 'Now' || timeStr === '') return 0; // Return 0 for empty/no time (sorts to end)
    
    // Parse backend formats: "HH:MM", "Yesterday", day names, "MM/DD/YYYY"
    if (timeStr === 'Yesterday') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(23, 59, 59, 999); // End of yesterday
      return yesterday.getTime();
    }
    
    // Parse "H:MM AM/PM" or "HH:MM AM/PM" format (today)
    const timeMatch = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1]);
      const mins = parseInt(timeMatch[2]);
      const ampm = timeMatch[3].toUpperCase();
      
      // Convert to 24-hour format
      if (ampm === 'PM' && hours !== 12) {
        hours += 12;
      } else if (ampm === 'AM' && hours === 12) {
        hours = 0;
      }
      
      const today = new Date();
      today.setHours(hours, mins, 0, 0);
      return today.getTime();
    }
    
    // Fallback: Parse "HH:MM" format (24-hour, for backwards compatibility)
    if (timeStr.match(/^\d{1,2}:\d{2}$/)) {
      const [hours, mins] = timeStr.split(':').map(Number);
      const today = new Date();
      today.setHours(hours, mins, 0, 0);
      return today.getTime();
    }
    
    // Parse day names (this week)
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = dayNames.findIndex(day => timeStr.includes(day));
    if (dayIndex >= 0) {
      const today = new Date();
      const currentDay = today.getDay();
      let daysAgo = currentDay - dayIndex;
      if (daysAgo < 0) daysAgo += 7;
      const targetDate = new Date();
      targetDate.setDate(today.getDate() - daysAgo);
      targetDate.setHours(23, 59, 59, 999);
      return targetDate.getTime();
    }
    
    // Parse "MM/DD/YYYY" or "M/D/YYYY" format
    if (timeStr.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
      const [month, day, year] = timeStr.split('/').map(Number);
      const date = new Date(year, month - 1, day);
      date.setHours(23, 59, 59, 999);
      return date.getTime();
    }
    
    // Try to parse as ISO date string
    try {
      const date = new Date(timeStr);
      if (!isNaN(date.getTime())) {
        return date.getTime();
      }
    } catch {}
    
    // Default: treat as very old
    return 0;
  };

  const updateChatPreview = useCallback((chatId, newMessage) => {
    // Update the chat preview in place without re-fetching - use requestAnimationFrame for smooth updates
    requestAnimationFrame(() => {
      setConversations(prev => {
        const updated = prev.map(chat => {
          if (chat.id === chatId) {
            const messageTimestamp = newMessage.timestamp ? new Date(newMessage.timestamp).getTime() : Date.now();
            const formattedTime = formatMessageTime(newMessage.timestamp);
            
            return {
              ...chat,
              preview: newMessage.text || '[Image]',
              time: formattedTime,
              _lastMessageTime: messageTimestamp // Store timestamp for sorting
            };
          }
          return chat;
        });
        
        // Sort by most recent message timestamp (most recent first)
        return updated.sort((a, b) => {
          const timeA = a._lastMessageTime || (a.time === 'Now' ? Date.now() : 0);
          const timeB = b._lastMessageTime || (b.time === 'Now' ? Date.now() : 0);
          return timeB - timeA; // Descending order (newest first)
        });
      });
    });
  }, []);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/chats`);
      if (response.ok) {
        const data = await response.json();
        const allChats = data.chats || [];
        
        // Get courses the user has joined from localStorage
        const joinedCourses = JSON.parse(localStorage.getItem('joinedCourses') || '{}');
        const joinedClassIds = Object.keys(joinedCourses).filter(code => joinedCourses[code]);
        
        // Get invited users from localStorage
        const invitedUsers = JSON.parse(localStorage.getItem('invitedUsers') || '{}');
        const invitedUsernames = Object.keys(invitedUsers).filter(name => invitedUsers[name]);
        
        // Filter to only show chats for courses the user has joined OR DMs with invited users
        const filteredChats = allChats.filter(chat => {
          // If it's a DM, check if the user is invited
          if (chat.isDM && chat.name) {
            return invitedUsernames.includes(chat.name);
          }
          // Otherwise, check if it's a joined course
          const classId = chat.classId || chat.code;
          return joinedClassIds.includes(classId);
        });
        
        // Fetch DM conversations for invited users
        const dmPromises = invitedUsernames.map(async (username) => {
          try {
            const dmResponse = await fetch(`${API_BASE_URL}/chats/dm/${encodeURIComponent(username)}`);
            if (dmResponse.ok) {
              const dmData = await dmResponse.json();
              return dmData.chat;
            }
          } catch (error) {
            console.error(`Error fetching DM for ${username}:`, error);
          }
          return null;
        });
        
        const dmChats = (await Promise.all(dmPromises)).filter(chat => chat !== null);
        
        // Combine group chats and DM chats
        const allConversations = [...filteredChats, ...dmChats];
        
        // Remove duplicates based on id
        const uniqueChats = [];
        const seenIds = new Set();
        
        allConversations.forEach(chat => {
          const chatId = chat.id;
          
          if (chatId && seenIds.has(chatId)) {
            return; // Skip duplicate
          }
          
          if (chatId) {
            seenIds.add(chatId);
          }
          
          // Store timestamp for sorting
          const chatWithTime = {
            ...chat,
            _lastMessageTime: chat._lastMessageTimestamp 
              ? chat._lastMessageTimestamp * 1000 // Convert seconds to milliseconds
              : parseChatTime(chat.time)
          };
          uniqueChats.push(chatWithTime);
        });
        
        // Sort chats by most recent message (most recent first)
        const sortedChats = uniqueChats.sort((a, b) => {
          const timeA = parseChatTime(a.time);
          const timeB = parseChatTime(b.time);
          return timeB - timeA; // Descending order (newest first)
        });
        
        // Use requestAnimationFrame for smooth updates
        requestAnimationFrame(() => {
          setConversations(sortedChats);
        });
        
        // Update global unread count
        const total = sortedChats.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
        setTotalUnreadCount(total);
      } else {
        setConversations([]);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDMChat = async (username) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/chats/dm/${encodeURIComponent(username)}`);
      if (response.ok) {
        const data = await response.json();
        const chat = data.chat;
        
        // Check if chat already exists in conversations
        const existingIndex = conversations.findIndex(c => 
          c.id === chat.id || (c.isDM && c.name === username)
        );
        
        if (existingIndex >= 0) {
          // Update existing chat smoothly
          setConversations(prev => {
            const updated = [...prev];
            updated[existingIndex] = { ...updated[existingIndex], ...chat };
            return updated;
          });
        } else {
          // Add new DM chat to list with smooth animation
          setConversations(prev => {
            const alreadyExists = prev.some(c => 
              c.id === chat.id || (c.isDM && c.name === username)
            );
            
            if (alreadyExists) {
              return prev.map(c => 
                (c.id === chat.id || (c.isDM && c.name === username)) ? { ...c, ...chat } : c
              );
            }
            
            return [chat, ...prev];
          });
        }
        
        // Select this chat
        setSelectedChat(chat.id);
      } else {
        console.error('Failed to fetch/create DM chat');
      }
    } catch (error) {
      console.error('Error handling DM chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClassChat = async (classId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/chats/class/${classId}`);
      if (response.ok) {
        const data = await response.json();
        const chat = data.chat;
        
        // Check if chat already exists in conversations (check by id, classId, code, or name)
        const existingIndex = conversations.findIndex(c => 
          c.id === chat.id || 
          c.classId === classId || 
          c.code === classId ||
          (c.name === chat.name && (c.classId === chat.classId || c.code === chat.code))
        );
        
        if (existingIndex >= 0) {
          // Update existing chat smoothly (don't create duplicate)
          setConversations(prev => {
            const updated = [...prev];
            updated[existingIndex] = { ...updated[existingIndex], ...chat };
            return updated;
          });
        } else {
          // Add new chat to list only if it doesn't already exist
          setConversations(prev => {
            // Double-check for duplicates before adding
            const alreadyExists = prev.some(c => 
              c.id === chat.id || 
              c.classId === chat.classId || 
              c.code === chat.code ||
              (c.name === chat.name && (c.classId === chat.classId || c.code === chat.code))
            );
            
            if (alreadyExists) {
              // Update existing instead of adding duplicate
              return prev.map(c => 
                (c.id === chat.id || c.classId === chat.classId || c.code === chat.code) ? { ...c, ...chat } : c
              );
            }
            
            return [chat, ...prev];
          });
        }
        
        // Select this chat
        setSelectedChat(chat.id);
      } else {
        console.error('Failed to fetch/create class chat');
      }
    } catch (error) {
      console.error('Error handling class chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      setLoadingMessages(true);
      const encodedChatId = encodeURIComponent(chatId);
      const response = await fetch(`${API_BASE_URL}/chats/${encodedChatId}/messages`);
      if (response.ok) {
        const data = await response.json();
        setAllMessages(prev => ({
          ...prev,
          [chatId]: data.messages || []
        }));
        scrollToBottom();
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to fetch messages:', response.status, errorData);
        setAllMessages(prev => ({
          ...prev,
          [chatId]: []
        }));
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setAllMessages(prev => ({
        ...prev,
        [chatId]: []
      }));
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSelectChat = useCallback((chatId) => {
    setSelectedChat(chatId);
    // Mark as read when opened and update global count
    setConversations(prev => {
      const updated = prev.map(conv => 
        conv.id === chatId ? { ...conv, unread: false, unreadCount: 0 } : conv
      );
      // Calculate new total and update global context
      const newTotal = updated.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
      setTotalUnreadCount(newTotal);
      return updated;
    });
    
    // Fetch messages for this chat
    fetchMessages(chatId);
  }, []);

  const handleNewChat = () => {
    setShowNewChatModal(true);
  };

  const createNewChat = () => {
    if (!newChatName.trim()) return;
    
    const newChat = {
      id: Date.now(),
      name: newChatName.trim(),
      preview: 'No messages yet',
      time: 'Now',
      isGroup: newChatName.includes(' ') ? false : true,
    };
    
    setConversations(prev => [newChat, ...prev]);
    setSelectedChat(newChat.id);
    setNewChatName('');
    setShowNewChatModal(false);
  };

  const toggleLike = async (messageId) => {
    if (!selectedChat) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/chats/${selectedChat}/messages/${messageId}/like`, {
        method: 'PATCH'
      });

      if (response.ok) {
        const data = await response.json();
        setAllMessages(prev => ({
          ...prev,
          [selectedChat]: (prev[selectedChat] || []).map(msg =>
            msg.id === messageId ? { ...msg, liked: data.liked } : msg
          )
        }));
      } else {
        console.error('Failed to toggle like');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleReply = (msg) => {
    setReplyingTo({
      id: msg.id,
      sender: msg.sender,
      text: msg.text || '[Image]'
    });
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  // Counter for unique temp message IDs
  const tempIdCounterRef = React.useRef(0);
  
  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedChat) return;
    
    const messageText = messageInput.trim();
    // Use counter + timestamp + random for guaranteed uniqueness
    tempIdCounterRef.current += 1;
    const tempMessageId = `temp-${Date.now()}-${tempIdCounterRef.current}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Create optimistic message immediately
    const optimisticTimestamp = new Date().toISOString();
    const optimisticMessage = {
      id: tempMessageId,
      sender: 'John Doe',
      text: messageText,
      type: 'text',
      liked: false,
      status: 'sending',
      timestamp: optimisticTimestamp,
      showHeader: false,
      ...(replyingTo && {
        quoted: {
          sender: replyingTo.sender,
          text: replyingTo.text
        }
      })
    };
    
    // Add optimistic message to UI immediately
    setAllMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), optimisticMessage]
    }));
    
    // Update chat preview immediately (optimistic update) - show "Now" for optimistic
    updateChatPreview(selectedChat, { ...optimisticMessage, timestamp: optimisticTimestamp });
    
    // Clear input immediately
    const savedReplyingTo = replyingTo;
    setMessageInput('');
    setReplyingTo(null);
    
    // Scroll to bottom after adding optimistic message
    scrollToBottom();
    
    // Send to backend in background
    const messageData = {
      text: messageText,
      type: 'text',
      ...(savedReplyingTo && {
        quoted: {
          sender: savedReplyingTo.sender,
          text: savedReplyingTo.text
        }
      })
    };

    try {
      const response = await fetch(`${API_BASE_URL}/chats/${encodeURIComponent(selectedChat)}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData)
      });

      if (response.ok) {
        const data = await response.json();
        const serverMessage = data.message;
        
        // Replace optimistic message with server message
        setAllMessages(prev => {
          const currentMessages = prev[selectedChat] || [];
          const tempIndex = currentMessages.findIndex(msg => msg.id === tempMessageId);
          
          if (tempIndex >= 0) {
            // Replace the temporary message with the real one
            const updatedMessages = [...currentMessages];
            
            // Check if server message ID already exists (handle race conditions)
            const existingServerIndex = updatedMessages.findIndex(
              (msg, idx) => msg.id === serverMessage.id && idx !== tempIndex && !msg.id.toString().startsWith('temp-')
            );
            
            if (existingServerIndex >= 0) {
              // Server message with this ID already exists, remove the temp one
              updatedMessages.splice(tempIndex, 1);
            } else {
              // Safe to replace - add tempMessageId to server message for unique key
              const messageWithTempId = { ...serverMessage, _tempId: tempMessageId };
              updatedMessages[tempIndex] = messageWithTempId;
            }
            
            return {
              ...prev,
              [selectedChat]: updatedMessages
            };
          } else {
            // If temp message not found, check if server message already exists
            const alreadyExists = currentMessages.some(
              msg => msg.id === serverMessage.id && !msg.id.toString().startsWith('temp-')
            );
            
            if (!alreadyExists) {
              return {
                ...prev,
                [selectedChat]: [...currentMessages, serverMessage]
              };
            }
            
            // Already exists, don't add duplicate
            return prev;
          }
        });
        
        // Update chat preview smoothly without re-fetching
        updateChatPreview(selectedChat, serverMessage);
      } else {
        // Remove optimistic message on error
        setAllMessages(prev => {
          const currentMessages = prev[selectedChat] || [];
          return {
            ...prev,
            [selectedChat]: currentMessages.filter(msg => msg.id !== tempMessageId)
          };
        });
        
        // Restore input and reply state
        setMessageInput(messageText);
        setReplyingTo(savedReplyingTo);
        
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to send message:', response.status, errorData);
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      // Remove optimistic message on error
      setAllMessages(prev => {
        const currentMessages = prev[selectedChat] || [];
        return {
          ...prev,
          [selectedChat]: currentMessages.filter(msg => msg.id !== tempMessageId)
        };
      });
      
      // Restore input and reply state
      setMessageInput(messageText);
      setReplyingTo(savedReplyingTo);
      
      console.error('Error sending message:', error);
      alert('Error sending message. Please check your connection and try again.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const addEmoji = (emoji) => {
    setMessageInput(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleMediaUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a new message with the uploaded image
      const newMessage = {
        id: Date.now(),
        sender: 'me',
        type: 'image',
        fileName: file.name,
        liked: false,
      };

      setAllMessages(prev => ({
        ...prev,
        [selectedChat]: [...(prev[selectedChat] || []), newMessage]
      }));
      
      // Reset file input
      e.target.value = '';
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Top Header */}
      <header className={styles.topHeader}>
        <Link href="/" className={styles.logo}>StudyRoom</Link>
        <button className={styles.logoutButton} onClick={() => router.push('/signin')}>
          <LogoutIcon />
        </button>
      </header>

      <div className={styles.mainContent}>
        {/* Existing Navbar */}
        <Navbar />

        {/* Chat Container */}
        <div className={styles.chatContainer}>
          {/* Left Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <h1 className={styles.sidebarTitle}>Chat</h1>
              <div className={styles.sidebarIcons}>
                <button className={styles.iconButton} title="New Chat" onClick={handleNewChat}>
                  <AddCommentIcon className={styles.headerIconGray} />
                </button>
              </div>
            </div>

            {showNewChatModal && (
              <div className={styles.newChatModal}>
                <input
                  type="text"
                  placeholder="Enter name or group..."
                  className={styles.newChatInput}
                  value={newChatName}
                  onChange={(e) => setNewChatName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && createNewChat()}
                  autoFocus
                />
                <div className={styles.newChatButtons}>
                  <button className={styles.cancelButton} onClick={() => setShowNewChatModal(false)}>
                    Cancel
                  </button>
                  <button className={styles.createButton} onClick={createNewChat}>
                    Create
                  </button>
                </div>
              </div>
            )}

            <div className={styles.searchContainer}>
              <SearchIcon className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search"
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className={styles.conversationList}>
              {loading ? (
                <div className={styles.loadingMessage}>Loading chats...</div>
              ) : filteredConversations.length === 0 ? (
                <div className={styles.emptyChatList}>No chats found</div>
              ) : (
                filteredConversations.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conv={conv}
                    isSelected={selectedChat === conv.id}
                    onSelect={handleSelectChat}
                  />
                ))
              )}
            </div>
          </div>

          {/* Right Chat Panel */}
          {selectedConversation ? (
            <div className={styles.chatPanel}>
              <div className={styles.chatHeader}>
                <div className={styles.chatHeaderInfo}>
                  <div className={styles.chatAvatar}>
                    {selectedConversation.isGroup ? (
                      <GroupsIcon className={styles.avatarIcon} />
                    ) : (
                      <PersonIcon className={styles.avatarIcon} />
                    )}
                  </div>
                  <div className={styles.chatHeaderText}>
                    <div className={styles.chatTitle}>{selectedConversation.name}</div>
                    <div className={styles.chatSubtitle}>
                      {selectedConversation.code && (
                        <span className={styles.chatCode}>{selectedConversation.code}</span>
                      )}
                      {selectedConversation.isGroup ? (
                        <span className={styles.onlineStatus}>
                          <span className={styles.onlineDot}></span>
                          <span>{selectedConversation.onlineCount} Online</span>
                        </span>
                      ) : (
                        <span className={`${styles.userStatus} ${styles[selectedConversation.userStatus]}`}>
                          <span className={`${styles.userStatusDot} ${styles[selectedConversation.userStatus]}`}></span>
                          <span>{selectedConversation.userStatus === 'online' ? 'Online' : selectedConversation.userStatus === 'away' ? 'Away' : 'Offline'}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className={styles.chatHeaderActions}>
                  <a href="https://seats.library.columbia.edu/reserve/spaces/business-group-study" target="_blank" rel="noopener noreferrer" className={styles.reserveButton}>Reserve a Room</a>
                  <button className={styles.closeButton}>
                    <CloseIcon />
                  </button>
                </div>
              </div>

              <div className={styles.messagesArea}>
                <div className={styles.messagesContainer}>
                {loadingMessages ? (
                  <div className={styles.loadingMessage}>Loading messages...</div>
                ) : currentMessages.length === 0 ? (
                  <div className={styles.noMessages}>
                    <p>No messages yet</p>
                    <p className={styles.noMessagesSubtext}>Be the first to send a message!</p>
                  </div>
                ) : (
                  currentMessages.map((msg) => {
                    // Treat "John Doe" as current user (same as "me")
                    const isCurrentUser = msg.sender === 'me' || msg.sender === 'John Doe';
                    
                    return (
                    <div 
                      key={msg._tempId || `${msg.id}-${msg.timestamp || Date.now()}-${msg.text?.substring(0, 10) || ''}`} 
                      className={`${styles.message} ${isCurrentUser ? styles.messageSent : styles.messageReceived} ${msg.continuation ? styles.messageContinuation : ''}`}
                    >
                      {!isCurrentUser && msg.showHeader && (
                        <div className={styles.messageHeader}>
                          <div className={styles.messageAvatarWrapper}>
                            <div className={styles.messageAvatar}>
                              <PersonIcon className={styles.messageAvatarIcon} />
                            </div>
                            <span className={`${styles.avatarDot} ${msg.status === 'online' ? styles.online : styles.away}`}></span>
                          </div>
                          <span className={styles.messageSender}>{msg.sender}</span>
                        </div>
                      )}
                      
                      <div className={`${styles.messageContent} ${(msg.showHeader || msg.indented) ? styles.messageContentIndented : ''}`}>
                        {msg.type === 'image' && (
                          <div className={styles.messageImage}>
                            <ImageIcon className={styles.imageIcon} />
                          </div>
                        )}
                        
                        {msg.quoted && (
                          <div className={styles.quotedSection}>
                            <div className={styles.quotedHeader}>
                              <div className={styles.quotedAvatarWrapper}>
                                <div className={styles.quotedAvatar}>
                                  <PersonIcon className={styles.quotedAvatarIcon} />
                                </div>
                                <span className={`${styles.avatarDot} ${styles.online}`}></span>
                              </div>
                              <div className={styles.quotedRight}>
                                <div className={styles.quotedSenderRow}>
                                  <span className={styles.quotedSenderName}>{msg.quoted.sender}</span>
                                </div>
                                <div className={styles.quotedBubble}>
                                  <div className={styles.quotedText}>{msg.quoted.text}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {msg.text && (
                          <div className={`${styles.messageRow} ${msg.quoted ? styles.messageRowIndented : ''}`}>
                            <p className={styles.messageText}>{msg.text}</p>
                            <div className={`${styles.messageActions} ${msg.liked ? styles.messageActionsVisible : ''}`}>
                              <button 
                                className={styles.replyButton}
                                onClick={() => handleReply(msg)}
                                title="Reply"
                              >
                                <TurnLeftIcon />
                              </button>
                              <button 
                                className={`${styles.likeButton} ${msg.liked ? styles.liked : ''}`}
                                onClick={() => toggleLike(msg.id)}
                              >
                                {msg.liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                  })
                )}
                </div>
              </div>

              {replyingTo && (
                <div className={styles.replyPreview}>
                  <div className={styles.replyPreviewContent}>
                    <span className={styles.replyPreviewLabel}>Replying to {replyingTo.sender}</span>
                    <span className={styles.replyPreviewText}>{replyingTo.text}</span>
                  </div>
                  <button className={styles.replyPreviewClose} onClick={cancelReply}>
                    <CloseIcon />
                  </button>
                </div>
              )}

              <div className={styles.messageInputContainer}>
                <input
                  type="file"
                  ref={fileInputRef}
                  className={styles.hiddenFileInput}
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                />
                <button className={styles.addButton} onClick={handleMediaUpload} title="Upload media">
                  <AddIcon />
                </button>
                <input
                  type="text"
                  placeholder="Send a message"
                  className={styles.messageInput}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <div className={styles.inputActions}>
                  <div className={styles.emojiWrapper}>
                    <button 
                      className={styles.inputAction}
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <EmojiEmotionsIcon />
                    </button>
                    {showEmojiPicker && (
                      <div className={styles.emojiPicker}>
                        {emojis.map((emoji, index) => (
                          <button 
                            key={index} 
                            className={styles.emojiButton}
                            onClick={() => addEmoji(emoji)}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button className={styles.inputAction}>
                    <MicIcon />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.emptyChat}>
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatContent />
    </Suspense>
  );
}
