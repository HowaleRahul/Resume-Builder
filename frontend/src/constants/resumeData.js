export const DEFAULT_RESUME_DATA = {
  personal: { 
    name: "John Doe", 
    email: "john.doe@example.com", 
    phone: "+1 (555) 000-0000", 
    location: "New York, NY", 
    github: "github.com/johndoe", 
    linkedin: "linkedin.com/in/johndoe",
    objective: "Results-driven Software Engineer with 5+ years of experience in building scalable web applications. Expert in React, Node.js, and cloud infrastructure."
  },
  education: [
    { title: "B.S. in Computer Science", companyOrInst: "State University", date: "2016 – 2020", location: "New York, NY", details: "GPA: 3.8/4.0. Dean's List for 4 consecutive years." }
  ],
  experience: [
    { title: "Senior Software Engineer", companyOrInst: "Tech Global Inc.", location: "San Francisco, CA", date: "Jan 2021 – Present", bullets: ["Architected microservices handling 1M+ daily active users", "Reduced server costs by 30% through AWS Lambda optimization", "Mentored a team of 5 junior developers through code reviews and pair programming"] }
  ],
  projects: [
    { title: "AI-Powered Analytics Suite", date: "2023", location: "Remote", bullets: ["Built a real-time dashboard using React and D3.js", "Integrated OpenAI API for automated data insights", "Successfully deployed to 50+ enterprise clients"] }
  ],
  skills: [
    { category: "Languages", items: ["JavaScript (ES6+)", "TypeScript", "Python", "Go"] },
    { category: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Redux"] },
    { category: "Backend", items: ["Node.js", "Express", "FastAPI", "PostgreSQL"] },
    { category: "Cloud & DevOps", items: ["AWS", "Docker", "Kubernetes", "CI/CD"] }
  ]
};
