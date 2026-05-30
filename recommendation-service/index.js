const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 8000;

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("WARNING: GEMINI_API_KEY environment variable is not set! Using mock fallbacks.");
}
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Multer setup for handling file uploads (in-memory)
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

// Helper to interact with Gemini API
async function callGemini(prompt, systemInstruction = "") {
  if (!genAI) {
    throw new Error("Gemini API key is not configured.");
  }
  
  const model = genAI.getGenerativeModel({
    model: 'gemini-flash-latest',
  });

  const fullPrompt = `${systemInstruction}\n\nUser Request/Context:\n${prompt}`;
  
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
    }
  });

  return result.response.text();
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: "Recommendation Service is running", hasApiKey: !!apiKey });
});

// 1. POST /recommend - Job recommendations
app.post('/recommend', async (req, res) => {
  const { skills = [], interests = [], experience = "Intermediate" } = req.body;
  
  const prompt = `Skills: ${skills.join(', ')}\nInterests: ${interests.join(', ')}\nExperience Level: ${experience}`;
  const systemInstruction = `You are an AI Job Matching Expert. Recommend 4 suitable job roles matching the user's profile. You MUST respond with a valid JSON array of objects.
Each object in the array must contain:
- "job_title" (string)
- "company" (string)
- "match_score" (number, 0-100)
- "required_skills" (array of strings)
- "salary_range" (string, e.g. "$120k - $140k")
- "demand" (string, e.g. "High" or "Extreme")
- "description" (string)
Do not include any markdown format tags like \`\`\`json outside the JSON text.`;

  try {
    const rawResult = await callGemini(prompt, systemInstruction);
    const data = JSON.parse(rawResult);
    res.json(data);
  } catch (error) {
    console.error("Gemini /recommend failed, using fallback:", error.message);
    // Mock Fallback
    const mockJobs = [
      {
        job_title: "Full Stack Developer",
        company: "Stripe",
        match_score: 95,
        required_skills: ["React", "Node.js", "TypeScript", "SQL"],
        salary_range: "$140k - $185k",
        demand: "High",
        description: "Build robust, scalable developer-friendly APIs and user dashboards."
      },
      {
        job_title: "Frontend Engineer",
        company: "Vercel",
        match_score: 88,
        required_skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
        salary_range: "$130k - $170k",
        demand: "Extreme",
        description: "Work on performance-critical React rendering and edge-optimized dashboards."
      },
      {
        job_title: "Software Engineer - AI Systems",
        company: "OpenAI",
        match_score: 82,
        required_skills: ["Python", "PyTorch", "APIs", "Docker"],
        salary_range: "$160k - $220k",
        demand: "Extreme",
        description: "Integrate LLM API nodes and orchestrate multi-agent microservice systems."
      },
      {
        job_title: "DevOps Architect",
        company: "HashiCorp",
        match_score: 75,
        required_skills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
        salary_range: "$150k - $190k",
        demand: "High",
        description: "Design high-availability cloud cluster deployments and automated delivery networks."
      }
    ];
    res.json(mockJobs);
  }
});

// 2. POST /career-roadmap
app.post('/career-roadmap', async (req, res) => {
  const { currentSkills = [], targetRole = "Software Engineer" } = req.body;
  
  const prompt = `Current Skills: ${currentSkills.join(', ')}\nTarget Role: ${targetRole}`;
  const systemInstruction = `You are a Professional Career Mentor. Create a step-by-step roadmap to achieve the target role from the user's current skills. You MUST respond with a valid JSON object.
The object must contain:
- "roadmap_title" (string)
- "summary" (string)
- "milestones" (array of objects, each with: "step_number" (number), "title" (string), "description" (string), "estimated_duration" (string), "recommended_resources" (array of strings))
- "certificates" (array of strings)
Do not include any markdown formatting tags outside the JSON text.`;

  try {
    const rawResult = await callGemini(prompt, systemInstruction);
    const data = JSON.parse(rawResult);
    res.json(data);
  } catch (error) {
    console.error("Gemini /career-roadmap failed, using fallback:", error.message);
    const mockRoadmap = {
      roadmap_title: `Learning Path to ${targetRole}`,
      summary: `A structured curriculum to master technical and system design skills needed to transition successfully.`,
      milestones: [
        {
          step_number: 1,
          title: "Bridge Frontend and Type Safety",
          description: "Transition from pure JavaScript to TypeScript. Master advanced interfaces, generics, and compiler options.",
          estimated_duration: "3 weeks",
          recommended_resources: ["TypeScript Deep Dive by Basarat", "Official TypeScript Handbook"]
        },
        {
          step_number: 2,
          title: "Dockerization and Server Deployment",
          description: "Learn how to wrap applications into microservice containers using Docker and write compose configurations.",
          estimated_duration: "4 weeks",
          recommended_resources: ["Docker & Kubernetes Course by Maximillian", "Vite/Nginx Deployment Guides"]
        },
        {
          step_number: 3,
          title: "AWS Cloud Infrastructure Core",
          description: "Get familiar with cloud compute nodes, load balancing, relational schemas, and serverless edge functions.",
          estimated_duration: "5 weeks",
          recommended_resources: ["AWS Certified Solutions Architect Course", "Serverless Framework Documentation"]
        }
      ],
      certificates: ["AWS Certified Solutions Architect", "HashiCorp Certified Terraform Associate"]
    };
    res.json(mockRoadmap);
  }
});

