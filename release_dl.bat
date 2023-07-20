@echo off
setlocal enabledelayedexpansion

:: Set the log directory and file path
set "logDir=C:\logs"
set "logFile=%logDir%\batch_log.txt"

:: Check if the log directory exists and create it if it does not
if not exist %logDir% (
    mkdir %logDir%
)

:: Clear the log file
echo. > "%logFile%"

:: Check if the 'releases' folder exists and delete it if it does
set message=Deleting previous 'releases' folder...
echo %message%
echo %message% >> "%logFile%"
rmdir /s /q C:\releases >> "%logFile%" 2>&1
if errorlevel 1 goto :error

:: Download the latest release file from GitHub and log the command
set message=Downloading the latest release file from GitHub...
echo %message%
echo %message% >> "%logFile%"
powershell -Command "try { Invoke-WebRequest -Uri (Invoke-RestMethod -Uri 'https://api.github.com/repos/Buront2610/reservation_system/releases/latest').assets[0].browser_download_url -OutFile 'C:\releases.zip' } catch { Write-Host $_.Exception.Message; exit 1 }" >> "%logFile%" 2>&1
if errorlevel 1 goto :error

:: Unzip the release file and log the command
set message=Unzipping the release file...
echo %message%
echo %message% >> "%logFile%"
powershell -Command "try { Expand-Archive -Path 'C:\releases.zip' -DestinationPath 'C:\' } catch { Write-Host $_.Exception.Message; exit 1 }" >> "%logFile%" 2>&1
if errorlevel 1 goto :error

:: Delete the release zip file
set message=Deleting the release zip file...
echo %message%
echo %message% >> "%logFile%"
del /F /Q C:\releases.zip >> "%logFile%" 2>&1
if errorlevel 1 goto :error

:: Set the environment variable
set message=Setting the environment variable...
echo %message%
echo %message% >> "%logFile%"
setx RESERVATION_SYSTEM_PATH "C:\\releases" /M >> "%logFile%" 2>&1
echo %RESERVATION_SYSTEM_PATH% >> "%logFile%" 2>&1
if errorlevel 1 goto :error

:: Generate the nginx configuration and log the command
set message=Generating the nginx configuration...
echo %message%
echo %message% >> "%logFile%"


:: Save the current execution policy
powershell -Command "Set-Content -Path 'current_policy.txt' -Value (Get-ExecutionPolicy)"

:: Set the execution policy to RemoteSigned
powershell -Command "Set-ExecutionPolicy RemoteSigned -Force"

:: Run your script
powershell -File "C:\releases\set_config.ps1" >> "%logFile%" 2>&1

:: Restore the original execution policy
powershell -Command "Set-ExecutionPolicy (Get-Content -Path 'current_policy.txt') -Force"

:: Delete the temporary file
del /F /Q current_policy.txt


if errorlevel 1 goto :error
set message=Nginx configuration generated.
echo %message%
echo %message% >> "%logFile%"


if errorlevel 1 goto :error

echo. >> "%logFile%"

:: Wait for user input to exit
echo Press any key to exit...
pause > nul
goto :EOF

:error
set message=An error occurred, check the log file for more details.
echo %message%
echo %message% >> "%logFile%"
pause > nul

endlocal
