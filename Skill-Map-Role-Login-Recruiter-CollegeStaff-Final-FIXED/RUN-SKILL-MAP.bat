@echo off
setlocal
cd /d "%~dp0"
echo Installing backend and frontend dependencies...
call npm --prefix backend install
if errorlevel 1 goto :error
call npm --prefix frontend install
if errorlevel 1 goto :error
echo.
echo Starting Skill Map backend and frontend in separate windows...
start "Skill Map Backend" cmd /k "cd /d %~dp0backend && npm run dev"
start "Skill Map Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"
echo.
echo Frontend: http://localhost:3000
echo Backend : http://localhost:5000
exit /b 0
:error
echo Installation failed. Check the error above.
pause
exit /b 1
