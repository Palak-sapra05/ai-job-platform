import React, { useState, useRef } from 'react';
import { Download, FileText, Wand2, User, RefreshCw, Layout, GripVertical } from 'lucide-react';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';
import './ResumeBuilder.css';

const ResumeBuilder = () => {
  const [activeTemplate, setActiveTemplate] = useState('modern');
  const [isGenerating, setIsGenerating] = useState(false);
  const [data, setData] = useState({
    personal: { name: '', title: '', email: '', phone: '', location: '' },
    summary: '',
    experience: [
      { id: 'exp-1', title: '', company: '', date: '', desc: '' }
    ],
    education: [
      { id: 'edu-1', degree: '', school: '', date: '' }
    ]
  });

  const resumeRef = useRef(null);

  const handleAutoFill = () => {
    setData({
      personal: { name: 'John Doe', title: 'Senior Software Engineer', email: 'john@example.com', phone: '(555) 123-4567', location: 'San Francisco, CA' },
      summary: 'Experienced Software Engineer with a demonstrated history of working in the tech industry. Skilled in React, Node.js, and Cloud Infrastructure.',
      experience: [
        { id: 'exp-1', title: 'Senior Frontend Developer', company: 'Tech Corp', date: '2020 - Present', desc: 'Led the frontend team in developing scalable React applications.' },
        { id: 'exp-2', title: 'Web Developer', company: 'Startup Inc', date: '2018 - 2020', desc: 'Developed and maintained various client websites.' }
      ],
      education: [
        { id: 'edu-1', degree: 'B.S. Computer Science', school: 'University of Technology', date: '2014 - 2018' }
      ]
    });
    toast.success("Resume auto-filled from profile!");
  };

  const handleGenerateSummary = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setData(prev => ({
        ...prev,
        summary: "Dynamic and results-oriented Software Engineer with 5+ years of experience building responsive, user-centric web applications. Proven ability to optimize performance, mentor junior developers, and seamlessly integrate AI-driven features into enterprise platforms."
      }));
      setIsGenerating(false);
      toast.success("AI Summary generated!");
    }, 1500);
  };

  const exportPDF = () => {
    window.print();
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('expIndex', index);
  };

  const handleDrop = (e, targetIndex) => {
    const sourceIndex = e.dataTransfer.getData('expIndex');
    if (!sourceIndex) return;
    
    const newExp = [...data.experience];
    const [draggedItem] = newExp.splice(sourceIndex, 1);
    newExp.splice(targetIndex, 0, draggedItem);
    
    setData(prev => ({ ...prev, experience: newExp }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const addExperience = () => {
    setData(prev => ({
      ...prev,
      experience: [...prev.experience, { id: `exp-${Date.now()}`, title: '', company: '', date: '', desc: '' }]
    }));
  };

  const updatePersonal = (field, value) => {
    setData(prev => ({ ...prev, personal: { ...prev.personal, [field]: value } }));
  };

  const updateExperience = (index, field, value) => {
    const newExp = [...data.experience];
    newExp[index][field] = value;
    setData(prev => ({ ...prev, experience: newExp }));
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-view resume-builder-layout" style={{ padding: '1.5rem' }}>
        {/* Sidebar Controls */}
        <div className="builder-controls glass-card">
        <div className="builder-header">
          <h2>Resume Builder</h2>
          <div className="builder-actions">
            <button className="icon-action-btn" onClick={handleAutoFill} title="Auto-fill from Profile">
              <User size={18} />
            </button>
            <button className="icon-action-btn" onClick={exportPDF} title="Export PDF">
              <Download size={18} />
            </button>
          </div>
        </div>

        <div className="template-selector">
          <label><Layout size={16}/> Template</label>
          <select value={activeTemplate} onChange={(e) => setActiveTemplate(e.target.value)} className="w-full input-style">
            <option value="modern">Modern (ATS Friendly)</option>
            <option value="minimal">Minimalist</option>
            <option value="creative">Creative</option>
          </select>
        </div>

        <div className="form-section">
          <h3>Personal Details</h3>
          <input type="text" placeholder="Full Name" value={data.personal.name} onChange={e => updatePersonal('name', e.target.value)} className="input-style mb-2 w-full" />
          <input type="text" placeholder="Job Title" value={data.personal.title} onChange={e => updatePersonal('title', e.target.value)} className="input-style mb-2 w-full" />
          <div className="input-group">
            <input type="email" placeholder="Email" value={data.personal.email} onChange={e => updatePersonal('email', e.target.value)} className="input-style mb-2 w-full" />
            <input type="text" placeholder="Phone" value={data.personal.phone} onChange={e => updatePersonal('phone', e.target.value)} className="input-style mb-2 w-full" />
          </div>
        </div>

        <div className="form-section">
          <div className="flex-between">
            <h3>Professional Summary</h3>
            <button className="ai-btn" onClick={handleGenerateSummary} disabled={isGenerating}>
              {isGenerating ? <RefreshCw size={14} className="spin" /> : <Wand2 size={14} />} AI Generate
            </button>
          </div>
          <textarea rows="4" placeholder="Brief summary of your experience..." value={data.summary} onChange={e => setData(prev => ({...prev, summary: e.target.value}))} className="input-style w-full"></textarea>
        </div>

        <div className="form-section">
          <div className="flex-between">
            <h3>Experience</h3>
            <button className="text-btn" onClick={addExperience}>+ Add</button>
          </div>
          
          <div className="draggable-list">
            {data.experience.map((exp, i) => (
              <div 
                key={exp.id} 
                className="draggable-item"
                draggable
                onDragStart={(e) => handleDragStart(e, i)}
                onDrop={(e) => handleDrop(e, i)}
                onDragOver={handleDragOver}
              >
                <div className="drag-handle"><GripVertical size={16} /></div>
                <div className="drag-content">
                  <input type="text" placeholder="Job Title" value={exp.title} onChange={e => updateExperience(i, 'title', e.target.value)} className="input-style mb-2 w-full" />
                  <div className="input-group">
                    <input type="text" placeholder="Company" value={exp.company} onChange={e => updateExperience(i, 'company', e.target.value)} className="input-style mb-2 w-full" />
                    <input type="text" placeholder="Date (e.g. 2020 - 2023)" value={exp.date} onChange={e => updateExperience(i, 'date', e.target.value)} className="input-style mb-2 w-full" />
                  </div>
                  <textarea rows="2" placeholder="Description" value={exp.desc} onChange={e => updateExperience(i, 'desc', e.target.value)} className="input-style w-full"></textarea>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="builder-preview">
        <div className="preview-toolbar">
          <span>Live Preview</span>
          <button className="btn-primary flex items-center gap" onClick={exportPDF}>
            <Download size={16} /> Export PDF
          </button>
        </div>
        
        <div className="resume-paper-container">
          <div className={`resume-paper template-${activeTemplate}`} ref={resumeRef}>
            <div className="resume-header">
              <h1>{data.personal.name || 'Your Name'}</h1>
              <h2>{data.personal.title || 'Job Title'}</h2>
              <div className="resume-contact">
                {data.personal.email && <span>{data.personal.email}</span>}
                {data.personal.phone && <span>{data.personal.phone}</span>}
                {data.personal.location && <span>{data.personal.location}</span>}
              </div>
            </div>

            <div className="resume-body">
              {data.summary && (
                <div className="resume-section">
                  <h3>Summary</h3>
                  <p>{data.summary}</p>
                </div>
              )}

              {data.experience.some(e => e.title || e.company) && (
                <div className="resume-section">
                  <h3>Experience</h3>
                  {data.experience.map((exp, i) => (
                    exp.title || exp.company ? (
                      <div key={i} className="resume-item">
                        <div className="resume-item-header">
                          <h4>{exp.title} {exp.company && <span className="company">at {exp.company}</span>}</h4>
                          <span className="date">{exp.date}</span>
                        </div>
                        <p>{exp.desc}</p>
                      </div>
                    ) : null
                  ))}
                </div>
              )}

              {data.education.some(e => e.degree || e.school) && (
                <div className="resume-section">
                  <h3>Education</h3>
                  {data.education.map((edu, i) => (
                    edu.degree || edu.school ? (
                      <div key={i} className="resume-item">
                        <div className="resume-item-header">
                          <h4>{edu.degree}</h4>
                          <span className="date">{edu.date}</span>
                        </div>
                        <p>{edu.school}</p>
                      </div>
                    ) : null
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </main>
    </div>
  );
};

export default ResumeBuilder;
