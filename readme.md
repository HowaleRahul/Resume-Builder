You are a senior full-stack developer, system architect, and AI engineer.

I want to build a production-level web application called:

"AI-Powered LaTeX Resume Parser, Builder & Analyzer"

---

## CORE FUNCTIONALITY

1. INPUT SYSTEM

- Accept resume input via:
  a) Paste LaTeX code
  b) Upload .tex file
  c) Upload PDF resume

2. PDF TO LATEX CONVERSION

- When a PDF is uploaded:
  - Extract text and structure from the PDF
  - Identify sections like:
    - Name, Email, Phone
    - Education, Experience, Projects, Skills
  - Convert extracted content into structured JSON
  - Generate equivalent LaTeX code automatically
  - Allow user to edit generated content

3. LATEX PARSER ENGINE

- Parse LaTeX resume code and extract:
  - Name
  - Email
  - Phone
  - Education
  - Experience
  - Projects
  - Skills
  - Achievements

- Convert extracted data into structured JSON
- Use regex + modular parsing system

4. DYNAMIC FORM GENERATOR

- React-based UI:
  - Editable fields for all sections
  - Add/remove sections
  - Multiple entries support
  - Drag-and-drop reordering

5. LATEX GENERATOR

- Convert JSON → clean LaTeX
- Maintain formatting (sections, itemize, etc.)
- Ensure compatibility with Overleaf

6. EXPORT OPTIONS

- Download .tex file
- Copy LaTeX code
- Export as PDF

---

## AUTHENTICATION & STORAGE

1. AUTHENTICATION

- Use Clerk for:
  - Sign up / Login / Logout
  - Session handling
  - Protected routes

2. DATABASE (MongoDB)

- Store user-specific resumes

3. RESUME DATA MODEL
   Each resume should store:

- userId
- originalLatexCode
- uploadedPDF (optional)
- parsedData (JSON)
- updatedData (edited JSON)
- generatedLatexCode
- templateType
- ATS score
- version history
- timestamps

4. FEATURES

- Save resumes automatically
- View all resumes (dashboard)
- Edit, delete, duplicate resumes
- Version control (restore previous versions)

---

## ADVANCED FEATURES

1. Smart Template Detection

- Detect LaTeX template automatically

2. UNIVERSAL TEMPLATE SUPPORT

- System should handle a wide variety of LaTeX resume formats
- Use fallback parsing if template is unknown

3. Template Switching

- Switch between:
  - Modern
  - ATS-friendly
  - Minimal

4. ATS SCORE ANALYZER

- Provide:
  - Score (0–100)
  - Missing keywords
  - Suggestions

5. AI SUGGESTIONS

- Improve resume:
  - Rewrite bullet points
  - Suggest action verbs
  - Enhance descriptions

6. JOB DESCRIPTION MATCHING

- Compare resume with job description
- Output:
  - Match %
  - Missing skills

7. LIVE PREVIEW

- Real-time resume preview

8. LATEX ERROR DETECTION

- Detect syntax errors:
  - Missing brackets
  - Invalid commands

9. RESUME COMPARISON

- Compare two resumes:
  - ATS score
  - Skills
  - Structure

10. MULTI-LANGUAGE SUPPORT

- Generate resumes in multiple languages

---

## TECH STACK

Frontend:

- React.js
- Tailwind CSS
- Clerk (authentication)

Backend:

- Node.js + Express

Database:

- MongoDB

PDF Processing:

- PDF parsing libraries (pdf-parse, pdf.js, or similar)

Optional:

- AI APIs for content improvement

---

## API REQUIREMENTS

Create APIs for:

- Auth-protected routes
- Upload PDF / LaTeX
- Parse LaTeX → JSON
- Parse PDF → JSON
- Generate LaTeX from JSON
- Save/update/delete resumes
- Get user resumes
- Compare resumes
- ATS scoring

---

## DELIVERABLES

Generate:

