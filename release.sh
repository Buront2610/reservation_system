# Download the release file from GitHub
Invoke-WebRequest -Uri "https://github.com/yourusername/yourrepository/releases/download/v1.0.0/release.zip" -OutFile "C:\release.zip"

# Unzip the release file
Expand-Archive -Path C:\release.zip -DestinationPath C:\release

# Set the environment variable
$env:RESERVATION_SYSTEM_PATH="C:\release\build"

# Generate the nginx configuration
$template = Get-Content -Path C:\release\nginx.conf.template -Raw
$expanded = $ExecutionContext.InvokeCommand.ExpandString($template)
$expanded | Set-Content -Path C:\nginx\conf\nginx.conf

# Restart Nginx
Restart-Service -Name 'nginx'
