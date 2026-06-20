# Mengambil lokasi folder tempat skrip ini dijalankan
$PSScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location -Path $PSScriptRoot

# Menjalankan Node.js
node coderly.js

Read-Host -Prompt "Selesai! Tekan Enter untuk keluar..."
