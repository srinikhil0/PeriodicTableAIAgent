import axios from 'axios';

const RSC_API_BASE_URL = 'https://api.rsc.org/compounds/v1';

export class RSCClient {
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('RSC API key is required');
    }
    this.apiKey = apiKey;
  }

  private get headers() {
    return {
      'apikey': this.apiKey,
      'Accept': 'application/json'
    };
  }

  async getElementData(symbol: string) {
    const response = await axios.get(
      `${RSC_API_BASE_URL}/elements/${symbol}`,
      { headers: this.headers }
    );
    return response.data;
  }

  async getCompoundData(formula: string) {
    const response = await axios.get(
      `${RSC_API_BASE_URL}/compounds/formula/${formula}`,
      { headers: this.headers }
    );
    return response.data;
  }
}