"use client"

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import GroupsIcon from '@mui/icons-material/Groups';
import AddCommentIcon from '@mui/icons-material/AddComment';
import ImageIcon from '@mui/icons-material/Image';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import MicIcon from '@mui/icons-material/MicNoneOutlined';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import styles from './chat.module.css';

// Sample data - replace with real data later
const conversations = [
  { id: 1, name: 'John Smith', preview: 'Sed ut perspiciatis unde omnis iste natus...', time: '17:19', isGroup: false },
  { id: 2, name: 'User Interface Design', preview: 'At vero eos et accusamus et iusto odio di...', time: 'Yesterday', isGroup: true, code: 'COMS4170' },
  { id: 3, name: 'Machine Learning', preview: 'John Smith: Ut enim ad minim veniam, qu...', time: 'Sunday', isGroup: true },
  { id: 4, name: 'Artificial Intelligence', preview: 'Jane Doe: Lorem ipsum dolor sit amet, co...', time: 'Friday', isGroup: true, unread: true },
  { id: 5, name: 'Intro to Python', preview: 'John Smith: Sed ut perspiciatis unde omni...', time: 'Wednesday', isGroup: true },
  { id: 6, name: 'Discrete Mathematics', preview: 'John Smith: Sed ut perspiciatis unde omni...', time: 'Wednesday', isGroup: true },
  { id: 7, name: 'Jane Doe', preview: 'Sed ut perspiciatis unde omnis iste natuse...', time: 'Monday', isGroup: false },
  { id: 8, name: 'Advanced Programming', preview: 'John Smith: Sed ut perspiciatis unde omn...', time: '01/08/2025', isGroup: true },
  { id: 9, name: 'Fundamentals of Computer Systems', preview: 'John Smith: Sed ut perspiciatis unde omn...', time: '01/09/2025', isGroup: true },
  { id: 10, name: 'Computer Graphics & Design', preview: 'John Smith: Sed ut perspiciatis unde omn...', time: '01/11/2025', isGroup: true },
];

const sampleMessages = [
  {
    id: 1,
    sender: 'John Smith',
    type: 'image',
    liked: false,
  },
  {
    id: 2,
    sender: 'John Smith',
    text: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?',
    liked: false,
  },
  {
    id: 3,
    sender: 'John Smith',
    text: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
    quoted: {
      sender: 'Jane Doe',
      text: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?'
    },
    liked: true,
  },
  {
    id: 4,
    sender: 'me',
    text: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.',
    liked: false,
  },
];

export default function ChatPage() {
  const searchParams = useSearchParams();
  const [selectedChat, setSelectedChat] = useState(2); // Default to User Interface Design
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState(sampleMessages);

  const selectedConversation = conversations.find(c => c.id === selectedChat);

  const toggleLike = (messageId) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, liked: !msg.liked } : msg
    ));
  };

  return (
    <div className={styles.chatContainer}>
      {/* Left Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.sidebarTitle}>Chat</h1>
          <div className={styles.sidebarIcons}>
            <button className={styles.iconButton}>
              <GroupsIcon style={{ color: '#0089f9' }} />
            </button>
            <button className={styles.iconButton}>
              <AddCommentIcon style={{ color: '#666' }} />
            </button>
          </div>
        </div>

        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search"
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.conversationList}>
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`${styles.conversationItem} ${selectedChat === conv.id ? styles.conversationItemActive : ''}`}
              onClick={() => setSelectedChat(conv.id)}
            >
              <div className={styles.avatar}>
                <GroupsIcon style={{ color: '#888' }} />
              </div>
              <div className={styles.conversationInfo}>
                <div className={styles.conversationHeader}>
                  <span className={styles.conversationName}>{conv.name}</span>
                  <span className={styles.conversationTime}>{conv.time}</span>
                </div>
                <div className={styles.conversationPreview}>{conv.preview}</div>
              </div>
              {conv.unread && <div className={styles.unreadDot}></div>}
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
                <GroupsIcon style={{ color: '#888' }} />
              </div>
              <div>
                <div className={styles.chatTitle}>{selectedConversation.name}</div>
                <div className={styles.chatSubtitle}>
                  {selectedConversation.code && <span>{selectedConversation.code}</span>}
                  <div className={styles.onlineStatus}>
                    <span className={styles.onlineDot}></span>
                    83 online
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.chatHeaderActions}>
              <button className={styles.reserveButton}>Reserve a Room</button>
              <button className={styles.closeButton}>
                <CloseIcon />
              </button>
            </div>
          </div>

          <div className={styles.messagesArea}>
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`${styles.message} ${msg.sender === 'me' ? styles.messageSent : ''}`}
              >
                {msg.sender !== 'me' && (
                  <div className={styles.messageHeader}>
                    <div className={styles.messageAvatar}></div>
                    <span className={styles.messageSender}>{msg.sender}</span>
                  </div>
                )}
                <div className={styles.messageContent}>
                  {msg.type === 'image' && (
                    <div className={styles.messageImage}>
                      <ImageIcon style={{ color: '#888', fontSize: 40 }} />
                    </div>
                  )}
                  {msg.quoted && (
                    <div className={styles.quotedMessage}>
                      <div className={styles.quotedSender}>
                        <span className={styles.quotedDot}></span>
                        <span className={styles.quotedName}>{msg.quoted.sender}</span>
                      </div>
                      <div className={styles.quotedText}>{msg.quoted.text}</div>
                    </div>
                  )}
                  {msg.text && <p className={styles.messageText}>{msg.text}</p>}
                  <div className={styles.messageActions}>
                    <button 
                      className={`${styles.likeButton} ${msg.liked ? styles.liked : ''}`}
                      onClick={() => toggleLike(msg.id)}
                    >
                      {msg.liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.messageInputContainer}>
            <button className={styles.addButton}>
              <AddIcon />
            </button>
            <input
              type="text"
              placeholder="Send a message"
              className={styles.messageInput}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <div className={styles.inputActions}>
              <button className={styles.inputAction}>
                <EmojiEmotionsIcon />
              </button>
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
  );
}