1. Project folder structure
2. Backend:
   - Express server
   - Clerk integration
   - MongoDB schema
   - Resume APIs

3. Frontend:
   - Auth integration
   - Dashboard
   - Resume editor
   - Dynamic form UI

4. Parser modules:
   - LaTeX parser
   - PDF parser

5. Generator module:
   - JSON → LaTeX

6. ATS scoring logic

7. Sample:
   - PDF input → JSON
   - LaTeX input → JSON
   - JSON → LaTeX output

8. System architecture

9. Challenges and solutions:
   - PDF parsing accuracy
   - Handling different LaTeX formats
   - Maintaining formatting consistency

---

## CONSTRAINTS

- System should attempt to support multiple LaTeX formats, but prioritize robustness
- Keep parser modular and extensible
- Ensure clean, scalable, production-level code

---

## GOAL

User flow:

Login → Upload PDF or LaTeX → Parse → Edit → Enhance → Save → Generate LaTeX → Download → Use in Overleaf

System should act as:

- Resume builder
- Resume parser
- Resume analyzer
- Resume optimizer

You are a senior full-stack developer and system architect.

I want to build a web application called "LaTeX Resume Parser & Builder" with the following functionality:

1. The user can paste LaTeX resume code (from Overleaf) or upload a .tex file.

2. The system should parse the LaTeX code and extract structured data such as:
   - Name
   - Email
   - Phone
   - Education
   - Experience
   - Projects
   - Skills
   - Achievements

3. Convert the extracted data into a structured JSON format.

4. Dynamically generate a frontend form (React-based) where:
   - Each extracted section becomes editable input fields
   - Sections like education/experience support multiple entries
   - User can add/remove/edit sections

5. After editing, the system should regenerate clean and properly formatted LaTeX code that:
   - Works directly on Overleaf
   - Maintains proper LaTeX syntax
   - Supports itemize, sections, and formatting

6. The app should allow:
   - Downloading the updated .tex file
   - Copying LaTeX code
   - Optional: live preview (if possible)

7. Tech stack:
   - Frontend: React + Tailwind CSS
   - Backend: Node.js + Express
   - Database (optional): MongoDB

8. Important constraints:
   - try to support all LaTeX formats
   - Use regex-based parsing for MVP
   - Keep code modular (parser, generator, UI)

Now generate:

A. Complete project folder structure  
B. Backend code (Node.js) for:

- Uploading/parsing LaTeX
- Extracting fields using regex
- Returning structured JSON

C. Frontend React code for:

- Dynamic form generation from JSON
- Editable sections (add/remove fields)

D. LaTeX generator function:

- Convert JSON → valid LaTeX

E. Sample LaTeX input and expected JSON output

F. Step-by-step explanation of how each module works

G. Suggestions for scaling and improving the project (AI features, ATS scoring, template system)

Write clean, production-level code with comments and best practices.

You are a senior full-stack developer, system architect, and AI engineer.

I want to build a production-level web application called:

"AI-Powered LaTeX Resume Parser, Builder & Analyzer"

The application should accept LaTeX resume code (from Overleaf) and provide full editing, analysis, and regeneration capabilities.

---

## CORE FUNCTIONALITY

1. INPUT SYSTEM

- Accept LaTeX code via:
  a) Paste input
  b) Upload .tex file
- Validate LaTeX syntax (basic validation)

2. LATEX PARSER ENGINE

- Parse LaTeX resume code and extract structured data:
  - Name
  - Email
  - Phone
  - Education
  - Experience
  - Projects
  - Skills
  - Achievements

- Convert parsed data into structured JSON format
- Use regex for MVP, but design modular parser for scalability

3. TEMPLATE DETECTION

- Automatically detect LaTeX template types (e.g., moderncv, custom templates)
- Adjust parsing logic based on detected template
- Support at least 2–3 predefined templates

4. DYNAMIC FORM GENERATOR (FRONTEND)

- Build a React-based UI that:
  - Dynamically generates input fields from JSON
  - Supports:
    - Add/remove sections
    - Repeatable entries (education, experience)
    - Editable fields
  - Drag-and-drop section reordering

