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

// Get active futures contracts
function getActiveFutures(): Array<{symbol: string, name: string, expiration: string, contractMonth: string}> {
  return [
    { symbol: 'NQ03-25', name: 'E-mini NASDAQ 100', expiration: '2025-03-21', contractMonth: 'MAR25' },
    { symbol: 'ES03-25', name: 'E-mini S&P 500', expiration: '2025-03-21', contractMonth: 'MAR25' },
    { symbol: 'YM03-25', name: 'E-mini Dow Jones', expiration: '2025-03-21', contractMonth: 'MAR25' },
    { symbol: 'RTY03-25', name: 'E-mini Russell 2000', expiration: '2025-03-21', contractMonth: 'MAR25' },
    { symbol: 'VX03-25', name: 'VIX Futures', expiration: '2025-03-21', contractMonth: 'MAR25' }
  ];
}

async function performFuturesScan() {
  console.log('Starting futures momentum scan...');

  const activeFutures = getActiveFutures();
  const results: any[] = [];
  
  // Clear old scan results (keep only last 24 hours)
  const { error: deleteError } = await supabase
    .from('momentum_scans')
    .delete()
    .lt('scan_timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
  
  if (deleteError) {
    console.error('Error clearing old scan results:', deleteError);
  }

  for (const futuresContract of activeFutures) {
    try {
      console.log(`Processing ${futuresContract.symbol}`);

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

      const futuresData = {
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
        contract_month: futuresContract.contractMonth,
        scan_timestamp: new Date().toISOString()
      };

      const { error: upsertError } = await supabase
        .from('momentum_scans')
        .upsert(futuresData, {
          onConflict: 'symbol'
        });

      if (upsertError) {
        console.error(`Error upserting ${futuresContract.symbol}:`, upsertError);
      } else {
        results.push(futuresData);
        console.log(`✅ Updated ${futuresContract.symbol} momentum data`);
      }

    } catch (error) {
      console.error(`Error processing ${futuresContract.symbol}:`, error);
    }
  }

  console.log(`Futures scan completed. Updated ${results.length} contracts.`);
  return results;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Futures background scan function called');
    
    const results = await performFuturesScan();
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: `Futures scan completed. Updated ${results.length} contracts.`,
      contractsUpdated: results.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Futures scan error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
