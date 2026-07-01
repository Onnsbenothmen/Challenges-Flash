@echo off
cd /d "%~dp0"
git add -A
git commit -m "migration PostgreSQL vers SQLite + nettoyage"
git push
echo.
echo Termine ! Appuyez sur une touche pour fermer.
pause >nul
