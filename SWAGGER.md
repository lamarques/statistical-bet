# 📖 Documentação Swagger/OpenAPI

A API do **Lotofácil Bet Generator** possui documentação completa usando Swagger/OpenAPI 3.0.

## 🔗 Acessar a Documentação

Após iniciar o servidor com `npm run dev`, acesse:

**http://localhost:3000/api-docs**

## 🎯 Recursos da Documentação Interativa

### 1. Interface Swagger UI
- Navegação visual por todos os endpoints
- Schemas de dados detalhados
- Exemplos de requisições e respostas
- Descrições completas de cada campo

### 2. Teste Direto na Interface
Você pode testar todos os endpoints diretamente no Swagger:

1. Clique em um endpoint (ex: `POST /api/draws`)
2. Clique em "Try it out"
3. Edite o JSON de exemplo
4. Clique em "Execute"
5. Veja a resposta em tempo real

### 3. Tags Organizadas

A documentação está organizada em 3 categorias:

#### 🎲 Sorteios
- `POST /api/draws` - Salvar resultado de sorteio no histórico

#### 🎯 Apostas
- `GET /api/suggestions` - Gerar sugestão de aposta baseada em estatística

#### 🔧 Sistema
- `GET /health` - Verificar status da API

## 📝 Exemplos no Swagger

### Salvar Sorteio

O Swagger mostra automaticamente um exemplo completo:

```json
{
  "contestNumber": 3200,
  "date": "2024-11-05",
  "numbers": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
}
```

**Validações documentadas**:
- `contestNumber`: número inteiro obrigatório
- `date`: string no formato YYYY-MM-DD
- `numbers`: array com exatamente 15 números únicos entre 1 e 25

### Obter Sugestão

Sem parâmetros necessários, apenas execute o endpoint.

**Retorna**:
- 15 números sugeridos (ordenados)
- Análise estatística completa
- Informações sobre balanceamento

## 🔍 Schemas Detalhados

O Swagger documenta todos os tipos de dados:

### DrawInput
```typescript
{
  contestNumber: integer (required)
  date: string (format: date, required)
  numbers: array[integer] (15 items, 1-25, required)
}
```

### BetSuggestion
```typescript
{
  bet: {
    id: string
    numbers: array[integer] (15 items, sorted)
    generatedAt: string (format: date-time)
  }
  analysis: {
    totalDrawsAnalyzed: integer
    frequencyBased: array[integer] (10 items)
    delayedNumbers: array[integer] (10 items)
    balancedSelection: string
  }
}
```

## 🎨 Personalização

A interface Swagger foi personalizada:
- ✅ Topbar do Swagger UI removida
- ✅ Título personalizado: "Lotofácil API Docs"
- ✅ Descrição detalhada da API
- ✅ Informações de contato e licença
- ✅ Tags organizadas por funcionalidade

## 🔄 Códigos de Status HTTP

Todos os códigos de resposta estão documentados:

### Sucesso
- `200 OK` - Requisição bem-sucedida
- `201 Created` - Recurso criado com sucesso

### Erros do Cliente
- `400 Bad Request` - Dados inválidos
- `404 Not Found` - Recurso não encontrado
- `409 Conflict` - Conflito (ex: sorteio duplicado)

### Erros do Servidor
- `500 Internal Server Error` - Erro interno

## 💡 Dicas de Uso

### 1. Exploração Rápida
Use a interface Swagger para:
- Entender rapidamente a estrutura da API
- Ver exemplos práticos de uso
- Testar sem precisar de ferramentas externas

### 2. Testes Manuais
Perfeito para:
- Validar comportamento da API
- Testar casos extremos
- Verificar mensagens de erro

### 3. Documentação para Equipe
Compartilhe a URL do Swagger com:
- Desenvolvedores front-end
- Testadores QA
- Documentadores técnicos

## 🚀 Exportar Especificação OpenAPI

A especificação OpenAPI 3.0 pode ser acessada em:

**http://localhost:3000/api-docs/swagger.json**

Use essa URL para:
- Gerar clientes automaticamente (codegen)
- Importar em ferramentas como Postman
- Integrar com outras ferramentas de API

## 📚 Mais Informações

Para documentação adicional, consulte:
- `README.md` - Visão geral da arquitetura
- `EXEMPLOS.md` - Exemplos com curl e PowerShell
- `QUICKSTART.md` - Guia rápido de início

---

**A documentação Swagger é atualizada automaticamente** quando você modifica os comentários JSDoc nos arquivos de rotas! 🎉
