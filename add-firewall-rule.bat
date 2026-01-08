@echo off
echo Adding Windows Firewall rule for CoachVerse Backend...
netsh advfirewall firewall add rule name="CoachVerse Backend Port 5000" dir=in action=allow protocol=TCP localport=5000
echo.
echo Firewall rule added successfully!
echo You can now connect from your mobile device.
pause
