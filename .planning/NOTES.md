# Notes

Project notes, ideas, and documentation.

## Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Backend**: Firebase Firestore (NoSQL)
- **Storage**: localStorage for user IDs

## Key Files

| File | Purpose |
|------|---------|
| index.html | Main UI |
| main.js | Firebase logic & chat |
| style.css | Styling |

## Firebase Structure

```
collection: "messages"
  - text: string
  - userId: string
  - timestamp: serverTimestamp
```

## Known Limitations

- No authentication
- Messages publicly visible
- User IDs stored in localStorage (auto-generated UUIDs)

## Ideas

- [ ] Add dark mode toggle
- [ ] Emoji picker
- [ ] File/image sharing
- [ ] Message editing
- [ ] Delete own messages
