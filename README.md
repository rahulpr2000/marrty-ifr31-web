# Marrty IFR31 - Web Frontend

React + Vite Dashboard for Student Face Attendance System.

## Features
- **Dashboard:** Real-time stats.
- **Students:** Manage student data.
- **Faculty:** Manage faculty data.
- **Attendance:** View reports.
- **Enrollment:** Upload face images.
- **Devices:** Setup guide for ESP32.

## Tech Stack
- React 18
- Vite
- TypeScript
- Tailwind CSS
- AWS Amplify UI
- Recharts / Lucide React

## Deployment
Hosted on S3 + CloudFront.
```bash
npm run build
aws s3 sync dist/ s3://marrty-ifr31-web-dev-...
```
