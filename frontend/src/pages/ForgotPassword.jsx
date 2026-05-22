import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, BrainCircuit, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <motion.div className="glass-card auth-card" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="auth-header">
            <BrainCircuit size={48} color="#38bdf8" />
            <h2>Reset Password</h2>
            <p>Enter your email and we'll send you an OTP to reset your password.</p>
          </div>

          <form className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input type="email" placeholder="name@company.com" required />
              </div>
            </div>
            <Link to="/verify-otp" className="btn-primary w-full" style={{ textAlign: 'center', textDecoration: 'none' }}>Send OTP</Link>
          </form>

          <p className="auth-footer">
            <Link to="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <ArrowLeft size={16} /> Back to Login
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
