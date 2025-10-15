# Real-Time Community Open Chat


A simple, open, and real-time community chat application built with Vanilla JavaScript and powered by Google Firestore for its backend. This project allows users to join a public chat room and communicate anonymously in real-time.

## Live Demo

You can access a live version of the chat application here:

**[https://kathari-hima-kishore.github.io/real-time-community-open-chat/](https://kathari-hima-kishore.github.io/real-time-community-open-chat/)**

## Features

*   **Real-Time Messaging**: Messages appear instantly for all users without needing to refresh the page, thanks to Firestore's real-time listeners.
*   **Persistent Chat History**: All messages are stored objetivos in Firestore, so the history is preserved.
*   **Anonymous Users**: A unique, random user ID is generated and stored in the browser's `localStorage`, allowing for anonymous participation.
*   **Simple UI**: A clean and intuitive interface for a seamless chatting experience.

## Technologies Used

*   **Frontend**: HTML, CSS, Vanilla JavaScript
*   **Backend as a Service (BaaS)**: Google Firebase (Firestore)
*   **Deployment**: GitHub Actions for CI/CD to Azure Static Web Apps, and GitHub Pages.

## Getting Started

To run this project locally, you will need to set up your own Firebase project.

### Prerequisites

*   A Google account to create a Firebase project.
*   A code editor like VS Code with a live server extension.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/kathari-hima-kishore/real-time-community-open-chat.git
    cd real-time-community-open-chat
    ```

2.  **Create a Firebase Project:**
    *   Go to the [Firebase Console](https://console.firebase.google.com/).
    *   Click "Add project" and follow the on-screen instructions.
    *   Once your project is created, go to the project dashboard.
    *   Add a new Web app (`</>`).
    *   Give it a nickname and Firebase will provide you with a `firebaseConfig` object. Copy this object.

3.  **Configure Firebase in the project:**
    *   Open the `main.js` file.
    *   Replace the existing `firebaseConfig` object with the one you copied from your Firebase project.

    ```javascript
    // main.js

    // REPLACE THIS with your own Firebase configuration
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
    };
    ```

4.  **Enable Firestore:**
    *   In your Firebase project console, navigate to a **Firestore Database** from the left-hand menu.
    *   Click "Create database" and start in **test mode** (this will allow open read/write access for development).
    *   Choose a Cloud Firestore location.

5.  **Run the application locally:**
    *   Open the project folder in your code editor.
    *   Use a live server extension to serve `index.html`. The application will open in your default browser.

## Deployment

This repository is configured with a GitHub Actions workflow (`.github/workflows/azure-static-web-apps-ashy-beach-0c2bd381e.yml`) for continuous integration and deployment to **Azure Static Web Apps**. The workflow triggers on any push or pull request to the `main` branch, automating the build and deployment process.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
