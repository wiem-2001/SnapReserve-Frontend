# Frontend - Event Management Platform

## Overview

A React-based frontend for an event management platform, built with Vite. Features user authentication, event browsing, ticket purchasing, and real-time notifications.

## Tech Stack

- **Framework**: React with Vite
- **State Management**: Zustand
- **Styling**: CSS + Ant Design
- **Routing**: React Router
- **Real-time**: WebSockets
- **Git Hooks**: Husky

## Project Structure
```
src/
├── App.jsx                 # Main application component
├── App.css                # Global application styles
├── main.jsx               # Application entry point
├── Applayout/             # Main layout components
│   ├── Header/            # Navigation header
│   ├── SidebarMenu/       # Side navigation
│   ├── Footer.jsx         # Page footer
│   └── Layout.jsx         # Main layout wrapper
├── assets/                # Static assets (images, icons, etc.)
├── components/            # Reusable UI components
├── constants/             # Application constants
│   └── Js enums.js        # JavaScript enums
├── pages/                 # Page components
├── Providers/             # React context providers
├── routes/                # Application routing
│   ├── AppRoutes.jsx      # Main routing configuration
│   └── ProtectedRoute.jsx # Authentication-protected routes
├── stores/                # State management (Zustand)
│   ├── authStore.js       # Authentication state
│   ├── dealsStore.js      # Deals and promotions
│   ├── eventStore.js      # Event data management
│   ├── notificationStore.js # Notifications state
│   ├── organizerStatsStore.js # Organizer analytics
│   ├── socketStore.js     # WebSocket connections
│   └── ticketStore.js     # Ticket management
└── index.css              # Global styles
```
Root Level Files
```
├── Dockerfile # Docker container configuration
├── docker-compose.frontend.yml # Docker compose configuration
├── .env # Environment variables
├── .gitignore # Git ignore rules
├── .husky # Git hooks configuration
├── index.html # HTML template
├── package.json # Project dependencies and scripts
├── vite.config.js # Vite configuration
└── README.md # Project documentation
```
## Getting Started

### Prerequisites

- Node.js (version 20 or higher)
- npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
- Copy .env.example to .env and configure your environment variables.

### Run the project 
```bash
npm run dev
```
### Features
- User authentication and authorization
- Event browsing and management
- Ticket purchase flow
- Real-time notifications via WebSockets
- Responsive design with Ant Design components
- Protected routes and role-based access

### State Management
Uses Zustand stores for state management

### Git Hooks
Husky is configured to run pre-commit hooks for code quality checks.

### Docker Support

The project includes Docker configuration for containerized deployment:

- Build the Docker image
```docker-compose -f docker-compose.frontend.yml build```

- Start the container
```docker-compose -f docker-compose.frontend.yml up```
