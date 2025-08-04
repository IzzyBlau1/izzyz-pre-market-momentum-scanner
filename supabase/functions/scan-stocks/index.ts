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
        const previousVolume = quote.v ? quote.v * 0.8 : 0 // Estimate previous volume
        const volumeSpike = previousVolume > 0 ? volume / previousVolume : 1

        // Estimate float (using shares outstanding as proxy)
        const sharesOutstanding = profile?.shareOutstanding || 50000000 // Default 50M if not available
        const estimatedFloat = sharesOutstanding * 0.8 // Estimate 80% of shares as float

        // Apply scanning criteria
        const meetsCriteria = 
          price >= 2 && price <= 20 &&                    // Price range
          changePercent >= 5 &&                           // Daily gain >= 5%
          volumeSpike >= 2 &&                            // Volume spike >= 2x
          estimatedFloat <= 100000000 &&                 // Float <= 100M shares
          Math.abs(changePercent) >= 3                   // Some volatility (catalyst proxy)

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
            catalyst,
            float: estimatedFloat
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