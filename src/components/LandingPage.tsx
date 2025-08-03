import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
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
              src="/Image of Izzy2.png" 
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
              marginBottom: '10px'
            }}>
              Izzy'z Pre-Market Momentum Scanner
            </h1>
            <h2 style={{
              color: '#222',
              textAlign: 'center'
            }}>
              Get the Best Trade Setups 90 Minutes Before the Bell. Enter Your Trades Pre-Market, and Be Done With Your Trading Day Before the Market Even Opens!!
            </h2>
            <p style={{ textAlign: 'left', color: '#222' }}>
              <span style={{
                color: '#008060',
                fontWeight: 'bold'
              }}>
                AI-assisted. Powered by AI-enhanced logic. Built using AI-assisted modeling for real-time directional clarity.
              </span>
            </p>
          </div>
        </div>
        
        <div style={{
          marginBottom: '0 !important',
          paddingBottom: '0 !important',
          marginTop: '40px'
        }}>
          <img 
            alt="Scanner Output Table" 
            src="/Manus_scanner-output-font-xxl.png" 
            style={{
              marginBottom: '0 !important',
              paddingBottom: '0 !important',
              width: '100%',
              border: '1px solid #ccc',
              borderRadius: '6px',
              marginTop: '20px'
            }}
          />
        </div>
        
        <h3 style={{
          margin: 0,
          padding: 0,
          textAlign: 'center',
          color: '#222'
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
        
        <h3 style={{ color: '#222', textAlign: 'center' }}>What's Included:</h3>
        <ul style={{ marginLeft: '20px' }}>
          <li style={{ color: '#222' }}>✅ Instant access to the standalone scanner app</li>
          <li style={{ color: '#222' }}>✅ No Recurring or Subscription Fees. Lifetime FREE Upgrades.</li>
          <li style={{ color: '#222' }}>✅ Float, price, volume spike, and catalyst filters built-in</li>
          <li style={{ color: '#222' }}>✅ Proprietary AI-assisted momentum detection</li>
          <li style={{ color: '#222' }}>✅ 5–10 qualified trade opportunities daily</li>
          <li style={{ color: '#222' }}>✅ Works alongside any brokerage account</li>
          <li style={{ color: '#222' }}>✅ Compatible with Windows, Mac, Android, and iOS — available as a mobile download or use through your desktop browser</li>
        </ul>
        
        <h3 style={{ color: '#222', textAlign: 'center' }}>As easy as 1, 2, 3:</h3>
        <ol style={{ marginLeft: '20px' }}>
          <li style={{ color: '#222' }}>Open the scanner app</li>
          <li style={{ color: '#222' }}>Click the <strong>Scan</strong> button</li>
          <li style={{ color: '#222' }}>Review results with directional bias, float, volume, and catalyst data</li>
          <li style={{ color: '#222' }}>Execute trades using your broker (if pre-market access is available)</li>
        </ol>
        
        <h3 style={{ textAlign: 'center', color: '#222' }}>
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
          <h3 style={{ color: '#222', textAlign: 'center' }}>What Traders Are Saying:</h3>
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