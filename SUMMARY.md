# 📊 Sistema Gerador de Apostas - Lotofácil

## ✅ Status do Projeto: COMPLETO

### 🎯 Implementado com Sucesso

#### 1. Arquitetura DDD (Domain-Driven Design)
- ✅ **Domain Layer**: Entidades, Value Objects e Repository Interfaces
- ✅ **Application Layer**: Use Cases e Services
- ✅ **Infrastructure Layer**: Implementação JSON Repository
- ✅ **Presentation Layer**: Controllers, Routes e Express App

#### 2. Análise Estatística Avançada
- ✅ Cálculo de frequência de números (1-25)
- ✅ Identificação de números atrasados
- ✅ Análise de proporção par/ímpar
- ✅ Análise de proporção baixo (1-13) vs alto (14-25)
- ✅ Análise de pares de números frequentes
- ✅ Score combinado: 60% frequência + 40% atraso

#### 3. API REST Completa
- ✅ `POST /api/draws` - Salvar histórico de sorteio
- ✅ `GET /api/suggestions` - Gerar sugestão de aposta
- ✅ `GET /health` - Health check
- ✅ Validações robustas de entrada
- ✅ Tratamento de erros apropriado

#### 4. Testes Unitários (23 testes - 100% Pass)
- ✅ LotofacilNumbers (7 testes)
- ✅ StatisticsService (6 testes)
- ✅ SaveDrawHistoryUseCase (3 testes)
- ✅ GenerateBetSuggestionUseCase (7 testes)

#### 5. Scripts Utilitários
- ✅ `npm run seed` - Popular dados de exemplo
- ✅ `npm run test-api` - Teste local de geração
- ✅ `npm run dev` - Servidor desenvolvimento
- ✅ `npm run build` - Compilação TypeScript
- ✅ `npm test` - Suite de testes

---

## 📁 Estrutura Completa

```
apostas/
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── Bet.ts
│   │   │   └── Draw.ts
│   │   ├── value-objects/
│   │   │   ├── LotofacilNumbers.ts
│   │   │   └── LotofacilNumbers.spec.ts
│   │   └── repositories/
│   │       └── DrawRepository.ts
│   ├── application/
│   │   ├── services/
│   │   │   ├── StatisticsService.ts
│   │   │   └── StatisticsService.spec.ts
│   │   └── use-cases/
│   │       ├── GenerateBetSuggestionUseCase.ts
│   │       ├── GenerateBetSuggestionUseCase.spec.ts
│   │       ├── SaveDrawHistoryUseCase.ts
│   │       └── SaveDrawHistoryUseCase.spec.ts
│   ├── infrastructure/
│   │   └── repositories/
│   │       └── JsonDrawRepository.ts
│   ├── presentation/
│   │   ├── controllers/
│   │   │   ├── GetBetSuggestionController.ts
│   │   │   └── SaveDrawController.ts
│   │   ├── routes/
│   │   │   └── index.ts
│   │   └── app.ts
│   ├── scripts/
│   │   ├── seed.ts
│   │   └── test-api.ts
│   └── index.ts
├── data/
│   ├── draws.json (gerado)
│   └── draws-example.json
├── dist/ (gerado após build)
├── coverage/ (gerado após test:coverage)
├── node_modules/
├── package.json
├── tsconfig.json
├── jest.config.js
├── .gitignore
├── README.md
├── EXEMPLOS.md
└── QUICKSTART.md
```

---

## 🔧 Tecnologias Utilizadas

- **Runtime**: Node.js 20+
- **Linguagem**: TypeScript 5.3
- **Framework Web**: Express 4.18
- **Testes**: Jest 29.7
- **Padrão**: Domain-Driven Design (DDD)
- **Persistência**: JSON File System

---

## 📊 Algoritmo de Geração

### Input
- Histórico de sorteios salvos em `data/draws.json`

### Processamento
1. **Análise Estatística**:
   - Frequência de cada número (1-25)
   - Última ocorrência de cada número
   - Proporções históricas (par/ímpar, baixo/alto)

