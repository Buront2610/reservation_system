@echo off

:: Start Nginx service
net start nginx

:: Check if Python is installed
where python >nul 2>nul
if errorlevel 1 (
    echo Python not found, please install Python first.
    exit /b 1
)

:: Install Python libraries if not already installed
where pip >nul 2>nul
if errorlevel 1 (
    echo Pip not found, please install Pip first.
    exit /b 1
)
pip freeze | findstr /i /c:"flask" >nul 2>nul || pip install -r C:\release\backend\requirement.txt

:: Start Flask application with Waitress
:: This assumes that you have a Python script to start your Flask application with Waitress
:: Replace 'C:\release\backend\start_script.py' with the actual path to your script
start python C:\release\backend\start_script.py

:: Start Flask application with Waitress
:: This assumes that 'run:app' points to your Flask application
:: And that waitress-serve is available in your PATH
start /b waitress-serve --listen=127.0.0.1:5000 run:app

exit /b 0