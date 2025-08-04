import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// MoMo1 Momentum Calculation Functions
function calculateStochastic(highs: number[], lows: number[], closes: number[], kPeriod: number, dPeriod: number) {
  if (closes.length < kPeriod + dPeriod) return { k: [], d: [] }
  
  const kValues = []
  const dValues = []
  
  for (let i = kPeriod - 1; i < closes.length; i++) {
    const periodHighs = highs.slice(i - kPeriod + 1, i + 1)
    const periodLows = lows.slice(i - kPeriod + 1, i + 1)
    
    const highestHigh = Math.max(...periodHighs)
    const lowestLow = Math.min(...periodLows)
    
    if (highestHigh === lowestLow) {
      kValues.push(50) // Neutral when no range
    } else {
      const k = ((closes[i] - lowestLow) / (highestHigh - lowestLow)) * 100
      kValues.push(k)
    }
  }
  
  // Calculate D values (SMA of K values)
  for (let i = dPeriod - 1; i < kValues.length; i++) {
    const dPeriodKs = kValues.slice(i - dPeriod + 1, i + 1)
    const d = dPeriodKs.reduce((sum, k) => sum + k, 0) / dPeriod
    dValues.push(d)
  }
  
  return { k: kValues, d: dValues }
}

function calculateWilliamsR(highs: number[], lows: number[], closes: number[], period: number) {
  if (closes.length < period) return []
  
  const wrValues = []
  
  for (let i = period - 1; i < closes.length; i++) {
    const periodHighs = highs.slice(i - period + 1, i + 1)
    const periodLows = lows.slice(i - period + 1, i + 1)
    
    const highestHigh = Math.max(...periodHighs)
    const lowestLow = Math.min(...periodLows)
    
    if (highestHigh === lowestLow) {
      wrValues.push(-50) // Neutral when no range
    } else {
      const wr = ((highestHigh - closes[i]) / (highestHigh - lowestLow)) * (-100)
      wrValues.push(wr)
    }
  }
  
  return wrValues
}

function calculateMoMo1(candles: any) {
  if (!candles || !candles.h || !candles.l || !candles.c || candles.c.length < 50) {
    return 'neutral'
  }
  
  const highs = candles.h
  const lows = candles.l
  const closes = candles.c
  
  // Calculate Fast Stochastic (8/3)
  const stoch8 = calculateStochastic(highs, lows, closes, 8, 3)
  
  // Calculate Slow Stochastic (38/3)
  const stoch38 = calculateStochastic(highs, lows, closes, 38, 3)
  
  // Calculate Williams %R (38 period)
  const wr = calculateWilliamsR(highs, lows, closes, 38)
  
  // Need at least 2 data points to determine direction
  if (stoch8.d.length < 2 || stoch38.d.length < 2 || wr.length < 2) {
    return 'neutral'
  }
  
  // Get latest values
  const stoch8K = stoch8.k[stoch8.k.length - 1]
  const stoch8KPrev = stoch8.k[stoch8.k.length - 2]
  const stoch8D = stoch8.d[stoch8.d.length - 1]
  const stoch8DPrev = stoch8.d[stoch8.d.length - 2]
  
  const stoch38K = stoch38.k[stoch38.k.length - 1]
  const stoch38KPrev = stoch38.k[stoch38.k.length - 2]
  const stoch38D = stoch38.d[stoch38.d.length - 1]
  const stoch38DPrev = stoch38.d[stoch38.d.length - 2]
  
  const wrCurrent = wr[wr.length - 1]
  const wrPrev = wr[wr.length - 2]
  
  // Calculate signals based on ThinkScript logic
  const stoch8Long = stoch8D > stoch8DPrev && stoch8K > stoch8KPrev
  const stoch8Short = stoch8D < stoch8DPrev && stoch8K < stoch8KPrev
  const stoch38Long = stoch38D > stoch38DPrev && stoch38K > stoch38KPrev
  const stoch38Short = stoch38D < stoch38DPrev && stoch38K < stoch38KPrev
  
  const wrUp = wrCurrent > -90 && wrCurrent > wrPrev
  const wrDown = wrCurrent < -10 && wrCurrent < wrPrev
  
  // Combined signals
  const comboLong = stoch8Long && stoch38Long && wrUp
  const comboShort = stoch8Short && stoch38Short && wrDown
  
  if (comboLong) return 'up'
  if (comboShort) return 'down'
  return 'neutral'
}

