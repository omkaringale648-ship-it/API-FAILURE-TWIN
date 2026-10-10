@echo off
title API Failure Twin - Live Server & Public Tunnel
echo ===================================================
echo     Starting API Failure Twin Public Server
echo ===================================================
echo.
echo [1/2] Launching unified backend & frontend on port 8000...
start /b python -m uvicorn backend.app.main:app --port 8000 --host 0.0.0.0

timeout /t 3 /nobreak >nul

echo [2/2] Connecting public tunnel (https://wild-toys-grin.loca.lt)...
echo.
echo Tunnel Verification Password (Endpoint IP): 134.82.68.163
echo Local URL: http://localhost:8000
echo.
:loop
call npx.cmd localtunnel --port 8000 --subdomain wild-toys-grin
echo Tunnel disconnected, reconnecting in 5 seconds...
timeout /t 5
goto loop
