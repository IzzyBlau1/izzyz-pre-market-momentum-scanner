import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface StockScan {
  id: string;
  symbol: string;
  company_name?: string;
  price: number;
  previous_close: number;
  change_percent: number;
  volume: number;
  volume_spike: number;
  estimated_float: number;
  catalyst: string;
  contract_month?: string;
  expiration_date?: string;
  momo1_signals: {
    '1m'?: 'bullish' | 'bearish' | 'neutral';
    '5m'?: 'bullish' | 'bearish' | 'neutral';
    '15m'?: 'bullish' | 'bearish' | 'neutral';
    '1h'?: 'bullish' | 'bearish' | 'neutral';
    '4h'?: 'bullish' | 'bearish' | 'neutral';
    '1d'?: 'bullish' | 'bearish' | 'neutral';
  };
  momo2_signals: {
    '1m'?: 'bullish' | 'bearish' | 'neutral';
    '5m'?: 'bullish' | 'bearish' | 'neutral';
    '15m'?: 'bullish' | 'bearish' | 'neutral';
    '1h'?: 'bullish' | 'bearish' | 'neutral';
    '4h'?: 'bullish' | 'bearish' | 'neutral';
    '1d'?: 'bullish' | 'bearish' | 'neutral';
  };
  scan_timestamp: string;
  created_at: string;
  updated_at: string;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [scanResults, setScanResults] = useState<StockScan[]>([]);
  const [lastScan, setLastScan] = useState<Date | null>(null);
  const { toast } = useToast();

  // Load cached scan results from database
  const loadCachedResults = async () => {
    try {
      const { data, error } = await supabase
        .from('momentum_scans')
        .select('*')
        .order('change_percent', { ascending: false })
        .limit(15);

      if (error) throw error;

      if (data && data.length > 0) {
        // Transform the data to match our interface
        const transformedData: StockScan[] = data.map(item => ({
          ...item,
          momo1_signals: typeof item.momo1_signals === 'string' 
            ? JSON.parse(item.momo1_signals) 
            : item.momo1_signals,
          momo2_signals: typeof item.momo2_signals === 'string' 
            ? JSON.parse(item.momo2_signals) 
            : item.momo2_signals,
        }));
        
        setScanResults(transformedData);
        // Get the latest scan timestamp
        const latestScan = data.reduce((latest, current) => {
          return new Date(current.scan_timestamp) > new Date(latest.scan_timestamp) ? current : latest;
        });
        setLastScan(new Date(latestScan.scan_timestamp));
      }
    } catch (error) {
      console.error('Error loading cached results:', error);
    }
  };

  // Trigger a background scan manually
  const triggerBackgroundScan = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('background-scan');
      
      if (error) throw error;
      
      toast({
        title: "Scan Triggered",
        description: "Background scan initiated. Results will update automatically.",
      });

      // Reload results after a short delay to get fresh data
      setTimeout(() => {
        loadCachedResults();
      }, 2000);

    } catch (error) {
      console.error('Background scan error:', error);
      toast({
        title: "Scan Failed",
        description: "Error triggering background scan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    // Load initial data
    loadCachedResults();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('momentum-scans-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'momentum_scans'
        },
        (payload) => {
          console.log('New scan result:', payload.new);
          loadCachedResults(); // Reload all results when new data arrives
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE', 
          schema: 'public',
          table: 'momentum_scans'
        },
        () => {
          loadCachedResults(); // Reload when old data is cleaned up
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getMomentumColor = (direction: string | undefined) => {
    switch (direction) {
      case "bullish": return "bg-green-500";
      case "bearish": return "bg-red-500";
      case "neutral": return "bg-yellow-500";
      default: return "bg-gray-400";
    }
  };

  const formatFloat = (float: number) => {
    if (float >= 1000000) {
      return `${(float / 1000000).toFixed(1)}M`;
    }
    return `${(float / 1000).toFixed(1)}K`;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Izzy'z Pre-Market Momentum Scanner
          </h1>
          <div className="flex items-center justify-center gap-2 text-xl text-muted-foreground mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <span>Live Auto-Scanning Every 2 Minutes</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button 
              onClick={triggerBackgroundScan} 
              disabled={isLoading}
              size="lg"
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? "Triggering Scan..." : "TRIGGER SCAN"}
            </Button>
            <p className="text-xs text-muted-foreground">
              🚀 Powered by cached results - instantly scalable for thousands of users
            </p>
          </div>
          {lastScan && (
            <p className="text-sm text-muted-foreground mt-2">
              Last scan: {lastScan.toLocaleTimeString()} on {lastScan.toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Results Table */}
        {scanResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Index Futures ({scanResults.length} instruments)
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border bg-card rounded-lg">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-3 text-left font-semibold">Symbol</th>
                    <th className="border border-border p-3 text-center font-semibold">Contract</th>
                    <th className="border border-border p-3 text-center font-semibold">Price</th>
                    <th className="border border-border p-3 text-center font-semibold">Change %</th>
                    <th className="border border-border p-3 text-center font-semibold">Volume</th>
                    <th className="border border-border p-3 text-center font-semibold">Expiration</th>
                    <th className="border border-border p-3 text-center font-semibold">Momentum</th>
                    <th className="border border-border p-3 text-center font-semibold text-xs">1m</th>
                    <th className="border border-border p-3 text-center font-semibold text-xs">5m</th>
                    <th className="border border-border p-3 text-center font-semibold text-xs">15m</th>
                    <th className="border border-border p-3 text-center font-semibold text-xs">30m</th>
                    <th className="border border-border p-3 text-center font-semibold text-xs">1h</th>
                    <th className="border border-border p-3 text-center font-semibold text-xs">4h</th>
                    <th className="border border-border p-3 text-center font-semibold text-xs">1d</th>
                  </tr>
                </thead>
                <tbody>
                   {scanResults.map((stock, stockIndex) => (
                     <>
                       {/* MoMo1 Row */}
                       <tr key={`${stock.id}-momo1`} className={stockIndex % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                         <td className="border border-border p-3 font-semibold" rowSpan={2}>
                           {stock.symbol}
                         </td>
                         <td className="border border-border p-3 text-center" rowSpan={2}>
                           {stock.company_name || 'N/A'}
                         </td>
                         <td className="border border-border p-3 text-center" rowSpan={2}>
                           ${stock.price.toFixed(2)}
                         </td>
                         <td className={`border border-border p-3 text-center font-semibold ${
                           stock.change_percent >= 0 ? 'text-green-600' : 'text-red-600'
                         }`} rowSpan={2}>
                           {stock.change_percent >= 0 ? '+' : ''}{stock.change_percent.toFixed(1)}%
                         </td>
                         <td className="border border-border p-3 text-center" rowSpan={2}>
                           {stock.volume.toLocaleString()}
                         </td>
                         <td className="border border-border p-3 text-center" rowSpan={2}>
                           {stock.contract_month || 'N/A'}
                         </td>
                         <td className="border border-border p-3 text-center text-sm font-semibold">
                           MoMo1
                         </td>
                         {(["1m", "5m", "15m", "30m", "1h", "4h", "1d"] as const).map((timeframe) => (
                           <td key={`momo1-${timeframe}`} className="border border-border p-3 text-center">
                             <div className={`w-4 h-4 mx-auto rounded-full ${getMomentumColor(stock.momo1_signals[timeframe])}`}></div>
                           </td>
                         ))}
                       </tr>
                       {/* MoMo2 Row */}
                       <tr key={`${stock.id}-momo2`} className={stockIndex % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                         <td className="border border-border p-3 text-center text-sm font-semibold">
                           MoMo2
                         </td>
                         {(["1m", "5m", "15m", "30m", "1h", "4h", "1d"] as const).map((timeframe) => (
                           <td key={`momo2-${timeframe}`} className="border border-border p-3 text-center">
                             <div className={`w-4 h-4 mx-auto rounded-full ${getMomentumColor(stock.momo2_signals[timeframe])}`}></div>
                           </td>
                         ))}
                       </tr>
                     </>
                   ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {scanResults.length === 0 && !isLoading && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  No momentum opportunities found in the latest scan.
                </p>
                <p className="text-sm text-muted-foreground">
                  Background scans run automatically every 15 minutes. Click "TRIGGER SCAN" to run a manual scan.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && scanResults.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground">
                Running background scan... Please wait.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;