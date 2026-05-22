import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, BrainCircuit, Globe, Cpu as Google, CheckCircle } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const Signup = () => {
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    // Basic strength indicator
    let s = 0;
    if (val.length > 6) s++;
    if (/[A-Z]/.test(val)) s++;
    if (/[0-9]/.test(val)) s++;
    if (/[^A-Za-z0-9]/.test(val)) s++;
    setStrength(s);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalName = name || 'User';
    localStorage.setItem('userName', finalName);
    localStorage.setItem('registeredEmail', email);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('isAuthenticated', 'true');
    
    addNotification({
      type: 'signup',
      title: 'Registration Successful',
      message: `Welcome to AI Career, ${finalName}! Your account has been successfully created.`
    });
    
    navigate('/onboarding');
  };

  const strengthColor = ['#ef4444', '#f59e0b', '#10b981', '#059669'][strength - 1] || '#334155';

  return (
    <div className="auth-page">
      <div className="auth-container">
        <motion.div 
          className="glass-card auth-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="auth-header">
            <BrainCircuit size={48} color="#38bdf8" />
            <h2>Create Account</h2>
            <p>Join thousands of professionals accelerating their careers</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={handlePasswordChange}
                  required 
                />
              </div>
              <div className="password-strength">
                <div className="strength-bar">
                  <div 
                    className="strength-progress" 
                    style={{ width: `${(strength / 4) * 100}%`, background: strengthColor }}
                  ></div>
                </div>
                <p style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: strengthColor }}>
                  {['Weak', 'Fair', 'Good', 'Strong'][strength - 1] || 'Enter password'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.875rem' }}>
              <input type="checkbox" style={{ marginTop: '0.25rem' }} required />
              <span>I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link></span>
            </div>

            <button type="submit" className="btn-primary w-full">Create Account</button>
          </form>

          <div className="auth-divider">
            <span>or sign up with</span>
          </div>

          <div className="social-auth">
            <button className="glass-card social-btn"><Google size={20} /> Google</button>
            <button className="glass-card social-btn"><Globe size={20} /> GitHub</button>
          </div>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