2. **Cálculo de Score**:
   ```
   Score(n) = (Freq(n) / MaxFreq) × 0.6 + (Delay(n) / MaxDelay) × 0.4
   ```

3. **Seleção Balanceada**:
   - Ordenar números por score
   - Selecionar 15 números mantendo proporções
   - Evitar desbalanceamento extremo

### Output
- 15 números ordenados (1-25)
- Análise estatística detalhada
- Métricas de balanceamento

---

## 🧪 Validações Implementadas

### Value Object: LotofacilNumbers
- ✅ Exatamente 15 números
- ✅ Números únicos (sem duplicatas)
- ✅ Intervalo válido (1-25)
- ✅ Auto-ordenação

### Use Case: SaveDrawHistory
- ✅ Campos obrigatórios
- ✅ Formato de data válido
- ✅ Validação através de LotofacilNumbers
- ✅ Prevenção de duplicatas (mesmo contestNumber)

### Use Case: GenerateBetSuggestion
- ✅ Verificação de histórico disponível
- ✅ Números únicos na sugestão
- ✅ Balanceamento estatístico
- ✅ Ordenação automática

---

## 📈 Cobertura de Testes

Execute para ver a cobertura:
```bash
npm run test:coverage
```

Áreas cobertas:
- ✅ Camada de Domínio (entities, value objects)
- ✅ Camada de Aplicação (use cases, services)
- ✅ Validações de regras de negócio
- ✅ Cálculos estatísticos
- ✅ Tratamento de erros

---

## 🚀 Como Usar

### Setup Inicial
```bash
npm install
npm run seed
```

### Desenvolvimento
```bash
npm run dev
# Servidor em http://localhost:3000
```

### Teste Local (sem API)
```bash
npm run test-api
# Gera sugestão no terminal
```

### Testes Unitários
```bash
npm test
# 23/23 testes passando
```

---

## 📝 Exemplos de Uso

### Salvar Sorteio (curl)
```bash
curl -X POST http://localhost:3000/api/draws \
  -H "Content-Type: application/json" \
  -d '{
    "contestNumber": 3200,
    "date": "2024-11-05",
    "numbers": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
  }'
```

### Obter Sugestão (PowerShell)
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/suggestions" -Method GET
```

---

## 🎓 Conceitos DDD Aplicados

1. **Entities**: `Draw`, `Bet` - Objetos com identidade
2. **Value Objects**: `LotofacilNumbers` - Objetos imutáveis
3. **Repositories**: Abstração de persistência
4. **Use Cases**: Orquestração de lógica de negócio
5. **Services**: Lógica de domínio complexa
6. **Separation of Concerns**: Camadas bem definidas

---

## ⚠️ Considerações Importantes

1. **Não é garantia de ganho**: Loteria é sorte, estatística apenas orienta
2. **Mais dados = melhores insights**: Recomenda-se 50+ sorteios no histórico
3. **Atualização constante**: Adicione novos sorteios regularmente
4. **Balanceamento**: O algoritmo busca equilíbrio estatístico
5. **Variabilidade**: Cada execução pode gerar números diferentes

---

## 🔐 Boas Práticas Implementadas

- ✅ TypeScript strict mode
- ✅ Separação de camadas (DDD)
- ✅ Dependency Injection
- ✅ Interface Segregation
- ✅ Single Responsibility Principle
- ✅ Testes unitários abrangentes
- ✅ Validação de dados robusta
- ✅ Tratamento de erros apropriado
- ✅ Código limpo e documentado

---

## 📞 Suporte

Para dúvidas ou problemas:
- Consulte `README.md` para visão geral
- Consulte `EXEMPLOS.md` para uso da API
- Consulte `QUICKSTART.md` para início rápido

---

**Desenvolvido com DDD e TypeScript** 🚀
**23 testes unitários passando** ✅
**Análise estatística avançada** 📊
