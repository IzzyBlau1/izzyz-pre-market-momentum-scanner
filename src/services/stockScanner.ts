interface FuturesData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  previousClose: number;
  expiration: string;
  contractMonth: string;
}

interface NewsItem {
  headline: string;
  summary: string;
  url: string;
  datetime: number;
}

class FuturesScannerService {
  private apiKey: string = '';
  private baseUrl = 'https://finnhub.io/api/v1';

  constructor(apiKey: string = '') {
    this.apiKey = apiKey;
  }

  // Get active futures contracts
  getActiveFutures(): Array<{symbol: string, name: string, expiration: string, contractMonth: string}> {
    // March 2025 futures contracts
    return [
      { symbol: 'NQ03-25', name: 'E-mini NASDAQ 100', expiration: '2025-03-21', contractMonth: 'MAR25' },
      { symbol: 'ES03-25', name: 'E-mini S&P 500', expiration: '2025-03-21', contractMonth: 'MAR25' },
      { symbol: 'YM03-25', name: 'E-mini Dow Jones', expiration: '2025-03-21', contractMonth: 'MAR25' },
      { symbol: 'RTY03-25', name: 'E-mini Russell 2000', expiration: '2025-03-21', contractMonth: 'MAR25' },
      { symbol: 'VX03-25', name: 'VIX Futures', expiration: '2025-03-21', contractMonth: 'MAR25' }
    ];
  }

  // Simulate futures data with momentum signals
  async scanFutures(): Promise<any[]> {
    const activeFutures = this.getActiveFutures();
    const results = [];

    for (const futuresContract of activeFutures) {
      try {
        // Simulate momentum data for each timeframe
        const momo1Signals = {
          '1m': ['bullish', 'bearish', 'neutral'][Math.floor(Math.random() * 3)],
          '5m': ['bullish', 'bearish', 'neutral'][Math.floor(Math.random() * 3)],
          '15m': ['bullish', 'bearish', 'neutral'][Math.floor(Math.random() * 3)]
        };
        
        const momo2Signals = {
          '30m': ['bullish', 'bearish', 'neutral'][Math.floor(Math.random() * 3)],
          '1h': ['bullish', 'bearish', 'neutral'][Math.floor(Math.random() * 3)],
          '4h': ['bullish', 'bearish', 'neutral'][Math.floor(Math.random() * 3)],
          '1d': ['bullish', 'bearish', 'neutral'][Math.floor(Math.random() * 3)]
        };

        // Simulate price data based on instrument
        let basePrice = 5000;
        if (futuresContract.symbol.startsWith('NQ')) basePrice = 21000;
        else if (futuresContract.symbol.startsWith('ES')) basePrice = 5800;
        else if (futuresContract.symbol.startsWith('YM')) basePrice = 43500;
        else if (futuresContract.symbol.startsWith('RTY')) basePrice = 2350;
        else if (futuresContract.symbol.startsWith('VX')) basePrice = 18.5;

        const price = basePrice + (Math.random() - 0.5) * basePrice * 0.02; // ±1% variation
        const previousClose = price - (Math.random() - 0.5) * price * 0.01; // ±0.5% from current

        results.push({
          symbol: futuresContract.symbol,
          company_name: futuresContract.name,
          price: Number(price.toFixed(2)),
          previous_close: Number(previousClose.toFixed(2)),
          change_percent: Number((((price - previousClose) / previousClose) * 100).toFixed(2)),
          volume: Math.floor(Math.random() * 200000 + 50000),
          volume_spike: Number((Math.random() * 2 + 0.5).toFixed(1)),
          momo1_signals: momo1Signals,
          momo2_signals: momo2Signals,
          expiration_date: futuresContract.expiration,
          contract_month: futuresContract.contractMonth
        });
      } catch (error) {
        console.error(`Error scanning ${futuresContract.symbol}:`, error);
      }
    }

    return results;
  }
}

export { FuturesScannerService };
export type { FuturesData, NewsItem };