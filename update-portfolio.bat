@echo off
:: Portfolio Auto-Update Script (Windows)
:: This script syncs projects from GitHub and commits changes

echo 🚀 Portfolio Auto-Update Script
echo ===============================

:: Check if we're in a git repository
if not exist ".git" (
    echo ❌ Not a git repository. Please run this script from your portfolio root directory.
    exit /b 1
)

:: Check if Node.js is available
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js to run the sync script.
    exit /b 1
)

:: Check if sync script exists
if not exist "sync-projects.js" (
    echo ❌ sync-projects.js not found. Please ensure the script is in the current directory.
    exit /b 1
)

echo ℹ️ Checking git status...
git diff --quiet HEAD
if %errorlevel% neq 0 (
    echo ⚠️ You have uncommitted changes. Please commit or stash them before running this script.
    echo Uncommitted files:
    git status --porcelain
    exit /b 1
)

echo ℹ️ Fetching latest project data from GitHub...

:: Run the sync script
node sync-projects.js
if %errorlevel% neq 0 (
    echo ❌ Failed to sync project data
    exit /b 1
)

echo ✅ Successfully synced project data

:: Check if projects.json was updated
git diff --quiet projects.json
if %errorlevel% equ 0 (
    echo ℹ️ No changes detected in projects.json
    echo Portfolio is already up to date! 🎉
    exit /b 0
)

echo ℹ️ Changes detected in projects.json

echo.
echo 📋 Changes in projects.json:
git diff --stat projects.json

echo ℹ️ Staging changes...
git add projects.json

echo ℹ️ Creating commit...

:: Create commit message
for /f "tokens=*" %%i in ('node -e "console.log(require('./projects.json').totalProjects)"') do set PROJECT_COUNT=%%i

git commit -m "🔄 Auto-update: Sync projects from GitHub" -m "" -m "- Updated projects.json with latest repository data" -m "- Total projects: %PROJECT_COUNT%" -m "- Last updated: %date% %time%" -m "" -m "🤖 Generated with automated sync script"

echo ✅ Changes committed successfully!

echo.
set /p PUSH_CHOICE="🚀 Push changes to remote repository? (y/N): "
if /i "%PUSH_CHOICE%"=="y" (
    echo ℹ️ Pushing to remote repository...
    git push
    if %errorlevel% equ 0 (
        echo ✅ Changes pushed successfully!
        echo.
        echo 🌐 Your portfolio has been updated!
        echo    GitHub: https://github.com/miqdad-dev/Portfolio
        echo    Website: https://miqdad-dev.github.io/Portfolio/
    ) else (
        echo ❌ Failed to push changes
        exit /b 1
    )
) else (
    echo ℹ️ Changes committed locally but not pushed to remote
    echo Run 'git push' when you're ready to deploy the changes
)

echo.
echo ✅ Portfolio update completed! ✨
pause