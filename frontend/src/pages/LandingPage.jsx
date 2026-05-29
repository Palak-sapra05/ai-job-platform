import React from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  Brain, 
  Zap, 
  BarChart3, 
  Search, 
  Globe,
  Star,
  Users,
  Briefcase,
  TrendingUp
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TextType from '../components/TextType';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div 
    className="glass-card feature-card"
    whileHover={{ y: -10 }}
  >
    <div className="icon-container">
      <Icon size={24} color="#38bdf8" />
    </div>
    <h3>{title}</h3>
    <p>{description}</p>
  </motion.div>
);

const LandingPage = () => {
  const stats = [
    { label: 'Active Jobs', value: '12K+', icon: Briefcase },
    { label: 'Happy Users', value: '50K+', icon: Users },
    { label: 'Skill Paths', value: '500+', icon: TrendingUp },
    { label: 'Recommendations', value: '1M+', icon: Brain },
  ];

  const features = [
    {
      icon: Brain,
      title: 'AI Recommendations',
      description: 'Get personalized job and skill suggestions based on your unique profile and interests.'
    },
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Advanced filtering and AI-powered search to find exactly what you are looking for.'
    },
    {
      icon: Zap,
      title: 'Real-time Alerts',
      description: 'Stay updated with instant notifications for new job matches and skill trends.'
    },
    {
      icon: BarChart3,
      title: 'Growth Analytics',
      description: 'Track your career progress and skill development with interactive charts.'
    },
    {
      icon: Globe,
      title: 'Global Network',
      description: 'Connect with top companies and hiring managers from around the world.'
    },
    {
      icon: Star,
      title: 'Resume Analysis',
      description: 'Get instant feedback on your resume and tips to improve your ATS score.'
    }
  ];

  return (
    <div className="landing-page">
      <Navbar />
      
      <section className="hero">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>PersonalisedAI-Powered <br /> 
            <TextType 
              text={[
                'Career Companion', 
                'Skill Builder', 
                'Job Matcher', 
                'Growth Engine'
              ]}
              typingSpeed={80}
              deletingSpeed={40}
              pauseDuration={2500}
              textColors={['#6366f1', '#d946ef', '#ec4899', '#0ea5e9']}
              className="text-type-amazing"
              cursorClassName="text-type-cursor-amazing"
            />
          </h1>
          <p>Discover personalized job opportunities, master new skills, and track your professional growth with the world's most advanced AI career platform.</p>
          <div className="hero-btns">
            <button className="btn-primary">Find Your Dream Job</button>
            <button className="btn-secondary" style={{ border: '1px solid var(--glass-border)', padding: '0.75rem 1.5rem', borderRadius: '8px' }}>Explore Skills</button>
          </div>
        </motion.div>
        
        <div className="hero-stats stats-grid section" style={{ width: '100%', marginTop: '4rem' }}>
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              className="glass-card stat-item"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <stat.icon size={24} color="var(--primary)" />
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section features">
        <div className="section-title">
          <h2>Powerful Features</h2>
          <p style={{ color: 'var(--text-dim)' }}>Everything you need to accelerate your career in one place.</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </section>

      <section className="section testimonials" style={{ background: 'rgba(254, 129, 212, 0.02)' }}>
        <div className="section-title">
          <h2>What Our Users Say</h2>
        </div>
        <div className="features-grid">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="glass-card testimonial-card">
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={16} fill="var(--primary)" color="var(--primary)" />)}
              </div>
              <p>"This platform completely changed how I look for jobs. The AI recommendations were spot on!"</p>
              <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', background: 'var(--glass)', borderRadius: '50%' }}></div>
                <div>
                  <strong>User {i + 1}</strong>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-dim)' }}>Software Engineer</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
