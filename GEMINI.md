# Gemini Memo

This document summarizes the project structure and development environment of the Keyboard Visualizer application for the Gemini model.

## Project Overview

This is a web application that visualizes keyboard operations. It is developed with a modern front-end stack and uses Supabase for the backend.

## Technology Stack

- **Frontend:**
  - React
  - TypeScript
  - Vite
- **Backend:**
  - Supabase (Database and Authentication)
- **Testing:**
  - Vitest
- **Container:**
  - Docker

## How to run the project

### Using npm

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

### Using Docker

1. Build and start the container:
   ```bash
   docker-compose up -d --build
   ```
2. The application will be available at `http://localhost:5173`.

## Database

The project uses Supabase for its database. Migrations are managed in the `supabase/migrations` directory.

The following scripts are available for database operations:

- `npm run db:migrate`: Creates a new migration file.
- `npm run db:generate-sql`: Generates SQL from the migration file.
- `npm run db:run-migration`: Applies the migration to the database.

## Scripts

The main scripts available in `package.json` are:

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run preview`: Previews the production build locally.
- `npm run test`: Runs the test suite.