5. LATEX GENERATOR ENGINE

- Convert edited JSON back into clean, structured LaTeX code
- Ensure:
  - Proper formatting
  - Compatible with Overleaf
  - Uses sections, itemize, formatting correctly

6. EXPORT FEATURES

- Download .tex file
- Copy LaTeX code
- Optional: Export as PDF

---

## ADVANCED FEATURES

7. TEMPLATE SWITCHING

- Allow user to switch resume templates:
  - Modern
  - ATS-friendly
  - Minimal
- Same JSON → different LaTeX output

8. LIVE PREVIEW

- Show real-time preview of resume (PDF or HTML rendering)

9. ATS SCORE ANALYZER

- Analyze resume and provide:
  - ATS score (0–100)
  - Missing keywords
  - Suggestions for improvement

10. AI SUGGESTIONS ENGINE

- Improve resume content using AI:
  - Rewrite bullet points
  - Suggest action verbs
  - Enhance descriptions

11. JOB DESCRIPTION MATCHING

- Accept job description input
- Output:
  - Match percentage
  - Missing skills
  - Suggested improvements

12. LATEX ERROR DETECTION

- Detect:
  - Missing brackets
  - Invalid commands
  - Syntax issues

13. SAVE & LOAD SYSTEM

- User authentication (login/signup)
- Save multiple resumes
- Edit later

14. VERSION CONTROL

- Maintain resume history
- Allow rollback to previous versions

15. RESUME COMPARISON TOOL

- Compare two resumes:
  - ATS score
  - Skills
  - Structure

16. MULTI-LANGUAGE SUPPORT

- Generate resumes in multiple languages:
  - English
  - German
  - French

17. MOBILE RESPONSIVE UI

- Fully responsive frontend design

18. OPTIONAL: OVERLEAF INTEGRATION

- Generate Overleaf-compatible project or link (if feasible)

---

## TECH STACK

Frontend:

- React.js
- Tailwind CSS

Backend:

- Node.js + Express

Database:

- MongoDB

Optional:

- AI APIs for suggestions

---

## DELIVERABLES REQUIRED

Generate the following in detail:

1. Complete project folder structure
2. Backend implementation:
   - File upload
   - LaTeX parsing (regex-based)
   - JSON conversion
   - API endpoints

3. Frontend implementation:
   - Dynamic form UI
   - Drag-and-drop sections
   - Resume editor interface

4. LaTeX Generator Module:
   - JSON → LaTeX conversion

5. ATS Score logic (basic implementation)

6. AI suggestion integration (mock or real API)

7. Sample:
   - LaTeX input
   - Parsed JSON output
   - Regenerated LaTeX output

8. Database schema design

9. System architecture explanation

10. Challenges and solutions:

- Handling multiple templates
- Parsing complexity
- Maintaining LaTeX formatting

11. Suggestions for scaling and production deployment

---

## IMPORTANT CONSTRAINTS

- Do NOT attempt to support all LaTeX formats
- Focus on 2–3 structured templates
- Keep parser modular and extensible
- Write clean, production-ready, well-commented code
- Follow best practices in frontend and backend design

---

## GOAL

The final system should allow users to:

- Paste LaTeX → Edit via UI → Regenerate → Download → Use in Overleaf

And also:

- Improve resume quality using AI
- Analyze ATS performance
- Customize templates easily

Build this step-by-step with clear explanations and modular code.

You are a senior full-stack developer.

I have already built a basic LaTeX Resume Parser & Builder that:

- Accepts LaTeX resume input
- Parses it into JSON
- Displays editable form fields
- Regenerates LaTeX code

Now I want to enhance this project with the following advanced features:

1. Smart Template Detection

- Detect which LaTeX resume template is being used
- Adjust parsing logic accordingly

2. Template Switching System

- Allow users to switch between multiple resume templates (modern, ATS-friendly, minimal)
- Use the same JSON data to generate different LaTeX outputs

