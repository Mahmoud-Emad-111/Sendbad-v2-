@echo off
REM Migration Script for Vite Setup (Windows)
REM This script moves files to src/ directory for Vite project structure

echo Starting migration to Vite structure...

REM Create src directories
echo Creating src directories...
if not exist "src\components\figma" mkdir src\components\figma
if not exist "src\components\ui" mkdir src\components\ui
if not exist "src\styles" mkdir src\styles

REM Copy components
echo Copying components...
if exist "components" (
  xcopy /E /I /Y components src\components
  echo Components copied
) else (
  echo Warning: components\ directory not found
)

REM Copy styles
echo Copying styles...
if exist "styles" (
  xcopy /E /I /Y styles src\styles
  echo Styles copied
) else (
  echo Warning: styles\ directory not found
)

echo.
echo Migration complete!
echo.
echo Next steps:
echo 1. npm install
echo 2. npm run dev
echo.
echo Your Vite project should now be ready!

pause
