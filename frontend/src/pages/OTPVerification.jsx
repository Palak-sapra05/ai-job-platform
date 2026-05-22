import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, ShieldCheck } from 'lucide-react';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const navigate = useNavigate();

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <motion.div className="glass-card auth-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="auth-header">
            <ShieldCheck size={48} color="#38bdf8" />
            <h2>Verify OTP</h2>
            <p>We've sent a 6-digit code to your email.</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            {otp.map((data, index) => (
              <input
                className="glass-card"
                key={index}
                type="text"
                maxLength="1"
                value={data}
                onChange={e => handleChange(e.target, index)}
                onFocus={e => e.target.select()}
                style={{ width: '45px', height: '55px', textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', border: '1px solid var(--glass-border)', background: 'var(--glass)' }}
              />
            ))}
          </div>

          <button className="btn-primary w-full" onClick={() => navigate('/dashboard')}>Verify & Continue</button>

          <p className="auth-footer">
            Didn't receive code? <a href="#" style={{ color: 'var(--primary)' }}>Resend</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default OTPVerification;
