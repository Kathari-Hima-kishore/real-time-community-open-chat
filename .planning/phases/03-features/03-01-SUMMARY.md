# Phase 3: Features - Summary

**Completed:** 2026-03-03

## Implemented Features

### User Avatars
- Each message displays a colored avatar with user initials
- Color generated deterministically from display name (8 color options)
- Initials extracted from display name (first letter + last letter for multi-word names)
- Avatars are 32px circular elements

### Online User Count
- Real-time count displayed in header ("1 user online" / "N users online")
- Uses Firestore `presence` collection
- Users marked as online on load, offline on `beforeunload`
- Count updates automatically when users join/leave

### Typing Indicators
- Shows "[Name] is typing..." when one user types
- Shows "[Name1] and [Name2] are typing..." for two users
- Shows "[N] people are typing..." for 3+ users
- Uses Firestore `typing` collection with auto-expiry (3 seconds)
- Clears when user sends message

### Message Persistence
- Messages stored in Firestore `messages` collection
- Loaded automatically on page refresh via `onSnapshot`
- Ordered by timestamp

## Files Modified
- `index.html` - Added typingIndicator, onlineCount elements
- `main.js` - Added avatar, presence, typing logic
- `style.css` - Added avatar, typing indicator, online count styles

---

*Phase: 03-features*
