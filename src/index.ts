import 'reflect-metadata';
import { createApp } from './presentation/app';
import { initializeDatabase } from './infrastructure/database/ormconfig';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  // Initialize database if DATABASE_HOST is configured
  if (process.env.DATABASE_HOST) {
    console.log('🔌 Conectando ao banco de dados MySQL...');
    await initializeDatabase();
  } else {
    console.log('📁 Usando armazenamento em JSON (DATABASE_HOST não configurado)');
  }

  const app = createApp();

  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📊 API disponível em http://localhost:${PORT}/api`);
    console.log(`📖 Documentação Swagger em http://localhost:${PORT}/api-docs`);
    console.log(`\nEndpoints disponíveis:`);
    console.log(`  POST http://localhost:${PORT}/api/draws - Salvar resultado de sorteio`);
    console.log(`  POST http://localhost:${PORT}/api/draws/import - Importar da Caixa`);
    console.log(`  GET  http://localhost:${PORT}/api/suggestions - Obter sugestão de aposta`);
  });
}

bootstrap().catch(error => {
  console.error('❌ Erro ao iniciar aplicação:', error);
  process.exit(1);
});
