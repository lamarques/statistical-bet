import { LotofacilApiService } from '../infrastructure/services/LotofacilApiService';
import { JsonDrawRepository } from '../infrastructure/repositories/JsonDrawRepository';
import { Draw } from '../domain/entities/Draw';

async function importDraws() {
  console.log('📥 IMPORTADOR DE RESULTADOS DA LOTOFÁCIL\n');
  console.log('🌐 Conectando à API da Caixa Econômica Federal...\n');

  const apiService = new LotofacilApiService();
  const repository = new JsonDrawRepository('./data');

  try {
    // Verificar quantos sorteios já temos
    const existingCount = await repository.count();
    console.log(`📊 Sorteios já cadastrados: ${existingCount}\n`);

    // Buscar último sorteio disponível
    const latest = await apiService.fetchLatestDraw();
    console.log(`🎲 Último sorteio disponível: ${latest.numero}`);
    console.log(`📅 Data: ${latest.dataApuracao}\n`);

    // Perguntar quantos sorteios importar
    const args = process.argv.slice(2);
    let count = 50; // padrão

    if (args.length > 0) {
      const parsed = parseInt(args[0]);
      if (!isNaN(parsed) && parsed > 0) {
        count = parsed;
      }
    }

    console.log(`🔢 Buscando últimos ${count} sorteios...\n`);

    // Buscar os sorteios
    const draws = await apiService.fetchLastNDraws(count);

    console.log(`\n✅ ${draws.length} sorteios obtidos com sucesso!\n`);
    console.log('💾 Salvando no banco de dados...\n');

    let saved = 0;
    let skipped = 0;

    for (const apiDraw of draws) {
      try {
        // Verificar se já existe
        const existing = await repository.findByContestNumber(apiDraw.numero);
        
        if (existing) {
          skipped++;
          continue;
        }

        // Converter strings para números
        const numbers = apiDraw.listaDezenas.map(n => parseInt(n));

        // Converter data do formato DD/MM/YYYY para Date
        const [day, month, year] = apiDraw.dataApuracao.split('/');
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

        // Criar e salvar
        const draw = Draw.create(
          apiDraw.numero,
          date,
          numbers
        );

        await repository.save(draw);
        console.log(`✓ Sorteio ${apiDraw.numero} salvo`);
        saved++;
      } catch (error: any) {
        console.log(`✗ Erro ao salvar sorteio ${apiDraw.numero}: ${error.message}`);
      }
    }

    const finalCount = await repository.count();

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 RESUMO DA IMPORTAÇÃO');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Sorteios obtidos da API: ${draws.length}`);
    console.log(`   Novos sorteios salvos: ${saved}`);
    console.log(`   Já existentes (ignorados): ${skipped}`);
    console.log(`   Total no banco de dados: ${finalCount}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (saved > 0) {
      console.log('✨ Importação concluída com sucesso!');
      console.log('💡 Agora você pode gerar sugestões baseadas em dados reais.\n');
    } else {
      console.log('ℹ️  Nenhum sorteio novo foi adicionado.\n');
    }

  } catch (error: any) {
    console.error('\n❌ ERRO:', error.message);
    process.exit(1);
  }
}

// Executar
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('  IMPORTADOR AUTOMÁTICO DE RESULTADOS');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('Uso: npm run import-draws [quantidade]\n');
  console.log('Exemplos:');
  console.log('  npm run import-draws           # Importa últimos 50 sorteios');
  console.log('  npm run import-draws 100       # Importa últimos 100 sorteios');
  console.log('  npm run import-draws 500       # Importa últimos 500 sorteios\n');
  process.exit(0);
}

importDraws().catch(error => {
  console.error('❌ Erro fatal:', error.message);
  process.exit(1);
});
