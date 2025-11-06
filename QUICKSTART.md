# 🚀 Guia Rápido - Lotofácil Bet Generator

## Começar a Usar em 3 Passos

### 1️⃣ Popular com Dados de Exemplo
```bash
npm run seed
```
Isso criará 10 sorteios de exemplo no arquivo `data/draws.json`.

### 2️⃣ Testar Geração de Apostas (Local)
```bash
npm run test-api
```
Gera uma sugestão de aposta e mostra a análise estatística no terminal.

### 3️⃣ Iniciar API (Servidor Web)
```bash
npm run dev
```
Inicia o servidor na porta 3000. Acesse: http://localhost:3000

---

## 🎯 Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm install` | Instala as dependências |
| `npm run seed` | Popula dados de exemplo |
| `npm run test-api` | Testa geração local de apostas |
| `npm run dev` | Inicia servidor em modo dev |
| `npm run build` | Compila TypeScript para JavaScript |
| `npm start` | Inicia servidor em produção |
| `npm test` | Executa testes unitários |
| `npm run test:coverage` | Gera relatório de cobertura |

---

## 📡 Endpoints da API

### Salvar Sorteio
```bash
POST http://localhost:3000/api/draws
Content-Type: application/json

{
  "contestNumber": 3158,
  "date": "2024-06-11",
  "numbers": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
}
```

### Obter Sugestão
```bash
GET http://localhost:3000/api/suggestions
```

---

## 📊 Entendendo o Algoritmo

O sistema analisa o histórico de sorteios e calcula:

1. **Frequência**: Quantas vezes cada número apareceu
2. **Atraso**: Há quantos sorteios o número não aparece
3. **Score Combinado**: 60% frequência + 40% atraso
4. **Balanceamento**:
   - Proporção pares/ímpares
   - Proporção baixos (1-13) vs altos (14-25)

Os 15 números com melhor score, respeitando o balanceamento estatístico, são selecionados.

---

## 🧪 Exemplo Completo no PowerShell

```powershell
# 1. Salvar um novo sorteio
$body = @{
    contestNumber = 3200
    date = "2024-11-05"
    numbers = @(1,3,5,7,9,11,13,15,17,19,21,23,24,25,2)
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/draws" `
  -Method POST `
  -Body $body `
  -ContentType "application/json"

# 2. Obter sugestão atualizada
Invoke-RestMethod -Uri "http://localhost:3000/api/suggestions" `
  -Method GET
```

---

## 📁 Estrutura do Projeto (DDD)

```
src/
├── domain/              # Regras de negócio
│   ├── entities/       # Draw, Bet
│   ├── value-objects/  # LotofacilNumbers
│   └── repositories/   # Interfaces
├── application/         # Casos de uso
│   ├── use-cases/      # SaveDraw, GenerateBet
│   └── services/       # StatisticsService
├── infrastructure/      # Implementações técnicas
│   └── repositories/   # JsonDrawRepository
└── presentation/        # Camada HTTP
    ├── controllers/    # Controllers
    ├── routes/         # Rotas
    └── app.ts          # Express config
```

---

## 🎲 Exemplo de Resposta da Sugestão

```json
{
  "message": "Sugestão de aposta gerada com sucesso",
  "data": {
    "bet": {
      "numbers": [1,3,4,5,6,7,8,9,10,12,15,19,22,24,25]
    },
    "analysis": {
      "totalDrawsAnalyzed": 10,
      "frequencyBased": [3,4,5,6,8,10,17,2,7,9],
      "delayedNumbers": [1,5,7,9,12,15,19,22,24,25],
      "balancedSelection": "Pares: 7, Ímpares: 8, Baixos(1-13): 10, Altos(14-25): 5"
    }
  }
}
```

---

## ⚠️ Notas Importantes

- ✅ Todos os 23 testes unitários passam
- ✅ Código segue princípios de DDD
- ✅ Análise estatística baseada em frequência e atraso
- ✅ Validação de números (15 únicos, entre 1-25)
- ⚠️ Maior histórico = melhores sugestões
- ⚠️ Loteria é um jogo de sorte, não há garantias

---

## 📚 Documentação Completa

- `README.md` - Visão geral e arquitetura
- `EXEMPLOS.md` - Exemplos detalhados de uso da API
- Este arquivo - Guia de início rápido

---

**Boa sorte! 🍀**
