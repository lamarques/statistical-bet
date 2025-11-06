# Lotofácil Bet Generator 🎲

Sistema gerador de apostas para Lotofácil baseado em análise estatística de resultados históricos.

## 🏗️ Arquitetura

O projeto foi desenvolvido seguindo os princípios de **Domain-Driven Design (DDD)**:

```
src/
├── domain/                 # Camada de domínio
│   ├── entities/          # Entidades (Draw, Bet)
│   ├── value-objects/     # Value Objects (LotofacilNumbers)
│   └── repositories/      # Interfaces de repositórios
├── application/           # Camada de aplicação
│   ├── use-cases/        # Casos de uso
│   └── services/         # Serviços de domínio
├── infrastructure/        # Camada de infraestrutura
│   └── repositories/     # Implementações de repositórios
└── presentation/          # Camada de apresentação
    ├── controllers/      # Controllers HTTP
    ├── routes/          # Rotas da API
    └── app.ts           # Configuração Express
```

## 🚀 Funcionalidades

### Análise Estatística
- Cálculo de frequência de números
- Identificação de números atrasados
- Análise de proporção par/ímpar
- Análise de proporção baixo/alto (1-13 vs 14-25)
- Análise de pares de números frequentes

### Endpoints

#### POST /api/draws
Salva um resultado de sorteio no histórico.

**Request:**
```json
{
  "contestNumber": 3000,
  "date": "2024-01-01",
  "numbers": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
}
```

**Response:**
```json
{
  "message": "Sorteio salvo com sucesso",
  "data": {
    "id": "draw-3000",
    "contestNumber": 3000,
    "date": "2024-01-01T00:00:00.000Z",
    "numbers": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  }
}
```

#### GET /api/suggestions
Gera uma sugestão de aposta baseada em análise estatística.

**Response:**
```json
{
  "message": "Sugestão de aposta gerada com sucesso",
  "data": {
    "bet": {
      "id": "bet-1234567890",
      "numbers": [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 20, 21, 22, 23, 24],
      "generatedAt": "2024-01-01T12:00:00.000Z"
    },
    "analysis": {
      "totalDrawsAnalyzed": 100,
      "frequencyBased": [3, 5, 7, 9, 11, 13, 15, 17, 19, 21],
      "delayedNumbers": [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
      "balancedSelection": "Pares: 7, Ímpares: 8, Baixos(1-13): 7, Altos(14-25): 8"
    }
  }
}
```

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Compilar TypeScript
npm run build

# Executar em modo desenvolvimento
npm run dev

# Executar em produção
npm start

# Executar testes
npm test

# Executar testes em watch mode
npm run test:watch

# Gerar coverage
npm run test:coverage
```

## 🧪 Testes

O projeto inclui testes unitários completos para:
- Value Objects (LotofacilNumbers)
- Serviços (StatisticsService)
- Use Cases (SaveDrawHistoryUseCase, GenerateBetSuggestionUseCase)

Execute os testes com:
```bash
npm test
```

## 📊 Estratégia de Geração de Apostas

A sugestão de apostas é gerada através de um algoritmo que:

1. **Analisa o histórico completo** de sorteios salvos
2. **Calcula scores** para cada número baseado em:
   - Frequência de aparição (peso 60%)
   - Tempo desde última aparição (peso 40%)
3. **Mantém balanço estatístico**:
   - Proporção de números pares/ímpares
   - Proporção de números baixos (1-13) vs altos (14-25)
4. **Seleciona os 15 melhores números** respeitando os balanços

## 🔧 Tecnologias

- **Node.js** + **TypeScript**
- **Express** - Framework web
- **Jest** - Framework de testes
- **DDD** - Domain-Driven Design

## 📝 Exemplo de Uso

```bash
# 1. Iniciar o servidor
npm run dev

# 2. Adicionar sorteios ao histórico
curl -X POST http://localhost:3000/api/draws \
  -H "Content-Type: application/json" \
  -d '{
    "contestNumber": 3000,
    "date": "2024-01-01",
    "numbers": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
  }'

# 3. Obter sugestão de aposta
curl http://localhost:3000/api/suggestions
```

## 📄 Licença

ISC

## 👤 Autor

Rogerio Lamarques <rogerio.lamarques@gmail.com>