// Calculate RSI
function calculateRSI(prices: number[], period: number = 14): number[] {
  if (prices.length < period + 1) return []
  
  const rsi: number[] = []
  let gains = 0
  let losses = 0
  
  // Calculate initial average gain and loss
  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1]
    if (change > 0) gains += change
    else losses -= change
  }
  
  let avgGain = gains / period
  let avgLoss = losses / period
  let rs = avgGain / avgLoss
  rsi.push(100 - (100 / (1 + rs)))
  
  // Calculate remaining RSI values
  for (let i = period + 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1]
    const gain = change > 0 ? change : 0
    const loss = change < 0 ? -change : 0
    
    avgGain = (avgGain * (period - 1) + gain) / period
    avgLoss = (avgLoss * (period - 1) + loss) / period
    rs = avgGain / avgLoss
    rsi.push(100 - (100 / (1 + rs)))
  }
  
  return rsi
}

// Calculate Exponential Moving Average  
function calculateEMA(values: number[], period: number): number[] {
  if (values.length < period) return []
  
  const ema: number[] = []
  const multiplier = 2 / (period + 1)
  
  // Start with SMA for first value
  let sum = 0
  for (let i = 0; i < period; i++) {
    sum += values[i]
  }
  ema.push(sum / period)
  
  // Calculate EMA for remaining values
  for (let i = period; i < values.length; i++) {
    const currentEma = (values[i] * multiplier) + (ema[ema.length - 1] * (1 - multiplier))
    ema.push(currentEma)
  }
  
  return ema
}

// Calculate Simple Moving Average
function calculateSMA(values: number[], period: number): number[] {
  if (values.length < period) return []
  
  const result: number[] = []
  for (let i = period - 1; i < values.length; i++) {
    const slice = values.slice(i - period + 1, i + 1)
    const average = slice.reduce((sum, val) => sum + val, 0) / period
    result.push(average)
  }
  
  return result
}

