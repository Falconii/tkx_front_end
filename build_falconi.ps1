Write-Host "=== BUILD FALCONI - INICIANDO ===" -ForegroundColor Cyan

# Caminhos
$destino = "C://Repositorios//Marcos//tkx_aplicativo//docs"
$buildBrowser = "docs/browser"

Write-Host "1) Gerando build Angular..." -ForegroundColor Yellow
ng build --base-href /tkx_aplicativo/

if (!(Test-Path $buildBrowser)) {
    Write-Host "ERRO: Pasta docs/browser não encontrada. Build falhou." -ForegroundColor Red
    exit 1
}

Write-Host "2) Criando 404.html..." -ForegroundColor Yellow
Copy-Item "$buildBrowser/index.html" "$buildBrowser/404.html" -Force

Write-Host "3) Executando backup da versão atual..." -ForegroundColor Yellow
node backup_doc.js

Write-Host "4) Limpando pasta de destino..." -ForegroundColor Yellow
if (Test-Path $destino) {
    Remove-Item "$destino/*" -Recurse -Force
} else {
    New-Item -ItemType Directory -Path $destino | Out-Null
}

Write-Host "5) Copiando arquivos do build para a pasta docs final..." -ForegroundColor Yellow
Copy-Item "$buildBrowser/*" $destino -Recurse -Force

Write-Host "=== BUILD FALCONI FINALIZADO COM SUCESSO ===" -ForegroundColor Green