// 3. POST /resume-analysis and POST /analyze
const analyzeResumeHandler = async (req, res) => {
  let resumeText = req.body.text || "";

  if (req.file) {
    try {
      const parsedPdf = await pdfParse(req.file.buffer);
      resumeText = parsedPdf.text;
    } catch (err) {
      console.error("PDF Parsing failed, falling back to body text or placeholder:", err.message);
    }
  }

  if (!resumeText) {
    resumeText = "Full Stack Engineer. Skills: React, Node.js, JS, CSS, HTML. Experience: 3 years.";
  }

  const prompt = `Resume Text:\n${resumeText}`;
  const systemInstruction = `You are an expert ATS (Applicant Tracking System) parser and Resume Consultant. Analyze the provided resume text and generate a realistic resume evaluation for software engineering roles. You MUST respond with a valid JSON object.
The object must contain:
- "score" (number, 0-100)
- "atsScore" (number, 0-100)
- "keywordMatch" (number, 0-100)
- "skillsFound" (array of strings)
- "missingSkills" (array of strings)
- "topMissingKeywords" (array of strings)
- "formattingIssues" (array of strings)
- "weakBullets" (array of strings)
- "suggestions" (array of strings)
Do not include any markdown formatting tags outside the JSON text.`;

  try {
    const rawResult = await callGemini(prompt, systemInstruction);
    const data = JSON.parse(rawResult);
    res.json(data);
  } catch (error) {
    console.error("Gemini /resume-analysis failed, using fallback:", error.message);
    res.json({
      score: 32,
      atsScore: 28,
      keywordMatch: 35,
      skillsFound: ['Java', 'Python', 'Docker', 'React', 'PHP'],
      missingSkills: ['Kubernetes', 'Linux', 'Git', 'CI/CD', 'Cloud'],
      topMissingKeywords: ['Kubernetes', 'Linux', 'Git', 'CI/CD', 'Cloud'],
      formattingIssues: ['Resume is very short and missing structured sections', 'No experience or education details', 'Missing ATS-friendly headings such as SUMMARY or EXPERIENCE'],
      weakBullets: ['EcoDrive – Developed a fuel optimization web app using HTML, CSS, PHP...'],
      suggestions: [
        'Add clear sections like SUMMARY, SKILLS, EXPERIENCE, PROJECTS, EDUCATION',
        'Include role-specific keywords such as Kubernetes, Git, Linux, CI/CD, cloud basics',
        'Rewrite project bullets with measurable outcomes and automation/DevOps focus',
        'Provide at least one technical experience item or relevant internship entry'
      ]
    });
  }
};

app.post('/resume-analysis', upload.single('resume'), analyzeResumeHandler);
app.post('/analyze', upload.single('resume'), analyzeResumeHandler);

// 4. POST /interview-questions
app.post('/interview-questions', async (req, res) => {
  const { role = "Software Engineer", skills = [] } = req.body;
  
  const prompt = `Job Role: ${role}\nKey Skills: ${skills.join(', ')}`;
  const systemInstruction = `You are a Technical Interviewer. Generate 5 behavioral and technical interview questions based on the target role and key skills. You MUST respond with a valid JSON array of objects.
Each object in the array must contain:
- "question" (string)
- "category" (string, e.g. "Technical" or "Behavioral")
- "suggested_answer_bullet_points" (array of strings)
Do not include any markdown formatting tags outside the JSON text.`;

  try {
    const rawResult = await callGemini(prompt, systemInstruction);
    const data = JSON.parse(rawResult);
    res.json(data);
  } catch (error) {
    console.error("Gemini /interview-questions failed, using fallback:", error.message);
    res.json([
      {
        question: "Explain the virtual DOM and how React renders changes.",
        category: "Technical",
        suggested_answer_bullet_points: [
          "React maintains a lightweight representation of the real DOM in memory.",
          "On state update, React generates a new virtual DOM tree and compares it (diffing) with the old one.",
          "React updates only the dirty nodes in the actual DOM (reconciliation)."
        ]
      },
      {
        question: "How do you handle state management in a large-scale React app?",
        category: "Technical",
        suggested_answer_bullet_points: [
          "Use Context API for global, rarely updated settings (themes, user auth).",
          "Use Redux Toolkit or Zustand for high-frequency, complex state flows.",
          "Leverage React Query or SWR for caching server responses."
        ]
      },
      {
        question: "Tell me about a time you faced a difficult technical challenge and how you overcame it.",
        category: "Behavioral",
        suggested_answer_bullet_points: [
          "Describe the specific context and technical block clearly (e.g., memory leak).",
          "Explain the structured troubleshooting steps you took (profiling, logs).",
          "Quantify the positive outcome and what you learned from it."
        ]
      }
    ]);
  }
});

