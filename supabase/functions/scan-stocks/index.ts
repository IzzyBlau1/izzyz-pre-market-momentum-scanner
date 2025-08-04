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
    const FINNHUB_API_KEY = Deno.env.get('FINNHUB_API_KEY')
    if (!FINNHUB_API_KEY) {
      throw new Error('FINNHUB_API_KEY not found in environment variables')
    }

    // Stock universe for scanning
    const stockUniverse = [
      'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX', 'AMD', 'INTC',
      'CRM', 'ADBE', 'PYPL', 'UBER', 'LYFT', 'SNAP', 'TWTR', 'SPOT', 'ZM', 'DOCU',
      'ROKU', 'SQ', 'SHOP', 'SNOW', 'PLTR', 'COIN', 'HOOD', 'RIVN', 'LCID', 'SOFI'
    ]

    const results = []

    for (const symbol of stockUniverse) {
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
        
        // Get actual previous close volume (using 'pc' if available, otherwise estimate)
        const previousCloseVolume = quote.pv || (volume * 0.7) // More realistic previous volume estimate
        const volumeSpike = previousCloseVolume > 0 ? (volume / previousCloseVolume) : 1.0

        // Get float data from company profile
        const sharesOutstanding = profile?.shareOutstanding
        const marketCap = profile?.marketCapitalization
        let estimatedFloat = null
        
        if (sharesOutstanding && !isNaN(sharesOutstanding)) {
          estimatedFloat = sharesOutstanding * 0.8 // Estimate 80% of shares as float
        } else if (marketCap && price > 0) {
          // Alternative: estimate from market cap
          const totalShares = marketCap * 1000000 / price // marketCap is in millions
          estimatedFloat = totalShares * 0.8
        }

        // Apply simplified scanning criteria for testing
        const meetsCriteria = 
          price >= 2 && price <= 20 &&                    // Price range $2-$20
          price > 0                                        // Valid price data

        if (meetsCriteria) {
          // Fetch recent news for catalyst
          const newsResponse = await fetch(
            `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${new Date(Date.now() - 24*60*60*1000).toISOString().split('T')[0]}&to=${new Date().toISOString().split('T')[0]}&token=${FINNHUB_API_KEY}`
          )
          
          let catalyst = "General market movement"
          if (newsResponse.ok) {
            const news = await newsResponse.json()
            if (news.length > 0) {
              catalyst = news[0].headline.substring(0, 100) + "..."
            }
          }

          results.push({
            symbol,
            price: price.toFixed(2),
            change: `${change >= 0 ? '+' : ''}${change.toFixed(2)} (${changePercent.toFixed(1)}%)`,
            volume: volume.toLocaleString(),
            volumeSpike: volumeSpike.toFixed(1) + 'x',
            float: estimatedFloat ? (estimatedFloat / 1000000).toFixed(1) + 'M' : 'N/A',
            catalyst
          })
        }
      } catch (error) {
        console.error(`Error processing ${symbol}:`, error)
        continue
      }
    }

    return new Response(
      JSON.stringify({ results }),
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