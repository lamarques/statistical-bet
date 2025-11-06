import 'reflect-metadata';
import { AppDataSource, initializeDatabase } from '../infrastructure/database/ormconfig';
import { DrawRepositoryFactory } from '../infrastructure/repositories/DrawRepositoryFactory';
import { Draw } from '../domain/entities/Draw';

async function checkSetup() {
  console.log('🔍 Verificando configuração do sistema...\n');

  try {
    // 1. Check environment variables
    console.log('1️⃣ Variáveis de Ambiente:');
    console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'não configurado'}`);
    console.log(`   DATABASE_HOST: ${process.env.DATABASE_HOST || 'não configurado (usando JSON)'}`);
    if (process.env.DATABASE_HOST) {
      console.log(`   DATABASE_PORT: ${process.env.DATABASE_PORT || '3306'}`);
      console.log(`   DATABASE_NAME: ${process.env.DATABASE_NAME || 'lotofacil'}`);
      console.log(`   DATABASE_USER: ${process.env.DATABASE_USER || 'lotofacil'}`);
    }
    console.log('');

    // 2. Initialize database if MySQL
    if (process.env.DATABASE_HOST) {
      console.log('2️⃣ Conexão com MySQL:');
      await initializeDatabase();
      console.log('   ✅ Conectado ao MySQL com sucesso');
      console.log('');
    } else {
      console.log('2️⃣ Storage:');
      console.log('   📁 Usando armazenamento JSON');
      console.log('');
    }

    // 3. Test repository
    console.log('3️⃣ Repositório:');
    const repository = DrawRepositoryFactory.getRepository();
    const count = await repository.count();
    console.log(`   ✅ Repositório funcionando (${count} sorteios no banco)`);
    console.log('');

    // 4. Test latest draw
    if (count > 0) {
      console.log('4️⃣ Último Sorteio:');
      const latest = await repository.findLatest();
      if (latest) {
        console.log(`   Concurso: ${latest.contestNumber}`);
        console.log(`   Data: ${latest.date.toISOString().split('T')[0]}`);
        console.log(`   Números: ${latest.numbers.getNumbers().join(', ')}`);
      }
      console.log('');
    }

    // 5. Test creating a draw
    console.log('5️⃣ Teste de Criação:');
    const testNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const testDraw = Draw.create(99999, new Date(), testNumbers);
    console.log(`   ✅ Draw criado: ${testDraw.id}`);
    console.log('');

    // 6. Summary
    console.log('✅ Sistema configurado corretamente!');
    console.log('');
    console.log('Próximos passos:');
    if (count === 0) {
      console.log('   1. Importar dados: npm run import-draws 100');
      console.log('   2. OU popular com exemplo: npm run seed');
    }
    console.log('   3. Iniciar servidor: npm run dev');
    console.log('   4. Acessar Swagger: http://localhost:3000/api-docs');
    console.log('');

  } catch (error) {
    console.error('❌ Erro na verificação:', error);
    process.exit(1);
  } finally {
    // Close database connection if it was opened
    if (process.env.DATABASE_HOST && AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

checkSetup();
