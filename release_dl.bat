@echo off
setlocal

:: Download the latest release file from GitHub
powershell -Command "Invoke-WebRequest -Uri (Invoke-RestMethod -Uri 'https://api.github.com/repos/Buront2610/reservation_system/releases/tag/pre').assets[0].browser_download_url -OutFile C:\release.zip"

:: Unzip the release file
powershell -Command "Expand-Archive -Path C:\release.zip -DestinationPath C:\release"

:: Set the environment variable

:: Generate the nginx configuration
powershell -Command "
$template = Get-Content -Path C:\release\nginx.conf.template -Raw
$expanded = $ExecutionContext.InvokeCommand.ExpandString($template)
$expanded | Set-Content -Path C:\nginx\conf\nginx.conf
"

:: Restart Nginx
net stop nginx
net start nginx

endlocal
