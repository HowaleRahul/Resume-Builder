# 🚀 CareerFlow AI

**CareerFlow AI** is a premium, production-ready AI-powered career management suite. It helps engineers and developers build ATS-optimized LaTeX resumes, track job applications with a Kanban board, and analyze their portfolio for skill gaps.

## ✨ Core Features

-   **🤖 AI Resume Architect**: Generate high-fidelity LaTeX resumes from raw text or PDFs. Powered by Google Gemini.
-   **📊 Job Application Tracker**: Manage your interview pipeline with a modern, interactive Kanban board.
-   **🔍 Head-to-Head Comparison**: Compare your resume against Job Descriptions to get a real-time ATS compatibility score.
-   **📈 Skill Gap Analysis**: Get actionable advice on what certifications or technologies you need to land your dream role.
-   **🔗 Portfolio Intelligence**: Sync your GitHub or personal portfolio to auto-extract and format impactful projects.

## 🛠️ Tech Stack

-   **Frontend**: React, Vite, Tailwind CSS, Lucide React, Clerk (Auth).
-   **Backend**: Node.js, Express, MongoDB, Mongoose.
-   **AI**: Google Generative AI (Gemini Pro).
-   **Export**: Native Browser Print Engine (PDF) & Raw LaTeX (.tex).

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18+)
-   MongoDB Instance (Local or Atlas)
-   Clerk Account (for Authentication)
-   Gemini API Key

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/HowaleRahul/Resume-Builder.git
    cd Resume-Builder
    ```

2.  **Setup Backend**:
    ```bash
    cd backend
    npm install
    cp .env.example .env # Add your MONGO_URI and GEMINI_API_KEY
    npm run dev
    ```

3.  **Setup Frontend**:
    ```bash
    cd ../frontend
    npm install
    cp .env.example .env # Add your VITE_CLERK_PUBLISHABLE_KEY
    npm run dev
    ```

## 📄 Deployment

Designed to be deployed on **Vercel** or **Netlify**.

-   **Frontend**: Connect your GitHub repo to Vercel. Set `VITE_CLERK_PUBLISHABLE_KEY`.
-   **Backend**: Deploy as a separate service (e.g., Render, Railway) or as Serverless Functions. Update the `axios` base URL in the frontend.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---
Developed with ❤️ by **Rahul Howale**.