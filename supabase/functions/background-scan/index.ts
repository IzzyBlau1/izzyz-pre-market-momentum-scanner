import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.53.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client with service role key for database writes
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Momentum calculation functions (same as original scan-stocks function)
function calculateStochastic(candles: any, kPeriod: number = 14, dPeriod: number = 3): number[] {
  if (!candles || candles.length < kPeriod) return [];
  
  const kValues: number[] = [];
  
  for (let i = kPeriod - 1; i < candles.length; i++) {
    const slice = candles.slice(i - kPeriod + 1, i + 1);
    const highestHigh = Math.max(...slice.map((c: any) => c.h));
    const lowestLow = Math.min(...slice.map((c: any) => c.l));
    const currentClose = candles[i].c;
    
    const k = ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;
    kValues.push(k);
  }
  
  return kValues;
}

function calculateWilliamsR(candles: any, period: number = 14): number[] {
  if (!candles || candles.length < period) return [];
  
  const wrValues: number[] = [];
  
  for (let i = period - 1; i < candles.length; i++) {
    const slice = candles.slice(i - period + 1, i + 1);
    const highestHigh = Math.max(...slice.map((c: any) => c.h));
    const lowestLow = Math.min(...slice.map((c: any) => c.l));
    const currentClose = candles[i].c;
    
    const wr = ((highestHigh - currentClose) / (highestHigh - lowestLow)) * -100;
    wrValues.push(wr);
  }
  
  return wrValues;
}

function calculateMoMo1(candles: any) {
  if (!candles || candles.length < 20) {
    return 'neutral';
  }

  try {
    const stochastic = calculateStochastic(candles);
    const williamsR = calculateWilliamsR(candles);
    
    if (stochastic.length === 0 || williamsR.length === 0) {
      return 'neutral';
    }

    const lastStoch = stochastic[stochastic.length - 1];
    const lastWR = williamsR[williamsR.length - 1];

    if (lastStoch > 80 && lastWR > -20) {
      return 'up';
    } else if (lastStoch < 20 && lastWR < -80) {
      return 'down';
    } else {
      return 'neutral';
    }
  } catch (error) {
    console.error('Error calculating MoMo1:', error);
    return 'neutral';
  }
}

function calculateRSI(prices: number[], period: number = 14): number[] {
  if (prices.length < period + 1) return [];
  
  const gains: number[] = [];
  const losses: number[] = [];
  
  for (let i = 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }
  
  const rsiValues: number[] = [];
  
  for (let i = period - 1; i < gains.length; i++) {
    const avgGain = gains.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
    const avgLoss = losses.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
    
    if (avgLoss === 0) {
      rsiValues.push(100);
    } else {
      const rs = avgGain / avgLoss;
      const rsi = 100 - (100 / (1 + rs));
      rsiValues.push(rsi);
    }
  }
  
  return rsiValues;
}

function calculateEMA(values: number[], period: number): number[] {
  if (values.length < period) return [];
  
  const emaValues: number[] = [];
  const multiplier = 2 / (period + 1);
  
  // First EMA value is SMA
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += values[i];
  }
  emaValues.push(sum / period);
  
  // Calculate subsequent EMA values
  for (let i = period; i < values.length; i++) {
    const ema = (values[i] * multiplier) + (emaValues[emaValues.length - 1] * (1 - multiplier));
    emaValues.push(ema);
  }
  
  return emaValues;
}

function calculateSMA(values: number[], period: number): number[] {
  if (values.length < period) return [];
  
  const smaValues: number[] = [];
  
  for (let i = period - 1; i < values.length; i++) {
    const sum = values.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    smaValues.push(sum / period);
  }
  
  return smaValues;
}

function calculateMoMo2(candles: any) {
  if (!candles || candles.length < 35) {
    return 'neutral';
  }

  try {
    const closePrices = candles.map((c: any) => c.c);
    const rsi = calculateRSI(closePrices, 13);
    
    if (rsi.length === 0) return 'neutral';
    
    const rsiEMA = calculateEMA(rsi, 2);
    const rsiSMA = calculateSMA(rsi, 34);
    
    if (rsiEMA.length === 0 || rsiSMA.length === 0) return 'neutral';
    
    const lastRsiEMA = rsiEMA[rsiEMA.length - 1];
    const lastRsiSMA = rsiSMA[rsiSMA.length - 1];
    
    if (lastRsiEMA > lastRsiSMA + 5) {
      return 'up';
    } else if (lastRsiEMA < lastRsiSMA - 5) {
      return 'down';
    } else {
      return 'neutral';
    }
  } catch (error) {
    console.error('Error calculating MoMo2:', error);
    return 'neutral';
  }
}

