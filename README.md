# Taskmaster: A React & Firebase Task Management App

Taskmaster is a task management application built with React, Vite, and Firebase. It provides a modern interface for managing your tasks with real-time updates powered by Firebase Firestore and backend processing via Firebase Cloud Functions.

---

## Table of Contents

- Overview
- Features
- Architecture
- Installation
- Firebase Configuration
- Development
- Deployment
- Security
- License

## Overview

Taskmaster simplifies task management through a clean and responsive user interface, utilizing React & Vite for the frontend and Firebase services for backend operations.

## Features

- **Task Management:** Add, update, and delete tasks.
- **Real-Time Updates:** Data synchronization via Firebase Firestore.
- **Cloud Functions:** Process raw text input into structured tasks using the parseTasks function.
- **Responsive UI:** Uses Material UI components for a polished look.

## Architecture

- **Frontend (app folder):**
  - Built with React and Vite.
  - Uses Material UI for theming.
  - Connects to Firebase Firestore.
- **Backend (functions folder):**
  - Contains Firebase Cloud Functions (e.g., parseTasks).
  - Managed with the Firebase CLI.
- **Firebase Configuration:**
  - Defined in `firebase.json` and `app/src/firebase.js`.
  - Firestore rules are specified in `firestore.rules`.

## Installation

### Prerequisites

- Node.js (v14 or later)
- npm (included with Node.js)
- Firebase CLI (install via `npm install -g firebase-tools`)

### Frontend Setup

1. Navigate to the `app` directory:  
   `cd app`
2. Install dependencies by running:  
   `npm install`
3. Start the development server with:  
   `npm run dev`

### Backend Setup (Firebase Functions)

1. Navigate to the `functions` directory:  
   `cd functions`
2. Install dependencies by running:  
   `npm install`
3. Run Firebase Functions locally with:  
   `npm run serve`

## Firebase Configuration

- Firebase settings are defined in `app/src/firebase.js`.
- The `parseTasks` function in `functions/index.js` processes raw text input into tasks.
- Hosting is configured in `firebase.json`, with production builds served from `app/dist`.
- Update `firestore.rules` as needed for security in production.

## Development

- **Frontend:** Uses React, Vite, and ESLint for rapid development.
- **Backend:** Uses Firebase Cloud Functions (Node.js) with CORS enabled.

## Deployment

1. Build the frontend by running in the `app` directory:  
   `npm run build`
2. Deploy the app and functions using the Firebase CLI:  
   `firebase deploy`

## Security

- Firestore rules currently deny all access; update `firestore.rules` for production.
- API keys in `app/src/firebase.js` are safe for client use, but follow best practices for production.

## License

This project is provided as a template and is open for modification and extension.
