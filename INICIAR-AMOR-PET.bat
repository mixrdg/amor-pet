@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo =====================================
echo          AMOR PET - INICIANDO
echo =====================================
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js nao foi encontrado.
  echo Instale a versao LTS em https://nodejs.org/ e abra este arquivo novamente.
  pause
  exit /b 1
)
if not exist node_modules (
  echo Instalando os componentes necessarios. Na primeira vez pode demorar...
  call npm install
  if errorlevel 1 (echo Nao foi possivel instalar os componentes.& pause & exit /b 1)
)
start "Amor Pet" cmd /k "npm start"
timeout /t 3 /nobreak >nul
start http://localhost:3000
