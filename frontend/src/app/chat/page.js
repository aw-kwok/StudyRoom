"use client"

import React, { useState, Suspense } from 'react';
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

// Sample conversation data
const initialConversations = [
  { id: 1, name: 'John Smith', preview: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', time: '17:19', isGroup: false, userStatus: 'online' },
  { id: 2, name: 'User Interface Design', preview: 'Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore...', time: 'Yesterday', isGroup: true, code: 'COMS4170', onlineCount: 83 },
  { id: 3, name: 'Machine Learning', preview: 'John Smith: Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse...', time: 'Sunday', isGroup: true, code: 'COMS4771W', unread: true, unreadCount: 1, onlineCount: 45 },
  { id: 4, name: 'Artificial Intelligence', preview: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore...', time: 'Friday', isGroup: true, code: 'COMS4701W', onlineCount: 67 },
  { id: 5, name: 'Intro to Python', preview: 'John Smith: Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit...', time: 'Wednesday', isGroup: true, code: 'AUPL6845O', unread: true, unreadCount: 3, onlineCount: 124 },
  { id: 6, name: 'Discrete Mathematics', preview: 'Mike Brown: Temporibus autem quibusdam et aut officiis debitis aut rerum...', time: 'Wednesday', isGroup: true, code: 'COMS3203W', unread: true, unreadCount: 1, onlineCount: 38 },
  { id: 7, name: 'Jane Doe', preview: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil...', time: 'Monday', isGroup: false, userStatus: 'away' },
  { id: 8, name: 'Advanced Programming', preview: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore...', time: '01/08/2025', isGroup: true, code: 'COMS3157W', onlineCount: 56 },
  { id: 9, name: 'Fundamentals of Computer Systems', preview: 'John Smith: Doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo...', time: '01/09/2025', isGroup: true, code: 'CSEE3827', unread: true, unreadCount: 2, onlineCount: 92 },
  { id: 10, name: 'Computer Graphics & Design', preview: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis...', time: '01/11/2025', isGroup: true, code: 'MECE3408E', onlineCount: 31 },
];

// Chat history for all conversations
const initialMessages = {
  1: [
    {
      id: 1,
      sender: 'John Smith',
      status: 'online',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      liked: false,
      showHeader: true,
    },
    {
      id: 2,
      sender: 'me',
      text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      liked: false,
    },
    {
      id: 3,
      sender: 'John Smith',
      status: 'online',
      text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      liked: true,
      showHeader: true,
    },
    {
      id: 4,
      sender: 'me',
      text: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      liked: false,
    },
  ],
  2: [
    {
      id: 1,
      sender: 'John Smith',
      status: 'away',
      type: 'image',
      liked: false,
      showHeader: true,
      continuation: true,
    },
    {
      id: 2,
      sender: 'John Smith',
      text: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?',
      liked: false,
      showHeader: false,
      indented: true,
    },
    {
      id: 3,
      sender: 'Jane Doe',
      status: 'online',
      text: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
      quoted: {
        sender: 'Jane Doe',
        text: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?'
      },
      liked: true,
      showHeader: false,
    },
    {
      id: 4,
      sender: 'me',
      text: 'Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
      liked: false,
    },
  ],
  3: [
    {
      id: 1,
      sender: 'John Smith',
      status: 'online',
      text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
      liked: false,
      showHeader: true,
    },
    {
      id: 2,
      sender: 'Alice Chen',
      status: 'away',
      text: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
      liked: false,
      showHeader: true,
    },
    {
      id: 3,
      sender: 'me',
      text: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
      liked: true,
    },
    {
      id: 4,
      sender: 'John Smith',
      status: 'online',
      text: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur?',
      liked: false,
      showHeader: true,
    },
  ],
  4: [
    {
      id: 1,
      sender: 'Jane Doe',
      status: 'online',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      liked: true,
      showHeader: true,
    },
    {
      id: 2,
      sender: 'Bob Wilson',
      status: 'away',
      text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
      liked: false,
      showHeader: true,
    },
    {
      id: 3,
      sender: 'me',
      text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      liked: false,
    },
  ],
  5: [
    {
      id: 1,
      sender: 'John Smith',
      status: 'online',
      text: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      liked: false,
      showHeader: true,
    },
    {
      id: 2,
      sender: 'Sarah Lee',
      status: 'online',
      text: 'Eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
      liked: true,
      showHeader: true,
    },
    {
      id: 3,
      sender: 'John Smith',
      status: 'online',
      text: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.',
      liked: false,
      showHeader: true,
    },
  ],
  6: [
    {
      id: 1,
      sender: 'John Smith',
      status: 'away',
      text: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum.',
      liked: false,
      showHeader: true,
    },
    {
      id: 2,
      sender: 'me',
      text: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.',
      liked: true,
    },
    {
      id: 3,
      sender: 'Mike Brown',
      status: 'online',
      text: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet.',
      liked: false,
      showHeader: true,
    },
  ],
  7: [
    {
      id: 1,
      sender: 'Jane Doe',
      status: 'online',
      text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
      liked: false,
      showHeader: true,
    },
    {
      id: 2,
      sender: 'me',
      text: 'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
      liked: false,
    },
    {
      id: 3,
      sender: 'Jane Doe',
      status: 'online',
      text: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
      liked: true,
      showHeader: true,
    },
    {
      id: 4,
      sender: 'me',
      text: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur?',
      liked: false,
    },
  ],
  8: [
    {
      id: 1,
      sender: 'John Smith',
      status: 'online',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      liked: false,
      showHeader: true,
    },
    {
      id: 2,
      sender: 'Emily Davis',
      status: 'away',
      text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      liked: false,
      showHeader: true,
    },
    {
      id: 3,
      sender: 'me',
      text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      liked: true,
    },
  ],
  9: [
    {
      id: 1,
      sender: 'John Smith',
      status: 'online',
      text: 'Excepteur sint occaecat cupidatat non proident.',
      liked: false,
      showHeader: true,
    },
    {
      id: 2,
      sender: 'me',
      text: 'Sunt in culpa qui officia deserunt mollit anim id est laborum.',
      liked: false,
    },
    {
      id: 3,
      sender: 'Chris Taylor',
      status: 'online',
      text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.',
      liked: false,
      showHeader: true,
    },
    {
      id: 4,
      sender: 'John Smith',
      status: 'online',
      text: 'Doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.',
      liked: true,
      showHeader: true,
    },
  ],
  10: [
    {
      id: 1,
      sender: 'John Smith',
      status: 'away',
      text: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
      liked: false,
      showHeader: true,
    },
    {
      id: 2,
      sender: 'me',
      text: 'Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
      liked: false,
    },
    {
      id: 3,
      sender: 'Lisa Wang',
      status: 'online',
      text: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
      liked: true,
      showHeader: true,
    },
    {
      id: 4,
      sender: 'me',
      text: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum.',
      liked: false,
    },
  ],
};

// Simple emoji list
const emojis = ['😀', '😂', '😍', '🥳', '👍', '👋', '🎉', '❤️', '🔥', '💯', '🙌', '😎', '🤔', '👀', '✨', '💪'];

function ChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedChat, setSelectedChat] = useState(2);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [allMessages, setAllMessages] = useState(initialMessages);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [conversations, setConversations] = useState(initialConversations);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatName, setNewChatName] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const fileInputRef = React.useRef(null);

  const selectedConversation = conversations.find(c => c.id === selectedChat);
  const currentMessages = allMessages[selectedChat] || [];
  const { setTotalUnreadCount } = useUnread();
  const totalUnreadCount = conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);

  const handleSelectChat = (chatId) => {
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
  };

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

  const toggleLike = (messageId) => {
    setAllMessages(prev => ({
      ...prev,
      [selectedChat]: (prev[selectedChat] || []).map(msg =>
        msg.id === messageId ? { ...msg, liked: !msg.liked } : msg
      )
    }));
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

  const sendMessage = () => {
    if (!messageInput.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      sender: 'me',
      text: messageInput.trim(),
      liked: false,
      ...(replyingTo && {
        quoted: {
          sender: replyingTo.sender,
          text: replyingTo.text
        }
      })
    };

    setAllMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMessage]
    }));
    setMessageInput('');
    setReplyingTo(null);
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
              {conversations
                .filter(conv => 
                  conv.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((conv) => (
                <div
                  key={conv.id}
                  className={`${styles.conversationItem} ${selectedChat === conv.id ? styles.conversationItemActive : ''}`}
                  onClick={() => handleSelectChat(conv.id)}
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
                      <span className={styles.conversationTime}>{conv.time}</span>
                    </div>
                    <div className={`${styles.conversationPreview} ${conv.unread ? styles.conversationPreviewUnread : ''}`}>{conv.preview}</div>
                  </div>
                </div>
              ))}
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
                {currentMessages.length === 0 ? (
                  <div className={styles.noMessages}>
                    <p>No messages yet</p>
                    <p className={styles.noMessagesSubtext}>Be the first to send a message!</p>
                  </div>
                ) : (
                  currentMessages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`${styles.message} ${msg.sender === 'me' ? styles.messageSent : styles.messageReceived} ${msg.continuation ? styles.messageContinuation : ''}`}
                    >
                      {msg.sender !== 'me' && msg.showHeader && (
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
                  ))
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
