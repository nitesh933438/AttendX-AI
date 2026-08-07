# AttendX AI - Deployment Guide

This guide provides step-by-step instructions for deploying AttendX AI into a production environment. The architecture is split between a React frontend and a Node.js backend, connected to a PostgreSQL database.

## 1. Prerequisites
- A GitHub/GitLab account.
- A Vercel account (for Frontend).
- A Render account (for Backend).
- A Supabase account (for PostgreSQL database).

## 2. Database Setup (Supabase)
1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Under "Project Settings" -> "Database", locate your **Connection String (URI)**.
3. Keep this URI handy, as you will need to add it to your Backend environment variables.

## 3. Backend Deployment (Render)
1. Push your AttendX AI code to a GitHub repository.
2. Go to [Render](https://render.com/) and create a new **Web Service**.
3. Connect your GitHub repository.
4. Configure the Web Service:
   - **Environment:** Node
   - **Build Command:** \`npm install && npm run build\`
   - **Start Command:** \`npm start\`
5. Add the following **Environment Variables**:
   - \`NODE_ENV\`: \`production\`
   - \`DATABASE_URL\`: *(Your Supabase Connection String)*
   - \`JWT_SECRET\`: *(A strong, random cryptographic string)*
   - \`PORT\`: \`10000\`
6. Click **Deploy**. Render will build and launch your backend API.
7. Note the Render URL (e.g., \`https://attendx-backend.onrender.com\`).

## 4. Frontend Deployment (Vercel)
1. Go to [Vercel](https://vercel.com/) and create a new **Project**.
2. Import the same GitHub repository.
3. Configure the Build Settings:
   - **Framework Preset:** Vite
   - **Build Command:** \`npm run build\`
   - **Output Directory:** \`dist\`
4. Configure **vercel.json** (Ensure this file is in your root directory to proxy API requests):
   \`\`\`json
   {
     "rewrites": [
       {
         "source": "/api/(.*)",
         "destination": "https://your-render-backend-url.onrender.com/api/$1"
       },
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   \`\`\`
   *(Replace the destination with your actual Render URL)*.
5. Add the following **Environment Variables** in Vercel:
   - \`VITE_GEMINI_API_KEY\`: *(Your Google Gemini API Key, if applicable)*
6. Click **Deploy**. Vercel will build and serve your React PWA.

## 5. Post-Deployment Verification
- Open your Vercel frontend URL.
- Test the login functionality to ensure the frontend can communicate with the backend.
- Attempt to install the PWA on a mobile device or Chrome desktop.
- Verify that Database Backups can be triggered successfully from the Admin Dashboard.
