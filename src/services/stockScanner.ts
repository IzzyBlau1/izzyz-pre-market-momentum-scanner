interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  averageVolume50Day: number;
  float: number;
  previousClose: number;
}

interface ScanCriteria {
  minPrice: number;
  maxPrice: number;
  minDailyGainPercent: number;
  volumeSpikeMultiplier: number;
  maxFloat: number;
}

interface NewsItem {
  headline: string;
  summary: string;
  url: string;
  datetime: number;
}

class StockScannerService {
  private apiKey: string = '';
  private baseUrl = 'https://finnhub.io/api/v1';

  constructor(apiKey: string = '') {
    this.apiKey = apiKey;
  }

  // Check if current time is within pre-market hours (8 AM - 9:30 AM EST)
  private isPreMarketHours(): boolean {
    const now = new Date();
    const estTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
    const hours = estTime.getHours();
    const minutes = estTime.getMinutes();
    
    return (hours === 8) || (hours === 9 && minutes < 30);
  }

  // Fetch stock quote data
  private async fetchStockQuote(symbol: string): Promise<StockData | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/quote?symbol=${symbol}&token=${this.apiKey}`
      );
      
      if (!response.ok) return null;
      
      const data = await response.json();
      
      // Calculate volume spike (current vs 50-day average)
      const volumeSpike = data.volume / (data.averageVolume || 1);
      
      return {
        symbol,
        price: data.c, // current price
        change: data.d, // change
        changePercent: data.dp, // change percent
        volume: data.volume || 0,
        averageVolume50Day: data.averageVolume || 0,
        float: 0, // Will need separate API call for float data
        previousClose: data.pc // previous close
      };
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      return null;
    }
  }

  // Fetch company profile for float data
  private async fetchCompanyProfile(symbol: string): Promise<number> {
    try {
      const response = await fetch(
        `${this.baseUrl}/stock/profile2?symbol=${symbol}&token=${this.apiKey}`
      );
      
      if (!response.ok) return 0;
      
      const data = await response.json();
      return data.shareOutstanding || 0; // Outstanding shares as proxy for float
    } catch (error) {
      console.error(`Error fetching profile for ${symbol}:`, error);
      return 0;
    }
  }

  // Fetch recent news for catalyst detection
  private async fetchRecentNews(symbol: string): Promise<NewsItem[]> {
    try {
      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      
      const response = await fetch(
        `${this.baseUrl}/company-news?symbol=${symbol}&from=${yesterday.toISOString().split('T')[0]}&to=${today.toISOString().split('T')[0]}&token=${this.apiKey}`
      );
      
      if (!response.ok) return [];
      
      const news = await response.json();
      return news.slice(0, 3).map((item: any) => ({
        headline: item.headline,
        summary: item.summary,
        url: item.url,
        datetime: item.datetime
      }));
    } catch (error) {
      console.error(`Error fetching news for ${symbol}:`, error);
      return [];
    }
  }

  // Check if stock meets all criteria
  private async meetsCriteria(symbol: string, criteria: ScanCriteria): Promise<boolean> {
    const quote = await this.fetchStockQuote(symbol);
    if (!quote) return false;

    // 1. Price between $2 and $20
    if (quote.price < criteria.minPrice || quote.price > criteria.maxPrice) {
      return false;
    }

    // 2. Up at least 10% on the day
    if (quote.changePercent < criteria.minDailyGainPercent) {
      return false;
    }

    // 3. Volume spike 5X average
    const volumeSpike = quote.volume / (quote.averageVolume50Day || 1);
    if (volumeSpike < criteria.volumeSpikeMultiplier) {
      return false;
    }

    // 4. Float less than 10M shares
    const float = await this.fetchCompanyProfile(symbol);
    if (float > criteria.maxFloat) {
      return false;
    }

    // 5. Has recent news (catalyst)
    const news = await this.fetchRecentNews(symbol);
    if (news.length === 0) {
      return false;
    }

    return true;
  }

  // Get list of active stocks (top gainers as starting point)
  private async getActiveStocks(): Promise<string[]> {
    try {
      // Get top gainers as our universe of stocks to scan
      const response = await fetch(
        `${this.baseUrl}/stock/market-status?exchange=US&token=${this.apiKey}`
      );
      
      // For now, return a curated list of commonly active stocks
      // In production, this would come from a market screener API
      return [
        'AAPL', 'TSLA', 'NVDA', 'AMD', 'MSFT', 'GOOGL', 'META', 'AMZN',
        'NFLX', 'CRM', 'UBER', 'LYFT', 'SNAP', 'TWTR', 'SQ', 'PYPL',
        'ROKU', 'ZM', 'PTON', 'MRNA', 'PFE', 'JNJ', 'KO', 'PEP'
      ];
    } catch (error) {
      console.error('Error fetching active stocks:', error);
      return [];
    }
  }

  // Main scan function
  async scanStocks(): Promise<any[]> {
    if (!this.apiKey) {
      throw new Error('API key required for stock scanning');
    }

    if (!this.isPreMarketHours()) {
      console.warn('Not in pre-market hours (8 AM - 9:30 AM EST)');
    }

    const criteria: ScanCriteria = {
      minPrice: 2,
      maxPrice: 20,
      minDailyGainPercent: 10,
      volumeSpikeMultiplier: 5,
      maxFloat: 10_000_000
    };

    const stockUniverse = await this.getActiveStocks();
    const qualifyingStocks = [];

    for (const symbol of stockUniverse) {
      try {
        if (await this.meetsCriteria(symbol, criteria)) {
          const quote = await this.fetchStockQuote(symbol);
          const news = await this.fetchRecentNews(symbol);
          const float = await this.fetchCompanyProfile(symbol);
          
          if (quote) {
            qualifyingStocks.push({
              symbol,
              price: quote.price,
              change: quote.change,
              changePercent: quote.changePercent,
              volume: quote.volume,
              volumeSpike: quote.volume / (quote.averageVolume50Day || 1),
              float,
              catalyst: news[0]?.headline || 'Recent news activity',
              momentum: {
                '1m': { momo1: 0, momo2: 0 }, // Will be populated by momentum scripts
                '5m': { momo1: 0, momo2: 0 },
                '15m': { momo1: 0, momo2: 0 },
                '1h': { momo1: 0, momo2: 0 },
                '4h': { momo1: 0, momo2: 0 },
                'daily': { momo1: 0, momo2: 0 }
              }
            });
          }
        }
      } catch (error) {
        console.error(`Error processing ${symbol}:`, error);
      }
    }

    return qualifyingStocks;
  }
}

export { StockScannerService };
export type { StockData, ScanCriteria, NewsItem };