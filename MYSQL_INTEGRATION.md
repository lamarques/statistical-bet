# 🗄️ MySQL Integration Summary

## O Que Foi Implementado

Esta implementação adiciona suporte completo a banco de dados MySQL usando TypeORM, mantendo compatibilidade com armazenamento JSON.

### Arquivos Criados

#### 1. **docker-compose.yml**
- Container MySQL 8.0 com credenciais configuradas
- Container da aplicação com dependência do MySQL
- Network bridge para comunicação entre containers
- Volume persistente para dados do MySQL
- Health checks para garantir inicialização correta

#### 2. **src/infrastructure/database/ormconfig.ts**
- Configuração do DataSource do TypeORM
- Suporte a variáveis de ambiente
- Auto-sincronização em desenvolvimento
- Funções `initializeDatabase()` e `closeDatabase()`

#### 3. **src/infrastructure/database/entities/DrawEntity.ts**
- Entity TypeORM mapeando tabela `draws`
- Colunas: contestNumber (PK), drawDate, numbers, createdAt
- Índices em contestNumber (unique) e drawDate
- Métodos `toDomain()` e `fromDomain()` para conversão

#### 4. **src/infrastructure/repositories/MySQLDrawRepository.ts**
- Implementação completa da interface `DrawRepository`
- Métodos: save, findAll, findByContestNumber, findLatest, count, saveMany, deleteAll
- Conversão automática entre entidades de domínio e banco

#### 5. **src/infrastructure/repositories/DrawRepositoryFactory.ts**
- Factory pattern para escolher repositório correto
- Usa MySQL se `DATABASE_HOST` estiver configurado
- Fallback para JSON caso contrário
- Singleton para evitar múltiplas instâncias

#### 6. **src/infrastructure/database/migrations/1699999999999-CreateDrawsTable.ts**
- Migration inicial para criar tabela `draws`
- Índice único em `contestNumber`
- Índice regular em `drawDate` para queries por data
- Suporte a rollback com método `down()`

#### 7. **.env.example**
- Template de configuração com variáveis de ambiente
- Seções para desenvolvimento local e produção
- Documentação inline dos valores

### Arquivos Modificados

#### 1. **package.json**
- Adicionadas dependências: `typeorm`, `mysql2`, `reflect-metadata`
- Novos scripts: `typeorm`, `migration:run`, `migration:revert`

#### 2. **src/index.ts**
- Import de `reflect-metadata` no início
- Função `bootstrap()` assíncrona
- Inicialização condicional do banco de dados
- Mensagens de log indicando tipo de storage usado

#### 3. **src/presentation/routes/index.ts**
- Substituído `JsonDrawRepository` por `DrawRepositoryFactory`
- Seleção automática do repositório correto

#### 4. **README.md**
- Seção expandida de instalação
- Instruções para Docker Compose
- Documentação de variáveis de ambiente
- Comandos TypeORM

#### 5. **QUICKSTART.md**
- Reformulado para incluir opções MySQL e JSON
- Instruções de Docker Compose
- Comandos para gerenciar containers

## Como Funciona

### Detecção Automática de Storage

```typescript
// A aplicação detecta automaticamente qual repositório usar:
if (process.env.DATABASE_HOST) {
  // Usa MySQLDrawRepository
} else {
  // Usa JsonDrawRepository
}
```

### Fluxo de Inicialização

1. **Aplicação inicia** → `src/index.ts`
2. **Verifica `DATABASE_HOST`** → Se configurado, conecta ao MySQL
3. **Factory cria repositório** → `DrawRepositoryFactory.getRepository()`
4. **TypeORM sincroniza schema** → Em desenvolvimento (synchronize: true)
5. **Aplicação pronta** → Endpoints funcionam normalmente

### Conversão de Dados

```
Domain Entity (Draw)
         ↕
DrawEntity (TypeORM)
         ↕
MySQL Table (draws)
```

## Comandos Essenciais

### Docker Compose

```bash
# Iniciar tudo
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Parar
docker-compose stop

# Limpar tudo
docker-compose down -v
```

### TypeORM Migrations

