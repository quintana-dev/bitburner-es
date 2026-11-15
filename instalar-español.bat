@echo off
chcp 65001 >nul
title Bitburner en Español - Instalador Oficial por quintana.dev
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$scriptDir='%~dp0'; $f=[System.IO.File]::ReadAllLines('%~f0',[System.Text.Encoding]::UTF8); $c=($f[7..($f.Length-1)]) -join [Environment]::NewLine; Invoke-Expression $c"
pause
exit /b %ERRORLEVEL%

# === POWERSHELL LOGIC ===
Write-Host ""
Write-Host "=============================================================" -ForegroundColor Cyan
Write-Host "   Bitburner en Español - Instalador Oficial" -ForegroundColor White
Write-Host "               por quintana.dev" -ForegroundColor Magenta
Write-Host "           https://quintana.dev.ar" -ForegroundColor DarkCyan
Write-Host "=============================================================" -ForegroundColor Cyan
Write-Host ""

if ($scriptDir -and $scriptDir.EndsWith('\')) {
    $scriptDir = $scriptDir.Substring(0, $scriptDir.Length - 1)
}
if (-not $scriptDir) { $scriptDir = (Get-Location).Path }

# 1. Determinar origen de main.bundle.js
$sourceBundle = Join-Path $scriptDir "dist\main.bundle.js"
if (-not (Test-Path $sourceBundle)) { $sourceBundle = Join-Path $scriptDir "main.bundle.js" }

if (-not (Test-Path $sourceBundle)) {
    Write-Host "[ERROR] No se encontró 'main.bundle.js'. Asegúrate de extraer todos los archivos del zip." -ForegroundColor Red
    exit 1
}

# 2. Buscar Bitburner
$targetDir = $null

# Opción A: Se ejecutó dentro de la carpeta del juego
if (Test-Path (Join-Path $scriptDir "resources\app\dist")) {
    $targetDir = $scriptDir
}

# Opción B: Detección por registro de Steam
if (-not $targetDir) {
    try {
        $steamPath = (Get-ItemProperty -Path "HKCU:\Software\Valve\Steam" -ErrorAction SilentlyContinue).SteamPath
        if ($steamPath) {
            $candidate = Join-Path $steamPath "steamapps\common\Bitburner"
            if (Test-Path (Join-Path $candidate "resources\app\dist")) {
                $targetDir = $candidate
            }
        }
    } catch {}
}

# Opción C: Rutas habituales de instalación
if (-not $targetDir) {
    $commonPaths = @(
        "C:\Program Files (x86)\Steam\steamapps\common\Bitburner",
        "C:\Program Files\Steam\steamapps\common\Bitburner",
        "D:\SteamLibrary\steamapps\common\Bitburner",
        "E:\SteamLibrary\steamapps\common\Bitburner",
        "F:\SteamLibrary\steamapps\common\Bitburner",
        "D:\Steam\steamapps\common\Bitburner",
        "E:\Steam\steamapps\common\Bitburner"
    )
    foreach ($p in $commonPaths) {
        if (Test-Path (Join-Path $p "resources\app\dist")) {
            $targetDir = $p
            break
        }
    }
}

# Opción D: Si no se encontró, pedir la ruta
if (-not $targetDir) {
    Write-Host "No se detectó la carpeta de Bitburner automáticamente." -ForegroundColor Yellow
    $inputPath = Read-Host "Arrastra o escribe aquí la ruta de la carpeta de Bitburner en Steam"
    if ($inputPath) {
        $inputPath = $inputPath.Trim('"').Trim("'").Trim()
        if (Test-Path (Join-Path $inputPath "resources\app\dist")) {
            $targetDir = $inputPath
        }
    }
}

if (-not $targetDir -or -not (Test-Path (Join-Path $targetDir "resources\app\dist"))) {
    Write-Host "[ERROR] No se encontró la carpeta 'resources\app\dist' en la ruta indicada." -ForegroundColor Red
    exit 1
}

Write-Host "[1/3] Carpeta de Bitburner detectada en:" -ForegroundColor Green
Write-Host "      $targetDir" -ForegroundColor Gray
Write-Host ""

# Verificar si el juego está en ejecución
$proc = Get-Process -Name Bitburner -ErrorAction SilentlyContinue
if ($proc) {
    Write-Host "[AVISO] Bitburner está en ejecución. Por favor ciérralo para continuar." -ForegroundColor Yellow
    Read-Host "Presiona Enter una vez cerrado el juego..."
}

# Copia de seguridad
Write-Host "[2/3] Verificando copia de seguridad..." -ForegroundColor Green
$backupDir = Join-Path $targetDir "resources\app\dist_backup"
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    $origBundle = Join-Path $targetDir "resources\app\dist\main.bundle.js"
    if (Test-Path $origBundle) {
        Copy-Item $origBundle (Join-Path $backupDir "main.bundle.js") -Force
        Write-Host "      Copia de seguridad del juego original creada en 'dist_backup'." -ForegroundColor Gray
    }
} else {
    Write-Host "      Copia de seguridad ya existente, omitiendo." -ForegroundColor Gray
}
Write-Host ""

# Instalar archivos
Write-Host "[3/3] Instalando archivos en español..." -ForegroundColor Green
$destBundle = Join-Path $targetDir "resources\app\dist\main.bundle.js"
Copy-Item $sourceBundle $destBundle -Force

$sourceIndex = Join-Path $scriptDir "index.html"
if (Test-Path $sourceIndex) {
    Copy-Item $sourceIndex (Join-Path $targetDir "resources\app\index.html") -Force
}

Write-Host ""
Write-Host "=============================================================" -ForegroundColor Green
Write-Host "   ¡INSTALACIÓN COMPLETADA CON ÉXITO!" -ForegroundColor White
Write-Host "   Ya puedes abrir Bitburner desde Steam y disfrutarlo" -ForegroundColor White
Write-Host "   totalmente en español." -ForegroundColor White
Write-Host ""
Write-Host "   Créditos y soporte: https://quintana.dev.ar" -ForegroundColor Cyan
Write-Host "=============================================================" -ForegroundColor Green
Write-Host ""
