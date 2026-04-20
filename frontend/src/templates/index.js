/**
 * templates/index.js
 * Central registry for all resume templates.
 * Each entry contains:
 *   label     – human-readable display name
 *   author    – original author credit
 *   tag       – badge shown on the card
 *   color     – theme color for card preview
 *   compat    – 'online' (works with latexonline.cc) | 'overleaf' (needs Overleaf)
 *   desc      – short description
 *   code      – the full .tex source
 */

// ─── Template 1: Jitin Nair — Clean Minimal ──────────────────────────────────
const TEMPLATE_JITIN = `%-----------------------------------------------------------------------------------------------------------------------------------------------%
%	The MIT License (MIT)
%	Copyright (c) 2021 Jitin Nair
%-----------------------------------------------------------------------------------------------------------------------------------------------%
\\documentclass[a4paper,12pt]{article}
\\usepackage{url}
\\usepackage{parskip}
\\RequirePackage{color}
\\RequirePackage{graphicx}
\\usepackage[usenames,dvipsnames]{xcolor}
\\usepackage[scale=0.9]{geometry}
\\usepackage{tabularx}
\\usepackage{enumitem}
\\newcolumntype{C}{>{\\centering\\arraybackslash}X}
\\usepackage{supertabular}
\\newlength{\\fullcollw}
\\setlength{\\fullcollw}{0.47\\textwidth}
\\usepackage{titlesec}
\\usepackage{multicol}
\\usepackage{multirow}
\\titleformat{\\section}{\\Large\\scshape\\raggedright}{}{0em}{}[\\titlerule]
\\titlespacing{\\section}{0pt}{10pt}{10pt}
\\usepackage[unicode, draft=false]{hyperref}
\\definecolor{linkcolour}{rgb}{0,0.2,0.6}
\\hypersetup{colorlinks,breaklinks,urlcolor=linkcolour,linkcolor=linkcolour}
\\usepackage{fontawesome5}

\\newenvironment{jobshort}[2]
    {
    \\begin{tabularx}{\\linewidth}{@{}l X r@{}}
    \\textbf{#1} & \\hfill &  #2 \\\\[3.75pt]
    \\end{tabularx}
    }
    {
    }

\\newenvironment{joblong}[2]
    {
    \\begin{tabularx}{\\linewidth}{@{}l X r@{}}
    \\textbf{#1} & \\hfill &  #2 \\\\[3.75pt]
    \\end{tabularx}
    \\begin{minipage}[t]{\\linewidth}
    \\begin{itemize}[nosep,after=\\strut, leftmargin=1em, itemsep=3pt,label=--]
    }
    {
    \\end{itemize}
    \\end{minipage}
    }

\\begin{document}
\\pagestyle{empty}

\\begin{tabularx}{\\linewidth}{@{} C @{}}
\\Huge{Your Name} \\\\[7.5pt]
\\href{mailto:email@mysite.com}{\\raisebox{-0.05\\height}\\faEnvelope\\ email@mysite.com} \\ $|$ \\
\\href{tel:+000000000000}{\\raisebox{-0.05\\height}\\faMobile\\ +00.00.000.000} \\\\
\\end{tabularx}

\\section{Work Experience}

\\begin{joblong}{Designation, Company Name}{Mar 2019 - Jan 2021}
\\item Lorem ipsum dolor sit amet, consectetur adipiscing elit.
\\item Aenean commodo ligula eget dolor.
\\end{joblong}

\\begin{jobshort}{Designation, Company Name}{Mar 2019 - Jan 2021}
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
\\end{jobshort}

\\section{Education}
\\begin{tabularx}{\\linewidth}{@{}X X@{} }
{\\textbf{Degree}} & \\hfill \\normalsize{2021} \\\\
Institution & \\hfill \\normalsize{GPA: 3.9/4.0} \\\\
\\end{tabularx}

\\section{Skills}
\\begin{tabularx}{\\linewidth}{@{}l X@{}}
Languages &  \\normalsize{Python, JavaScript, C++}\\\\
Frameworks & \\normalsize{React, Node.js, Express}\\\\
Tools & \\normalsize{Git, Docker, AWS}\\\\
\\end{tabularx}

\\vfill
\\center{\\footnotesize Last updated: \\today}

\\end{document}`;

