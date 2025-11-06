import { createApp } from '../presentation/app';
import { JsonDrawRepository } from '../infrastructure/repositories/JsonDrawRepository';

async function testApi() {
  console.log('🧪 Testando API localmente...\n');

  const repository = new JsonDrawRepository('./data');
  
  // Verificar quantos sorteios existem
  const count = await repository.count();
  console.log(`📊 Total de sorteios no histórico: ${count}\n`);

  if (count === 0) {
    console.log('⚠️  Nenhum sorteio encontrado. Execute "npm run seed" primeiro.\n');
    return;
  }

  // Importar use cases
  const { GenerateBetSuggestionUseCase } = await import('../application/use-cases/GenerateBetSuggestionUseCase');
  const { StatisticsService } = await import('../application/services/StatisticsService');

  const statisticsService = new StatisticsService();
  const generateBetUseCase = new GenerateBetSuggestionUseCase(repository, statisticsService);

  // Gerar sugestão
  console.log('🎲 Gerando sugestão de aposta...\n');
  const result = await generateBetUseCase.execute();

  console.log('✅ SUGESTÃO GERADA COM SUCESSO!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📝 NÚMEROS SUGERIDOS:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`   ${result.bet.numbers.getNumbers().join(' - ')}\n`);

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 ANÁLISE ESTATÍSTICA:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`   Total de sorteios analisados: ${result.statistics.totalDrawsAnalyzed}`);
  console.log(`   Distribuição: ${result.statistics.balancedSelection}`);
  console.log(`\n   Top 10 números mais frequentes:`);
  console.log(`   ${result.statistics.frequencyBased.join(', ')}`);
  console.log(`\n   Top 10 números mais atrasados:`);
  console.log(`   ${result.statistics.delayedNumbers.join(', ')}\n`);

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('💡 DICA:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('   Esta sugestão foi gerada baseada em análise');
  console.log('   estatística do histórico. A distribuição de');
  console.log('   números foi balanceada para maximizar as chances.\n');
}

testApi().catch(error => {
  console.error('❌ Erro:', error.message);
  process.exit(1);
});
