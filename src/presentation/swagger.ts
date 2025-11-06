import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Lotofácil Bet Generator API',
      version: '1.0.0',
      description: `
Sistema gerador de apostas para Lotofácil baseado em análise estatística de resultados históricos.

## 🎯 Funcionalidades

- Salvar histórico de sorteios
- Gerar sugestões de apostas baseadas em estatística
- Análise de frequência de números
- Identificação de números atrasados
- Balanceamento par/ímpar e baixo/alto

## 📊 Algoritmo

O sistema calcula um score para cada número baseado em:
- 60% Frequência de aparição
- 40% Tempo desde última aparição

Os números são selecionados mantendo proporções estatísticas balanceadas.
      `,
      contact: {
        name: 'Rogerio Lamarques',
        email: 'rogerio.lamarques@gmail.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento'
      }
    ],
    tags: [
      {
        name: 'Sorteios',
        description: 'Gerenciamento de histórico de sorteios'
      },
      {
        name: 'Apostas',
        description: 'Geração de sugestões de apostas'
      },
      {
        name: 'Sistema',
        description: 'Endpoints de sistema'
      }
    ]
  },
  apis: ['./src/presentation/routes/*.ts', './src/presentation/controllers/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options);
