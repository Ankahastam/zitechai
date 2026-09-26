@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0deploy-site.ps1"
exit /b %errorlevel%
