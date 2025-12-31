@echo off
echo Iniciando o ambiente de desenvolvimento...

:: Inicia o Backend em uma nova janela
start "Backend Library" powershell -NoExit -Command "cd back; npm run start:dev"

:: Inicia o Frontend em uma nova janela
start "Frontend Library" powershell -NoExit -Command "cd front; npm run dev"

echo.
echo Servicos iniciados!
echo Para parar, basta fechar as janelas do terminal que foram abertas.
pause
