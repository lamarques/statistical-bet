import { JsonDrawRepository } from '../infrastructure/repositories/JsonDrawRepository';
import { Draw } from '../domain/entities/Draw';

async function seedData() {
  console.log('🌱 Populando banco de dados com dados de exemplo...\n');

  const repository = new JsonDrawRepository('./data');

  // Dados de exemplo baseados em padrões reais da Lotofácil
  const sampleDraws = [
    { contestNumber: 3148, date: '2024-06-01', numbers: [1, 3, 4, 5, 7, 8, 10, 12, 13, 14, 17, 18, 20, 22, 25] },
    { contestNumber: 3149, date: '2024-06-02', numbers: [2, 3, 5, 6, 8, 9, 11, 13, 15, 16, 18, 19, 21, 23, 24] },
    { contestNumber: 3150, date: '2024-06-03', numbers: [1, 2, 4, 6, 7, 9, 10, 12, 14, 16, 17, 19, 20, 22, 25] },
    { contestNumber: 3151, date: '2024-06-04', numbers: [3, 4, 5, 7, 8, 10, 11, 13, 15, 17, 18, 20, 21, 23, 24] },
    { contestNumber: 3152, date: '2024-06-05', numbers: [1, 2, 3, 5, 6, 8, 9, 11, 12, 14, 16, 19, 22, 24, 25] },
    { contestNumber: 3153, date: '2024-06-06', numbers: [4, 5, 6, 7, 9, 10, 11, 13, 14, 16, 17, 19, 21, 23, 25] },
    { contestNumber: 3154, date: '2024-06-07', numbers: [1, 2, 3, 4, 6, 8, 10, 12, 15, 17, 18, 20, 22, 24, 25] },
    { contestNumber: 3155, date: '2024-06-08', numbers: [2, 3, 5, 7, 8, 9, 11, 13, 14, 16, 18, 19, 21, 23, 24] },
    { contestNumber: 3156, date: '2024-06-09', numbers: [1, 4, 5, 6, 7, 9, 10, 12, 15, 17, 19, 20, 22, 24, 25] },
    { contestNumber: 3157, date: '2024-06-10', numbers: [2, 3, 4, 6, 8, 10, 11, 13, 14, 16, 17, 18, 20, 21, 23] },
  ];

  for (const drawData of sampleDraws) {
    const draw = Draw.create(
      drawData.contestNumber,
      new Date(drawData.date),
      drawData.numbers
    );
    
    await repository.save(draw);
    console.log(`✓ Sorteio ${drawData.contestNumber} salvo`);
  }

  const count = await repository.count();
  console.log(`\n✅ ${count} sorteios salvos com sucesso!`);
  console.log('📊 Agora você pode gerar sugestões de apostas baseadas nestes dados.\n');
}

seedData().catch(error => {
  console.error('❌ Erro ao popular dados:', error.message);
  process.exit(1);
});
