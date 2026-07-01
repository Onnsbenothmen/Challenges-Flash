@echo off
cd /d "%~dp0"
echo ====================================
echo Push vers GitHub
echo ====================================
echo.
git add -A
git commit -m "Ajout README, notifications, screenshots SVG, nettoyage"
git push
echo.
if %errorlevel% equ 0 (
    echo Push reussi !
) else (
    echo Erreur lors du push.
)
pause