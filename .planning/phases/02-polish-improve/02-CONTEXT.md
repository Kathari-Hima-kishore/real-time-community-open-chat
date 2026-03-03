# Phase 2: Polish & Improve - Context

**Gathered:** 2026-03-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Enhance the existing real-time chat with user-facing polish: display names, message formatting, timestamps, and XSS prevention. These improvements make the chat more user-friendly while maintaining the simple, public, no-auth model.

</domain>

<decisions>
## Implementation Decisions

### Display Names
- Users prompted for display name on first visit
- Stored in localStorage
- Users can change their name anytime via settings/icon
- Default: prompt on first use

### Message Formatting
- Basic markdown support: bold, italic, links
- Code inline supported (backticks)
- URLs auto-detected and rendered as clickable links
- Full markdown features (code blocks, lists) deferred to future phase

### Timestamps
- Hybrid approach:
  - Relative time (e.g., "5 min ago", "2 hours ago") for messages under 24 hours old
  - Absolute time (e.g., "Jan 15, 10:30 AM") for messages older than 24 hours
- Updates dynamically as time passes

### Input Sanitization
- Strip all HTML tags from user input
- Only plain text + rendered markdown allowed
- Prevents XSS attacks while allowing rich text via markdown

</decisions>

<specifics>
## Specific Ideas

- Prompt for display name in a modal or inline input when user visits for first time (no localStorage `displayName` key)
- Settings icon in header to change name after initial setup
- Relative timestamps should update live (e.g., "5 min ago" becomes "6 min ago" after a minute)

</specifics>

<deferred>
## Deferred Ideas

- Full markdown support (code blocks, lists, blockquotes) — Phase 3 or later
- User avatars — Phase 3
- Online user count — Phase 3
- Typing indicators — Phase 3
- Room/channel support — Phase 4
- Private messaging — Phase 4
- Message reactions — Phase 4

</deferred>

---

*Phase: 02-polish-improve*
*Context gathered: 2026-03-03*
