@echo off
echo ===================================================
echo   CAT AGENTIC ENGINE - FRESH DEPLOYMENT PROTOCOL
echo ===================================================
echo.
echo [1/4] Cleaning existing Git configuration...
if exist ".git" (
    rmdir /s /q .git
    echo    - .git directory removed.
) else (
    echo    - No existing .git found.
)

echo.
echo [2/4] Initializing fresh Git repository...
git init
git branch -M main

echo.
echo [3/4] Staging Core Files (Design Locked v2.0)...
git add .

echo.
echo [4/4] Committing "Core Design Lock"...
git commit -m "feat: Core Design Lock v2.0 (Comet/Neobrutalism) - Auto-Deploy"

echo.
echo ===================================================
echo   READY FOR PUSH
echo ===================================================
echo.
echo To push to GitHub, run:
echo   git remote add origin <YOUR_GITHUB_REPO_URL>
echo   git push -u origin main --force
echo.
pause
