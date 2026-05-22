import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, CheckCircle, Briefcase, User, FileText, Send } from 'lucide-react';

const steps = ['Personal Info', 'Experience', 'Resume & Cover Letter', 'Submit'];

const ApplyModal = ({ job, onClose }) => {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState('');

  const savedName = localStorage.getItem('userName') || '';
  const [form, setForm] = useState({
    fullName: savedName,
    email: '',
    phone: '',
    linkedin: '',
    yearsExp: '',
    currentRole: '',
    coverLetter: '',
    portfolioUrl: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    if (e.target.files[0]) setFileName(e.target.files[0].name);
  };

  const handleNext = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save application to localStorage for the activity feed
    const apps = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
    apps.unshift({ job, appliedAt: new Date().toISOString(), ...form });
    localStorage.setItem('appliedJobs', JSON.stringify(apps));
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(6px)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem',
        }}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          style={{
            background: 'var(--card-bg, #0f172a)',
            border: '1px solid var(--glass-border, rgba(255,255,255,0.08))',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '580px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            position: 'relative',
          }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '1.25rem', right: '1.25rem',
              background: 'rgba(255,255,255,0.07)', border: 'none',
              borderRadius: '50%', width: '36px', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-main)',
            }}
          >
            <X size={18} />
          </button>

          {submitted ? (
            /* ── Success State ── */
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: 'center', padding: '2rem 1rem' }}
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: 2, duration: 0.4 }}
                style={{ display: 'inline-flex', marginBottom: '1.5rem' }}
              >
                <CheckCircle size={72} color="var(--primary, #38bdf8)" />
              </motion.div>
              <h2 style={{ marginBottom: '0.5rem' }}>Application Submitted! 🎉</h2>
              <p style={{ color: 'var(--text-dim, #94a3b8)', marginBottom: '0.5rem' }}>
                You've successfully applied to <strong>{job?.title}</strong> at <strong>{job?.company}</strong>.
              </p>
              <p style={{ color: 'var(--text-dim, #94a3b8)', fontSize: '0.875rem', marginBottom: '2rem' }}>
                The hiring team will reach out within 3–5 business days.
              </p>
              <button className="btn-primary" style={{ width: '100%' }} onClick={onClose}>
                Back to Jobs
              </button>
            </motion.div>
          ) : (
            <>
              {/* ── Header ── */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.75rem' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '12px',
                  background: (() => {
                    const colors = ['#1e3a5f','#2a1f5f','#1f3d2a','#3d1f2a','#1f2f3d','#3d2a1f'];
                    return colors[(job?.company?.charCodeAt(0) || 0) % colors.length];
                  })(),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, fontSize: '1rem', fontWeight: 700,
                  color: 'var(--primary, #38bdf8)', letterSpacing: '0.05em', userSelect: 'none',
                }}>
                  {(job?.company || 'C').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{job?.title}</h2>
                  <p style={{ margin: 0, color: 'var(--primary, #38bdf8)', fontWeight: 600 }}>{job?.company}</p>
                </div>
              </div>

              {/* ── Progress Steps ── */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                {steps.map((s, i) => (
                  <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'center' }}>
                    <div style={{
                      height: '4px', width: '100%', borderRadius: '99px',
                      background: i <= step ? 'var(--primary, #38bdf8)' : 'rgba(255,255,255,0.1)',
                      transition: 'background 0.3s',
                    }} />
                    <span style={{ fontSize: '0.7rem', color: i === step ? 'var(--primary, #38bdf8)' : 'var(--text-dim, #94a3b8)' }}>
                      {s}
                    </span>
                  </div>
                ))}
              </div>

              {/* ── Form Steps ── */}
              <form onSubmit={step === steps.length - 1 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                  >
                    {step === 0 && (
                      <>
                        <StepHeader icon={<User size={18} />} title="Personal Information" />
                        <Field label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Jane Doe" required />
                        <Field label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} placeholder="jane@example.com" required />
                        <Field label="Phone Number" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" />
                        <Field label="LinkedIn Profile URL" name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="linkedin.com/in/janedoe" />
                      </>
                    )}

                    {step === 1 && (
                      <>
                        <StepHeader icon={<Briefcase size={18} />} title="Experience & Background" />
                        <Field label="Current / Most Recent Role" name="currentRole" value={form.currentRole} onChange={handleChange} placeholder="e.g. Software Engineer at Google" required />
                        <div>
                          <label style={labelStyle}>Years of Experience</label>
                          <select
                            name="yearsExp"
                            value={form.yearsExp}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                          >
                            <option value="">Select...</option>
                            {['Fresher / Student', '0–1 years', '1–3 years', '3–5 years', '5–10 years', '10+ years'].map(o => (
                              <option key={o} value={o}>{o}</option>
                            ))}
                          </select>
                        </div>
                        <Field label="Portfolio / GitHub URL (optional)" name="portfolioUrl" value={form.portfolioUrl} onChange={handleChange} placeholder="github.com/janedoe" />
                      </>
                    )}

                    {step === 2 && (
                      <>
                        <StepHeader icon={<FileText size={18} />} title="Resume & Cover Letter" />
                        {/* Resume Upload */}
                        <div>
                          <label style={labelStyle}>Upload Resume</label>
                          <label style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            padding: '1.5rem', border: '2px dashed rgba(56,189,248,0.3)',
                            borderRadius: '12px', cursor: 'pointer',
                            background: fileName ? 'rgba(56,189,248,0.05)' : 'transparent',
                            transition: 'all 0.2s',
                          }}>
                            <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} style={{ display: 'none' }} />
                            <Upload size={28} color="var(--primary, #38bdf8)" style={{ marginBottom: '0.5rem' }} />
                            {fileName
                              ? <span style={{ color: 'var(--primary, #38bdf8)', fontSize: '0.875rem' }}>{fileName}</span>
                              : <>
                                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Click to upload</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim, #94a3b8)' }}>PDF, DOC or DOCX (Max 5 MB)</span>
                              </>
                            }
                          </label>
                        </div>

                        {/* Cover Letter */}
                        <div>
                          <label style={labelStyle}>Cover Letter (optional)</label>
                          <textarea
                            name="coverLetter"
                            value={form.coverLetter}
                            onChange={handleChange}
                            placeholder={`I am excited to apply for the ${job?.title} position at ${job?.company}...`}
                            rows={5}
                            style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
                          />
                        </div>
                      </>
                    )}

                    {step === 3 && (
                      <>
                        <StepHeader icon={<Send size={18} />} title="Review & Submit" />
                        <div style={{
                          background: 'rgba(255,255,255,0.03)', borderRadius: '12px',
                          padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem',
                        }}>
                          {[
                            ['Name', form.fullName],
                            ['Email', form.email],
                            ['Phone', form.phone || '—'],
                            ['Current Role', form.currentRole],
                            ['Experience', form.yearsExp],
                            ['Resume', fileName || 'Not uploaded'],
                          ].map(([label, value]) => (
                            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                              <span style={{ color: 'var(--text-dim, #94a3b8)' }}>{label}</span>
                              <span style={{ fontWeight: 600, maxWidth: '60%', textAlign: 'right' }}>{value}</span>
                            </div>
                          ))}
                        </div>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-dim, #94a3b8)', textAlign: 'center', marginTop: '0.5rem' }}>
                          By submitting, you agree to share your information with <strong>{job?.company}</strong>.
                        </p>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* ── Navigation ── */}
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem' }}>
                  {step > 0 && (
                    <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={handleBack}>
                      Back
                    </button>
                  )}
                  <button type="submit" className="btn-primary" style={{ flex: 2 }}>
                    {step === steps.length - 1 ? '🚀 Submit Application' : 'Continue →'}
                  </button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─── Helper sub-components ─── */
const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-dim, #94a3b8)', textTransform: 'uppercase', letterSpacing: '0.05em' };
const inputStyle = {
  width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px', padding: '0.65rem 0.9rem', color: 'var(--text-main)', fontSize: '0.9rem', outline: 'none',
  boxSizing: 'border-box',
};

const Field = ({ label, name, type = 'text', value, onChange, placeholder, required }) => (
  <div>
    <label style={labelStyle}>{label}{required && <span style={{ color: '#f87171' }}> *</span>}</label>
    <input
      type={type} name={name} value={value} onChange={onChange}
      placeholder={placeholder} required={required}
      style={inputStyle}
    />
  </div>
);

const StepHeader = ({ icon, title }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
    <span style={{ color: 'var(--primary, #38bdf8)' }}>{icon}</span>
    <h3 style={{ margin: 0, fontSize: '1rem' }}>{title}</h3>
  </div>
);

export default ApplyModal;
