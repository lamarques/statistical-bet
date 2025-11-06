import axios from 'axios';

export interface LotofacilApiResponse {
  numero: number;
  dataApuracao: string;
  listaDezenas: string[];
  listaRateioPremio?: any[];
  valorArrecadado?: number;
  acumulado?: boolean;
}

export class LotofacilApiService {
  private readonly baseUrl = 'https://servicebus2.caixa.gov.br/portaldeloterias/api/lotofacil';

  async fetchLatestDraw(): Promise<LotofacilApiResponse> {
    try {
      const response = await axios.get<LotofacilApiResponse>(this.baseUrl);
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao buscar último sorteio: ${error.message}`);
    }
  }

  async fetchDrawByNumber(contestNumber: number): Promise<LotofacilApiResponse> {
    try {
      const response = await axios.get<LotofacilApiResponse>(
        `${this.baseUrl}/${contestNumber}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`Erro ao buscar sorteio ${contestNumber}: ${error.message}`);
    }
  }

  async fetchDrawsRange(start: number, end: number): Promise<LotofacilApiResponse[]> {
    const draws: LotofacilApiResponse[] = [];
    
    console.log(`🔄 Buscando sorteios de ${start} até ${end}...`);
    
    for (let i = start; i <= end; i++) {
      try {
        const draw = await this.fetchDrawByNumber(i);
        draws.push(draw);
        console.log(`✓ Sorteio ${i} obtido`);
        
        // Pequeno delay para não sobrecarregar a API
        await this.delay(300);
      } catch (error: any) {
        console.log(`✗ Erro no sorteio ${i}: ${error.message}`);
      }
    }
    
    return draws;
  }

  async fetchLastNDraws(count: number): Promise<LotofacilApiResponse[]> {
    const latest = await this.fetchLatestDraw();
    const startNumber = latest.numero - count + 1;
    return this.fetchDrawsRange(Math.max(1, startNumber), latest.numero);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
