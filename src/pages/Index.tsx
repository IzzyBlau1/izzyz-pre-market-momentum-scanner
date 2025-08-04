import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StockScan {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  volumeSpike: number;
  float: string;
  catalyst: string;
  momentum: {
    momo1: {
      "1m": "up" | "down" | "neutral";
      "5m": "up" | "down" | "neutral";
      "15m": "up" | "down" | "neutral";
      "1h": "up" | "down" | "neutral";
      "4h": "up" | "down" | "neutral";
      "daily": "up" | "down" | "neutral";
    };
    momo2: {
      "1m": "up" | "down" | "neutral";
      "5m": "up" | "down" | "neutral";
      "15m": "up" | "down" | "neutral";
      "1h": "up" | "down" | "neutral";
      "4h": "up" | "down" | "neutral";
      "daily": "up" | "down" | "neutral";
    };
  };
}

const Index = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<StockScan[]>([]);
  const [lastScan, setLastScan] = useState<Date | null>(null);

  const mockData: StockScan[] = [
    {
      symbol: "WSR",
      price: 12.19,
      change: 1.23,
      changePercent: 10.1,
      volume: 2450000,
      volumeSpike: 5.2,
      float: "9.8M",
      catalyst: "New Product Announcement",
      momentum: {
        momo1: { "1m": "up", "5m": "up", "15m": "up", "1h": "up", "4h": "up", "daily": "up" },
        momo2: { "1m": "up", "5m": "up", "15m": "up", "1h": "up", "4h": "up", "daily": "up" }
      }
    },
    {
      symbol: "THC",
      price: 5.94,
      change: 0.61,
      changePercent: 11.5,
      volume: 1200000,
      volumeSpike: 8.9,
      float: "7.3M", 
      catalyst: "Earnings Beat",
      momentum: {
        momo1: { "1m": "up", "5m": "up", "15m": "up", "1h": "up", "4h": "up", "daily": "up" },
        momo2: { "1m": "up", "5m": "up", "15m": "up", "1h": "up", "4h": "up", "daily": "up" }
      }
    },
    {
      symbol: "AES",
      price: 13.15,
      change: 1.71,
      changePercent: 15.0,
      volume: 890000,
      volumeSpike: 7.3,
      float: "9.2M",
      catalyst: "M&A",
      momentum: {
        momo1: { "1m": "up", "5m": "up", "15m": "up", "1h": "up", "4h": "up", "daily": "up" },
        momo2: { "1m": "up", "5m": "up", "15m": "up", "1h": "neutral", "4h": "down", "daily": "up" }
      }
    }
  ];

  const handleScan = async () => {
    setIsScanning(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setScanResults(mockData);
    setLastScan(new Date());
    setIsScanning(false);
  };

  const getMomentumColor = (direction: string) => {
    switch (direction) {
      case "up": return "bg-green-500";
      case "down": return "bg-red-500";
      default: return "bg-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Izzy'z Pre-Market Momentum Scanner
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            AI-Enhanced Pre-Market Stock Scanner ($2-$20 Range)
          </p>
          <Button 
            onClick={handleScan} 
            disabled={isScanning}
            size="lg"
            className="bg-primary hover:bg-primary/90"
          >
            {isScanning ? "Scanning..." : "SCAN"}
          </Button>
          {lastScan && (
            <p className="text-sm text-muted-foreground mt-2">
              Last scan: {lastScan.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Results Table */}
        {scanResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Scan Results ({scanResults.length} opportunities)
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border bg-card rounded-lg">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-3 text-left font-semibold">Ticker</th>
                    <th className="border border-border p-3 text-center font-semibold">Last $</th>
                    <th className="border border-border p-3 text-center font-semibold">% Change</th>
                    <th className="border border-border p-3 text-center font-semibold">V-Spike</th>
                    <th className="border border-border p-3 text-center font-semibold">Float</th>
                    <th className="border border-border p-3 text-center font-semibold">Catalyst</th>
                    <th className="border border-border p-3 text-center font-semibold">Momentum</th>
                    <th className="border border-border p-3 text-center font-semibold text-xs">1 MIN</th>
                    <th className="border border-border p-3 text-center font-semibold text-xs">5 MIN</th>
                    <th className="border border-border p-3 text-center font-semibold text-xs">15 MIN</th>
                    <th className="border border-border p-3 text-center font-semibold text-xs">1H</th>
                    <th className="border border-border p-3 text-center font-semibold text-xs">4H</th>
                    <th className="border border-border p-3 text-center font-semibold text-xs">Day</th>
                  </tr>
                </thead>
                <tbody>
                  {scanResults.map((stock, stockIndex) => (
                    <React.Fragment key={stock.symbol}>
                      {/* MoMo1 Row */}
                      <tr className={stockIndex % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                        <td className="border border-border p-3 font-semibold" rowSpan={2}>
                          {stock.symbol}
                        </td>
                        <td className="border border-border p-3 text-center" rowSpan={2}>
                          {stock.price.toFixed(2)}
                        </td>
                        <td className={`border border-border p-3 text-center font-semibold ${
                          stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                        }`} rowSpan={2}>
                          {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(1)}%
                        </td>
                        <td className="border border-border p-3 text-center" rowSpan={2}>
                          {stock.volumeSpike.toFixed(1)}x
                        </td>
                        <td className="border border-border p-3 text-center" rowSpan={2}>
                          {stock.float}
                        </td>
                        <td className="border border-border p-3 text-center text-sm" rowSpan={2}>
                          {stock.catalyst}
                        </td>
                        <td className="border border-border p-3 text-center text-sm font-semibold">
                          MoMo1
                        </td>
                        {(["1m", "5m", "15m", "1h", "4h", "daily"] as const).map((timeframe) => (
                          <td key={`momo1-${timeframe}`} className="border border-border p-3 text-center">
                            <div className={`w-4 h-4 mx-auto rounded-full ${getMomentumColor(stock.momentum.momo1[timeframe])}`}></div>
                          </td>
                        ))}
                      </tr>
                      {/* MoMo2 Row */}
                      <tr className={stockIndex % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                        <td className="border border-border p-3 text-center text-sm font-semibold">
                          MoMo2
                        </td>
                        {(["1m", "5m", "15m", "1h", "4h", "daily"] as const).map((timeframe) => (
                          <td key={`momo2-${timeframe}`} className="border border-border p-3 text-center">
                            <div className={`w-4 h-4 mx-auto rounded-full ${getMomentumColor(stock.momentum.momo2[timeframe])}`}></div>
                          </td>
                        ))}
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {scanResults.length === 0 && !isScanning && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground">
                Click SCAN to find pre-market momentum opportunities
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;