// ─── Template 2: Anubhav Singh — Classic Tech ────────────────────────────────
const TEMPLATE_ANUBHAV = `%-------------------------
% Resume in Latex — Anubhav Singh
%------------------------

\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[pdftex]{hyperref}
\\usepackage{fancyhdr}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.375in}
\\addtolength{\\evensidemargin}{-0.375in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\newcommand{\\resumeItem}[2]{
  \\item\\small{
    \\textbf{#1}{: #2 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-1pt}\\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-5pt}
}

\\newcommand{\\resumeSubItem}[2]{\\resumeItem{#1}{#2}\\vspace{-3pt}}
\\renewcommand{\\labelitemii}{$\\circ$}
\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=*]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

%----------HEADING-----------------
\\begin{tabular*}{\\textwidth}{l@{\\extracolsep{\\fill}}r}
  \\textbf{{\\LARGE Your Name}} & Email: \\href{mailto:you@email.com}{you@email.com}\\\\
  \\href{https://yoursite.com}{Portfolio: yoursite.com} & Mobile:~~~+91-XXX-XXXX-XXX \\\\
  \\href{https://github.com/yourusername}{Github: github.com/yourusername} \\\\
\\end{tabular*}

%-----------EDUCATION-----------------
\\section{Education}
  \\resumeSubHeadingListStart
    \\resumeSubheading
      {Your University}{City, Country}
      {Bachelor of Technology - Computer Science;  GPA: 3.9/4.0}{July 2020 - June 2024}
    \\resumeSubHeadingListEnd

\\vspace{-5pt}
\\section{Skills Summary}
  \\resumeSubHeadingListStart
  \\resumeSubItem{Languages}{Python, JavaScript, C++, Java, SQL}
  \\resumeSubItem{Frameworks}{React, Node.js, Express, Django, Flask}
  \\resumeSubItem{Tools}{Docker, Git, PostgreSQL, MySQL, MongoDB}
  \\resumeSubHeadingListEnd

\\vspace{-5pt}
\\section{Experience}
  \\resumeSubHeadingListStart
    \\resumeSubheading{Company Name}{City, Country}
    {Software Engineer (Full-time)}{June 2024 - Present}
    \\resumeItemListStart
        \\resumeItem{Feature Development}
          {Developed and maintained scalable web applications using React and Node.js.}
        \\resumeItem{Performance}
          {Improved application performance by 40\\% via code optimization and caching.}
      \\resumeItemListEnd
  \\resumeSubHeadingListEnd

%-----------PROJECTS-----------------
\\vspace{-5pt}
\\section{Projects}
\\resumeSubHeadingListStart
\\resumeSubItem{AI Resume Builder (React, Node.js, Gemini API)}{Built an intelligent resume builder with AI-powered parsing and ATS scoring. (2024)}
\\vspace{2pt}
\\resumeSubItem{E-Commerce Platform (React, Node.js, MongoDB)}{Full-stack e-commerce solution with payment integration and admin dashboard. (2023)}
\\resumeSubHeadingListEnd

\\vspace{-5pt}
\\section{Honors and Awards}
\\begin{description}[font=$\\bullet$]
\\item {Dean's List - Academic Excellence Award}
\\vspace{-5pt}
\\item {1st Place - University Hackathon}
\\end{description}

\\end{document}`;

