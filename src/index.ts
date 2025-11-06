import { createApp } from './presentation/app';

const PORT = process.env.PORT || 3000;

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
