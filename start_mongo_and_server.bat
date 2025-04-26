@echo off
echo Starting MongoDB service...
net start MongoDB

echo Starting Hospital Management Server...
cd backend
npm start

echo System is running! 