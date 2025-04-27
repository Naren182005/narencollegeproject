# SocialMuse - Social Media Content Generator

SocialMuse is a comprehensive social media content generation tool that helps you create optimized content for multiple platforms including LinkedIn, Instagram, Twitter, Facebook, and YouTube.

## Project Structure

This project consists of:

- **Frontend**: React application built with Vite, TypeScript, and Tailwind CSS
- **Backend**: Express.js server providing API endpoints for content generation and posting

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install
```

### Running the Application

You can run the frontend and backend separately or together:

```sh
# Run only the frontend
npm run dev

# Run only the backend
npm run server

# Run both frontend and backend together
npm run dev:all
```

- Frontend: http://localhost:8080
- Backend: http://localhost:3000

## API Endpoints

### Health Check
- **GET /api/health**
  - Returns the status of the server
  - Response: `{ status: 'ok', message: 'Server is running' }`

### Generate Content
- **POST /api/generate**
  - Generates content for a specific platform
  - Request body: `{ platform: string }`
  - Platform options: 'linkedin', 'instagram', 'twitter', 'facebook', 'youtube', 'common'
  - Response: `{ content: string | object }`

### Post Content
- **POST /api/post**
  - Posts content to a specific platform (simulated)
  - Request body: `{ platform: string, content: string | object }`
  - Response: `{ success: boolean, message: string, postId: string }`

## Technologies Used

- **Frontend**:
  - Vite
  - TypeScript
  - React
  - shadcn-ui
  - Tailwind CSS
  - React Query

- **Backend**:
  - Express.js
  - Node.js
  - dotenv
  - cors

## Environment Variables

Create a `.env` file in the project root with the following variables:

```
PORT=3000
```

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
