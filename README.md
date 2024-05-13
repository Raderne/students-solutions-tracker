# Student Solutions Tracking Website

## Overview

The **Student Solutions Tracking website** is a platform designed to help students track how many questions solved, teachers communicate with students, and track their progress. It provides an admin panel for teachers to perform various tasks, including adding, editing, and removing students. Additionally, teachers can send messages to individual student.

**Live Version** : [https://sehitgokselkoc.org/]

### Features

- **Admin Panel:**
  - display the students
  - Add new students
  - Edit student information
  - Remove students
  - Send messages to students
- **Firebase Backend:**
  - Stores student data (including solutions and messages)
  - Provides real-time synchronization
- **Leaderboard:**
  - Displays the top-performing students based on the number of questions solved

## Technologies Used

- **Frontend:**
  - HTML
  - CSS
  - JavaScript
- **Backend:**
  - Firebase (Firestore for data storage)

## Getting Started

1. Clone this repository to your local machine.
2. Set up your Firebase project:
   - Create a new project in Firebase.
   - Obtain your Firebase configuration (`firebaseConfig`) by following these steps:
     - Go to your Firebase project settings.
     - Under the "General" tab, scroll down to the "Your apps" section.
     - Click on the "Web" app icon (</>).
     - Copy the configuration object (`firebaseConfig`) provided.
3. Update the Firebase configuration in `firebase.js` with your own credentials:

   ```javascript
   // firebase/firebase.js

   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID",
   };

   // Initialize Firebase
   firebase.initializeApp(firebaseConfig);
   ```

4. Deploy the website to a hosting service (e.g., Firebase Hosting):
   - Install the Firebase CLI (`npm install -g firebase-tools`).
   - Run `firebase login` to authenticate with your Firebase account.
   - Navigate to your project folder and run `firebase init`.
   - Choose "Hosting" and follow the setup instructions.
   - Deploy your website using `firebase deploy`.

## Usage

1. **Admin Panel:**
   - Access the admin panel by logging in with your credentials.
   - Use the admin dashboard to manage student records.
   - Send messages to students individually or as a group.
2. **Student Dashboard:**
   - Students can log in to view their solutions and messages.
   - The leaderboard displays the top students.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, feel free to submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
