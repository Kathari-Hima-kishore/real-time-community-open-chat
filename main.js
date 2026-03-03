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
const PRESENCE_TIMEOUT = 60000;
const HEARTBEAT_INTERVAL = 30000;

// Generate or retrieve unique user ID
const userId = localStorage.getItem('user_id') || (() => {
  const id = Math.random().toString(36).slice(2, 9);
  localStorage.setItem('user_id', id);
  return id;
})();

// Generate random guest name
function generateGuestName() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const part1 = letters[Math.floor(Math.random() * 26)];
  const part2 = letters[Math.floor(Math.random() * 26)];
  const part3 = Math.floor(Math.random() * 90) + 10;
  return `Guest ${part1}${part2}${part3}`;
}

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
    heartbeatInterval: null,
    guestName: null,

    // Computed
    get typingText() {
      if (this.typingUsers.length === 0) return '';
      if (this.typingUsers.length === 1) return `${this.typingUsers[0]} is typing...`;
      if (this.typingUsers.length === 2) return `${this.typingUsers[0]} and ${this.typingUsers[1]} are typing...`;
      return `${this.typingUsers.length} people are typing...`;
    },

    // Initialize
    async init() {
      // Get display name from localStorage or generate guest name
      this.displayName = localStorage.getItem('displayName') || '';
      if (!this.displayName) {
        this.guestName = localStorage.getItem('guestName') || generateGuestName();
        localStorage.setItem('guestName', this.guestName);
        this.displayName = this.guestName;
      }

      // Clean up stale presence entries
      await this.cleanupStalePresence();

      // Set up presence with heartbeat
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

      // Listen for online count (use timestamp-based query)
      this.setupOnlineCountListener();
    },

    // Clean up stale presence entries
    async cleanupStalePresence() {
      const staleThreshold = Date.now() - PRESENCE_TIMEOUT;
      try {
        const snapshot = await db.collection('presence').get();
        const batch = db.batch();
        snapshot.forEach(doc => {
          const data = doc.data();
          if (data.ts < staleThreshold) {
            batch.update(doc.ref, { online: false });
          }
        });
        await batch.commit();
      } catch (e) {
        console.log('Cleanup error:', e);
      }
    },

    // Setup online count listener with real-time updates
    setupOnlineCountListener() {
      db.collection('presence')
        .where('online', '==', true)
        .onSnapshot(snapshot => {
          const now = Date.now();
          let count = 0;
          snapshot.forEach(doc => {
            const data = doc.data();
            if (data.ts && (now - data.ts) < PRESENCE_TIMEOUT) {
              count++;
            }
          });
          this.onlineCount = count;
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
      this.updatePresence();
    },

    changeName() {
      let name = '';
      while (!name || name.length > 20) {
        name = prompt('Enter your new display name (max 20 characters):', this.displayName) || '';
        name = name.trim();
        if (!name) {
          return;
        } else if (name.length > 20) {
          alert('Name must be 20 characters or less.');
        }
      }
      this.displayName = name;
      localStorage.setItem('displayName', name);
      this.updatePresence();
    },

    // Presence tracking with heartbeat
    setupPresence() {
      this.presenceRef = db.collection('presence').doc(this.userId);

      // Set initial presence
      this.updatePresence();

      // Heartbeat to keep presence alive
      this.heartbeatInterval = setInterval(() => {
        this.updatePresence();
      }, HEARTBEAT_INTERVAL);

      // Handle visibility change (tab switch, minimize, mobile)
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          this.updatePresence();
          this.cleanupStalePresence();
        }
      });

      // Handle page unload
      window.addEventListener('beforeunload', () => {
        this.setOffline();
      });

      // Handle mobile visibility
      document.addEventListener('pagehide', () => {
        this.setOffline();
      });
    },

    setOffline() {
      if (this.presenceRef) {
        this.presenceRef.update({ online: false }).catch(() => {});
      }
      if (this.heartbeatInterval) {
        clearInterval(this.heartbeatInterval);
      }
    },

    updatePresence() {
      if (this.presenceRef) {
        this.presenceRef.set({
          name: this.displayName || this.guestName || this.userId,
          online: true,
          ts: Date.now()
        }, { merge: true });
      }
    },

    // Typing indicator
    handleTyping() {
      const name = this.displayName || this.guestName;
      if (!name) return;

      this.typingRef = db.collection('typing').doc(this.userId);
      this.typingRef.set({
        name: name,
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

      const name = this.displayName || this.guestName;

      db.collection('messages').add({
        from: this.userId,
        text: text,
        ts: Date.now(),
        displayName: name
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
      const hash = uid.split('').reduce((a, c) => ((a << 5
