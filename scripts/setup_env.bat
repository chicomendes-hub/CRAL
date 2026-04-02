@echo off
REM ============================================
REM Script di Setup File .env per Windows
REM ============================================

echo.
echo ========================================
echo Setup File .env per CRAL Bot Telegram
echo ========================================
echo.

REM Determina la directory del progetto
set SCRIPT_DIR=%~dp0
set PROJECT_DIR=%SCRIPT_DIR%..

echo Directory progetto: %PROJECT_DIR%
echo.

REM Copia file .env backend
echo 1. Configurazione Backend...
if exist "%PROJECT_DIR%\backend\.env" (
    echo [!] File backend\.env gia esistente
    choice /C SN /M "Vuoi sovrascriverlo?"
    if errorlevel 2 (
        echo [OK] File backend\.env mantenuto
    ) else (
        copy "%PROJECT_DIR%\backend\.env.example" "%PROJECT_DIR%\backend\.env" >nul
        echo [OK] File backend\.env creato
    )
) else (
    if exist "%PROJECT_DIR%\backend\.env.example" (
        copy "%PROJECT_DIR%\backend\.env.example" "%PROJECT_DIR%\backend\.env" >nul
        echo [OK] File backend\.env creato
    ) else (
        echo [ERRORE] File .env.example non trovato
    )
)
echo.

REM Copia file .env frontend
echo 2. Configurazione Frontend...
if exist "%PROJECT_DIR%\frontend\.env" (
    echo [!] File frontend\.env gia esistente
    choice /C SN /M "Vuoi sovrascriverlo?"
    if errorlevel 2 (
        echo [OK] File frontend\.env mantenuto
    ) else (
        copy "%PROJECT_DIR%\frontend\.env.example" "%PROJECT_DIR%\frontend\.env" >nul
        echo [OK] File frontend\.env creato
    )
) else (
    if exist "%PROJECT_DIR%\frontend\.env.example" (
        copy "%PROJECT_DIR%\frontend\.env.example" "%PROJECT_DIR%\frontend\.env" >nul
        echo [OK] File frontend\.env creato
    ) else (
        echo [ERRORE] File .env.example non trovato
    )
)
echo.

echo ================================
echo Setup Completato!
echo ================================
echo.
echo Prossimi passi:
echo.
echo 1. Crea il bot su Telegram con @BotFather
echo    Vedi: ISTRUZIONI_BOTFATHER.md
echo.
echo 2. Modifica backend\.env e inserisci il TELEGRAM_TOKEN
echo    Usa Blocco Note o un editor di testo
echo.
echo 3. Verifica la configurazione:
echo    type backend\.env
echo    type frontend\.env
echo.
echo 4. Installa le dipendenze:
echo    cd backend ^&^& pip install -r requirements.txt
echo    cd frontend ^&^& yarn install
echo.
echo 5. Avvia l'applicazione:
echo    - Terminale 1: cd backend ^&^& python server.py
echo    - Terminale 2: cd frontend ^&^& yarn start
echo.
echo Documentazione:
echo - GUIDA_INSTALLAZIONE_LOCALE.md
echo - CONFIGURAZIONE_ENV.md
echo - GUIDA_RAPIDA.md
echo.
echo Buon lavoro con il CRAL Bot!
echo.
pause
