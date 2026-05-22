import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, Globe, Send, Briefcase, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="nav-logo">
            <BrainCircuit size={32} color="#38bdf8" />
            <span>AI Career</span>
          </div>
          <p>Elevate your career with AI-driven job and skill recommendations.</p>
          <div className="social-links">
            <a href="#"><Globe size={20} /></a>
            <a href="#"><Send size={20} /></a>
            <a href="#"><Briefcase size={20} /></a>
            <a href="#"><Mail size={20} /></a>
          </div>
        </div>

        <div className="footer-links">
          <h4>Platform</h4>
          <Link to="/jobs">Job Board</Link>
          <Link to="/skills">Skill Paths</Link>
          <Link to="/resume">Resume Analyzer</Link>
          <Link to="/analytics">Analytics</Link>
        </div>

        <div className="footer-links">
          <h4>Company</h4>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>

        <div className="footer-newsletter">
          <h4>Stay Updated</h4>
          <p>Get the latest career insights delivered to your inbox.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button className="btn-primary">Subscribe</button>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 AI Career Platform. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