// ─── Template 3: Jake Gutierrez — Most Popular on Overleaf ───────────────────
const TEMPLATE_JAKE = `%-------------------------
% Resume in Latex
% Author : Jake Gutierrez
% Based off of: https://github.com/sb2nov/resume
% License : MIT
%------------------------

\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\pdfgentounicode=1

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubSubheading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textit{\\small#1} & \\textit{\\small #2} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape Your Name} \\\\ \\vspace{1pt}
    \\small 123-456-7890 $|$ \\href{mailto:x@x.com}{\\underline{x@x.com}} $|$
    \\href{https://linkedin.com/in/yourprofile}{\\underline{linkedin.com/in/yourprofile}} $|$
    \\href{https://github.com/yourgithub}{\\underline{github.com/yourgithub}}
\\end{center}

%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
    \\resumeSubheading
      {Your University}{City, State}
      {Bachelor of Science in Computer Science}{Aug. 2020 -- May 2024}
  \\resumeSubHeadingListEnd

%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart

    \\resumeSubheading
      {Software Engineer}{June 2024 -- Present}
      {Company Inc.}{San Francisco, CA}
      \\resumeItemListStart
        \\resumeItem{Developed a RESTful API service using Node.js and Express, reducing response time by 40\\%.}
        \\resumeItem{Built a dynamic dashboard in React with real-time data visualization.}
        \\resumeItem{Integrated CI/CD pipelines with GitHub Actions to streamline deployment.}
      \\resumeItemListEnd

    \\resumeSubheading
      {Software Engineering Intern}{May 2023 -- Aug. 2023}
      {Startup Co.}{Remote}
      \\resumeItemListStart
        \\resumeItem{Developed features for a SaaS platform using Python and Django.}
        \\resumeItem{Collaborated with cross-functional teams in an Agile environment.}
      \\resumeItemListEnd

  \\resumeSubHeadingListEnd

%-----------PROJECTS-----------
\\section{Projects}
    \\resumeSubHeadingListStart
      \\resumeProjectHeading
          {\\textbf{AI Resume Builder} $|$ \\emph{React, Node.js, Gemini API}}{2024}
          \\resumeItemListStart
            \\resumeItem{Built an intelligent resume builder with AI-powered parsing and real-time PDF preview.}
            \\resumeItem{Integrated Google Gemini for ATS scoring and bullet point enhancement.}
          \\resumeItemListEnd
      \\resumeProjectHeading
          {\\textbf{E-Commerce Platform} $|$ \\emph{React, Node.js, MongoDB}}{2023}
          \\resumeItemListStart
            \\resumeItem{Full-stack e-commerce solution with payment integration and admin dashboard.}
          \\resumeItemListEnd
    \\resumeSubHeadingListEnd

%-----------TECHNICAL SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Languages}{: Python, JavaScript, TypeScript, C++, SQL} \\\\
     \\textbf{Frameworks}{: React, Node.js, Express, Django, Flask} \\\\
     \\textbf{Developer Tools}{: Git, Docker, AWS, GCP, VS Code} \\\\
     \\textbf{Libraries}{: Pandas, NumPy, Matplotlib, TensorFlow}
    }}
 \\end{itemize}

%-------------------------------------------
\\end{document}`;

