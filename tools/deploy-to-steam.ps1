$SteamAppDist = "C:\Program Files (x86)\Steam\steamapps\common\Bitburner\resources\app\dist"
$DevDist = "C:\_dev\bitburner-es\dist"

Write-Host "Copiando bundles traducidos a Steam..." -ForegroundColor Cyan
Copy-Item "$DevDist\main.bundle.js" "$SteamAppDist\main.bundle.js" -Force
Write-Host "¡Despliegue completado! Puedes iniciar Bitburner desde Steam." -ForegroundColor Green
