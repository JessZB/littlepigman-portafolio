# Script de inicio rápido para LittlePigman Portfolio
# Ejecuta Astro (Frontend), Bridge (Backend) y Admin UI simultáneamente

Write-Host "🚀 Iniciando el ecosistema LittlePigman Portfolio..." -ForegroundColor Cyan

# Función para ejecutar procesos en ventanas separadas o en segundo plano
function Start-DevServer {
    param (
        [string]$Name,
        [string]$Path,
        [string]$Command
    )
    Write-Host "  -> Arrancando $Name en $Path..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Path'; $Command"
}

# 1. Astro (Frontend Público) - Puerto 4321 por defecto
Start-DevServer -Name "Astro Frontend" -Path "f:\Diseño Digital\littlepigman-portafolio" -Command "npm run dev"

# 2. Bridge (Backend API) - Puerto 3001 por defecto
Start-DevServer -Name "Bridge Backend" -Path "f:\Diseño Digital\littlepigman-portafolio\bridge" -Command "npm run dev"

# 3. Admin UI (Dashboard) - Puerto 5173 por defecto
Start-DevServer -Name "Admin UI" -Path "f:\Diseño Digital\littlepigman-portafolio\bridge\admin-ui" -Command "npm run dev"

Write-Host "`n✅ ¡Todo en marcha! Se han abierto 3 pestañas de terminal." -ForegroundColor Green
Write-Host "Frontend: http://localhost:4321"
Write-Host "Admin API: http://localhost:3001"
Write-Host "Dashboard: http://localhost:5173"
