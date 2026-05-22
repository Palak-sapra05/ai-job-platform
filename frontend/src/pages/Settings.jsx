import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Bell, Save, RefreshCw, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';

const Settings = () => {
  const navigate = useNavigate();
  const [name, setName] = useState(localStorage.getItem('userName') || '');
  const [email, setEmail] = useState(localStorage.getItem('userEmail') || 'user@example.com');
  const [saved, setSaved] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('All fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }

    setUpdatingPassword(true);
    try {
      const response = await fetch('http://localhost:8080/auth/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          oldPassword: oldPassword,
          newPassword: newPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Password updated successfully!');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowPasswordForm(false);
      } else {
        toast.error(data.error || data.message || 'Failed to update password.');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Error connecting to authentication service.');
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-view">
        <header style={{ marginBottom: '2.5rem' }}>
          <h1>Account Settings</h1>
          <p style={{ color: 'var(--text-dim)' }}>Manage your profile information and preferences.</p>
        </header>

        <div style={{ maxWidth: '800px' }}>
          <form onSubmit={handleSave} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', paddingBottom: '2rem', borderBottom: '1px solid var(--glass-border)' }}>
              <div style={{ width: '80px', height: '80px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>
                {name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2>{name}</h2>
                <p style={{ color: 'var(--text-dim)' }}>{email}</p>
              </div>
            </div>

            <div className="settings-section">
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Personal Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label>Full Name</label>
                  <div className="input-wrapper">
                    <User size={18} className="input-icon" />
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-wrapper">
                    <Mail size={18} className="input-icon" />
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="settings-section">
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Security & Privacy</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--glass)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Shield size={20} color="var(--primary)" />
                    <div>
                      <p style={{ fontWeight: 600 }}>Two-Factor Authentication</p>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-dim)' }}>Add an extra layer of security to your account.</p>
                    </div>
                  </div>
                  <button className="btn-secondary" type="button">Enable</button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--glass)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Bell size={20} color="var(--secondary)" />
                    <div>
                      <p style={{ fontWeight: 600 }}>Email Notifications</p>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-dim)' }}>Receive updates about new job recommendations.</p>
                    </div>
                  </div>
                  <input type="checkbox" defaultChecked />
                </div>
                
                {/* Change Password Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', padding: '1rem', background: 'var(--glass)', borderRadius: '12px', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <Lock size={20} color="var(--primary)" />
                      <div>
                        <p style={{ fontWeight: 600 }}>Change Password</p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-dim)' }}>Update your account password regularly.</p>
                      </div>
                    </div>
                    <button 
                      className="btn-secondary" 
                      type="button"
                      onClick={() => setShowPasswordForm(!showPasswordForm)}
                    >
                      {showPasswordForm ? 'Cancel' : 'Change'}
                    </button>
                  </div>

                  {showPasswordForm && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', overflow: 'hidden' }}
                    >
                      <div className="form-group">
                        <label>Current Password</label>
                        <input 
                          type="password" 
                          placeholder="••••••••" 
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--glass-border)', color: 'var(--text-main)' }}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                          <label>New Password</label>
                          <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--glass-border)', color: 'var(--text-main)' }}
                          />
                        </div>
                        <div className="form-group">
                          <label>Confirm New Password</label>
                          <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--glass-border)', color: 'var(--text-main)' }}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                        <button 
                          className="btn-primary" 
                          type="button"
                          disabled={updatingPassword}
                          onClick={handleUpdatePassword}
                        >
                          {updatingPassword ? 'Updating...' : 'Update Password'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            <div className="settings-section">
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Career Profile</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--glass)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <RefreshCw size={20} color="var(--accent)" />
                  <div>
                    <p style={{ fontWeight: 600 }}>Update Onboarding Details</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-dim)' }}>Change your skills, experience, and target roles to get better recommendations.</p>
                  </div>
                </div>
                <button 
                  className="btn-primary" 
                  type="button" 
                  onClick={() => navigate('/onboarding')}
                >
                  Edit Profile
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem' }}>
              <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Save size={18} /> {saved ? 'Saved!' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Settings;
