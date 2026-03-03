// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9UXuwY4xPIYE_Cj-MWQ2c6HCrQdSzhjE",
  authDomain: "real-time-community-chat.firebaseapp.com",
  projectId: "real-time-community-chat",
  storageBucket: "real-time-community-chat.firebasestorage.app",
  messagingSenderId: "181787914206",
  appId: "1:181787914206:web:990d9e83cfaa00e34df74f",
  measurementId: "G-ZQKVVHM3LS"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Avatar colors
const avatarColors = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6'];

// Generate or retrieve unique user ID
const userId = localStorage.getItem('user_id') || (() => {
  const id = Math.random().toString(36).slice(2, 9);
  localStorage.setItem('user_id', id);
  return id;
})();

// Alpine.js Chat App
function chatApp() {
  return {
    // State
    messages: [],
    newMessage: '',
    displayName: '',
    userId: userId,
    onlineCount: 0,
    typingUsers: [],
    typingTimeout: null,
    presenceRef: null,
    typingRef: null,
    
    // Computed
    get typingText() {
      if (this.typingUsers.length === 0) return '';
      if (this.typingUsers.length === 1) return `${this.typingUsers[0]} is typing...`;
      if (this.typingUsers.length === 2) return `${this.typingUsers[0]} and ${this.typingUsers[1]} are typing...`;
      return `${this.typingUsers.length} people are typing...`;
    },
    
    // Initialize
    async init() {
      // Get or prompt for display name
      this.displayName = localStorage.getItem('displayName') || '';
      if (!this.displayName) {
        this.promptForName();
      }
      
      // Set up presence
      this.setupPresence();
      
      // Listen for messages
      db.collection('messages')
        .orderBy('ts')
        .onSnapshot(snapshot => {
          this.messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          this.$nextTick(() => this.scrollToBottom());
        });
      
      // Listen for typing
      db.collection('typing').onSnapshot(snapshot => {
        const typers = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          if (doc.id !== this.userId && Date.now() - data.ts < 4000) {
            typers.push(data.name);
          }
        });
        this.typingUsers = typers;
      });
      
      // Listen for online count
      db.collection('presence')
        .where('online', '==', true)
        .onSnapshot(snapshot => {
          this.onlineCount = snapshot.size;
        });
    },
    
    // Display name management
    promptForName() {
      let name = '';
      while (!name || name.length > 20) {
        name = prompt('Enter your display name (max 20 characters):') || '';
        name = name.trim();
        if (!name) {
          alert('Please enter a display name.');
        } else if (name.length > 20) {
          alert('Name must be 20 characters or less.');
        }
      }
      this.displayName = name;
      localStorage.setItem('displayName', name);
    },
    
    changeName() {
      let name = '';
      while (!name || name.length > 20) {
        name = prompt('Enter your new display name (max 20 characters):', this.displayName) || '';
        name = name.trim();
        if (!name) {
          alert('Please enter a display name.');
        } else if (name.length > 20) {
          alert('Name must be 20 characters or less.');
        }
      }
      this.displayName = name;
      localStorage.setItem('displayName', name);
      this.updatePresence();
    },
    
    // Presence tracking
    setupPresence() {
      this.presenceRef = db.collection('presence').doc(this.userId);
      this.presenceRef.set({
        name: this.displayName || this.userId,
        online: true,
        ts: Date.now()
      });
      
      window.addEventListener('beforeunload', () => {
        this.presenceRef.update({ online: false });
      });
    },
    
    updatePresence() {
      if (this.presenceRef) {
        this.presenceRef.update({ 
          name: this.displayName || this.userId, 
          online: true, 
          ts: Date.now() 
        });
      }
    },
    
    // Typing indicator
    handleTyping() {
      if (!this.displayName) return;
      
      this.typingRef = db.collection('typing').doc(this.userId);
      this.typingRef.set({
        name: this.displayName,
        ts: Date.now()
      });
      
      clearTimeout(this.typingTimeout);
      this.typingTimeout = setTimeout(() => {
        this.typingRef.delete().catch(() => {});
      }, 2000);
    },
    
    // Send message
    sendMessage() {
      const text = this.newMessage.trim();
      if (!text) return;
      
      db.collection('messages').add({
        from: this.userId,
        text: text,
        ts: Date.now(),
        displayName: this.displayName
      });
      
      this.newMessage = '';
      
      // Clear typing indicator
      if (this.typingRef) {
        this.typingRef.delete().catch(() => {});
      }
      
      this.updatePresence();
    },
    
    // Scroll to bottom
    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
    
    // Avatar helpers
    getAvatarColor(name) {
      const hash = (name || 'default').split('').reduce((a, c) => ((a << 5) - a) + c.charCodeAt(0), 0);
      return avatarColors[Math.abs(hash) % avatarColors.length];
    },
    
    getInitials(name) {
      if (!name) return '?';
      const parts = name.trim().split(/\s+/);
      if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    },
    
    getOtherName(uid) {
      if (!uid) return 'Unknown';
      const hash = uid.split('').reduce((a, c) => ((a << 5) - a) + c.charCodeAt(0), 0);
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const idx = Math.abs(hash) % (26 * 26 * 26);
      const char1 = letters[Math.floor(idx / (26 * 26)) % 26];
      const char2 = letters[Math.floor(idx / 26) % 26];
      const char3 = letters[idx % 26];
      return `User ${char1}${char2}${char3}`;
    },
    
    // Format timestamp
    formatTime(ts) {
      if (!ts) return '';
      const now = Date.now();
      const diff = now - ts;
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      
      if (days >= 1) {
        const date = new Date(ts);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
      } else if (hours >= 1) {
        return `${hours}h ago`;
      } else if (minutes >= 1) {
        return `${minutes}m ago`;
      } else {
        return 'now';
      }
    },
    
    // Parse content (sanitize + markdown)
    parseContent(text) {
      if (!text) return '';
      
      // Sanitize: strip HTML tags
      let result = text.replace(/<[^>]*>/g, '');
      
      // Escape HTML entities
      result = result
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
      
      // Parse markdown
      // Bold: **text** or __text__
      result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      result = result.replace(/__(.+?)__/g, '<strong>$1</strong>');
      
      // Italic: *text* or _text_
      result = result.replace(/\*(.+?)\*/g, '<em>$1</em>');
      result = result.replace(/_(.+?)_/g, '<em>$1</em>');
      
      // Inline code: `code`
      result = result.replace(/`(.+?)`/g, '<code>$1</code>');
      
      // Links: [text](url)
      result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
      
      // Auto-link URLs
      const urlRegex = /(https?:\/\/[^\s<]+)/g;
      result = result.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener">$1</a>');
      
      return result;
    }
  };
}
