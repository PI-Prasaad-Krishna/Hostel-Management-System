@echo off
echo Starting Hostel Management Backend...
echo.
echo Make sure:
echo 1. MySQL is running
echo 2. Database 'hostel_management' exists
echo 3. MySQL username/password in application.properties is correct
echo.
pause
cd /d "%~dp0"
mvn clean spring-boot:run

