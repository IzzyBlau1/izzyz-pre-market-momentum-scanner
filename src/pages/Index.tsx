import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StockScan {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  float: string;
  catalyst: string;
  momentum: {
    "1m": "up" | "down" | "neutral";
    "5m": "up" | "down" | "neutral";
    "15m": "up" | "down" | "neutral";
    "1h": "up" | "down" | "neutral";
    "4h": "up" | "down" | "neutral";
    "daily": "up" | "down" | "neutral";
  };
}

const Index = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<StockScan[]>([]);
  const [lastScan, setLastScan] = useState<Date | null>(null);

  const mockData: StockScan[] = [
    {
      symbol: "AAPL",
      price: 15.42,
      change: 2.18,
      changePercent: 16.47,
      volume: 2450000,
      float: "15.6B",
      catalyst: "Earnings Beat",
      momentum: { "1m": "up", "5m": "up", "15m": "up", "1h": "up", "4h": "up", "daily": "up" }
    },
    {
      symbol: "TSLA",
      price: 8.75,
      change: -0.45,
      changePercent: -4.89,
      volume: 1200000,
      float: "3.2B", 
      catalyst: "FDA Approval",
      momentum: { "1m": "down", "5m": "down", "15m": "neutral", "1h": "up", "4h": "up", "daily": "up" }
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

        {/* Results */}
        {scanResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Scan Results ({scanResults.length} opportunities)
            </h2>
            
            {scanResults.map((stock) => (
              <Card key={stock.symbol} className="border border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{stock.symbol}</CardTitle>
                    <div className="text-right">
                      <div className="text-2xl font-bold">${stock.price}</div>
                      <div className={`text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    {/* Basic Info */}
                    <div>
                      <h4 className="font-semibold mb-2">Basic Info</h4>
                      <div className="space-y-1 text-sm">
                        <div>Volume: {stock.volume.toLocaleString()}</div>
                        <div>Float: {stock.float}</div>
                      </div>
                    </div>

                    {/* Catalyst */}
                    <div>
                      <h4 className="font-semibold mb-2">Catalyst</h4>
                      <Badge variant="secondary">{stock.catalyst}</Badge>
                    </div>

                    {/* Momentum Timeframes */}
                    <div className="md:col-span-2">
                      <h4 className="font-semibold mb-2">Momentum Signals</h4>
                      <div className="grid grid-cols-6 gap-2">
                        {Object.entries(stock.momentum).map(([timeframe, direction]) => (
                          <div key={timeframe} className="text-center">
                            <div className="text-xs mb-1">{timeframe}</div>
                            <div className={`w-8 h-8 mx-auto rounded ${getMomentumColor(direction)}`}></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
