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

  const getMomentumTextColor = (direction: string | undefined) => {
    switch (direction) {
      case "bullish": return "text-green-400";
      case "bearish": return "text-red-400";
      case "neutral": return "text-yellow-400";
      default: return "text-gray-400";
    }
  };

  const getMomentumBgColor = (direction: string | undefined) => {
    switch (direction) {
      case "bullish": return "bg-green-900/30 border-green-500/50";
      case "bearish": return "bg-red-900/30 border-red-500/50";
      case "neutral": return "bg-yellow-900/30 border-yellow-500/50";
      default: return "bg-gray-900/30 border-gray-500/50";
    }
  };

  const getMomentumStatus = (momo1: any, momo2: any) => {
    const momo1Signals = Object.values(momo1 || {});
    const momo2Signals = Object.values(momo2 || {});
    
    const bullishCount = [...momo1Signals, ...momo2Signals].filter(s => s === 'bullish').length;
    const bearishCount = [...momo1Signals, ...momo2Signals].filter(s => s === 'bearish').length;
    
    if (bullishCount >= 5) return { status: 'GOING LONG', color: 'text-green-400', bg: 'bg-green-900/50' };
    if (bearishCount >= 5) return { status: 'GOING SHORT', color: 'text-red-400', bg: 'bg-red-900/50' };
    if (bullishCount > bearishCount) return { status: 'BULLISH TERRITORY', color: 'text-green-300', bg: 'bg-green-900/30' };
    if (bearishCount > bullishCount) return { status: 'BEARISH TERRITORY', color: 'text-red-300', bg: 'bg-red-900/30' };
    return { status: 'NO MOMENTUM', color: 'text-gray-400', bg: 'bg-gray-900/30' };
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

        {/* Professional Multi-Timeframe Display */}
        {scanResults.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center text-white mb-6">
              🚀 Index Futures - Real-Time Momentum Analysis ({scanResults.length} instruments)
            </h2>
            
            <div className="space-y-6">
              {scanResults.map((stock, index) => {
                const momentumStatus = getMomentumStatus(stock.momo1_signals, stock.momo2_signals);
                return (
                  <div key={stock.id || index} className={`p-6 rounded-xl border-2 ${momentumStatus.bg} border-gray-600`}>
                    {/* Header Section */}
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-3xl font-bold text-white">{stock.symbol}</h3>
                        <p className="text-xl text-gray-300">{stock.company_name}</p>
                        <div className="flex gap-4 text-sm text-gray-400 mt-1">
                          <span>Contract: {stock.contract_month}</span>
                          <span>Exp: {stock.expiration_date}</span>
                          <span>Updated: {new Date(stock.scan_timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold px-6 py-3 rounded-lg ${momentumStatus.color} bg-black/70 border border-gray-500`}>
                          {momentumStatus.status}
                        </div>
                      </div>
                    </div>

                    {/* Price Section */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      <div className="bg-black/50 p-4 rounded-lg border border-gray-600">
                        <div className="text-sm text-gray-400 uppercase tracking-wide">Price</div>
                        <div className="text-2xl font-bold text-white">${stock.price.toFixed(2)}</div>
                      </div>
                      <div className="bg-black/50 p-4 rounded-lg border border-gray-600">
                        <div className="text-sm text-gray-400 uppercase tracking-wide">Change</div>
                        <div className={`text-2xl font-bold ${stock.change_percent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {stock.change_percent >= 0 ? '+' : ''}{stock.change_percent.toFixed(2)}%
                        </div>
                      </div>
                      <div className="bg-black/50 p-4 rounded-lg border border-gray-600">
                        <div className="text-sm text-gray-400 uppercase tracking-wide">Volume</div>
                        <div className="text-2xl font-bold text-white">{formatFloat(stock.volume)}</div>
                      </div>
                      <div className="bg-black/50 p-4 rounded-lg border border-gray-600">
                        <div className="text-sm text-gray-400 uppercase tracking-wide">Vol Spike</div>
                        <div className="text-2xl font-bold text-blue-400">{stock.volume_spike}x</div>
                      </div>
                    </div>

                    {/* Multi-Timeframe Analysis Grid */}
                    <div className="grid grid-cols-7 gap-3">
                      {/* Timeframe Headers */}
                      <div className="text-center font-bold text-white bg-black/70 p-3 rounded-lg">
                        <div className="text-sm">TIMEFRAME</div>
                      </div>
                      {['1m', '5m', '15m', '30m', '1h', '4h', '1d'].map(tf => (
                        <div key={tf} className="text-center font-bold text-white bg-black/70 p-3 rounded-lg">
                          <div className="text-sm">{tf.toUpperCase()}</div>
                        </div>
                      ))}

                      {/* MoMo1 Row */}
                      <div className="bg-black/50 p-3 rounded-lg border border-gray-600">
                        <div className="text-sm font-semibold text-white">MoMo1</div>
                        <div className="text-xs text-gray-400">Stochastic</div>
                      </div>
                      {['1m', '5m', '15m', '30m', '1h', '4h', '1d'].map(timeframe => {
                        const signal = stock.momo1_signals?.[timeframe as keyof typeof stock.momo1_signals];
                        return (
                          <div key={`momo1-${timeframe}`} className={`p-3 rounded-lg border-2 text-center ${getMomentumBgColor(signal)}`}>
                            <div className={`font-bold uppercase text-sm ${getMomentumTextColor(signal)}`}>
                              {signal === 'bullish' ? 'LONG' : signal === 'bearish' ? 'SHORT' : signal === 'neutral' ? 'NEUT' : 'N/A'}
                            </div>
                            <div className={`w-3 h-3 mx-auto mt-1 rounded-full ${getMomentumColor(signal)}`}></div>
                          </div>
                        );
                      })}

                      {/* MoMo2 Row */}
                      <div className="bg-black/50 p-3 rounded-lg border border-gray-600">
                        <div className="text-sm font-semibold text-white">MoMo2</div>
                        <div className="text-xs text-gray-400">Williams %R</div>
                      </div>
                      {['1m', '5m', '15m', '30m', '1h', '4h', '1d'].map(timeframe => {
                        const signal = stock.momo2_signals?.[timeframe as keyof typeof stock.momo2_signals];
                        return (
                          <div key={`momo2-${timeframe}`} className={`p-3 rounded-lg border-2 text-center ${getMomentumBgColor(signal)}`}>
                            <div className={`font-bold uppercase text-sm ${getMomentumTextColor(signal)}`}>
                              {signal === 'bullish' ? 'LONG' : signal === 'bearish' ? 'SHORT' : signal === 'neutral' ? 'NEUT' : 'N/A'}
                            </div>
                            <div className={`w-3 h-3 mx-auto mt-1 rounded-full ${getMomentumColor(signal)}`}></div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
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