async function performBackgroundScan() {
  const finnhubApiKey = Deno.env.get('FINNHUB_API_KEY');
  
  if (!finnhubApiKey) {
    throw new Error('FINNHUB_API_KEY not found');
  }

  console.log('Starting background momentum scan...');

  // Fetch stock universe from Finnhub
  const screenerResponse = await fetch(`https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${finnhubApiKey}`);
  
  if (!screenerResponse.ok) {
    const errorText = await screenerResponse.text();
    throw new Error(`Failed to fetch stock universe: ${screenerResponse.status} - ${errorText}`);
  }

  const allStocks = await screenerResponse.json();
  console.log(`Found ${allStocks.length} total US stocks`);

  // Process stocks in batches to avoid overwhelming the API
  const batchSize = 50; // Reduced batch size for better rate limit management
  const qualifyingStocks: any[] = [];
  
  // Clear old scan results (keep only last 24 hours)
  const { error: deleteError } = await supabase
    .from('momentum_scans')
    .delete()
    .lt('scan_timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
  
  if (deleteError) {
    console.error('Error clearing old scan results:', deleteError);
  }

  for (let i = 0; i < Math.min(batchSize, allStocks.length); i++) {
    const stock = allStocks[i];
    const symbol = stock.symbol;

    try {
      console.log(`Processing ${symbol} (${i + 1}/${Math.min(batchSize, allStocks.length)})`);

      // Fetch quote
      const quoteResponse = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhubApiKey}`);
      if (!quoteResponse.ok) continue;
      
      const quote = await quoteResponse.json();
      const { c: price, pc: previousClose, t: timestamp } = quote;

      if (!price || !previousClose || price <= 0 || previousClose <= 0) {
        console.log(`Skipping ${symbol}: invalid price data`);
        continue;
      }

      // Price range filter: $1-$20
      if (price < 1 || price > 20) {
        continue;
      }

      // Calculate change percentage
      const changePercent = ((price - previousClose) / previousClose) * 100;

      // Fetch company profile for float estimation
      const profileResponse = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${finnhubApiKey}`);
      let profile = null;
      if (profileResponse.ok) {
        profile = await profileResponse.json();
      }

      // Volume and float estimation
      const volume = quote.v || 0;
      const averageVolume = 1000000; // Simplified average
      const volumeSpike = averageVolume > 0 ? (volume / averageVolume) : 0;

      if (volumeSpike < 5) {
        continue;
      }

      const sharesOutstanding = profile?.shareOutstanding || 0;
      let estimatedFloat = sharesOutstanding * 0.8; // 80% of shares outstanding

      if (!estimatedFloat || estimatedFloat < 1000000 || estimatedFloat > 10000000) {
        continue;
      }

      // Fetch momentum data for different timeframes
      const timeframes = ['1', '5', '15', '60', '240', 'D'];
      const momo1Signals: any = {};
      const momo2Signals: any = {};

      for (const timeframe of timeframes) {
        const resolution = timeframe === 'D' ? 'D' : timeframe;
        const candleResponse = await fetch(
          `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60}&to=${Math.floor(Date.now() / 1000)}&token=${finnhubApiKey}`
        );
        
        if (candleResponse.ok) {
          const candleData = await candleResponse.json();
          if (candleData.s === 'ok' && candleData.c && candleData.c.length > 0) {
            const candles = candleData.c.map((close: number, index: number) => ({
              c: close,
              h: candleData.h[index],
              l: candleData.l[index],
              o: candleData.o[index],
              v: candleData.v[index]
            }));

            const timeframeName = timeframe === 'D' ? 'daily' : 
                                 timeframe === '240' ? '4h' : 
                                 timeframe === '60' ? '1h' : 
                                 timeframe === '15' ? '15m' : 
                                 timeframe === '5' ? '5m' : '1m';

            momo1Signals[timeframeName] = calculateMoMo1(candles);
            momo2Signals[timeframeName] = calculateMoMo2(candles);
          }
        }

        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Check for news catalyst
      const newsResponse = await fetch(`https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]}&to=${new Date().toISOString().split('T')[0]}&token=${finnhubApiKey}`);
      let hasNewsCatalyst = false;
      let catalyst = null;

      if (newsResponse.ok) {
        const news = await newsResponse.json();
        if (news && news.length > 0) {
          hasNewsCatalyst = true;
          catalyst = news[0].headline;
        }
      }

      if (!hasNewsCatalyst) {
        continue;
      }

      // Store qualifying stock in database
      const stockData = {
        symbol,
        company_name: profile?.name || null,
        price,
        previous_close: previousClose,
        change_percent: changePercent,
        volume,
        volume_spike: volumeSpike,
        estimated_float: Math.round(estimatedFloat),
        catalyst,
        momo1_signals: momo1Signals,
        momo2_signals: momo2Signals,
        scan_timestamp: new Date().toISOString()
      };

      const { error: insertError } = await supabase
        .from('momentum_scans')
        .insert(stockData);

      if (insertError) {
        console.error(`Error inserting ${symbol}:`, insertError);
      } else {
        qualifyingStocks.push(stockData);
        console.log(`✅ Added ${symbol} to momentum scans`);
      }

    } catch (error) {
      console.error(`Error processing ${symbol}:`, error);
    }
  }

  console.log(`Background scan completed. Found ${qualifyingStocks.length} qualifying stocks.`);
  return qualifyingStocks;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Background scan function called');
    
    const results = await performBackgroundScan();
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: `Background scan completed. Found ${results.length} qualifying stocks.`,
      stocksFound: results.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Background scan error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
