import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
        
        // Fetch 50-day historical volume data for volume spike calculation
        const endDate = new Date()
        const startDate = new Date(endDate.getTime() - (50 * 24 * 60 * 60 * 1000))
        
        const historicalResponse = await fetch(
          `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${Math.floor(startDate.getTime() / 1000)}&to=${Math.floor(endDate.getTime() / 1000)}&token=${FINNHUB_API_KEY}`
        )
        
        let volumeSpike = 1
        if (historicalResponse.ok) {
          const historical = await historicalResponse.json()
          if (historical.v && historical.v.length > 0) {
            const avgVolume = historical.v.reduce((sum, vol) => sum + vol, 0) / historical.v.length
            volumeSpike = volume / avgVolume
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
        
        console.log(`${symbol} raw profile data:`, JSON.stringify(profile))
        console.log(`${symbol} profile data: sharesOutstanding=${sharesOutstanding} (type: ${typeof sharesOutstanding}), marketCap=${marketCap} (type: ${typeof marketCap})`)
        
        if (sharesOutstanding && !isNaN(sharesOutstanding) && sharesOutstanding > 0) {
          estimatedFloat = sharesOutstanding * 0.8 // Estimate 80% of shares as float
          console.log(`${symbol} float from shares: ${estimatedFloat} (${(estimatedFloat / 1000000).toFixed(1)}M)`)
        } else if (marketCap && !isNaN(marketCap) && marketCap > 0 && price > 0) {
          // Alternative: estimate from market cap
          const totalShares = marketCap * 1000000 / price // marketCap is in millions
          estimatedFloat = totalShares * 0.8
          console.log(`${symbol} float from market cap: ${estimatedFloat} (${(estimatedFloat / 1000000).toFixed(1)}M)`)
        } else {
          console.log(`${symbol} no float data available`)
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
            console.log(`${symbol} - In float formatter: estimatedFloat=${estimatedFloat}`)
            // Force string check for NaN
            const floatStr = String(estimatedFloat);
            if (floatStr === 'NaN' || !estimatedFloat || isNaN(estimatedFloat) || estimatedFloat <= 0) {
              console.log(`${symbol} - Returning N/A for float (string check: ${floatStr})`)
              return 'N/A';
            }
            const floatInMillions = estimatedFloat / 1000000;
            const millionsStr = String(floatInMillions);
            console.log(`${symbol} - floatInMillions=${floatInMillions}, string=${millionsStr}, isNaN=${isNaN(floatInMillions)}`)
            if (millionsStr === 'NaN' || isNaN(floatInMillions)) {
              console.log(`${symbol} - floatInMillions is NaN, returning N/A`)
              return 'N/A';
            }
            const result = floatInMillions.toFixed(1) + 'M';
            console.log(`${symbol} - Final float result: ${result}`)
            return result;
          })(),
          catalyst: catalyst || "No recent news",
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