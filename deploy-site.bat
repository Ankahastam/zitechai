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
if not errorlevel 1 goto :push

git commit -m "Update website"
if errorlevel 1 goto :failed

:push
git push origin main
if not errorlevel 1 goto :pushed

echo Direct push failed. Retrying through the local proxy...
git -c http.proxy=http://127.0.0.1:10808 push origin main
if errorlevel 1 goto :failed

:pushed
echo Website update pushed. Cloudflare deployment has started.
goto :done

:failed
echo Deployment stopped because a command failed.
pause
exit /b 1

:done
pause