// ─── Template 4: Two-Column Professional ─────────────────────────────────────
const TEMPLATE_TWO_COL = `%% Two-Column Professional Resume
%% Compatible with standard LaTeX packages
\\documentclass[10pt,a4paper]{article}

\\usepackage[margin=0.75in]{geometry}
\\usepackage{array}
\\usepackage{xcolor}
\\usepackage{hyperref}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage{parskip}
\\usepackage{tabularx}
\\usepackage{multicol}

\\definecolor{headingcolor}{RGB}{31,78,121}
\\definecolor{rulecolor}{RGB}{31,78,121}
\\definecolor{sidecolor}{RGB}{240,245,250}

\\hypersetup{colorlinks=true, urlcolor=headingcolor, linkcolor=headingcolor}

\\titleformat{\\section}
  {\\color{headingcolor}\\large\\bfseries}
  {}
  {0em}
  {}
  [\\color{rulecolor}\\hrule\\vspace{2pt}]
\\titlespacing{\\section}{0pt}{10pt}{5pt}

\\newcommand{\\entry}[4]{%
  \\textbf{#1}\\hfill\\textit{\\small #2}\\\\
  \\textit{#3}\\hfill\\small #4\\\\
}

\\setlist[itemize]{noitemsep, topsep=2pt, leftmargin=*}

\\begin{document}
\\pagestyle{empty}

%---------- Header ----------
{\\centering
  {\\LARGE\\bfseries\\color{headingcolor} Your Name}\\\\[4pt]
  \\href{mailto:you@email.com}{you@email.com} \\quad|\\quad
  +1 (234) 567-8900 \\quad|\\quad
  \\href{https://linkedin.com/in/yourprofile}{linkedin.com/in/yourprofile} \\quad|\\quad
  \\href{https://github.com/yourgithub}{github.com/yourgithub}\\\\[2pt]
  City, State 00000\\\\
  \\color{rulecolor}\\rule{\\linewidth}{1.5pt}
\\par}\\vspace{6pt}

\\begin{minipage}[t]{0.63\\textwidth}

\\section{Professional Summary}
Motivated software engineer with 3+ years of experience building scalable web applications. Passionate about clean code, performance optimization, and leveraging AI to solve real-world problems.

\\section{Experience}

\\entry{Software Engineer}{June 2024 -- Present}{Company Inc.}{San Francisco, CA}
\\begin{itemize}
  \\item Built microservices architecture handling 1M+ daily requests
  \\item Reduced API response time by 40\\% through Redis caching
  \\item Led a team of 3 engineers on a greenfield React dashboard
\\end{itemize}
\\vspace{6pt}

\\entry{Software Engineer Intern}{May 2023 -- Aug 2023}{Startup Co.}{Remote}
\\begin{itemize}
  \\item Developed RESTful APIs with Node.js and MongoDB
  \\item Implemented CI/CD pipeline reducing deployment time by 60\\%
\\end{itemize}

\\section{Projects}
\\textbf{AI Resume Builder} \\textit{(React, Node.js, Gemini API)}\\\\
\\begin{itemize}
  \\item AI-powered resume parsing, ATS scoring, and PDF generation
  \\item Real-time preview with Overleaf integration
\\end{itemize}
\\vspace{4pt}
\\textbf{E-Commerce Platform} \\textit{(React, MongoDB, Stripe)}\\\\
\\begin{itemize}
  \\item Full-stack shop with cart, orders, and payment integration
\\end{itemize}

\\end{minipage}\\hfill
\\begin{minipage}[t]{0.33\\textwidth}

\\colorbox{sidecolor}{\\begin{minipage}{\\linewidth}\\vspace{8pt}
\\section{Education}
\\textbf{B.S. Computer Science}\\\\
University Name\\\\
\\textit{City, State}\\\\
May 2024 \\quad GPA: 3.9/4.0\\\\[6pt]

\\section{Skills}
\\textbf{Languages}\\\\
Python, JavaScript, TypeScript, C++\\\\[4pt]
\\textbf{Frontend}\\\\
React, Next.js, Tailwind CSS\\\\[4pt]
\\textbf{Backend}\\\\
Node.js, Express, Django, FastAPI\\\\[4pt]
\\textbf{Databases}\\\\
MongoDB, PostgreSQL, Redis\\\\[4pt]
\\textbf{DevOps}\\\\
Docker, AWS, GitHub Actions\\\\[4pt]

\\section{Certifications}
AWS Solutions Architect\\\\
Google Cloud Professional\\\\[4pt]

\\section{Languages}
English (Native)\\\\
Spanish (Intermediate)\\\\
\\vspace{8pt}
\\end{minipage}}

\\end{minipage}

\\end{document}`;

