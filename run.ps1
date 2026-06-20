# 1. Menentukan lokasi folder tujuan (Downloads/coderly) di dalam folder pengguna
$TargetDir = Join-Path $HOME "Downloads/coderly"

# 2. Membuat folder jika belum ada secara otomatis
if (!(Test-Path -Path $TargetDir)) {
    New-Item -ItemType Directory -Path $TargetDir | Out-Null
    Write-Host "Folder $TargetDir berhasil dibuat." -ForegroundColor Green
}

# 3. Masuk ke folder target
Set-Location -Path $TargetDir

# 4. Mengunduh file dari GitHub
Write-Host "Memulai pengunduhan dari GitHub..." -ForegroundColor Cyan

if (Get-Command git -ErrorAction SilentlyContinue) {
    # Menggunakan Git Clone jika Git terinstal (mengunduh seluruh repositori beserta subfolder)
    if (!(Test-Path -Path (Join-Path $TargetDir ".git"))) {
        git clone https://github.com/Bruhrbx/Coderly.git .
    } else {
        Write-Host "Repositori sudah ada, melakukan penarikan data terbaru (git pull)..."
        git pull
    }
} else {
    # Alternatif jika Git tidak terinstal (mengunduh versi ZIP dan mengekstraknya)
    Write-Host "Git tidak terdeteksi. Mengunduh via ZIP..." -ForegroundColor Yellow
    $ZipFile = Join-Path $env:TEMP "coderly-main.zip"
    Invoke-WebRequest -Uri "https://github.com" -OutFile $ZipFile
    
    # Ekstrak file ZIP langsung ke folder target tanpa membuat subfolder ganda
    Expand-Archive -Path $ZipFile -DestinationPath $env:TEMP -Force
    Copy-Item -Path "$env:TEMP\Coderly-main\*" -Destination $TargetDir -Recurse -Force
    Remove-Item -Path $ZipFile, "$env:TEMP\Coderly-main" -Recurse -Force
}

# 5. Menginstal dependensi Node.js jika diperlukan (opsional, mengantisipasi error module)
if (Test-Path -Path "package.json") {
    Write-Host "Menginstal dependensi Node.js..." -ForegroundColor Cyan
    npm install
}

# 6. Menjalankan Node.js untuk mengeksekusi file coderly.js
if (Test-Path -Path "coderly.js") {
    Write-Host "Menjalankan coderly.js..." -ForegroundColor Green
    node coderly.js
} else {
    Write-Host "Error: File coderly.js tidak ditemukan!" -ForegroundColor Red
}

# 7. Penutup skrip
Read-Host -Prompt "Selesai! Tekan Enter untuk keluar..."
