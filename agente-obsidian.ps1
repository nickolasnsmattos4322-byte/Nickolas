$GROQ_API_KEY = "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"
$OBSIDIAN_PASTA = "$env:USERPROFILE\Documents\colorir-e-aprender-vault"
$PROJETO_PASTA = "$env:USERPROFILE\v0-colorir-e-aprender"
$ARQUIVO_TAREFAS = "$OBSIDIAN_PASTA\tarefas-pendentes.md"
$GITHUB_TOKEN = "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"
$GITHUB_REPO = "nickolasnsmattos4322-byte/Nickolas"
Write-Host "Agente iniciado!" -ForegroundColor Green
while ($true) {
    if (Test-Path $ARQUIVO_TAREFAS) {
        $conteudo = Get-Content $ARQUIVO_TAREFAS -Raw -Encoding UTF8
        if ($conteudo -and $conteudo.Trim() -ne "") {
            Write-Host "Tarefa encontrada!" -ForegroundColor Yellow
            $headerPath = "$PROJETO_PASTA\components\app\header.tsx"
            $headerConteudo = Get-Content $headerPath -Raw -Encoding UTF8
            $tarefaLimpa = $conteudo.Trim() -replace [char]13, "" -replace [char]10, " " -replace [char]34, [char]39
            $headerLimpo = $headerConteudo -replace [char]13, "" -replace [char]10, " " -replace [char]34, [char]39
            $promptTexto = "Desenvolvedor Next.js: modifique header.tsx para: $tarefaLimpa . Codigo atual: $headerLimpo . Responda APENAS: ARQUIVO: /components/app/header.tsx CODIGO: (codigo completo) FIM"
            $bodyObj = @{model="llama-3.3-70b-versatile";messages=@(@{role="user";content=$promptTexto});max_tokens=4000}
            $bodyJson = $bodyObj | ConvertTo-Json -Depth 10 -Compress
            try {
                $h = @{"Authorization"="Bearer $GROQ_API_KEY";"Content-Type"="application/json"}
                $r = Invoke-RestMethod -Uri "https://api.groq.com/openai/v1/chat/completions" -Method POST -Headers $h -Body $bodyJson
                $resultado = $r.choices[0].message.content
                Write-Host $resultado -ForegroundColor White
                $aprovacao = Read-Host "Aplicar? (S/N)"
                if ($aprovacao -eq "S" -or $aprovacao -eq "s") {
                    $blocos = $resultado -split "ARQUIVO:"
                    foreach ($bloco in $blocos) {
                        if ($bloco.Trim() -eq "") { continue }
                        $linhas = $bloco -split "CODIGO:"
                        if ($linhas.Count -lt 2) { continue }
                        $caminho = $linhas[0].Trim()
                        $codigo = ($linhas[1] -split "FIM")[0].Trim()
                        $destino = "$PROJETO_PASTA$caminho"
                        [System.IO.File]::WriteAllText($destino, $codigo, [System.Text.Encoding]::UTF8)
                        Write-Host "Salvo: $caminho" -ForegroundColor Green
                    }
                    Set-Location $PROJETO_PASTA
                    git add .
                    git commit -m "Agente: $tarefaLimpa"
                    git push "https://$GITHUB_TOKEN@github.com/$GITHUB_REPO.git"
                    Write-Host "Publicado!" -ForegroundColor Green
                }
            } catch { Write-Host "Erro: $_" -ForegroundColor Red; Start-Sleep -Seconds 60; continue }
            Clear-Content $ARQUIVO_TAREFAS
        }
    }
    Start-Sleep -Seconds 30
}