# AGENTS.md - Developer Guidelines

## Project Overview

This is a simple real-time chat application using Firebase Firestore. The project consists of vanilla HTML, CSS, and JavaScript with no build system or dependencies.

## Project Structure

```
/
├── index.html     # Main HTML file
├── main.js        # Firebase chat logic
├── style.css      # Application styles
└── LICENSE        # MIT License
```

## Build / Test Commands

This project has no build system, linter, or test framework. To test:

- **Run locally**: Open `index.html` in a browser
- **Deploy**: Use any static file server (e.g., `npx serve`, VS Code Live Server)

## Code Style Guidelines

### General Principles

- Keep files small and focused
- Use semantic HTML and CSS class names
- Avoid over-engineering - this is a simple project

### JavaScript Conventions

- Use IIFE pattern for encapsulation (already in use)
- Use const/let; avoid var
- Use arrow functions for callbacks
- Use template literals for string interpolation
- Keep functions under 20 lines

### Naming Conventions

- Variables/functions: camelCase (`userId`, `renderMessages`)
- Constants: UPPER_SNAKE_CASE for config (`firebaseConfig`)
- CSS classes: lowercase with hyphens (`.send`, `.messages`)
- HTML IDs: camelCase (`#messages`, `#msgInput`)

### HTML

- Use semantic elements (`<header>`, `<main>`, `<div>`)
- Include viewport meta tag for mobile
- Use lowercase tags

### CSS

- Use flexbox for layout
- Use hex colors with 6 digits
- Group related properties
- Use meaningful class names

### Error Handling

- Handle empty input validation
- Use try/catch for async Firebase operations when adding new features

### Firebase / Database

- Use Firestore for real-time updates
- Order messages by timestamp
- Never expose sensitive Firebase config keys in client code

## Important Notes

- This app stores user IDs in localStorage
- Messages are publicly visible to all users
- No authentication is implemented
- Consider adding input sanitization for XSS prevention if enhancing
