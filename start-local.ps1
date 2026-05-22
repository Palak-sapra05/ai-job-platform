# AI Job Platform Local Runner

# Helper function to free ports to avoid EADDRINUSE errors
function Free-Port($port) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connections) {
        foreach ($conn in $connections) {
            $pidToKill = $conn.OwningProcess
            if ($pidToKill -gt 0) {
                Write-Host "Stopping process $pidToKill using port $port..." -ForegroundColor Yellow
                Stop-Process -Id $pidToKill -Force -ErrorAction SilentlyContinue
            }
        }
    }
}

Write-Host "Cleaning up ports..." -ForegroundColor Cyan
$portsToFree = @(3000, 3001, 3002, 3003, 8000, 8080)
foreach ($port in $portsToFree) {
    Free-Port $port
}

# Create logs directory
New-Item -ItemType Directory -Force -Path "logs" | Out-Null

# Configure environment variables
$env:DB_HOST = "localhost"
$env:DB_USER = "root"
$env:DB_PASSWORD = ""
$env:PORT = "" # Clear global port to let services use their defaults

# Load GEMINI_API_KEY from .env if present
if (Test-Path ".env") {
    Get-Content ".env" | Foreach-Object {
        if ($_ -match "^\s*GEMINI_API_KEY\s*=\s*(.*)") {
            $env:GEMINI_API_KEY = $Matches[1].Trim()
            Write-Host "Loaded GEMINI_API_KEY from .env" -ForegroundColor Green
        }
    }
}

# Start backend services
Write-Host "Starting backend services..." -ForegroundColor Cyan

Write-Host "-> Starting auth-service (port 3001)..."
Start-Process node -ArgumentList "index.js" -WorkingDirectory "auth-service" -RedirectStandardOutput "logs/auth-out.log" -RedirectStandardError "logs/auth-err.log" -NoNewWindow

Write-Host "-> Starting profile-service (port 3002)..."
Start-Process node -ArgumentList "index.js" -WorkingDirectory "profile-service" -RedirectStandardOutput "logs/profile-out.log" -RedirectStandardError "logs/profile-err.log" -NoNewWindow

Write-Host "-> Starting notification-service (port 3003)..."
Start-Process node -ArgumentList "index.js" -WorkingDirectory "notification-service" -RedirectStandardOutput "logs/notification-out.log" -RedirectStandardError "logs/notification-err.log" -NoNewWindow

Write-Host "-> Starting recommendation-service (port 8000)..."
Start-Process node -ArgumentList "index.js" -WorkingDirectory "recommendation-service" -RedirectStandardOutput "logs/recommendation-out.log" -RedirectStandardError "logs/recommendation-err.log" -NoNewWindow

Write-Host "-> Starting api-gateway (port 8080)..."
Start-Process node -ArgumentList "index.js" -WorkingDirectory "api-gateway" -RedirectStandardOutput "logs/gateway-out.log" -RedirectStandardError "logs/gateway-err.log" -NoNewWindow

# Start frontend
Write-Host "-> Starting frontend (port 3000)..."
Start-Process npm.cmd -ArgumentList "run dev -- --port 3000" -WorkingDirectory "frontend" -RedirectStandardOutput "logs/frontend-out.log" -RedirectStandardError "logs/frontend-err.log" -NoNewWindow

Write-Host "Waiting 5 seconds for services to initialize..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

Write-Host "`nVerifying service statuses:" -ForegroundColor Cyan

$services = @(
    @{ Name = "Auth Service"; Url = "http://localhost:3001/health" },
    @{ Name = "Profile Service"; Url = "http://localhost:3002/health" },
    @{ Name = "Notification Service"; Url = "http://localhost:3003/health" },
    @{ Name = "Recommendation Service"; Url = "http://localhost:8000/health" },
    @{ Name = "API Gateway (Proxied)"; Url = "http://localhost:8080/auth/health" }
)

foreach ($svc in $services) {
    try {
        $resp = Invoke-RestMethod -Uri $svc.Url -Method Get -TimeoutSec 3
        # If response is an object, convert it to JSON string for readable logging
        if ($resp -is [System.Management.Automation.PSCustomObject] -or $resp -is [Hashtable]) {
            $respStr = ConvertTo-Json -InputObject $resp -Compress
        } else {
            $respStr = $resp.ToString().Trim()
        }
        Write-Host "  [OK]  $($svc.Name): $respStr" -ForegroundColor Green
    } catch {
        Write-Host "  [ERR] $($svc.Name): Failed to connect! (Check logs)" -ForegroundColor Red
    }
}

Write-Host "`nApplication is running!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "API Gateway: http://localhost:8080" -ForegroundColor Green
Write-Host "Check output logs in the 'logs/' folder if anything fails." -ForegroundColor Gray

Write-Host "`nKeeping services alive. Do not stop this task to keep the application running." -ForegroundColor Yellow
while ($true) {
    Start-Sleep -Seconds 10
}
