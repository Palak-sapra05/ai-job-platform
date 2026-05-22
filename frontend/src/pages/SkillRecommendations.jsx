import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, BookOpen, Award, Target, 
  ChevronRight, PlayCircle, RefreshCw
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

const SkillRecommendations = () => {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  let userData = null;
  try {
    userData = JSON.parse(localStorage.getItem('userProfileData')) || {};
  } catch(e) {}

  const currentSkills = userData?.skills ? userData.skills.map(s => s.name || s) : ["React", "JavaScript", "CSS", "HTML"];
  const targetRole = userData?.interests && userData.interests.length > 0 ? userData.interests[0] : "Frontend Developer";

  const fetchRoadmap = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/recommendation/career-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentSkills, targetRole })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch learning roadmap');
      }

      const data = await response.json();
      setRoadmap(data);
    } catch (err) {
      console.error("Roadmap fetch error:", err);
      // Fallback local data
      setRoadmap({
        roadmap_title: `Learning Path to ${targetRole}`,
        summary: `A structured curriculum to master technical and system design skills needed to transition successfully.`,
        milestones: [
          {
            step_number: 1,
            title: "Bridge Frontend and Type Safety",
            description: "Transition from JavaScript to TypeScript. Master advanced interfaces, union types, and TypeScript configuration.",
            estimated_duration: "3 weeks",
            recommended_resources: ["TypeScript Deep Dive by Basarat", "Vite & TypeScript Integration Guide"]
          },
          {
            step_number: 2,
            title: "Dockerization and Server Deployment",
            description: "Learn how to wrap applications into microservice containers using Docker and write docker-compose environments.",
            estimated_duration: "4 weeks",
            recommended_resources: ["Docker Essentials course", "Deploying Node Apps with Docker"]
          },
          {
            step_number: 3,
            title: "AWS Cloud Infrastructure Core",
            description: "Get familiar with cloud compute nodes (EC2), relational schemas (RDS), and serverless API gateway functions.",
            estimated_duration: "5 weeks",
            recommended_resources: ["AWS Certified Solutions Architect Course", "Serverless Framework Docs"]
          }
        ],
        certificates: ["AWS Certified Solutions Architect", "HashiCorp Certified Terraform Associate"]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="main-view">
        <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>Skill Enhancement Roadmap</h1>
            <p style={{ color: 'var(--text-dim)' }}>AI-generated learning paths to bridge your skill gaps.</p>
          </div>
          <button 
            className="btn-secondary" 
            onClick={fetchRoadmap} 
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem' }}
          >
            <RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh Roadmap
          </button>
        </header>

        {loading ? (
          <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
            <div className="spin" style={{ display: 'inline-block', marginBottom: '2rem' }}>
              <RefreshCw size={48} color="var(--primary)" />
            </div>
            <h2>Analyzing skill gaps...</h2>
            <p style={{ color: 'var(--text-dim)', marginTop: '1rem' }}>Gemini AI is crafting a tailored training path just for you.</p>
          </div>
        ) : (
          <div>
            <div className="roadmap-overview">
              <div className="glass-card" style={{ marginBottom: '2rem', padding: '2rem' }}>
                <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>{roadmap.roadmap_title}</h2>
                <p style={{ color: 'var(--text-dim)', lineHeight: 1.6 }}>{roadmap.summary}</p>
              </div>

              <div className="glass-card roadmap-summary" style={{ marginBottom: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div className="summary-item" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Target size={32} color="var(--primary)" />
                  <div>
                    <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{roadmap.milestones.length} Milestones</h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-dim)' }}>Identified for {targetRole}</p>
                  </div>
                </div>
                <div className="summary-item" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Award size={32} color="var(--secondary)" />
                  <div>
                    <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{roadmap.certificates.length} Certifications</h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-dim)' }}>Recommended to add</p>
                  </div>
                </div>
              </div>
            </div>

            <h3 style={{ marginBottom: '1.5rem' }}>Core Milestones</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {roadmap.milestones.map((step, index) => (
                <motion.div 
                  key={index} 
                  className="glass-card" 
                  style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}
                  whileHover={{ x: 5 }}
                >
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    background: 'rgba(254, 129, 212, 0.1)', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: 'var(--primary)',
                    fontWeight: 'bold',
                    flexShrink: 0
                  }}>
                    {step.step_number || index + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)' }}>{step.title}</h4>
                      <span className="badge" style={{ background: 'var(--glass)' }}>{step.estimated_duration}</span>
                    </div>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1rem' }}>{step.description}</p>
                    {step.recommended_resources && step.recommended_resources.length > 0 && (
                      <div>
                        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.5rem' }}>Suggested Resources</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {step.recommended_resources.map((res, i) => (
                            <span key={i} className="skill-tag" style={{ fontSize: '0.75rem' }}>{res}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {roadmap.certificates && roadmap.certificates.length > 0 && (
              <div style={{ marginTop: '2.5rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Recommended Professional Certifications</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  {roadmap.certificates.map((cert, index) => (
                    <motion.div 
                      key={index} 
                      className="glass-card" 
                      style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
                      whileHover={{ y: -5 }}
                    >
                      <div style={{ padding: '0.5rem', background: 'rgba(250, 172, 191, 0.1)', borderRadius: '8px', flexShrink: 0 }}>
                        <Award size={24} color="var(--secondary)" />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{cert}</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>Highly valued by employers hiring for {targetRole}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default SkillRecommendations;
