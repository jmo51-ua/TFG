@echo off
start powershell -NoExit -Command "cd .\Server\; node server"
timeout /t 2 /nobreak > nul
start powershell -NoExit -Command "cd .\Client\; npm run dev"
