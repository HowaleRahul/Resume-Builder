# ResumeForge AI

**ResumeForge AI** is a full-stack resume builder designed to help users create polished, professional resumes with AI-assisted content generation and real-time previewing.

## 🚀 Project Overview

This repository contains a modern resume-building application with a React frontend and a Node.js backend. Users can build resumes with AI-powered assistance, generate PDFs, and manage resume data with an intuitive interface.

## ✨ Features

- AI-assisted resume content creation
- Resume preview and PDF generation
- Frontend built with React, Vite, Tailwind CSS, and Zustand
- Backend built with Express, MongoDB, and AI integration
- Secure request handling with Helmet, CORS, and rate limiting
- Modular architecture with separate frontend and backend workspaces

## 🧱 Tech Stack

- Frontend: React, Vite, Tailwind CSS, Zustand
- Backend: Node.js, Express, MongoDB, Mongoose
- AI: Google Generative AI / OpenAI-style assistance
- PDF & LaTeX generation: `node-latex`, `pdf-parse`
- Deployment-ready with Vercel-compatible structure

## 📁 Repository Structure

- `frontend/` - React application and UI
- `backend/` - Express API, AI services, and resume generation logic
- `package.json` - Root workspace configuration

## ⚙️ Setup

1. Install dependencies for both frontend and backend:

```bash
npm run install
```

2. Start the development servers:

```bash
npm run dev
```

3. Open the frontend URL shown in the terminal and start building resumes.

## 🧪 Build

To build both frontend and backend workspaces:

```bash
npm run build
```

## 📌 Notes

- Configure environment variables in `frontend/.env` and `backend/.env` before running production or AI-related features.
- The backend uses a separate `backend` package with its own startup script.

## 💡 Recommended Project Name

The project is now named **ResumeForge AI**, which reflects the goal of crafting strong career documents using AI support.

---

If you want, I can also add a short `CONTRIBUTING.md` or `ENVIRONMENT.md` file for setup details. 