// ─── Template 5: Minimalist Elegant ──────────────────────────────────────────
const TEMPLATE_MINIMALIST = `%% Minimalist Elegant Resume
%% Clean single-column design with thin rule accents
\\documentclass[11pt, a4paper]{article}

\\usepackage[top=1.5cm, bottom=1.5cm, left=2cm, right=2cm]{geometry}
\\usepackage{hyperref}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage{tabularx}
\\usepackage{xcolor}
\\usepackage{fontenc}
\\usepackage{parskip}

\\definecolor{accent}{RGB}{70,70,70}
\\definecolor{light}{RGB}{120,120,120}

\\hypersetup{colorlinks=true, urlcolor=accent}

\\titleformat{\\section}
  {\\normalsize\\bfseries\\color{accent}\\uppercase\\scshape}
  {}{0em}{}
  [\\vspace{-6pt}\\rule{\\linewidth}{0.4pt}\\vspace{2pt}]
\\titlespacing{\\section}{0pt}{14pt}{4pt}

\\setlist[itemize]{leftmargin=1.2em, itemsep=2pt, topsep=0pt, parsep=0pt}

\\newcommand{\\cventry}[4]{%
  {\\textbf{#1}}\\hfill{\\small\\color{light}#2}\\\\
  {\\small\\color{light}#3}\\hfill{\\small\\color{light}#4}\\vspace{2pt}
}

\\begin{document}
\\pagestyle{empty}

% ── Header ──────────────────────────────────────────────────────────────────
{\\centering
  {\\fontsize{22}{26}\\selectfont \\textbf{Your Name}}\\\\[6pt]
  {\\small\\color{light}
    \\href{mailto:you@email.com}{you@email.com} \\enspace·\\enspace
    +1 234 567 8900 \\enspace·\\enspace
    \\href{https://github.com/yourgithub}{github.com/yourgithub} \\enspace·\\enspace
    City, Country
  }\\\\
\\par}
\\vspace{8pt}
\\rule{\\linewidth}{1pt}
\\vspace{4pt}

% ── Summary ─────────────────────────────────────────────────────────────────
\\section{Profile}
A driven software engineer with expertise in full-stack development and AI integration. Committed to writing clean, maintainable code and delivering high-impact solutions.

% ── Experience ──────────────────────────────────────────────────────────────
\\section{Experience}

\\cventry{Software Engineer}{Company Inc., San Francisco, CA}{Full-time}{June 2024 -- Present}
\\begin{itemize}
  \\item Architected and deployed 3 microservices reducing system latency by 40\\%
  \\item Built real-time React dashboard driving 20\\% increase in user engagement
  \\item Mentored 2 junior engineers through code reviews and pair programming
\\end{itemize}
\\vspace{6pt}

\\cventry{Software Engineering Intern}{Startup Co., Remote}{Internship}{May 2023 -- Aug 2023}
\\begin{itemize}
  \\item Developed REST APIs with Python FastAPI, serving 50k+ daily requests
  \\item Reduced database query time by 35\\% through query optimization
\\end{itemize}

% ── Education ───────────────────────────────────────────────────────────────
\\section{Education}

\\cventry{Bachelor of Science — Computer Science}{GPA: 3.9/4.0}{University Name}{2020 -- 2024}

% ── Projects ────────────────────────────────────────────────────────────────
\\section{Projects}

\\textbf{AI Resume Builder} \\quad {\\small\\color{light}React · Node.js · Gemini API}\\hfill{\\small\\color{light}2024}
\\begin{itemize}
  \\item Built AI-powered resume builder with real-time LaTeX PDF preview
\\end{itemize}
\\vspace{4pt}
\\textbf{E-Commerce Platform} \\quad {\\small\\color{light}React · MongoDB · Stripe}\\hfill{\\small\\color{light}2023}
\\begin{itemize}
  \\item Full-stack shop with cart management, payment integration, and admin panel
\\end{itemize}

% ── Skills ──────────────────────────────────────────────────────────────────
\\section{Skills}
\\begin{tabularx}{\\linewidth}{@{}l X@{}}
  Languages  & Python, JavaScript, TypeScript, C++, SQL \\\\
  Frontend   & React, Next.js, Tailwind CSS, HTML/CSS \\\\
  Backend    & Node.js, Express, FastAPI, Django \\\\
  DevOps     & Docker, AWS, GitHub Actions, Linux \\\\
\\end{tabularx}

\\end{document}`;

