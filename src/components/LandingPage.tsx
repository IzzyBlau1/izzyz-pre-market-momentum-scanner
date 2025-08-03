import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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

const LandingPage = () => {
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
      case "up": return "#10b981";
      case "down": return "#ef4444";
      default: return "#9ca3af";
    }
  };

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      margin: 0,
      background: 'white',
      fontSize: '18px',
      lineHeight: 1.6,
      backgroundColor: '#f8f8f8',
      padding: '20px',
      color: '#333'
    }}>
      <div style={{
        width: '90%',
        paddingBottom: '10px',
        marginBottom: 0,
        maxWidth: '1200px',
        margin: 'auto',
        background: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div>
            <img 
              alt="Logo" 
              src="/lovable-uploads/77871a24-00a8-46f0-9aac-df91f38fbbc3.png" 
              style={{
                width: '240px',
                height: '150px'
              }}
            />
          </div>
          <div>
            <h1 style={{
              color: '#222',
              textAlign: 'center',
              marginTop: 0,
              marginBottom: '10px',
              fontSize: '28px',
              fontWeight: 'bold'
            }}>
              Izzy'z Pre-Market Momentum Scanner
            </h1>
            <h2 style={{
              color: '#222',
              textAlign: 'center',
              fontSize: '20px',
              fontWeight: 'bold',
              marginTop: '10px',
              marginBottom: '15px'
            }}>
              Get the Best Trade Setups 90 Minutes Before the Bell. Enter Your Trades Pre-Market, and Be Done With Your Trading Day Before the Market Even Opens!!
            </h2>
            <p style={{ 
              textAlign: 'left', 
              color: '#222',
              marginTop: '15px',
              marginBottom: '20px' 
            }}>
              <span style={{
                color: '#008060',
                fontWeight: 'bold'
              }}>
                AI-assisted. Powered by AI-enhanced logic. Built using AI-assisted modeling for real-time directional clarity.
              </span>
            </p>
          </div>
        </div>
        
        {/* Interactive Scanner Demo */}
        <div style={{
          marginTop: '40px',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <Button 
              onClick={handleScan} 
              disabled={isScanning}
              style={{
                backgroundColor: '#008060',
                color: 'white',
                padding: '15px 25px',
                fontSize: '18px',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              {isScanning ? "Scanning..." : "SCAN"}
            </Button>
            {lastScan && (
              <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                Last scan: {lastScan.toLocaleTimeString()}
              </p>
            )}
          </div>

          {/* Scanner Results Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              border: '1px solid #ddd',
              backgroundColor: 'white',
              borderRadius: '8px',
              fontSize: '14px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f0f0f0' }}>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', fontWeight: 'bold' }}>Ticker</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>Last $</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>% Change</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>V-Spike</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>Float</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>Catalyst</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>Momentum</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '10px' }}>1 MIN</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '10px' }}>5 MIN</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '10px' }}>15 MIN</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '10px' }}>1H</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '10px' }}>4H</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '10px' }}>Day</th>
                </tr>
              </thead>
              <tbody>
                {scanResults.length > 0 && scanResults.map((stock, stockIndex) => (
                    <React.Fragment key={stock.symbol}>
                      {/* MoMo1 Row */}
                      <tr style={{ backgroundColor: stockIndex % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                        <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }} rowSpan={2}>
                          {stock.symbol}
                        </td>
                        <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }} rowSpan={2}>
                          ${stock.price.toFixed(2)}
                        </td>
                        <td style={{ 
                          border: '1px solid #ddd', 
                          padding: '8px', 
                          textAlign: 'center', 
                          fontWeight: 'bold',
                          color: stock.changePercent >= 0 ? '#10b981' : '#ef4444'
                        }} rowSpan={2}>
                          {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(1)}%
                        </td>
                        <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }} rowSpan={2}>
                          {stock.volumeSpike.toFixed(1)}x
                        </td>
                        <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }} rowSpan={2}>
                          {stock.float}
                        </td>
                        <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '12px' }} rowSpan={2}>
                          {stock.catalyst}
                        </td>
                        <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                          MoMo1
                        </td>
                        {(["1m", "5m", "15m", "1h", "4h", "daily"] as const).map((timeframe) => (
                          <td key={`momo1-${timeframe}`} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                            <div style={{
                              width: '12px',
                              height: '12px',
                              margin: '0 auto',
                              borderRadius: '50%',
                              backgroundColor: getMomentumColor(stock.momentum.momo1[timeframe])
                            }}></div>
                          </td>
                        ))}
                      </tr>
                      {/* MoMo2 Row */}
                      <tr style={{ backgroundColor: stockIndex % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                        <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                          MoMo2
                        </td>
                        {(["1m", "5m", "15m", "1h", "4h", "daily"] as const).map((timeframe) => (
                          <td key={`momo2-${timeframe}`} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                            <div style={{
                              width: '12px',
                              height: '12px',
                              margin: '0 auto',
                              borderRadius: '50%',
                              backgroundColor: getMomentumColor(stock.momentum.momo2[timeframe])
                            }}></div>
                          </td>
                        ))}
                      </tr>
                     </React.Fragment>
                  ))
                }
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {scanResults.length === 0 && !isScanning && (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              backgroundColor: '#f9f9f9',
              borderRadius: '8px',
              border: '1px solid #ddd'
            }}>
              <p style={{ color: '#666' }}>
                Click SCAN to see live pre-market momentum opportunities
              </p>
            </div>
          )}
        </div>
        
        <h3 style={{
          margin: 0,
          padding: 0,
          textAlign: 'center',
          color: '#222',
          fontWeight: 'bold',
          marginBottom: '20px'
        }}>
          What Makes This Scanner So Special?
        </h3>
        <ul style={{ marginLeft: '20px' }}>
          <li style={{ color: '#222' }}>
            ✅ <strong>Optimized for Pre-Market Trading</strong> – Find top movers 60–90 minutes before the market opens.
          </li>
          <li style={{ color: '#222' }}>
            ✅ <strong>Dual Momentum Confirmation</strong> – Powered by AI-enhanced logic using two independent directional models.
          </li>
          <li style={{ color: '#222' }}>
            ✅ <strong>Catalyst-Driven</strong> – No Catalyst? No signal! This scanner only shows stocks backed by a catalyst driven event.
          </li>
          <li style={{ color: '#222' }}>
            ✅ <strong>Clear Visual Output</strong> – Color-coded trend signals across 6 timeframes, from 1m to Daily.
          </li>
          <li style={{ color: '#222' }}>
            ✅ <strong>Lightweight and Easy to Use</strong> – Just click <strong>Scan</strong>. No setup. No coding. No platform dependency.
          </li>
        </ul>
        
        <h3 style={{ 
          color: '#222', 
          textAlign: 'center',
          fontWeight: 'bold',
          marginTop: '40px',
          marginBottom: '20px'
        }}>What's Included:</h3>
        <ul style={{ marginLeft: '20px' }}>
          <li style={{ color: '#222' }}>✅ Instant access to the standalone scanner app</li>
          <li style={{ color: '#222' }}>✅ No Recurring or Subscription Fees. Lifetime FREE Upgrades.</li>
          <li style={{ color: '#222' }}>✅ Float, price, volume spike, and catalyst filters built-in</li>
          <li style={{ color: '#222' }}>✅ Proprietary AI-assisted momentum detection</li>
          <li style={{ color: '#222' }}>✅ 5–10 qualified trade opportunities daily</li>
          <li style={{ color: '#222' }}>✅ Works alongside any brokerage account</li>
          <li style={{ color: '#222' }}>✅ Compatible with Windows, Mac, Android, and iOS — available as a mobile download or use through your desktop browser</li>
        </ul>
        
        <h3 style={{ 
          color: '#222', 
          textAlign: 'center',
          fontWeight: 'bold',
          marginTop: '40px',
          marginBottom: '20px'
        }}>As easy as 1, 2, 3:</h3>
        <ol style={{ marginLeft: '20px' }}>
          <li style={{ color: '#222' }}>1. Open the scanner app</li>
          <li style={{ color: '#222' }}>2. Click the <strong>Scan</strong> button</li>
          <li style={{ color: '#222' }}>3. Review results with directional bias, float, volume, and catalyst data</li>
          <li style={{ color: '#222' }}>Execute trades using your broker (if pre-market access is available)</li>
        </ol>
        
        <h3 style={{ 
          textAlign: 'center', 
          color: '#222',
          fontWeight: 'bold',
          fontSize: '24px',
          marginTop: '40px',
          marginBottom: '20px'
        }}>
          One Time Low Price <span style={{ color: '#008060', fontWeight: 'bold' }}>$97</span> ... No Recurring or Subscription Fees
        </h3>
        <p style={{
          textAlign: 'center',
          fontWeight: 'bold',
          marginTop: '20px',
          color: '#222'
        }}>
          No subscriptions. No bloat. Just a sharp trading tool that gives you an undeniable proven edge before most traders even have a clue.
        </p>
        
        <div style={{ textAlign: 'center' }}>
          <Link 
            to="/scanner" 
            style={{
              backgroundColor: '#008060',
              color: 'white',
              padding: '15px 25px',
              textAlign: 'center',
              display: 'inline-block',
              borderRadius: '5px',
              marginTop: '20px',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            Download Now - Start Winning Today and Get the Trading Edge You've Been Looking For
          </Link>
        </div>
        
        <h3 style={{ color: '#222', textAlign: 'center' }}>Pricing Comparison:</h3>
        <table style={{
          marginTop: '40px',
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr>
              <th style={{
                border: '1px solid #ddd',
                padding: '10px',
                textAlign: 'center',
                backgroundColor: '#f0f0f0',
                color: '#222'
              }}>Feature</th>
              <th style={{
                border: '1px solid #ddd',
                padding: '10px',
                textAlign: 'center',
                backgroundColor: '#f0f0f0',
                color: '#222'
              }}>Izzy'z Scanner</th>
              <th style={{
                border: '1px solid #ddd',
                padding: '10px',
                textAlign: 'center',
                backgroundColor: '#f0f0f0',
                color: '#222'
              }}>Typical Scanner</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center', color: '#222' }}>Price</td>
              <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center', color: '#222' }}>$97 (one-time)</td>
              <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center', color: '#222' }}>$39/month</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center', color: '#222' }}>Lifetime Access</td>
              <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center', color: '#222' }}>✅</td>
              <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center', color: '#222' }}>❌</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center', color: '#222' }}>Pre-Market Scanning</td>
              <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center', color: '#222' }}>✅</td>
              <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center', color: '#222' }}>❌</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center', color: '#222' }}>Catalyst Detection</td>
              <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center', color: '#222' }}>✅</td>
              <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center', color: '#222' }}>❌</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center', color: '#222' }}>Momentum Confirmation</td>
              <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center', color: '#222' }}>✅</td>
              <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center', color: '#222' }}>❌</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center', color: '#222' }}>Broker Independence</td>
              <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center', color: '#222' }}>✅</td>
              <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center', color: '#222' }}>❌</td>
            </tr>
          </tbody>
        </table>
        
        <div style={{ marginTop: '40px' }}>
          <h3 style={{ 
            color: '#222', 
            textAlign: 'center',
            fontWeight: 'bold'
          }}>What Traders Are Saying:</h3>
          <div style={{
            backgroundColor: '#f9f9f9',
            borderLeft: '5px solid #008060',
            marginBottom: '20px',
            padding: '15px 20px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <img 
              alt="Sarah" 
              src="https://randomuser.me/api/portraits/women/44.jpg"
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%'
              }}
            />
            <div>
              <div><strong style={{ color: '#222' }}>Sarah M.</strong></div>
              <div style={{
                color: 'gold',
                fontSize: '18px',
                marginTop: '5px'
              }}>★★★★★</div>
              <div style={{ color: '#222' }}>"Been trading for 8 years. This is the first time I consistently catch pre-market runners. Total game changer."</div>
            </div>
          </div>
          <div style={{
            backgroundColor: '#f9f9f9',
            borderLeft: '5px solid #008060',
            marginBottom: '20px',
            padding: '15px 20px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <img 
              alt="Mark" 
              src="https://randomuser.me/api/portraits/men/22.jpg"
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%'
              }}
            />
            <div>
              <div><strong style={{ color: '#222' }}>Mark T.</strong></div>
              <div style={{
                color: 'gold',
                fontSize: '18px',
                marginTop: '5px'
              }}>★★★★★</div>
              <div style={{ color: '#222' }}>"I was skeptical... but 3 back-to-back green trades in pre-market? I'm convinced."</div>
            </div>
          </div>
          <div style={{
            backgroundColor: '#f9f9f9',
            borderLeft: '5px solid #008060',
            marginBottom: '20px',
            padding: '15px 20px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <img 
              alt="Alex" 
              src="https://randomuser.me/api/portraits/men/12.jpg"
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%'
              }}
            />
            <div>
              <div><strong style={{ color: '#222' }}>Alex D.</strong></div>
              <div style={{
                color: 'gold',
                fontSize: '18px',
                marginTop: '5px'
              }}>★★★★★</div>
              <div style={{ color: '#222' }}>"Saves me an hour of chart scanning every morning. Click. Done. Profit."</div>
            </div>
          </div>
        </div>
        
        <div style={{
          marginTop: '30px',
          display: 'flex',
          gap: '20px',
          justifyContent: 'center'
        }}>
          <img alt="Trusted" src="https://img.icons8.com/ios-filled/50/verified-account.png" style={{ height: '40px' }}/>
          <img alt="Rated" src="https://img.icons8.com/ios-filled/50/thumb-up.png" style={{ height: '40px' }}/>
          <img alt="Reliable" src="https://img.icons8.com/ios-filled/50/handshake.png" style={{ height: '40px' }}/>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;