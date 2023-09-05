@echo off

:: Initialize log file
set LOGFILE=C:\logs\file.log
echo [%date% %time%] Starting script > %LOGFILE%

cd C:\nginx

:: Start Nginx service with specified config file
echo [%date% %time%] Starting Nginx... >> %LOGFILE%
start .\nginx

:: Give Nginx a few seconds to start
timeout /t 5

:: Check if Nginx started successfully
tasklist /FI "IMAGENAME eq nginx.exe" 2>NUL | find /I /N "nginx.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo Nginx started successfully.
    echo [%date% %time%] Nginx started successfully. >> %LOGFILE%
) else (
    echo Nginx failed to start.
    echo [%date% %time%] Nginx failed to start. >> %LOGFILE%
    exit /b 1
)

:: Check if Python is installed
where python >nul 2>nul
if errorlevel 1 (
    echo Python not found, please install Python first.
    echo [%date% %time%] Python not found, exiting. >> %LOGFILE%
    exit /b 1
)

:: Check if pip is installed
where pip >nul 2>nul
if errorlevel 1 (
    echo Pip not found, please install Pip first.
    echo [%date% %time%] Pip not found, exiting. >> %LOGFILE%
    exit /b 1
)

:: Install Python libraries if not already installed:: Move to the Flask application directory
cd C:\\releases\\backend

:: Create and activate virtual environment
if not exist "myenv" (
    echo [%date% %time%] Creating virtual environment... >> %LOGFILE%
    python -m venv myenv
)
echo [%date% %time%] Activating virtual environment... >> %LOGFILE%
call myenv\Scripts\activate

:: Install dependencies
echo [%date% %time%] Installing dependencies... >> %LOGFILE%
pip install -r requirements.txt

:: Set Flask environment variables
set FLASK_APP=run.py
set FLASK_ENV=production

:: Initialize and migrate database
echo [%date% %time%] Initializing and migrating database... >> %LOGFILE%
flask db init >> %LOGFILE% 2>>&1
flask db migrate >> %LOGFILE% 2>>&1
flask db upgrade >> %LOGFILE% 2>>&1

:: Start Flask application with Waitress
echo [%date% %time%] Starting Flask application... >> %LOGFILE%
start /b waitress-serve --listen=127.0.0.1:5000 run:app

echo [%date% %time%] Script completed successfully. >> %LOGFILE%
exit /b 0