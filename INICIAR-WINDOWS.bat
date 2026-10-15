@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Instala Node.js 24.19 o posterior desde https://nodejs.org
  pause
  exit /b 1
)
where npm >nul 2>nul
if errorlevel 1 (
  echo No se encontro npm. Reinstala Node.js incluyendo npm.
  pause
  exit /b 1
)
if not exist node_modules (
  echo Instalando dependencias de Solar Explorer...
  call npm ci
  if errorlevel 1 (
    echo No se pudo completar la instalacion. Revisa tu conexion.
    pause
    exit /b 1
  )
)
echo.
echo Abre http://localhost:5173 cuando aparezca Local en la terminal.
echo Mantiene esta ventana abierta mientras exploras. Ctrl+C para detener.
call npm run dev -- --port 5173 --strictPort
pause
