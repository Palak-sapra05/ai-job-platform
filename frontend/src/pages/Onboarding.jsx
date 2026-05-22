import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, BookOpen, GraduationCap, Briefcase, 
  Code, Cpu, Layers, Shield, Database, Layout, 
  Plus, FileText, CheckCircle, 
  ChevronRight, ChevronLeft, Target, Award, TrendingUp, Search, Globe, Zap,
  Trash2, ExternalLink, BarChart, Lightbulb, Map, Link
} from 'lucide-react';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: localStorage.getItem('userName') || '',
    email: '',
    college: '',
    degree: '',
    gradYear: '2024',
    status: 'Student',
    skills: [], // { name, level }
    projects: [], // { title, description, link, tech }
    interests: [],
    workType: 'Remote',
    industries: [],
    learningGoals: [],
    certifications: [],
    targetCompany: '',
    targetSalary: '$80k - $120k',
    resumeFile: null,
    linkedinUrl: '',
    githubUrl: ''
  });

  const navigate = useNavigate();
  const totalSteps = 7;

  const isStepValid = () => {
    if (step === 1) {
      return formData.name.trim() !== '' && formData.email.trim() !== '' && formData.college.trim() !== '' && formData.degree.trim() !== '';
    }
    if (step === 2) {
      return formData.skills.length > 0;
    }
    if (step === 4) {
      return formData.interests.length > 0 && formData.industries.length > 0;
    }
    return true;
  };

  const handleNext = () => {
    if (isStepValid()) {
      setStep(s => Math.min(s + 1, totalSteps));
    }
  };
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const completeOnboarding = () => {
    localStorage.setItem('onboardingComplete', 'true');
    localStorage.setItem('userName', formData.name);
    localStorage.setItem('userProfileData', JSON.stringify(formData));
    navigate('/dashboard');
  };

  const progress = (step / totalSteps) * 100;

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">
        {/* Progress Bar */}
        <div className="onboarding-progress">
          <div className="progress-label">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="progress-bar-bg">
            <motion.div 
              className="progress-bar-fill" 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="onboarding-card glass-card"
          >
            {step === 1 && <Step1 data={formData} set={setFormData} />}
            {step === 2 && <Step2 data={formData} set={setFormData} />}
            {step === 3 && <Step3 data={formData} set={setFormData} />}
            {step === 4 && <Step4 data={formData} set={setFormData} />}
            {step === 5 && <Step5 data={formData} set={setFormData} />}
            {step === 6 && <Step6 data={formData} set={setFormData} />}
            {step === 7 && <Step7 data={formData} />}

            <div className="onboarding-nav">
              {step > 1 && (
                <button className="btn-secondary-outline" onClick={handlePrev}>
                  <ChevronLeft size={20} /> Back
                </button>
              )}
              {step < totalSteps ? (
                <button 
                  className={`btn-primary ${!isStepValid() ? 'disabled' : ''}`} 
                  style={{ marginLeft: 'auto', opacity: isStepValid() ? 1 : 0.5, cursor: isStepValid() ? 'pointer' : 'not-allowed' }} 
                  onClick={handleNext}
                  disabled={!isStepValid()}
                >
                  Continue <ChevronRight size={20} />
                </button>
              ) : (
                <button className="btn-primary" style={{ marginLeft: 'auto' }} onClick={completeOnboarding}>
                  Launch My Dashboard <CheckCircle size={20} />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- Step Components ---

const Step1 = ({ data, set }) => (
  <div className="step-content">
    <div className="step-header">
      <div className="step-icon-bg"><User size={24} /></div>
      <div>
        <h2>Basic Information</h2>
        <p>Let's start with the basics to personalize your experience.</p>
      </div>
    </div>
    <div className="form-grid">
      <div className="form-group">
        <label>Full Name <span style={{color: 'red'}}>*</span></label>
        <div className="input-wrapper">
          <User size={18} className="input-icon" />
          <input type="text" value={data.name} onChange={e => set({...data, name: e.target.value})} placeholder="John Doe" />
        </div>
      </div>
      <div className="form-group">
        <label>Email Address <span style={{color: 'red'}}>*</span></label>
        <div className="input-wrapper">
          <Mail size={18} className="input-icon" />
          <input type="email" value={data.email} onChange={e => set({...data, email: e.target.value})} placeholder="john@example.com" />
        </div>
      </div>
      <div className="form-group">
        <label>College/University <span style={{color: 'red'}}>*</span></label>
        <div className="input-wrapper">
          <GraduationCap size={18} className="input-icon" />
          <input type="text" value={data.college} onChange={e => set({...data, college: e.target.value})} placeholder="MIT" />
        </div>
      </div>
      <div className="form-group">
        <label>Degree/Branch <span style={{color: 'red'}}>*</span></label>
        <div className="input-wrapper">
          <BookOpen size={18} className="input-icon" />
          <input type="text" value={data.degree} onChange={e => set({...data, degree: e.target.value})} placeholder="Computer Science" />
        </div>
      </div>
      <div className="form-group">
        <label>Graduation Year</label>
        <div className="input-wrapper">
          <GraduationCap size={18} className="input-icon" />
          <select value={data.gradYear} onChange={e => set({...data, gradYear: e.target.value})}>
            {['2020','2021','2022','2023','2024','2025','2026','2027','2028'].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
    <div className="status-selector">
      <label>Current Status</label>
      <div className="status-grid">
        {['Student', 'Fresher', 'Working Professional', 'Freelancer'].map(s => (
          <button 
            key={s} 
            className={`status-btn ${data.status === s ? 'active' : ''}`}
            onClick={() => set({...data, status: s})}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  </div>
);

const Step2 = ({ data, set }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const categories = [
    { name: 'Programming Languages', icon: <Code />, skills: ['JavaScript', 'Python', 'Java', 'C++', 'Go', 'Rust', 'TypeScript'] },
    { name: 'Web Development', icon: <Layout />, skills: ['React', 'Vue', 'Next.js', 'Tailwind', 'Node.js', 'GraphQL'] },
    { name: 'AI/ML', icon: <Cpu />, skills: ['PyTorch', 'TensorFlow', 'NLP', 'Computer Vision', 'Scikit-Learn'] },
    { name: 'Cloud & DevOps', icon: <Layers />, skills: ['Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'CI/CD'] },
    { name: 'Cybersecurity', icon: <Shield />, skills: ['Ethical Hacking', 'Network Security', 'Pentesting'] },
    { name: 'Database', icon: <Database />, skills: ['PostgreSQL', 'MongoDB', 'Redis', 'SQL Server'] },
  ];

  const toggleSkill = (skill) => {
    const exists = data.skills.find(s => s.name === skill);
    if (exists) {
      set({...data, skills: data.skills.filter(s => s.name !== skill)});
    } else {
      set({...data, skills: [...data.skills, { name: skill, level: 'Intermediate' }]});
    }
  };

  const updateLevel = (skillName, level) => {
    set({
      ...data,
      skills: data.skills.map(s => s.name === skillName ? { ...s, level } : s)
    });
  };

  return (
    <div className="step-content">
      <div className="step-header">
        <div className="step-icon-bg"><Code size={24} /></div>
        <div>
          <h2>Skills Assessment</h2>
          <p>Select your core technical skills and proficiency levels. <span style={{color: 'red'}}>* (Select at least 1)</span></p>
        </div>
      </div>
      
      <div className="skill-search glass-card">
        <Search size={20} />
        <input 
          type="text" 
          placeholder="Search skills (e.g. Node.js, GraphQL...)" 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="skills-scroll-container">
        {categories.map(cat => (
          <div key={cat.name} className="skill-cat">
            <h4 className="cat-title">
              {cat.icon} {cat.name}
            </h4>
            <div className="skill-chips">
              {cat.skills.filter(s => s.toLowerCase().includes(searchTerm.toLowerCase())).map(s => (
                <button 
                  key={s} 
                  className={`skill-chip ${data.skills.find(sk => sk.name === s) ? 'active' : ''}`}
                  onClick={() => toggleSkill(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {data.skills.length > 0 && (
        <div className="selected-skills-levels">
          <h4>Proficiency Levels</h4>
          <div className="levels-grid">
            {data.skills.map(skill => (
              <div key={skill.name} className="skill-level-card glass-card">
                <span className="skill-name">{skill.name}</span>
                <div className="level-slider-container">
                  <input 
                    type="range" 
                    min="1" 
                    max="3" 
                    step="1"
                    value={skill.level === 'Beginner' ? 1 : skill.level === 'Intermediate' ? 2 : 3}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      const level = val === 1 ? 'Beginner' : val === 2 ? 'Intermediate' : 'Advanced';
                      updateLevel(skill.name, level);
                    }}
                  />
                  <span className={`level-badge ${skill.level.toLowerCase()}`}>{skill.level}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Step3 = ({ data, set }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '', link: '', tech: '' });

  const addProject = () => {
    if (newProject.title) {
      set({ ...data, projects: [...data.projects, newProject] });
      setNewProject({ title: '', description: '', link: '', tech: '' });
      setShowAdd(false);
    }
  };

  const removeProject = (index) => {
    const projects = data.projects.filter((_, i) => i !== index);
    set({ ...data, projects });
  };

  return (
    <div className="step-content">
      <div className="step-header">
        <div className="step-icon-bg"><Briefcase size={24} /></div>
        <div>
          <h2>Projects & Experience</h2>
          <p>Showcase what you've built and where you've worked.</p>
        </div>
      </div>

      <div className="projects-grid">
        {data.projects.map((p, i) => (
          <div key={i} className="project-card glass-card">
            <div className="project-card-header">
              <h4>{p.title}</h4>
              <button className="text-red" onClick={() => removeProject(i)}><Trash2 size={16} /></button>
            </div>
            <p>{p.description}</p>
            <div className="project-tech">{p.tech}</div>
            {p.link && <a href={p.link} target="_blank" className="project-link"><ExternalLink size={14} /> View Project</a>}
          </div>
        ))}
        
        {!showAdd ? (
          <button className="glass-card add-project-btn" onClick={() => setShowAdd(true)}>
            <Plus size={32} color="var(--primary)" />
            <span>Add Project or Internship</span>
          </button>
        ) : (
          <div className="glass-card add-project-form">
            <input 
              placeholder="Project Title" 
              value={newProject.title} 
              onChange={e => setNewProject({...newProject, title: e.target.value})} 
            />
            <textarea 
              placeholder="Description" 
              value={newProject.description} 
              onChange={e => setNewProject({...newProject, description: e.target.value})} 
            />
            <input 
              placeholder="Technologies (e.g. React, Node.js)" 
              value={newProject.tech} 
              onChange={e => setNewProject({...newProject, tech: e.target.value})} 
            />
            <input 
              placeholder="Link (GitHub/Portfolio)" 
              value={newProject.link} 
              onChange={e => setNewProject({...newProject, link: e.target.value})} 
            />
            <div className="form-actions">
              <button className="btn-secondary-outline btn-sm" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn-primary btn-sm" onClick={addProject}>Add</button>
            </div>
          </div>
        )}
      </div>

      <div className="profile-links-section">
        <h4>Professional Links</h4>
        <div className="links-row">
          <div className="input-wrapper">
            <Globe size={18} className="input-icon" />
            <input 
              placeholder="GitHub Profile" 
              value={data.githubUrl}
              onChange={e => set({...data, githubUrl: e.target.value})}
            />
          </div>
          <div className="input-wrapper">
            <Link size={18} className="input-icon" />
            <input 
              placeholder="LinkedIn Profile" 
              value={data.linkedinUrl}
              onChange={e => set({...data, linkedinUrl: e.target.value})}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Step4 = ({ data, set }) => {
  const roles = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer', 'AI Engineer', 'Data Analyst', 'Cybersecurity Analyst', 'Cloud Engineer'];
  const industries = ['AI & Tech', 'Healthcare', 'Finance', 'Gaming', 'E-commerce', 'SaaS', 'Web3'];

  const toggleInterest = (role) => {
    const interests = data.interests.includes(role) 
      ? data.interests.filter(r => r !== role)
      : [...data.interests, role];
    set({...data, interests});
  };

  const toggleIndustry = (industry) => {
    const selected = data.industries.includes(industry)
      ? data.industries.filter(i => i !== industry)
      : [...data.industries, industry];
    set({...data, industries: selected});
  };

  return (
    <div className="step-content">
      <div className="step-header">
        <div className="step-icon-bg"><Target size={24} /></div>
        <div>
          <h2>Career Interests</h2>
          <p>What kind of roles and environments are you looking for?</p>
        </div>
      </div>

      <div className="selection-section">
        <h4>Target Roles <span style={{color: 'red'}}>*</span></h4>
        <div className="roles-flex">
          {roles.map(role => (
            <button 
              key={role} 
              className={`role-chip glass-card ${data.interests.includes(role) ? 'active' : ''}`}
              onClick={() => toggleInterest(role)}
            >
              <span>{role}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="selection-section">
        <h4>Preferred Industries <span style={{color: 'red'}}>*</span></h4>
        <div className="roles-flex">
          {industries.map(ind => (
            <button 
              key={ind} 
              className={`role-chip glass-card ${data.industries.includes(ind) ? 'active' : ''}`}
              onClick={() => toggleIndustry(ind)}
            >
              <span>{ind}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="selection-section">
        <h4>Work Preference</h4>
        <div className="status-grid">
          {['Remote', 'Hybrid', 'Onsite'].map(w => (
            <button key={w} className={`status-btn ${data.workType === w ? 'active' : ''}`} onClick={() => set({...data, workType: w})}>
              {w}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const Step5 = ({ data, set }) => {
  const suggestions = ['Master Rust', 'AWS Certified Developer', 'System Design Patterns', 'LLM Fine-tuning'];
  
  return (
    <div className="step-content">
      <div className="step-header">
        <div className="step-icon-bg"><Zap size={24} /></div>
        <div>
          <h2>Learning Goals</h2>
          <p>Define what you want to achieve next in your career.</p>
        </div>
      </div>

      <div className="goals-form">
        <div className="form-group">
          <label>Skills you want to learn</label>
          <div className="input-wrapper">
            <Lightbulb size={18} className="input-icon" />
            <input 
              placeholder="e.g. Distributed Systems, GraphQL" 
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  set({...data, learningGoals: [...data.learningGoals, e.target.value]});
                  e.target.value = '';
                }
              }}
            />
          </div>
          <div className="goal-chips">
            {data.learningGoals.map(g => (
              <span key={g} className="goal-chip">{g} <Trash2 size={12} onClick={() => set({...data, learningGoals: data.learningGoals.filter(i => i !== g)})} /></span>
            ))}
          </div>
        </div>

        <div className="ai-suggestions">
          <p className="text-sm text-dim">AI Suggestions for you:</p>
          <div className="suggestion-chips">
            {suggestions.map(s => (
              <button key={s} className="suggestion-chip" onClick={() => set({...data, learningGoals: [...new Set([...data.learningGoals, s])]})}>
                <Plus size={12} /> {s}
              </button>
            ))}
          </div>
        </div>

        <div className="form-grid" style={{ marginTop: '2rem' }}>
          <div className="form-group">
            <label>Target Company</label>
            <div className="input-wrapper">
              <Globe size={18} className="input-icon" />
              <input 
                placeholder="e.g. Google, Stripe" 
                value={data.targetCompany}
                onChange={e => set({...data, targetCompany: e.target.value})}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Expected Salary</label>
            <div className="input-wrapper">
              <Zap size={18} className="input-icon" />
              <select value={data.targetSalary} onChange={e => set({...data, targetSalary: e.target.value})}>
                <option>$50k - $80k</option>
                <option>$80k - $120k</option>
                <option>$120k - $200k</option>
                <option>$200k+</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Step6 = ({ data, set }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [score, setScore] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      set({...data, resumeFile: file});
      setAnalyzing(true);
      setTimeout(() => {
        setAnalyzing(false);
        setScore(78);
      }, 2500);
    }
  };

  return (
    <div className="step-content">
      <div className="step-header">
        <div className="step-icon-bg"><FileText size={24} /></div>
        <div>
          <h2>Resume & Portfolio Analysis</h2>
          <p>Upload your documents for AI-powered feedback.</p>
        </div>
      </div>

      <div className="upload-container">
        <label className="resume-dropzone glass-card">
          <input type="file" hidden onChange={handleFileChange} accept=".pdf,.doc,.docx" />
          <FileText size={48} color="var(--primary)" />
          <h3>{data.resumeFile ? data.resumeFile.name : "Drop Resume (PDF/DOCX)"}</h3>
          <p>AI will analyze your ATS score instantly</p>
          {data.resumeFile && <div className="file-success"><CheckCircle size={16} /> File Uploaded</div>}
        </label>

        <div className="linkedin-import glass-card">
          <Globe size={32} color="#0077b5" />
          <div className="import-text">
            <h4>Import LinkedIn</h4>
            <p>Sync your professional history</p>
          </div>
          <button className="btn-secondary-outline btn-sm">Connect</button>
        </div>
      </div>

      {analyzing && (
        <div className="analysis-loading">
          <div className="spinner"></div>
          <p>AI is analyzing your resume structure, keywords, and ATS compatibility...</p>
        </div>
      )}

      {score && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="analysis-results glass-card"
        >
          <div className="results-header">
            <div className="score-circle">
              <span className="score-val">{score}</span>
              <span className="score-label">ATS Score</span>
            </div>
            <div className="results-meta">
              <h4>Analysis Results</h4>
              <p>Your resume is <span className="text-green">Strong</span> but has some gaps.</p>
            </div>
          </div>
          <div className="gap-analysis">
            <h5><Shield size={14} /> Skill Gaps Identified:</h5>
            <ul>
              <li>Missing "Kubernetes" keyword (Highly relevant for your goals)</li>
              <li>Add more metrics to your project descriptions</li>
              <li>Portfolio link is missing</li>
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const Step7 = ({ data }) => (
  <div className="step-content">
    <div className="completion-hero" style={{ textAlign: 'center' }}>
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ type: 'spring' }}
      >
        <CheckCircle size={80} color="#10b981" style={{ margin: '0 auto 2rem' }} />
      </motion.div>
      <h2>AI Profiling Complete!</h2>
      <p>We've analyzed your data and generated your personalized career roadmap.</p>
    </div>
    
    <div className="summary-grid">
      <div className="summary-card glass-card">
        <BarChart color="var(--primary)" />
        <div>
          <h4>Readiness Score</h4>
          <div className="score-text">82/100</div>
          <p className="text-xs text-dim">Top 15% of candidates</p>
        </div>
      </div>
      <div className="summary-card glass-card">
        <Target color="var(--secondary)" />
        <div>
          <h4>Top Job Match</h4>
          <div className="score-text">AI Engineer</div>
          <p className="text-xs text-dim">94% match probability</p>
        </div>
      </div>
      <div className="summary-card glass-card full-width">
        <Map color="var(--accent)" />
        <div>
          <h4>Learning Roadmap Preview</h4>
          <div className="roadmap-preview">
            <div className="roadmap-step">
              <span className="step-dot active"></span>
              <div className="step-info">
                <h5>Month 1: Advanced ML Architectures</h5>
                <p>Focus on Transformer models and NLP pipelines.</p>
              </div>
            </div>
            <div className="roadmap-step">
              <span className="step-dot"></span>
              <div className="step-info">
                <h5>Month 2: Scalable AI Deployment</h5>
                <p>Kubernetes for ML and TorchServe.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="summary-card glass-card">
        <Award color="#f59e0b" />
        <div>
          <h4>Recommended Certs</h4>
          <ul className="certs-list">
            <li>AWS Machine Learning</li>
            <li>Google Cloud Professional</li>
          </ul>
        </div>
      </div>
      <div className="summary-card glass-card">
        <TrendingUp color="#10b981" />
        <div>
          <h4>Weekly Goal</h4>
          <p>Build 1 RAG-based application and deploy it.</p>
        </div>
      </div>
    </div>
  </div>
);

export default Onboarding;
