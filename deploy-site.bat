@echo off
setlocal
cd /d "%~dp0"

for /f "delims=" %%B in ('git branch --show-current') do set "BRANCH=%%B"
if not "%BRANCH%"=="main" (
  echo ERROR: Switch to the main branch before deploying.
  goto :failed
)

call npm run build
if errorlevel 1 goto :failed

git add -A
git diff --cached --quiet
if not errorlevel 1 (
  echo No changes to deploy.
  goto :done
)

git commit -m "Update website"
if errorlevel 1 goto :failed

git push origin main
if errorlevel 1 goto :failed

echo Website update pushed. Cloudflare deployment has started.
goto :done

:failed
echo Deployment stopped because a command failed.
pause
exit /b 1

:done
pause
