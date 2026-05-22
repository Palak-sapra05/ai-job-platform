import React from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';
import { Activity, Target, Zap, BarChart3 } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const growthData = [
  { month: 'Jan', skills: 20, jobs: 5 },
  { month: 'Feb', skills: 25, jobs: 12 },
  { month: 'Mar', skills: 35, jobs: 18 },
  { month: 'Apr', skills: 45, jobs: 25 },
  { month: 'May', skills: 60, jobs: 32 },
  { month: 'Jun', skills: 80, jobs: 45 },
];

const defaultDemandData = [
  { subject: 'React', A: 120, B: 110, fullMark: 150 },
  { subject: 'TypeScript', A: 98, B: 130, fullMark: 150 },
  { subject: 'Python', A: 86, B: 130, fullMark: 150 },
  { subject: 'Docker', A: 99, B: 100, fullMark: 150 },
  { subject: 'AWS', A: 85, B: 90, fullMark: 150 },
];

const COLORS = ['#38bdf8', '#818cf8', '#22d3ee', '#f472b6'];

const AnalyticsDashboard = () => {
  let userData = null;
  try {
    userData = JSON.parse(localStorage.getItem('userProfileData'));
  } catch(e) {}

  const demandData = userData && userData.skills && userData.skills.length > 0
    ? userData.skills.slice(0, 5).map(s => ({
        subject: s.name,
        A: Math.floor(Math.random() * 50) + 100,
        B: s.level === 'Beginner' ? 60 : s.level === 'Intermediate' ? 100 : 140,
        fullMark: 150
      }))
    : defaultDemandData;

  const targetRole = userData && userData.interests && userData.interests.length > 0 
    ? userData.interests[0] 
    : 'Senior DevOps Engineer';
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="main-view">
        <header style={{ marginBottom: '2.5rem' }}>
          <h1>Advanced Analytics</h1>
          <p style={{ color: 'var(--text-dim)' }}>Track your professional growth and industry trends in real-time.</p>
        </header>

        <div className="analytics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
          <motion.div className="glass-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <Activity size={20} color="var(--primary)" />
              <h3>Skill Growth vs. Job Opportunities</h3>
            </div>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="colorSkills" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="var(--text-dim)" fontSize={12} />
                  <YAxis stroke="var(--text-dim)" fontSize={12} />
                  <Tooltip contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--glass-border)' }} />
                  <Area type="monotone" dataKey="skills" stroke="var(--primary)" fillOpacity={1} fill="url(#colorSkills)" />
                  <Area type="monotone" dataKey="jobs" stroke="var(--secondary)" fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div className="glass-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <Target size={20} color="var(--secondary)" />
              <h3>Industry Skill Demand</h3>
            </div>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demandData}>
                  <XAxis dataKey="subject" stroke="var(--text-dim)" fontSize={12} />
                  <YAxis stroke="var(--text-dim)" fontSize={12} />
                  <Tooltip contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--glass-border)' }} />
                  <Bar dataKey="A" fill="var(--primary)" radius={[4, 4, 0, 0]} name="Market Demand" />
                  <Bar dataKey="B" fill="var(--secondary)" radius={[4, 4, 0, 0]} name="Your Level" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div className="glass-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <Zap size={20} color="var(--accent)" />
              <h3>Application Status Distribution</h3>
            </div>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Interview', value: 4 },
                      { name: 'Applied', value: 12 },
                      { name: 'Rejected', value: 3 },
                      { name: 'Offer', value: 1 },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {[0, 1, 2, 3].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--glass-border)' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div className="glass-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <BarChart3 size={20} color="var(--primary)" />
              <h3>AI Job Predictions</h3>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(254, 129, 212, 0.05)', borderRadius: '12px', border: '1px solid rgba(254, 129, 212, 0.2)' }}>
              <p style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                Based on your current learning trajectory, you have a <strong>92% probability</strong> of qualifying for <strong>{targetRole}</strong> roles within 3 months.
              </p>
              <button className="btn-primary" style={{ marginTop: '1rem', width: '100%' }}>View Roadmap</button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;
