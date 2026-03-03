# Phase 3: Features - Context

**Gathered:** 2026-03-03
**Status:** Completed

<domain>
## Phase Boundary

Add engaging features to the chat: user avatars with initials, online presence tracking, and typing indicators. These make the chat feel more alive and social while maintaining the simple, public, no-auth model.

</domain>

<decisions>
## Implementation Decisions

### User Avatars
- Generate color from display name using simple hash (8 colors)
- Show initials (first letter + last letter for multi-word names)
- 32px circular avatar next to each message
- Fallback to "?" if no name available

### Online User Count
- Use Firestore `presence` collection to track online users
- Mark user as online on page load
- Mark user as offline on beforeunload event
- Show real-time count in header

### Typing Indicators
- Use Firestore `typing` collection
- Set document when user types, auto-delete after 3 seconds
- Show who is typing or "N people are typing"
- Clear indicator when user sends message

</decisions>

<specifics>
## Implementation Details

- Avatars: Use getAvatarColor() and getInitials() functions
- Presence: Use onSnapshot to watch for changes
- Typing: Debounce with 2-second timeout, 3-second expiry

</specifics>

---

*Phase: 03-features*
*Context gathered: 2026-03-03*
