import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Briefcase, TrendingUp, Star, 
  Settings, LogOut, BrainCircuit, BarChart3, FileText
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <Link to="/" className="sidebar-logo">
        <BrainCircuit size={32} color="#38bdf8" />
        <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>AI Career</span>
      </Link>
      <nav className="sidebar-nav">
        <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link to="/jobs" className={`nav-link ${isActive('/jobs') ? 'active' : ''}`}>
          <Briefcase size={20} /> Recommended Jobs
        </Link>
        <Link to="/skills" className={`nav-link ${isActive('/skills') ? 'active' : ''}`}>
          <TrendingUp size={20} /> Skill Paths
        </Link>
        <Link to="/resume" className={`nav-link ${isActive('/resume') ? 'active' : ''}`}>
          <Star size={20} /> Resume Analysis
        </Link>
        <Link to="/resume-builder" className={`nav-link ${isActive('/resume-builder') ? 'active' : ''}`}>
          <FileText size={20} /> Resume Builder
        </Link>
        <Link to="/analytics" className={`nav-link ${isActive('/analytics') ? 'active' : ''}`}>
          <BarChart3 size={20} /> Analytics
        </Link>
      </nav>
      <div className="sidebar-footer">
        <Link to="/settings" className={`nav-link ${isActive('/settings') ? 'active' : ''}`}>
          <Settings size={20} /> Settings
        </Link>
        <a href="#" onClick={handleLogout} className="nav-link">
          <LogOut size={20} /> Logout
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
