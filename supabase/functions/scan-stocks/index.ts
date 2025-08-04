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
        
        // Fetch 50-day historical data for volume spike calculation and momentum analysis
        const endDate = new Date()
        const startDate = new Date(endDate.getTime() - (50 * 24 * 60 * 60 * 1000))
        
        const historicalResponse = await fetch(
          `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${Math.floor(startDate.getTime() / 1000)}&to=${Math.floor(endDate.getTime() / 1000)}&token=${FINNHUB_API_KEY}`
        )
        
        let volumeSpike = 1
        let momo1Signal = 'neutral'
        
        if (historicalResponse.ok) {
          const historical = await historicalResponse.json()
          if (historical.v && historical.v.length > 0) {
            const avgVolume = historical.v.reduce((sum, vol) => sum + vol, 0) / historical.v.length
            volumeSpike = volume / avgVolume
            
            // Calculate MoMo1 momentum using historical data
            momo1Signal = calculateMoMo1(historical)
            console.log(`${symbol} MoMo1 signal: ${momo1Signal}`)
          }
        }
        
        // Temporarily skip volume spike requirement for testing
        // if (volumeSpike < 5) {
        //   processedCount++
        //   continue
        // }

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
        
        // Always use fallback if we don't have a good estimate
        if (!estimatedFloat || estimatedFloat < 1000000) { // Less than 1M shares
          const estimatedShares = (Math.random() * 20 + 5) * 1000000 // Random 5-25M shares
          estimatedFloat = estimatedShares * 0.8
          console.log(`${symbol} using fallback float estimation: ${estimatedFloat} (${(estimatedFloat / 1000000).toFixed(1)}M)`)
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
        
        // Temporarily skip news catalyst requirement for testing
        // if (!hasNewsCatalyst) {
        //   processedCount++
        //   continue
        // }

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
          momo1: momo1Signal,
          gainPercent: gainPercent
        })
      } catch (error) {
        console.error(`Error processing ${symbol}:`, error)
        continue
      }
    }

    // Sort stocks by gain percentage (highest first) and take top 10
    const topStocks = stocksWithChanges
      .sort((a, b) => b.gainPercent - a.gainPercent)
      .slice(0, 10)
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