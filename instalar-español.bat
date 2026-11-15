@echo off
chcp 65001 >nul
title Bitburner en Español - Instalador Oficial por quintana.dev
color 0b

echo.
echo  =============================================================
echo    ____  _ _   _                                
echo   ^| __ )(_) ^|_^| ^|__  _   _ _ __ _ __   ___ _ __ 
echo   ^|  _ \^| ^| __^| '_ \^| ^| ^| ^| '__^| '_ \ / _ \ '__^|
echo   ^| ^|_) ^| ^| ^|_^| ^|_) ^| ^|_^| ^| ^|  ^| ^| ^| ^|  __/ ^|   
echo   ^|____/^|_^|\__^|_.__/ \__,_^|_^|  ^|_^| ^|_^|\___^|_^|   
echo.
echo           Edición en Español por quintana.dev
echo               https://quintana.dev.ar
echo  =============================================================
echo.

set SCRIPT_DIR=%~dp0
set TARGET_DIR=

REM Verificar si se ejecuta dentro del directorio del juego
if exist "%SCRIPT_DIR%resources\app\dist" (
    set "TARGET_DIR=%SCRIPT_DIR%"
    goto :INSTALL
)

REM Buscar rutas comunes de Steam
set "P1=C:\Program Files (x86)\Steam\steamapps\common\Bitburner"
set "P2=C:\Program Files\Steam\steamapps\common\Bitburner"
set "P3=D:\SteamLibrary\steamapps\common\Bitburner"
set "P4=E:\SteamLibrary\steamapps\common\Bitburner"
set "P5=F:\SteamLibrary\steamapps\common\Bitburner"
set "P6=D:\Steam\steamapps\common\Bitburner"
set "P7=E:\Steam\steamapps\common\Bitburner"

if exist "%P1%\resources\app\dist" ( set "TARGET_DIR=%P1%" & goto :INSTALL )
if exist "%P2%\resources\app\dist" ( set "TARGET_DIR=%P2%" & goto :INSTALL )
if exist "%P3%\resources\app\dist" ( set "TARGET_DIR=%P3%" & goto :INSTALL )
if exist "%P4%\resources\app\dist" ( set "TARGET_DIR=%P4%" & goto :INSTALL )
if exist "%P5%\resources\app\dist" ( set "TARGET_DIR=%P5%" & goto :INSTALL )
if exist "%P6%\resources\app\dist" ( set "TARGET_DIR=%P6%" & goto :INSTALL )
if exist "%P7%\resources\app\dist" ( set "TARGET_DIR=%P7%" & goto :INSTALL )

:MANUAL_PATH
echo No se detectó automáticamente la carpeta de Steam de Bitburner.
echo.
set /p TARGET_DIR="Arrastra o escribe aquí la ruta de la carpeta de Bitburner: "
set TARGET_DIR=%TARGET_DIR:"=%

if not exist "%TARGET_DIR%\resources\app\dist" (
    echo.
    echo [ERROR] No se encontró la carpeta 'resources\app\dist' en la ruta especificada.
    echo Por favor asegúrate de seleccionar la carpeta raíz de Bitburner en Steam.
    echo.
    goto :MANUAL_PATH
)

:INSTALL
echo [1/4] Carpeta de Bitburner detectada en:
echo       "%TARGET_DIR%"
echo.

REM Verificar si Bitburner está ejecutándose
tasklist /fi "imagename eq Bitburner.exe" 2>NUL | find /i "Bitburner.exe">NUL
if not errorlevel 1 (
    echo [AVISO] Bitburner está abierto. Ciérralo antes de continuar.
    echo Presiona cualquier tecla cuando hayas cerrado el juego...
    pause >nul
)

echo [2/4] Creando copia de seguridad del juego original...
if not exist "%TARGET_DIR%\resources\app\dist_backup" (
    mkdir "%TARGET_DIR%\resources\app\dist_backup" >nul 2>&1
    if exist "%TARGET_DIR%\resources\app\dist\main.bundle.js" (
        copy /Y "%TARGET_DIR%\resources\app\dist\main.bundle.js" "%TARGET_DIR%\resources\app\dist_backup\main.bundle.js" >nul
    )
    if exist "%TARGET_DIR%\resources\app\index.html" (
        copy /Y "%TARGET_DIR%\resources\app\index.html" "%TARGET_DIR%\resources\app\dist_backup\index.html" >nul
    )
    echo       Copia de seguridad guardada en 'dist_backup'.
) else (
    echo       Copia de seguridad ya existente, omitiendo.
)

echo.
echo [3/4] Instalando archivos traducidos...

set "SOURCE_BUNDLE=%SCRIPT_DIR%dist\main.bundle.js"
if not exist "%SOURCE_BUNDLE%" set "SOURCE_BUNDLE=%SCRIPT_DIR%main.bundle.js"

if not exist "%SOURCE_BUNDLE%" (
    echo [ERROR] No se encontró 'main.bundle.js'. Asegúrate de haber extraído todo el contenido del zip.
    pause
    exit /b 1
)

copy /Y "%SOURCE_BUNDLE%" "%TARGET_DIR%\resources\app\dist\main.bundle.js" >nul
if exist "%SCRIPT_DIR%index.html" (
    copy /Y "%SCRIPT_DIR%index.html" "%TARGET_DIR%\resources\app\index.html" >nul
)

echo.
echo =============================================================
echo   ¡INSTALACIÓN COMPLETADA CON ÉXITO!
echo   Ya puedes abrir Bitburner desde Steam y disfrutarlo
echo   totalmente en español.
echo.
echo   Créditos y soporte: https://quintana.dev.ar
echo =============================================================
echo.
pause