```bash
# Executar migrations
npm run migration:run

# Reverter última migration
npm run migration:revert
```

### Desenvolvimento

```bash
# Com Docker (MySQL)
docker-compose up -d

# Sem Docker (JSON)
npm run dev
```

## Variáveis de Ambiente

| Variável | Desenvolvimento | Produção |
|----------|----------------|----------|
| `NODE_ENV` | development | production |
| `PORT` | 3000 | 3000 |
| `DATABASE_HOST` | localhost ou mysql | seu-mysql-remoto.com |
| `DATABASE_PORT` | 3306 | 3306 |
| `DATABASE_NAME` | lotofacil | lotofacil_prod |
| `DATABASE_USER` | lotofacil | usuario_prod |
| `DATABASE_PASSWORD` | lotofacil123 | senha_segura |

## Vantagens da Implementação

### ✅ Flexibilidade
- Suporta JSON (simples) e MySQL (robusto)
- Troca automática baseada em configuração
- Sem mudanças no código de negócio

### ✅ Desenvolvimento Local
- Docker Compose facilita setup
- Ambiente consistente entre desenvolvedores
- Volumes isolados (limpa com `-v`)

### ✅ Produção
- MySQL remoto (PlanetScale, AWS RDS, etc)
- Sem necessidade de volumes no Fly.io
- Escalabilidade e backup profissional

### ✅ TypeORM Features
- Migrations versionadas
- Auto-sincronização em dev
- Type safety completa
- Queries otimizadas com índices

### ✅ DDD Preservado
- Repository pattern mantido
- Lógica de domínio intacta
- Infraestrutura isolada
- Fácil adicionar novos repositórios

## Próximos Passos Sugeridos

1. **Testar localmente**:
   ```bash
   docker-compose up -d
   docker-compose exec app npm run import-draws 100
   curl http://localhost:3000/api/suggestions
   ```

2. **Configurar MySQL remoto para produção**:
   - Criar instância no PlanetScale/AWS/Digital Ocean
   - Configurar variáveis de ambiente no Fly.io
   - Deploy: `fly deploy`

3. **Adicionar features**:
   - Consulta por range de datas
   - Estatísticas agregadas
   - Cache de queries frequentes
   - Exportação para CSV/Excel

4. **Otimizações**:
   - Connection pooling
   - Query caching
   - Índices adicionais para queries específicas
   - Backup automático

## Troubleshooting

### Porta 3306 ocupada

```bash
# Mudar porta no docker-compose.yml:
ports:
  - "3307:3306"

# E atualizar .env:
DATABASE_PORT=3307
```

### Migrations não rodam

```bash
# Build primeiro
npm run build

# Depois executar
npm run migration:run
```

### Container não conecta

```bash
# Ver logs detalhados
docker-compose logs mysql
docker-compose logs app

# Verificar health check
docker-compose ps
```

### Reset completo

```bash
docker-compose down -v
rm -rf node_modules package-lock.json
npm install
docker-compose up -d --build
```

## Estrutura Final

```
apostas/
├── docker-compose.yml          # Novo
├── .env.example               # Novo
├── src/
│   ├── infrastructure/
│   │   ├── database/
│   │   │   ├── ormconfig.ts          # Novo
│   │   │   ├── entities/
│   │   │   │   └── DrawEntity.ts     # Novo
│   │   │   └── migrations/
│   │   │       └── 1699999999999-CreateDrawsTable.ts  # Novo
│   │   └── repositories/
│   │       ├── DrawRepositoryFactory.ts    # Modificado
│   │       ├── JsonDrawRepository.ts       # Existente
│   │       └── MySQLDrawRepository.ts      # Novo
│   └── index.ts                            # Modificado
└── README.md                                # Atualizado
```

## Conclusão

A implementação está completa e pronta para uso! 🎉

- ✅ MySQL integrado via TypeORM
- ✅ Docker Compose configurado
- ✅ Compatibilidade com JSON mantida
- ✅ Migrations versionadas
- ✅ Factory pattern para repositórios
- ✅ Documentação atualizada

Para começar: `docker-compose up -d` 🚀
