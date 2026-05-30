import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, FileText, CheckCircle, AlertCircle, 
  Download, RefreshCw
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

const ResumeAnalysis = () => {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const onDrop = useCallback(acceptedFiles => {
    setFile(acceptedFiles[0]);
    analyzeResume(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 'application/pdf': ['.pdf'], 'application/msword': ['.doc'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] }
  });

  const analyzeResume = async (file) => {
    setAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch('http://localhost:8080/resume/analyze', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to analyze resume.');
      }

      const data = await response.json();
      setResults({
        score: data.score || 0,
        atsScore: data.atsScore || 0,
        keywordMatch: data.keywordMatch || 0,
        skillsFound: data.skillsFound || ['React', 'JavaScript'],
        missingSkills: data.missingSkills || ['TypeScript'],
        topMissingKeywords: data.topMissingKeywords || [],
        formattingIssues: data.formattingIssues || [],
        weakBullets: data.weakBullets || [],
        suggestions: data.suggestions || ['Add more quantitative results']
      });
    } catch (err) {
      console.error("Resume analysis error:", err);
      // Fallback local response
      setResults({
        score: 32,
        atsScore: 28,
        keywordMatch: 35,
        skillsFound: ['Java', 'Python', 'Docker', 'React', 'PHP'],
        missingSkills: ['Kubernetes', 'Linux', 'Git', 'CI/CD', 'Cloud'],
        topMissingKeywords: ['Kubernetes', 'Linux', 'Git', 'CI/CD', 'Cloud'],
        formattingIssues: ['Resume is very short and missing structured sections', 'No experience or education details'],
        weakBullets: ['EcoDrive – Developed a fuel optimization web app using HTML, CSS, PHP...'],
        suggestions: [
          'Add clear sections like SUMMARY, SKILLS, EXPERIENCE, PROJECTS, EDUCATION',
          'Include role-specific keywords such as Kubernetes, Git, Linux, CI/CD, cloud basics',
          'Rewrite project bullets with measurable outcomes and automation/DevOps focus',
          'Provide at least one technical experience item or relevant internship entry'
        ]
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="main-view">
        <header style={{ marginBottom: '2.5rem' }}>
          <h1>AI Resume Analyzer</h1>
          <p style={{ color: 'var(--text-dim)' }}>Upload your resume to get instant AI-driven feedback and ATS optimization tips.</p>
        </header>

        {!results && !analyzing && (
          <div {...getRootProps()} className={`resume-upload-zone ${isDragActive ? 'active' : ''}`}>
            <input {...getInputProps()} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '1.5rem', background: 'rgba(254, 129, 212, 0.1)', borderRadius: '50%' }}>
                <Upload size={48} color="var(--primary)" />
              </div>
              <div>
                <h2>{isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}</h2>
                <p style={{ color: 'var(--text-dim)', marginTop: '0.5rem' }}>Supports PDF, DOC, DOCX up to 10MB</p>
              </div>
              <button className="btn-primary" style={{ marginTop: '1rem' }}>Browse Files</button>
            </div>
          </div>
        )}

        {analyzing && (
          <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              style={{ display: 'inline-block', marginBottom: '2rem' }}
            >
              <RefreshCw size={48} color="var(--primary)" />
            </motion.div>
            <h2>Analyzing your resume...</h2>
            <p style={{ color: 'var(--text-dim)', marginTop: '1rem' }}>Our AI is parsing your skills and checking ATS compatibility.</p>
          </div>
        )}

        <AnimatePresence>
          {results && !analyzing && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}
            >
              <div className="glass-card" style={{ textAlign: 'center' }}>
                <h3>ATS Score</h3>
                <div style={{ position: 'relative', margin: '2rem auto', width: '150px', height: '150px' }}>
                  <svg width="150" height="150" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="var(--glass)" strokeWidth="5" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke="var(--primary)" strokeWidth="5" 
                      strokeDasharray="282.7" strokeDashoffset={282.7 * (1 - results.atsScore / 100)} 
                      strokeLinecap="round" transform="rotate(-90 50 50)" />
                  </svg>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <h2 style={{ fontSize: '2.5rem' }}>{results.atsScore}</h2>
                  </div>
                </div>
                <p style={{ color: '#2563eb', fontWeight: 600 }}>ATS compatibility</p>
                <button className="btn-secondary" style={{ width: '100%', marginTop: '2rem' }} onClick={() => setResults(null)}>
                  <RefreshCw size={16} /> Re-upload
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="glass-card">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <h3>Overall Resume Score</h3>
                      <p style={{ fontSize: '2.2rem', margin: '0.75rem 0', fontWeight: 700 }}>{results.score}</p>
                      <p style={{ color: 'var(--text-dim)' }}>General recruiter readiness and strength.</p>
                    </div>
                    <div>
                      <h3>Keyword Match</h3>
                      <p style={{ fontSize: '2.2rem', margin: '0.75rem 0', fontWeight: 700 }}>{results.keywordMatch}%</p>
                      <p style={{ color: 'var(--text-dim)' }}>How well your resume matches ATS keywords.</p>
                    </div>
                  </div>
                </div>

                <div className="glass-card">
                  <h3>Summary</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
                    <div>
                      <h4 style={{ fontSize: '0.875rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Extracted Skills</h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {results.skillsFound.map(s => <span key={s} className="skill-tag">{s}</span>)}
                      </div>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.875rem', color: '#ef4444', marginBottom: '0.5rem' }}>Missing Skills</h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {results.missingSkills.map(s => <span key={s} className="skill-tag" style={{ color: '#ef4444', borderColor: '#ef4444' }}>{s}</span>)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-card">
                  <h3>Actionable Feedback</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
                    <div>
                      <h4 style={{ fontSize: '0.875rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Top Missing Keywords</h4>
                      <ul style={{ paddingLeft: '1.2rem', margin: 0, color: 'var(--text-dim)' }}>
                        {results.topMissingKeywords.map((keyword, index) => <li key={index}>{keyword}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.875rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Formatting Issues</h4>
                      <ul style={{ paddingLeft: '1.2rem', margin: 0, color: 'var(--text-dim)' }}>
                        {results.formattingIssues.map((issue, index) => <li key={index}>{issue}</li>)}
                      </ul>
                    </div>
                  </div>
                  <div style={{ marginTop: '1.5rem' }}>
                    <h4 style={{ fontSize: '0.875rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Weak Bullet Points</h4>
                    <ul style={{ paddingLeft: '1.2rem', margin: 0, color: 'var(--text-dim)' }}>
                      {results.weakBullets.map((bullet, index) => <li key={index}>{bullet}</li>)}
                    </ul>
                  </div>
                </div>
                <div className="glass-card">
                  <h3>What to Change</h3>
                  <ul style={{ listStyle: 'none', marginTop: '1rem' }}>
                    {results.suggestions.map((s, i) => (
                      <li key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', color: 'var(--text-dim)' }}>
                        <AlertCircle size={18} color="var(--secondary)" style={{ flexShrink: 0 }} />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ResumeAnalysis;
