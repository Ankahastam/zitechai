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
if not errorlevel 1 goto :check_push

git commit -m "Update website"
if errorlevel 1 goto :failed

:check_push
for /f "delims=" %%A in ('git rev-list --count origin/main..HEAD') do set "AHEAD=%%A"
if "%AHEAD%"=="0" (
  echo No new changes to deploy.
  goto :done
)

:push
git -c http.proxy=http://127.0.0.1:10808 push origin main
if not errorlevel 1 goto :pushed

echo Proxy push failed. Retrying directly...
git push origin main
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
