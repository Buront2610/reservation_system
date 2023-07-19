# Start Nginx service
Start-Service -Name 'nginx'

# Start Flask application with Waitress
# This assumes that you have a Python script to start your Flask application with Waitress
# Replace 'path\to\your\start_script.py' with the actual path to your script
python C:\release\backend\start_script.py


# Start Flask application with Waitress
# This assumes that 'run:app' points to your Flask application
# And that waitress-serve is available in your PATH
Start-Process -NoNewWindow -FilePath "waitress-serve" -ArgumentList "--listen=127.0.0.1:5000 run:app"