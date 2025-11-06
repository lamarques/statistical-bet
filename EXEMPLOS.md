# Exemplos de Uso da API

## Iniciar o servidor

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

## Popular com dados de exemplo

```bash
npm run seed
```

## Endpoints

### 1. Health Check

```bash
curl http://localhost:3000/health
```

**Resposta:**
```json
{
  "status": "ok",
  "service": "Lotofácil Bet Generator"
}
```

### 2. Salvar Resultado de Sorteio

**Endpoint:** `POST /api/draws`

```bash
curl -X POST http://localhost:3000/api/draws \
  -H "Content-Type: application/json" \
  -d '{
    "contestNumber": 3158,
    "date": "2024-06-11",
    "numbers": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  }'
```

**Resposta de Sucesso (201):**
```json
{
  "message": "Sorteio salvo com sucesso",
  "data": {
    "id": "draw-3158",
    "contestNumber": 3158,
    "date": "2024-06-11T00:00:00.000Z",
    "numbers": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  }
}
```

**Resposta de Erro - Sorteio Duplicado (409):**
```json
{
  "error": "Sorteio 3158 já está cadastrado"
}
```

**Resposta de Erro - Dados Inválidos (400):**
```json
{
  "error": "Campos obrigatórios: contestNumber, date, numbers"
}
```

### 3. Obter Sugestão de Aposta

**Endpoint:** `GET /api/suggestions`

```bash
curl http://localhost:3000/api/suggestions
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Sugestão de aposta gerada com sucesso",
  "data": {
    "bet": {
      "id": "bet-1730822400000",
      "numbers": [2, 3, 5, 6, 7, 8, 10, 13, 14, 16, 17, 18, 19, 20, 24],
      "generatedAt": "2024-11-05T12:00:00.000Z"
    },
    "analysis": {
      "totalDrawsAnalyzed": 10,
      "frequencyBased": [3, 5, 7, 8, 10, 13, 17, 18, 19, 20],
      "delayedNumbers": [1, 9, 11, 12, 15, 21, 22, 23, 24, 25],
      "balancedSelection": "Pares: 8, Ímpares: 7, Baixos(1-13): 7, Altos(14-25): 8"
    }
  }
}
```

**Resposta de Erro - Sem Histórico (404):**
```json
{
  "error": "Não há histórico de sorteios para gerar sugestões"
}
```

## Exemplos com PowerShell

### Salvar um sorteio
```powershell
$body = @{
    contestNumber = 3158
    date = "2024-06-11"
    numbers = @(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15)
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/draws" -Method POST -Body $body -ContentType "application/json"
```

### Obter sugestão
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/suggestions" -Method GET
```

## Salvar Múltiplos Sorteios

```bash
# Sorteio 1
curl -X POST http://localhost:3000/api/draws \
  -H "Content-Type: application/json" \
  -d '{"contestNumber": 3159, "date": "2024-06-12", "numbers": [2,4,6,8,10,12,14,16,18,20,22,24,1,3,5]}'

# Sorteio 2
curl -X POST http://localhost:3000/api/draws \
  -H "Content-Type: application/json" \
  -d '{"contestNumber": 3160, "date": "2024-06-13", "numbers": [1,3,5,7,9,11,13,15,17,19,21,23,25,2,4]}'

# Sorteio 3
curl -X POST http://localhost:3000/api/draws \
  -H "Content-Type: application/json" \
  -d '{"contestNumber": 3161, "date": "2024-06-14", "numbers": [5,10,15,20,25,1,6,11,16,21,2,7,12,17,22]}'
```

## Interpretação dos Resultados

### Análise Estatística

A API retorna informações valiosas sobre a análise:

- **totalDrawsAnalyzed**: Quantidade de sorteios analisados
- **frequencyBased**: Os 10 números que mais aparecem no histórico
- **delayedNumbers**: Os 10 números mais "atrasados" (que não aparecem há mais tempo)
- **balancedSelection**: Distribuição dos números escolhidos

### Como usar a sugestão

A sugestão gerada já vem com 15 números balanceados estatisticamente. Você pode:

1. Usar os números exatamente como sugeridos
2. Usar como base e fazer pequenos ajustes
3. Gerar múltiplas sugestões e escolher a que mais lhe agrada
4. Analisar os dados estatísticos para criar suas próprias combinações

## Persistência

Todos os sorteios são salvos no arquivo `data/draws.json` e persistem entre reinicializações do servidor.
