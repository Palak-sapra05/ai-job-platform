import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, BrainCircuit, Globe, Cpu as Google } from 'lucide-react';

import { toast } from 'react-toastify';
import { useNotifications } from '../context/NotificationContext';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const handleSubmit = (e) => {
    e.preventDefault();
    const registeredEmail = localStorage.getItem('registeredEmail');
    
    // Only allow login if the email matches what they signed up with
    // (In a real app, this would be a backend check)
    if (!registeredEmail || registeredEmail !== email) {
      toast.error('Account not found. Please create an account first.', {
        position: "top-center"
      });
      return;
    }

    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', email);
    
    let nameToSet = localStorage.getItem('userName');
    try {
      const userData = JSON.parse(localStorage.getItem('userProfileData'));
      if (userData && userData.name) {
        nameToSet = userData.name;
      }
    } catch(e) {}

    if (!nameToSet || nameToSet === 'Demo User') {
      nameToSet = email.split('@')[0];
      nameToSet = nameToSet.charAt(0).toUpperCase() + nameToSet.slice(1);
    }
    
    localStorage.setItem('userName', nameToSet);
    
    addNotification({
      type: 'login',
      title: 'Login Successful',
      message: `Welcome back, ${nameToSet}! You have successfully logged into your account.`
    });
    
    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <motion.div 
          className="glass-card auth-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="auth-header">
            <BrainCircuit size={48} color="#38bdf8" />
            <h2>Welcome Back</h2>
            <p>Login to access your personalized career dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
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
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label>Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.875rem', color: 'var(--primary)' }}>Forgot?</Link>
              </div>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <button 
                  type="button" 
                  className="show-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full">Sign In</button>
          </form>

          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          <div className="social-auth">
            <button className="glass-card social-btn"><Google size={20} /> Google</button>
            <button className="glass-card social-btn"><Globe size={20} /> GitHub</button>
          </div>

          <p className="auth-footer">
            Don't have an account? <Link to="/signup">Create one for free</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