// 5. POST /skill-gap-analysis
app.post('/skill-gap-analysis', async (req, res) => {
  const { currentSkills = [], targetRole = "Software Engineer" } = req.body;

  const prompt = `Current Skills: ${currentSkills.join(', ')}\nTarget Role: ${targetRole}`;
  const systemInstruction = `You are an AI Skills Analyst. Analyze the gap between the user's current skills and the skills needed for their target role. You MUST respond with a valid JSON object.
The object must contain:
- "match_percent" (number, 0-100)
- "missing_critical_skills" (array of strings)
- "missing_nice_to_have_skills" (array of strings)
- "learning_path" (string)
- "market_demand_trend" (string)
Do not include any markdown formatting tags outside the JSON text.`;

  try {
    const rawResult = await callGemini(prompt, systemInstruction);
    const data = JSON.parse(rawResult);
    res.json(data);
  } catch (error) {
    console.error("Gemini /skill-gap-analysis failed, using fallback:", error.message);
    res.json({
      match_percent: 65,
      missing_critical_skills: ["TypeScript", "Docker", "AWS Essentials"],
      missing_nice_to_have_skills: ["Redis Caching", "CI/CD Actions"],
      learning_path: "Focus on adding static types and server virtualization to your portfolio.",
      market_demand_trend: "Extremely High. 85% of startups require TypeScript and Kubernetes/Docker orchestration."
    });
  }
});

// 6. POST /chat
app.post('/chat', async (req, res) => {
  const { message = "", history = [] } = req.body;

  const formattedHistory = history.map(h => `${h.sender === 'user' ? 'User' : 'Assistant'}: ${h.text}`).join('\n');
  const prompt = `Chat History:\n${formattedHistory}\n\nUser Message: ${message}`;
  
  const systemInstruction = `You are a helpful and encouraging AI Career Assistant. Answer career questions, suggest learning paths, give interview preparation tips, explain technologies, and provide roadmap guidance. You MUST respond with a valid JSON object.
The object must contain:
- "response" (string, containing clear markdown text)
- "follow_up_suggestions" (array of strings, e.g. ["Tell me about Docker", "Prepare for React interviews"])
Do not include any markdown formatting tags outside the JSON text.`;

  try {
    const rawResult = await callGemini(prompt, systemInstruction);
    const data = JSON.parse(rawResult);
    res.json(data);
  } catch (error) {
    console.error("Gemini /chat failed, using fallback:", error.message);
    
    // Simplistic fallback answer selector based on keywords
    let responseText = "That's an interesting career question! To give you a specialized answer, could you describe your target role?";
    let suggestions = ["What skills should I learn?", "Tell me about interview prep", "Resume writing tips"];

    const msg = message.toLowerCase();
    if (msg.includes('resume')) {
      responseText = "For a great resume, keep it to one page, use action verbs (e.g., 'Developed', 'Managed'), and tailor it to the specific job description by including relevant keywords.";
      suggestions = ["ATS compliance tips", "Show me a resume roadmap"];
    } else if (msg.includes('interview')) {
      responseText = "To prepare for interviews, practice the STAR method (Situation, Task, Action, Result) for behavioral questions. Research the company and prepare a few good questions to ask them at the end.";
      suggestions = ["System Design questions", "Behavioral interview prep"];
    } else if (msg.includes('skill') || msg.includes('learn')) {
      responseText = "Based on current trends, learning Python, SQL, and Cloud platforms (AWS/Azure) are highly valuable. If you're into frontend, React and TypeScript are top skills to have.";
      suggestions = ["Learning TypeScript", "Cloud deployment skills"];
    } else if (msg.includes('roadmap')) {
      responseText = "A standard Web Developer roadmap: HTML/CSS/JS -> Frontend Framework (React) -> Backend (Node.js/Python) -> Database (SQL/MongoDB) -> Deployment & CI/CD.";
      suggestions = ["Frontend roadmap", "DevOps roadmap"];
    }

    res.json({
      response: responseText,
      follow_up_suggestions: suggestions
    });
  }
});

app.listen(PORT, () => {
  console.log(`Recommendation Service listening on port ${PORT}`);
});
