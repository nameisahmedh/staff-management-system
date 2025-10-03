@echo off
echo Setting up Git repository for Staff Management System...

git init
git add .
git commit -m "Initial commit: Staff Management System with AI features"

echo.
echo Git repository initialized successfully!
echo.
echo To push to GitHub:
echo 1. Create a new repository on GitHub
echo 2. Run: git remote add origin https://github.com/yourusername/staff-management-system.git
echo 3. Run: git branch -M main
echo 4. Run: git push -u origin main
echo.
pause