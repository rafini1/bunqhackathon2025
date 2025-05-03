# Bunq Banking App with AI Assistant by: Rafi Azmani, Keci Chilala, Mahir Baltit, Elvir nikq 

A modern, AI-powered banking web application that transforms financial management into an engaging and interactive experience. This application features a dark mode interface with a rainbow color scheme and an intelligent AI assistant named "Finn" powered by NVIDIA AI.

## Features

### Modern UI with Dark Mode
- Sleek dark-themed interface with rainbow accents
- Responsive design for all device sizes
- Colorful, intuitive account cards and transaction displays

### AI-Powered Assistant "Finn"
- Natural language processing using NVIDIA AI
- Voice recognition for hands-free interaction
- Understands and processes banking commands
- Responds with confirmation dialogs and helpful information

### Banking Features
- View account balances and transaction history
- Send money with intuitive confirmation dialogs
- Request money from contacts
- Block and unblock cards for security
- Create savings accounts with custom names
- Balance validation to prevent overdrafts

### Navigation & Travel
- AI assistant can navigate you between app sections
- Travel planning section with flight search
- Transportation options comparison
- Popular destinations showcase

## Command System

Finn understands several command types:
- `BC` - Block Card
- `UC` - Unblock Card
- `SM` - Send Money
- `SMR` - Send Money Request
- `SA` - Create Savings Account
- `NAV` - Navigate to another page

## Technical Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: NVIDIA AI API
- **Speech Recognition**: Web Speech API

## Getting Started

1. Clone this repository
2. Install dependencies: `npm install`
3. Set up your NVIDIA API key in the environment variables
4. Set up PostgreSQL database connection
5. Run the application: `npm run dev`

## Environment Variables

The following environment variables are required:
- `DATABASE_URL`: PostgreSQL connection string
- `NVIDIA_API_KEY`: Your NVIDIA API key for AI functionality


