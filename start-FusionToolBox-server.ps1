$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$baseUrl = 'http://127.0.0.1:8123'

Write-Host "Starting FusionToolBox dev server in $root"
Write-Host "Keep this window open while developing the userscript."
Write-Host "Install loader: $baseUrl/FusionToolBox.loader.user.js"
Write-Host "Debug target: https://www.meiguodizhi.com/"

try {
  node --version | Out-Null
  Set-Location $root
  node .\dev-server.js
} catch {
  Write-Error "Node.js is required for start-FusionToolBox-server.ps1."
}
