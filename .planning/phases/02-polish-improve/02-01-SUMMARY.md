# Phase 2: Polish & Improve - Summary

**Completed:** 2026-03-03

## Implemented Features

### Display Names
- Users prompted for display name on first visit (via `prompt()`)
- Stored in localStorage (`displayName` key)
- Settings icon (⚙) in header to change name anytime
- Validation: non-empty, max 20 characters

### Message Formatting
- **bold** - `**text**` or `__text__`
- *italic* - `*text*` or `_text_`
- `inline code` - backtick wrapped
- [links](url) - markdown style links
- Auto-linked URLs (https://...)

### Timestamps
- Relative time for messages < 24h old ("5 min ago", "2 hours ago")
- Absolute time for older messages ("Jan 15, 10:30 AM")
- Updates dynamically every 60 seconds

### Input Sanitization (XSS Prevention)
- All HTML tags stripped from user input
- HTML entities escaped (&, <, >, ", ')
- Markdown rendered safely after sanitization

## Files Modified
- `index.html` - Added settings button
- `main.js` - Added display name, sanitization, markdown, timestamps
- `style.css` - Minimal styling updates

---

*Phase: 02-polish-improve*
