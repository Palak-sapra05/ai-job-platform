import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { BrainCircuit, Menu, X, Sun, Moon, Bell, CheckCircle, Search } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`nav-bar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <RouterLink to="/" className="nav-logo">
          <BrainCircuit size={32} color="#38bdf8" />
          <span>AI Career</span>
        </RouterLink>

        <div className="nav-links desktop">
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/jobs">Find Jobs</RouterLink>
          <RouterLink to="/skills">Skills</RouterLink>
          <RouterLink to="/about">About</RouterLink>
        </div>

        <div className="nav-actions">
          <div className="nav-search">
            <Search size={18} color="var(--text-dim)" />
            <input type="text" placeholder="Search..." aria-label="Site search" />
          </div>
          {/* Notifications Dropdown */}
          <div className="notification-container">
            <button 
              className="icon-action-btn" 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
            </button>
            
            {isNotifOpen && (
              <div className="notification-dropdown">
                <div className="notif-header">
                  <h4>Notifications</h4>
                  {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="mark-read-btn">
                      <CheckCircle size={14} /> Mark all read
                    </button>
                  )}
                </div>
                <div className="notif-list">
                  {notifications.length === 0 ? (
                    <div className="no-notifs">No new notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        className={`notif-item ${!n.read ? 'unread' : ''}`}
                        onClick={() => markAsRead(n.id)}
                      >
                        <div className={`notif-icon-wrapper ${n.type}`}>
                          <Bell size={16} />
                        </div>
                        <div className="notif-content">
                          <p className="notif-title">{n.title}</p>
                          <p className="notif-desc">{n.message}</p>
                          <span className="notif-time">{n.time}</span>
                        </div>
                        {!n.read && <div className="unread-dot"></div>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button onClick={toggleTheme} className="icon-action-btn theme-toggle" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <RouterLink to="/login" className="btn-secondary">Login</RouterLink>
          <RouterLink to="/signup" className="btn-primary">Get Started</RouterLink>
          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <RouterLink to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</RouterLink>
          <RouterLink to="/jobs" onClick={() => setIsMobileMenuOpen(false)}>Find Jobs</RouterLink>
          <RouterLink to="/skills" onClick={() => setIsMobileMenuOpen(false)}>Skills</RouterLink>
          <RouterLink to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</RouterLink>
          <RouterLink to="/signup" className="btn-primary" onClick={() => setIsMobileMenuOpen(false)}>Get Started</RouterLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