// ─── Template 6: Academic / Research CV ──────────────────────────────────────
const TEMPLATE_ACADEMIC = `%% Academic Research CV
%% Long-form format for academic and research positions
\\documentclass[11pt, a4paper]{article}

\\usepackage[margin=1in]{geometry}
\\usepackage{hyperref}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage{xcolor}
\\usepackage{parskip}

\\definecolor{darkblue}{RGB}{0,51,102}
\\hypersetup{colorlinks=true, urlcolor=darkblue, linkcolor=darkblue}

\\titleformat{\\section}{\\large\\bfseries\\color{darkblue}}{}{0em}{}[\\color{darkblue}\\hrule]
\\titlespacing{\\section}{0pt}{12pt}{6pt}
\\titleformat{\\subsection}{\\normalsize\\bfseries}{}{0em}{}
\\titlespacing{\\subsection}{0pt}{8pt}{2pt}

\\setlist[itemize]{itemsep=2pt, topsep=2pt}
\\setlist[enumerate]{itemsep=2pt, topsep=2pt}

\\begin{document}
\\pagestyle{empty}

% ── Header ───────────────────────────────────────────────────────────────────
{\\centering
  {\\Large\\bfseries\\color{darkblue} Dr. Your Name}\\\\[4pt]
  {\\small Assistant Professor, Department of Computer Science}\\\\[2pt]
  {\\small University Name, City, Country}\\\\[4pt]
  {\\small
    \\href{mailto:you@university.edu}{you@university.edu} \\quad|\\quad
    \\href{https://yourwebsite.com}{yourwebsite.com} \\quad|\\quad
    \\href{https://scholar.google.com}{Google Scholar}
  }
\\par}
\\vspace{6pt}

% ── Research Interests ───────────────────────────────────────────────────────
\\section{Research Interests}
Machine Learning, Natural Language Processing, Computer Vision, Human-Computer Interaction, AI Ethics.

% ── Education ────────────────────────────────────────────────────────────────
\\section{Education}

\\subsection{Ph.D. in Computer Science \\hfill 2019 -- 2024}
\\textit{University Name, City, Country}\\\\
Dissertation: "Efficient Neural Architectures for Low-Resource NLP Tasks"\\\\
Advisor: Prof. John Doe

\\vspace{6pt}
\\subsection{B.S. in Computer Science \\hfill 2015 -- 2019}
\\textit{University Name, City, Country}\\\\
GPA: 3.95/4.0, Summa Cum Laude

% ── Publications ─────────────────────────────────────────────────────────────
\\section{Publications}

\\subsection{Peer-Reviewed Journal Articles}
\\begin{enumerate}
  \\item \\textbf{Your Name}, Co-Author A, Co-Author B. "Title of Your Paper." \\textit{Journal Name}, vol. 12, no. 3, pp. 123--145, 2024. \\href{https://doi.org/10.xxxx}{DOI}
  \\item \\textbf{Your Name}, Co-Author C. "Another Paper Title." \\textit{Another Journal}, 2023. \\href{https://doi.org/10.xxxx}{DOI}
\\end{enumerate}

\\subsection{Conference Papers}
\\begin{enumerate}
  \\item \\textbf{Your Name}, Co-Author D. "Conference Paper Title." In \\textit{Proceedings of NeurIPS 2023}, pp. 456--468.
\\end{enumerate}

% ── Academic Experience ───────────────────────────────────────────────────────
\\section{Academic Experience}

\\subsection{Assistant Professor \\hfill 2024 -- Present}
\\textit{University Name, Department of Computer Science}
\\begin{itemize}
  \\item Teaching undergraduate and graduate courses in ML and AI
  \\item Supervising 3 PhD students and 5 Master's students
\\end{itemize}

\\subsection{Research Intern \\hfill Summer 2022}
\\textit{Research Lab, Tech Company}
\\begin{itemize}
  \\item Developed efficient transformer fine-tuning methods for low-resource languages
\\end{itemize}

% ── Skills ───────────────────────────────────────────────────────────────────
\\section{Technical Skills}
\\begin{itemize}
  \\item \\textbf{Programming:} Python, R, MATLAB, C++, Julia
  \\item \\textbf{ML Frameworks:} PyTorch, TensorFlow, Hugging Face, JAX
  \\item \\textbf{Tools:} Git, Docker, LaTeX, SLURM, GCP, AWS
\\end{itemize}

% ── Awards ───────────────────────────────────────────────────────────────────
\\section{Honors \\& Awards}
\\begin{itemize}
  \\item Best Paper Award — NeurIPS 2023 Workshop on Efficient ML
  \\item National Science Foundation Graduate Research Fellowship, 2019--2024
  \\item University Excellence Scholarship, 2015--2019
\\end{itemize}

\\end{document}`;

