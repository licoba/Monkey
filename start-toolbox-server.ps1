$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "Starting toolbox dev server in $root"
Write-Host "Keep this window open while developing the userscript."

try {
  node --version | Out-Null
  Set-Location $root
  node .\dev-server.js
} catch {
  Write-Error "Node.js is required for start-toolbox-server.ps1."
}