3. ATS Score Analyzer

- Analyze resume content and provide:
  - ATS score (0–100)
  - Missing keywords
  - Suggestions

4. AI Suggestions

- Improve resume content:
  - Rewrite bullet points
  - Suggest strong action verbs
  - Enhance descriptions

5. Live Preview

- Show real-time preview of resume (PDF or HTML)

6. Drag-and-Drop Sections

- Allow users to reorder sections dynamically

7. Save & Load Resumes

- Store resumes in database
- Allow users to edit later

8. Resume Comparison Tool

- Compare two resumes based on:
  - ATS score
  - Skills
  - Structure

9. Authentication System

- User login/signup
- Personal dashboard

10. Job Description Matching

- Input job description
- Show match percentage and missing skills

11. LaTeX Error Detection

- Detect syntax issues like:
  - Missing brackets
  - Invalid commands

12. Multi-language Resume Generation

- Generate resumes in multiple languages

13. Version Control

- Track resume changes
- Restore previous versions

For each feature, provide:

- Implementation approach
- Required technologies/libraries
- Backend + frontend logic
- Sample code snippets (where needed)




Keep solutions modular and scalable.

Goal Description
The objective is to build an AI-Powered LaTeX Resume Parser, Builder & Analyzer. This platform allows users to upload standard PDF resumes or Overleaf LaTeX code, converts it into structured JSON, offers a dynamic React-based drag-and-drop interface for modifications, and regenerates clean, Overleaf-compatible LaTeX.

In addition to the core parser/builder functionality, the architecture seamlessly integrates advanced capabilities such as an ATS score analyzer, AI content enhancer, smart template detection, real-time preview, job description gap analysis, and version control.

User Review Required
IMPORTANT

Since the project currently has no code initialized, I am proposing the initial architecture below. Once you approve this, I will run the commands to initialize the Frontend (Vite + React) and Backend (Node + Express) applications to generate the initial directories and base code.

Please review the Tech Stack, Directory Structure, and Feature Implementation approaches. Let me know if you prefer to use Next.js for the frontend rather than Vite/React, or if you have specific LaTeX templates you'd like to use as the MVP baselines.

Proposed Tech Stack
Frontend: React (via Vite) + Tailwind CSS + Framer Motion (for dynamic UI/drag-n-drop).
Backend: Node.js + Express + Mongoose.
Database: MongoDB (to store user resumes, parsed JSON, version history).
Authentication: Clerk (integrated natively on the frontend, JWT verification on the backend).
External APIs: OpenAI API / Gemini API (for AI suggestions and ATS analysis).
Project Folder Structure
The application will be organized in a monorepo setup containing both frontend and backend code.

text
/Resume-Builder
  ├── /frontend
  │   ├── src/
  │   │   ├── components/
  │   │   │   ├── editor/           # Dynamic Form elements, D&D sections
  │   │   │   ├── preview/          # Real-time PDF rendering iframe/window
  │   │   │   ├── templates/        # React representations of different templates
  │   │   │   └── ui/               # Reusable Tailwind components (buttons, modals)
  │   │   ├── pages/
  │   │   │   ├── Dashboard.jsx
  │   │   │   ├── Builder.jsx
  │   │   │   ├── ComparisonTool.jsx
  │   │   │   └── Login.jsx
  │   │   ├── services/             # API communication w/ Backend
  │   │   ├── store/                # Zustand or Redux for Resume State
  │   │   └── utils/                # LaTeX formatting helpers
  │   ├── package.json
  │   ├── tailwind.config.js
  │   └── vite.config.js
  │
  └── /backend
      ├── src/
      │   ├── controllers/
      │   │   ├── resumeController.js
      │   │   ├── aiController.js   # ATS processing and AI rewrite
      │   │   └── userController.js
      │   ├── models/
      │   │   ├── Resume.js         # Stores UserId, JSON data, Raw Code, History
      │   │   └── User.js
      │   ├── routes/
      │   │   ├── resumeRoutes.js
      │   │   └── aiRoutes.js
      │   ├── services/
      │   │   ├── latexParser.js    # Regex/AST algorithms to extract JSON
      │   │   ├── latexGenerator.js # Inverse function to write JSON -> .tex
      │   │   ├── templateDetector.js
      │   │   └── pdfExtractor.js   # Integration with PDF processing tools
      │   └── middlewares/
      │       └── authMiddleware.js # Verifies Clerk JWT token
      ├── .env
      ├── package.json
      └── index.js