// ─── Template 7: Professional Modern — RenderCV Style ────────────────────────
const TEMPLATE_PROFESSIONAL = `\\documentclass[10pt, letterpaper]{article}

% Packages:
\\usepackage[
    ignoreheadfoot,
    top=1.5 cm,
    bottom=1.5 cm,
    left=1.7 cm,
    right=1.7 cm,
    footskip=1.0 cm,
]{geometry}
\\usepackage{titlesec}
\\usepackage{tabularx}
\\usepackage{array}
\\usepackage[dvipsnames]{xcolor}
\\definecolor{primaryColor}{RGB}{0, 0, 0}
\\usepackage{enumitem}
\\usepackage{fontawesome5}
\\usepackage{amsmath}
\\usepackage[
    pdftitle={{{name}}'s CV},
    pdfauthor={{{name}}},
    pdfcreator={LaTeX with ResumeForge},
    colorlinks=true,
    urlcolor=primaryColor
]{hyperref}
\\usepackage[pscoord]{eso-pic}
\\usepackage{calc}
\\usepackage{bookmark}

\\usepackage{changepage}
\\usepackage{paracol}
\\usepackage{ifthen}
\\usepackage{needspace}
\\usepackage{iftex}

% Ensure that generate pdf is machine readable/ATS parsable:
\\ifPDFTeX
    \\input{glyphtounicode}
    \\pdfgentounicode=1
    \\usepackage[T1]{fontenc}
    \\usepackage[utf8]{inputenc}
    \\usepackage{lmodern}
\\fi

\\usepackage{charter}

% Some settings:
\\raggedright
\\AtBeginEnvironment{adjustwidth}{\\partopsep0pt}
\\pagestyle{empty}
\\setcounter{secnumdepth}{0}
\\setlength{\\parindent}{0pt}
\\setlength{\\topskip}{0pt}
\\setlength{\\columnsep}{0.15cm}
\\pagenumbering{gobble}

\\titleformat{\\section}{\\needspace{4\\baselineskip}\\bfseries\\large}{}{0pt}{}[\\vspace{1pt}\\titlerule]

\\titlespacing{\\section}{-1pt}{0.2 cm}{0.1 cm}

\\renewcommand\\labelitemi{$\\vcenter{\\hbox{\\small$\\bullet$}}$}
\\newenvironment{highlights}{
    \\begin{itemize}[topsep=0.10 cm, parsep=0.10 cm, partopsep=0pt, itemsep=0pt, leftmargin=0 cm + 10pt]
}{
    \\end{itemize}
}

\\newenvironment{highlightsforbulletentries}{
    \\begin{itemize}[topsep=0.10 cm, parsep=0.10 cm, partopsep=0pt, itemsep=0pt, leftmargin=10pt]
}{
    \\end{itemize}
}

\\newenvironment{onecolentry}{
    \\begin{adjustwidth}{0 cm + 0.00001 cm}{0 cm + 0.00001 cm}
}{
    \\end{adjustwidth}
}

\\newenvironment{twocolentry}[2][]{
    \\onecolentry
    \\def\\secondColumn{#2}
    \\setcolumnwidth{\\fill, 4.5 cm}
    \\begin{paracol}{2}
}{
    \\switchcolumn \\raggedleft \\secondColumn
    \\end{paracol}
    \\endonecolentry
}

\\newenvironment{threecolentry}[3][]{
    \\onecolentry
    \\def\\thirdColumn{#3}
    \\setcolumnwidth{, \\fill, 4.5 cm}
    \\begin{paracol}{3}
    {\\raggedright #2} \\switchcolumn
}{
    \\switchcolumn \\raggedleft \\thirdColumn
    \\end{paracol}
    \\endonecolentry
}

\\newenvironment{header}{
    \\setlength{\\topsep}{0pt}\\par\\kern\\topsep\\centering\\linespread{1.5}
}{
    \\par\\kern\\topsep
}

\\let\\hrefWithoutArrow\\href

\\begin{document}
    \\newcommand{\\AND}{\\unskip
        \\cleaders\\copy\\ANDbox\\hskip\\wd\\ANDbox
        \\ignorespaces
    }
    \\newsavebox\\ANDbox
    \\sbox\\ANDbox{$|$}

    \\begin{header}
        \\fontsize{20 pt}{20 pt}\\selectfont {{name}}

        \\vspace{3 pt}

        \\normalsize
        \\kern 5.0 pt%
        \\mbox{\\hrefWithoutArrow{tel:{{phone}}}{{{phone}}}}%
        \\kern 5.0 pt%
         \\AND%
        \\kern 5.0 pt%
\\mbox{\\hrefWithoutArrow{https://{{linkedin}}}{{{linkedin}}}} %
        \\kern 5.0 pt%
        \\AND%
        \\kern 5.0 pt%
        \\mbox{\\hrefWithoutArrow{https://{{github}}}{{{github}}}}%
        \\kern 5.0 pt%
         \\AND%
            \\kern 5.0 pt%
            {{{location}}}
    \\end{header}

    \\vspace{5 pt - 0.3 cm}

    % ----- Objective -----
    \\section{Objective}
        \\vspace{0.2 cm}
        \\begin{onecolentry}
            {{objective}}
        \\end{onecolentry}

    % ----- Education -----
    \\section{Education}
        \\vspace{0.2 cm}
        {{#education}}
        \\begin{twocolentry}{{{date}}}
        \\textbf{{{{companyOrInst}}}}\\end{twocolentry}
        \\vspace{0.10 cm}
        \\begin{onecolentry}
            \\begin{highlights}
                \\item {{{title}}}
                {{#details}}\\item {{{details}}}{{/details}}
            \\end{highlights}
        \\end{onecolentry}
        \\vspace{0.15 cm}
        {{/education}}

    % ----- Skills -----
    \\section{Skills}
        \\vspace{0.05 cm}
        \\begin{highlightsforbulletentries}
            {{#skills}}
            \\item \\textbf{{{category}}:} {{#items}}{{.}}{{^-last}}, {{/-last}}{{/items}}
            \\vspace{0.02 cm}
            {{/skills}}
        \\end{highlightsforbulletentries}

    % ----- Projects -----
    \\section{Academic Projects Experience}
        \\vspace{0.1 cm}
        {{#projects}}
        \\begin{twocolentry}{{{date}}}
            \\textbf{{{{title}}}}
        \\end{twocolentry}
        \\vspace{0.10 cm}
        \\begin{onecolentry}
            \\begin{highlights}
                {{#bullets}}
                \\item {{{.}}}
                {{/bullets}}
            \\end{highlights}
        \\end{onecolentry}
        \\vspace{0.15 cm}
        {{/projects}}

    % ----- Experience -----
    \\section{Work Experience}
        \\vspace{0.1 cm}
        {{#experience}}
        \\begin{twocolentry}{{{date}}}
            \\textbf{{{{title}}}}, {{{companyOrInst}}}
        \\end{twocolentry}
        \\vspace{0.10 cm}
        \\begin{onecolentry}
            \\begin{highlights}
                {{#bullets}}
                \\item {{{.}}}
                {{/bullets}}
            \\end{highlights}
        \\end{onecolentry}
        \\vspace{0.15 cm}
        {{/experience}}

\\end{document}`;