// Calculate MoMo2 (TDI-based) for a specific timeframe
function calculateMoMo2(candles: any) {
  if (!candles || !candles.c || candles.c.length < 40) {
    return 'neutral' // Need enough data for RSI and averages
  }
  
  try {
    const prices = candles.c
    
    // TDI Parameters
    const RSI_PERIOD = 38
    const TDI_UPPER_LEVEL = 68
    const TDI_LOWER_LEVEL = 32
    const VOLATILITY_BAND = 34
    const RSI_PRICE_LINE = 2
    const TRADE_SIGNAL_LINE = 7
    const STDEV_MULTIPLIER = 1.62
    
    // Calculate RSI
    const rsi = calculateRSI(prices, RSI_PERIOD)
    if (rsi.length < 2) return 'neutral'
    
    // Calculate TDI components
    const dp = calculateEMA(rsi, RSI_PRICE_LINE) // Price Line
    const ds = calculateEMA(rsi, TRADE_SIGNAL_LINE) // Signal Line  
    const da = calculateSMA(rsi, VOLATILITY_BAND) // Average Line
    
    if (dp.length < 2 || ds.length < 2 || da.length < 2) return 'neutral'
    
    // Get current and previous values
    const dpCurrent = dp[dp.length - 1]
    const dpPrevious = dp[dp.length - 2]
    const dsCurrent = ds[ds.length - 1]
    const dsPrevious = ds[ds.length - 2]
    const daCurrent = da[da.length - 1]
    const daPrevious = da[da.length - 2]
    
    // Rising/Falling conditions
    const DPR = dpCurrent > dpPrevious
    const DPF = dpCurrent < dpPrevious
    const DSR = dsCurrent > dsPrevious
    const DSF = dsCurrent < dsPrevious
    const DAR = daCurrent > daPrevious
    const DAF = daCurrent < daPrevious
    
    // TDI Signal conditions
    const TDILONG = dpCurrent > 50 && DPR && dsCurrent > 50 && DSR && daCurrent > 50 && DAR
    const TDISHORT = dpCurrent < 50 && DPF && dsCurrent < 50 && DSF && daCurrent < 50 && DAF
    const TDILONG2 = dpCurrent < 50 && DPR && dsCurrent < 50 && DSR && daCurrent < 50 && DAR
    const TDISHORT2 = dpCurrent > 50 && DPF && dsCurrent > 50 && DSF && daCurrent > 50 && DAF
    const HOLD = !TDILONG && !TDISHORT && !TDILONG2 && !TDISHORT2
    
    // Map to colors: Bullish = green, Bearish = red, Neutral = yellow
    if (TDILONG || TDILONG2) return 'up' // Green (bullish)
    if (TDISHORT || TDISHORT2) return 'down' // Red (bearish)
    return 'neutral' // Yellow (neutral/hold)
    
  } catch (error) {
    console.error('Error calculating MoMo2:', error)
    return 'neutral'
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Function called, checking environment...')
    
    const FINNHUB_API_KEY = Deno.env.get('FINNHUB_API_KEY')
    if (!FINNHUB_API_KEY) {
      console.error('FINNHUB_API_KEY not found in environment variables')
      throw new Error('FINNHUB_API_KEY not found in environment variables')
    }
    
    console.log('API key found, starting scan...')

    // Get comprehensive US stock universe using Finnhub screener
    console.log('Fetching stock universe from Finnhub...')
    const screenerResponse = await fetch(
      `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${FINNHUB_API_KEY}`
    )
    
    console.log('Screener response status:', screenerResponse.status)
    console.log('Screener response headers:', Object.fromEntries(screenerResponse.headers.entries()))
    
    if (!screenerResponse.ok) {
      const errorText = await screenerResponse.text()
      console.error('Finnhub API error:', errorText)
      throw new Error(`Failed to fetch stock universe: ${screenerResponse.status} - ${errorText}`)
    }
    
    const allStocks = await screenerResponse.json()
    console.log(`Found ${allStocks.length} total US stocks`)

    const results = []
    let processedCount = 0

    // Process stocks in batches to avoid rate limits and timeouts
    // Limit to first 200 stocks for testing, then sort by price change
    const stocksToProcess = allStocks.slice(0, 200)
    console.log(`Processing first ${stocksToProcess.length} stocks for testing`)
    
    const stocksWithChanges = []
    
    for (const stock of stocksToProcess) {
      const symbol = stock.symbol
      try {
        // Fetch stock quote
        const quoteResponse = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
        )
        
        if (!quoteResponse.ok) continue
        
        const quote = await quoteResponse.json()
        
        // Fetch company profile for float estimation
        const profileResponse = await fetch(
          `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`
        )
        
        let profile = null
        if (profileResponse.ok) {
          profile = await profileResponse.json()
        }

        // Calculate metrics
        const price = quote.c || 0
        const change = quote.d || 0
        const changePercent = quote.dp || 0
        const volume = quote.v || 0
        const previousClose = quote.pc || 0
        
        // Skip if basic data is invalid
        if (price <= 0 || previousClose <= 0) {
          console.log(`Skipping ${symbol}: invalid price data (price: ${price}, prevClose: ${previousClose})`)
          continue
        }
        
        // For testing, let's be very lenient - any stock with valid data
        const priceInRange = price >= 2 && price <= 20 // Back to original $2-$20 range
        
        console.log(`${symbol}: price=${price}, change=${changePercent}%, volume=${volume}, inRange=${priceInRange}`)
        
        if (!priceInRange) {
          processedCount++
          if (processedCount % 100 === 0) {
            console.log(`Processed ${processedCount} stocks...`)
          }
          continue
        }
        
        // Fetch multi-timeframe historical data for momentum analysis
        const endDate = new Date()
        const startDate = new Date(endDate.getTime() - (50 * 24 * 60 * 60 * 1000)) // 50 days for daily analysis
        
        // Fetch multiple timeframes in parallel
        const timeframes = [
          { resolution: '1', days: 2, name: '1m' },    // 1-min data for 2 days
          { resolution: '5', days: 5, name: '5m' },    // 5-min data for 5 days  
          { resolution: '15', days: 10, name: '15m' }, // 15-min data for 10 days
          { resolution: '60', days: 20, name: '1h' },  // 1-hour data for 20 days
          { resolution: '240', days: 40, name: '4h' }, // 4-hour data for 40 days
          { resolution: 'D', days: 50, name: 'daily' } // Daily data for 50 days
        ]
        
        const momentumPromises = timeframes.map(async (tf) => {
          const tfStartDate = new Date(endDate.getTime() - (tf.days * 24 * 60 * 60 * 1000))
          const response = await fetch(
            `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${tf.resolution}&from=${Math.floor(tfStartDate.getTime() / 1000)}&to=${Math.floor(endDate.getTime() / 1000)}&token=${FINNHUB_API_KEY}`
          )
          
          if (response.ok) {
            const data = await response.json()
            return { 
              timeframe: tf.name, 
              data, 
              momo1Signal: calculateMoMo1(data),
              momo2Signal: calculateMoMo2(data)
            }
          }
          return { timeframe: tf.name, data: null, momo1Signal: 'neutral', momo2Signal: 'neutral' }
        })
        
        const momentumResults = await Promise.all(momentumPromises)
        
        // Extract momentum signals for each timeframe
        const momentum = {
          momo1: {
            '1m': momentumResults.find(r => r.timeframe === '1m')?.momo1Signal || 'neutral',
            '5m': momentumResults.find(r => r.timeframe === '5m')?.momo1Signal || 'neutral', 
            '15m': momentumResults.find(r => r.timeframe === '15m')?.momo1Signal || 'neutral',
            '1h': momentumResults.find(r => r.timeframe === '1h')?.momo1Signal || 'neutral',
            '4h': momentumResults.find(r => r.timeframe === '4h')?.momo1Signal || 'neutral',
            'daily': momentumResults.find(r => r.timeframe === 'daily')?.momo1Signal || 'neutral'
          },
          momo2: {
            '1m': momentumResults.find(r => r.timeframe === '1m')?.momo2Signal || 'neutral',
            '5m': momentumResults.find(r => r.timeframe === '5m')?.momo2Signal || 'neutral', 
            '15m': momentumResults.find(r => r.timeframe === '15m')?.momo2Signal || 'neutral',
            '1h': momentumResults.find(r => r.timeframe === '1h')?.momo2Signal || 'neutral',
            '4h': momentumResults.find(r => r.timeframe === '4h')?.momo2Signal || 'neutral',
            'daily': momentumResults.find(r => r.timeframe === 'daily')?.momo2Signal || 'neutral'
          }
        }
        
        // Calculate volume spike from daily data
        let volumeSpike = 1
        const dailyData = momentumResults.find(r => r.timeframe === 'daily')?.data
        if (dailyData && dailyData.v && dailyData.v.length > 0) {
          const avgVolume = dailyData.v.reduce((sum, vol) => sum + vol, 0) / dailyData.v.length
          volumeSpike = volume / avgVolume
        }
        
        console.log(`${symbol} MoMo1 signals:`, momentum.momo1)
        
        // Require minimum volume spike
        if (volumeSpike < 5) {
          processedCount++
          continue
        }

        // Get float data from company profile
        const sharesOutstanding = profile?.shareOutstanding
        const marketCap = profile?.marketCapitalization
        let estimatedFloat = null
        
        // Debug what we're getting from the profile
        if (profile) {
          console.log(`${symbol} profile keys:`, Object.keys(profile))
          console.log(`${symbol} full profile:`, JSON.stringify(profile, null, 2))
        } else {
          console.log(`${symbol} - No profile data received`)
        }
        
        console.log(`${symbol} profile data: sharesOutstanding=${sharesOutstanding} (type: ${typeof sharesOutstanding}), marketCap=${marketCap} (type: ${typeof marketCap})`)
        
        if (sharesOutstanding && !isNaN(sharesOutstanding) && sharesOutstanding > 1000000) { // Must be at least 1M shares
          estimatedFloat = sharesOutstanding * 0.8 // Estimate 80% of shares as float
          console.log(`${symbol} float from shares: ${estimatedFloat} (${(estimatedFloat / 1000000).toFixed(1)}M)`)
        } else if (marketCap && !isNaN(marketCap) && marketCap > 10 && price > 0) { // Must be at least $10M market cap
          // Alternative: estimate from market cap
          const totalShares = marketCap * 1000000 / price // marketCap is in millions
          if (totalShares > 1000000) { // Only use if result is reasonable
            estimatedFloat = totalShares * 0.8
            console.log(`${symbol} float from market cap: ${estimatedFloat} (${(estimatedFloat / 1000000).toFixed(1)}M)`)
          } else {
            estimatedFloat = null // Force fallback
          }
        } else {
          estimatedFloat = null // Force fallback
        }
        
        // Require valid float data - no fallback estimates allowed
        if (!estimatedFloat || estimatedFloat < 1000000 || estimatedFloat > 10000000) { // Must be 1M-10M shares
          console.log(`${symbol} - Float requirement not met: ${estimatedFloat ? (estimatedFloat / 1000000).toFixed(1) + 'M' : 'N/A'}`)
          processedCount++
          continue
        }
        
        // Ensure estimatedFloat is a valid number before using it
        if (estimatedFloat && isNaN(estimatedFloat)) {
          console.log(`${symbol} calculated float is NaN, setting to null`)
          estimatedFloat = null
        }

        // Fetch recent news for catalyst requirement
        const newsResponse = await fetch(
          `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${new Date(Date.now() - 24*60*60*1000).toISOString().split('T')[0]}&to=${new Date().toISOString().split('T')[0]}&token=${FINNHUB_API_KEY}`
        )
        
        let catalyst = null
        let hasNewsCatalyst = false
        
        if (newsResponse.ok) {
          const news = await newsResponse.json()
          if (news.length > 0) {
            catalyst = news[0].headline.substring(0, 100) + "..."
            hasNewsCatalyst = true
          }
        }
        
        // Require news catalyst - all stocks must have recent news
        if (!hasNewsCatalyst) {
          processedCount++
          continue
        }

        // Calculate gain percentage for display
        const gainPercent = previousClose > 0 ? ((price - previousClose) / previousClose) * 100 : 0
        
        // Debug float value before formatting
        console.log(`${symbol} - About to format float: estimatedFloat=${estimatedFloat}, isNaN=${isNaN(estimatedFloat)}, type=${typeof estimatedFloat}`)
        
        // Store stock data with change percentage for sorting
        stocksWithChanges.push({
          symbol,
          price: price.toFixed(2),
          change: `${gainPercent >= 0 ? '+' : ''}${gainPercent.toFixed(1)}%`,
          volume: volume.toLocaleString(),
          volumeSpike: volumeSpike.toFixed(1) + 'x',
          float: (() => {
            console.log(`${symbol} - Float calculation: estimatedFloat=${estimatedFloat}`)
            try {
              if (!estimatedFloat || typeof estimatedFloat !== 'number' || !isFinite(estimatedFloat) || estimatedFloat <= 0) {
                console.log(`${symbol} - Float check failed, returning N/A`)
                return 'N/A';
              }
              const floatInMillions = estimatedFloat / 1000000;
              console.log(`${symbol} - Float in millions: ${floatInMillions}`)
              const result = floatInMillions.toFixed(1) + 'M';
              console.log(`${symbol} - Final float result: ${result}`)
              return result.includes('NaN') ? 'N/A' : result;
            } catch (e) {
              console.log(`${symbol} - Float calculation error: ${e}`)
              return 'N/A';
            }
          })(),
          catalyst: catalyst || "No recent news",
          momentum: momentum,
          gainPercent: gainPercent
        })
      } catch (error) {
        console.error(`Error processing ${symbol}:`, error)
        continue
      }
    }

    // Sort stocks by gain percentage (highest first) and take top 15
    const topStocks = stocksWithChanges
      .sort((a, b) => b.gainPercent - a.gainPercent)
      .slice(0, 15)
      .map(stock => {
        const { gainPercent, ...stockWithoutGainPercent } = stock
        return stockWithoutGainPercent
      })

    console.log(`Returning top ${topStocks.length} stocks with highest price changes`)

    return new Response(
      JSON.stringify({ results: topStocks }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})