Advanced Features & Implementation Approach
1. Smart Template Detection & Switcher
Approach: The backend templateDetector.js will inspect the \documentclass and specific package imports (e.g., moderncv, awesome-cv) using Regex. It will categorize the resume into supported template classes. The frontend form data (JSON) will remain standard, but the latexGenerator.js will have different translation strategies mapping the same JSON object into completely different .tex outputs depending on the currently selected template.
2. LaTeX Parser & Generator
Approach:
Parser: We will write a modular latexParser.js utilizing specific Regex groups to pull nested commands (e.g., \cvitem{}, \begin{itemize}).
Generator: A builder pattern that loops through JSON sections (Education, Experience), applying the correct LaTeX macros to wrap around the text and handles escaping special LaTeX characters (like &, %, $).
3. Drag-and-Drop Form (Dynamic UI)
Approach: Utilize @hello-pangea/dnd (or Framer Motion's Reorder) to create an intuitive block-level builder UI. When a user changes ordering on the UI, the state manager updates the JSON array. The backend will strictly follow the JSON array order when regenerating the .tex.
4. Live Preview
Approach: Provide an API endpoint or utilize a WebAssembly PDFLaTeX compiler (like SwiftLaTeX or Tectonic if running client-side) to compile the updated LaTeX code on the fly. As an MVP, we can mock the preview by using a web-friendly HTML CSS layout approximation, with a "Compile to PDF" button that asks a backend LaTeX engine to compile and return the PDF file via pdf-lib / pdflatex.
5. ATS Score Analyzer & AI Suggestions
Approach: Create an aiController.js that talks to OpenAI/Gemini.
For ATS Scoring, the backend will take the compiled raw text from the parsed JSON, merge it with a user-submitted Job Description string, and ask the LLM to output a JSON containing numeric scores, matched keywords, and a feedback array.
For AI Suggestions, when a user highlights a bullet point or presses "Enhance", the frontend pings an endpoint passing the sentence + context. The backend returns 3 upgraded variants using power verbs.
6. Authentication, Save/Load, Version Control
Approach:
Setup Clerk <ClerkProvider> on the React frontend.
Passes an implicit Bearer token to backend APIs.
Resume.js MongoDB schema to feature a versions: [ { versionNumber: 1, jsonSnapshot: {...}, timestamp } ] array. This ensures rollback capability.
Open Questions
WARNING

To provide a Live LaTeX PDF Preview, the backend needs a local LaTeX compiler installed (like texlive or tectonic), or we can use an external compilation API to render the PDF. For the MVP, would you like to focus on generating the clean LaTeX text string first, or do you want me to attempt setting up an actual PDF renderer using Node compilation?
Do you have a preferred AI provider for the ATS calculation and resume improvements (e.g., OpenAI, Gemini, Claude)?
Verification Plan
Initialization Setup: Ensure React UI and Express backend both spin up reliably without compiler errors.
Parser Logic Verification: Pass a sample Overleaf standard resume. Require JSON.parse to successfully categorize [name, email, education, experiences].
Generator Logic Verification: Export the JSON back out to LaTeX and verify no data drops occurred.
Integration Testing: Test user login flow via Clerk -> upload logic -> parser JSON extraction -> display in UI.


follow mvc structure and also there is no compnent folder in frontend and implement remaining features from readme file i want each and every feature implement the folder structure is not being followed i want mvc accept all types of latex templates