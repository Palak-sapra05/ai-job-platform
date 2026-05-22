const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = 8080;

const AUTH_SERVICE = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const PROFILE_SERVICE = process.env.PROFILE_SERVICE_URL || 'http://localhost:3002';
const RECOMMENDATION_SERVICE = process.env.RECOMMENDATION_SERVICE_URL || 'http://localhost:8000';
const NOTIFICATION_SERVICE = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3003';

// Route to Auth Service
app.use('/auth', createProxyMiddleware({
  target: AUTH_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/auth': '' }
}));

// Route to Profile Service
app.use('/profile', createProxyMiddleware({
  target: PROFILE_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/profile': '' }
}));

// Route to Recommendation Service
app.use('/recommendation', createProxyMiddleware({
  target: RECOMMENDATION_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/recommendation': '' }
}));

// Route to Resume Analysis Service (mapped to Recommendation Service)
app.use('/resume', createProxyMiddleware({
  target: RECOMMENDATION_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/resume': '' }
}));

// Route to Notification Service
app.use('/notification', createProxyMiddleware({
  target: NOTIFICATION_SERVICE,
  changeOrigin: true,
  pathRewrite: { '^/notification': '' }
}));

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