// ─── Registry ─────────────────────────────────────────────────────────────────
export const TEMPLATE_REGISTRY = {
  'jitin-nair': {
    label: 'Jitin Nair — Clean',
    author: 'Jitin Nair',
    tag: 'Most Used',
    tagColor: 'blue',
    color: 'from-blue-100 to-indigo-50',
    compat: 'online',
    desc: 'Minimal article-style with social icons and tabular skill layout.',
    code: TEMPLATE_JITIN,
  },
  'anubhav-singh': {
    label: 'Anubhav Singh — Classic',
    author: 'Anubhav Singh',
    tag: 'Popular',
    tagColor: 'rose',
    color: 'from-rose-50 to-orange-50',
    compat: 'online',
    desc: 'Classic tech resume with subheading macros, perfect for SWE roles.',
    code: TEMPLATE_ANUBHAV,
  },
  'jake': {
    label: "Jake's Resume",
    author: 'Jake Gutierrez',
    tag: '#1 on Overleaf',
    tagColor: 'emerald',
    color: 'from-emerald-50 to-teal-50',
    compat: 'online',
    desc: 'The most-used resume template on Overleaf. Clean, ATS-friendly layout.',
    code: TEMPLATE_JAKE,
  },
  'two-column': {
    label: 'Two-Column Pro',
    author: 'Community',
    tag: 'Professional',
    tagColor: 'violet',
    color: 'from-violet-50 to-purple-50',
    compat: 'online',
    desc: 'Split-column design with sidebar for skills and a main content area.',
    code: TEMPLATE_TWO_COL,
  },
  'minimalist': {
    label: 'Minimalist Elegant',
    author: 'Community',
    tag: 'Clean',
    tagColor: 'slate',
    color: 'from-slate-50 to-gray-100',
    compat: 'online',
    desc: 'Ultra-clean single-column resume with subtle rule accents.',
    code: TEMPLATE_MINIMALIST,
  },
  'academic': {
    label: 'Academic / Research CV',
    author: 'Community',
    tag: 'Academic',
    tagColor: 'amber',
    color: 'from-amber-50 to-yellow-50',
    compat: 'online',
    desc: 'Long-form CV for academic and research positions with publications.',
    code: TEMPLATE_ACADEMIC,
  },
  'professional-modern': {
    label: 'Professional Modern',
    author: 'Community',
    tag: 'New & Premium',
    tagColor: 'indigo',
    color: 'from-indigo-50 to-blue-50',
    compat: 'overleaf',
    desc: 'Highly structured, ATS-optimized RenderCV style for experienced pros.',
    code: TEMPLATE_PROFESSIONAL,
  },
};

export const TEMPLATE_KEYS = Object.keys(TEMPLATE_REGISTRY);
