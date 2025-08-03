import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="font-sans p-0 m-0 bg-white text-lg leading-relaxed bg-gray-50 text-gray-800">
      <div className="w-[90%] max-w-6xl mx-auto bg-white p-10 rounded-lg shadow-lg">
        <div className="flex flex-row items-start gap-5 mb-5">
          <div>
            <img 
              alt="Logo" 
              src="/Image of Izzy2.png" 
              className="w-40 h-auto mr-5"
            />
          </div>
          <div>
            <h1 className="mt-0 mb-2.5 text-gray-800 text-center">
              Izzy'z Pre-Market Momentum Scanner
            </h1>
            <h2 className="text-gray-800 text-center">
              Get the Best Trade Setups 90 Minutes Before the Bell. Enter Your Trades Pre-Market, and Be Done With Your Trading Day Before the Market Even Opens!!
            </h2>
            <p className="text-left text-gray-800">
              <span className="text-teal-700 font-bold">
                AI-assisted. Powered by AI-enhanced logic. Built using AI-assisted modeling for real-time directional clarity.
              </span>
            </p>
          </div>
        </div>
        
        <div className="mt-10 mb-0">
          <img 
            alt="Scanner Output Table" 
            src="/Manus_scanner-output-font-xxl.png" 
            className="w-full max-w-6xl h-auto block mx-auto p-0 bg-white border-none shadow-none"
          />
        </div>
        
        <h3 className="m-0 p-0 text-center text-gray-800">
          What Makes This Scanner So Special?
        </h3>
        <ul className="ml-5">
          <li className="text-gray-800">
            ✅ <strong>Optimized for Pre-Market Trading</strong> – Find top movers 60–90 minutes before the market opens.
          </li>
          <li className="text-gray-800">
            ✅ <strong>Dual Momentum Confirmation</strong> – Powered by AI-enhanced logic using two independent directional models.
          </li>
          <li className="text-gray-800">
            ✅ <strong>Catalyst-Driven</strong> – No Catalyst? No signal! This scanner only shows stocks backed by a catalyst driven event.
          </li>
          <li className="text-gray-800">
            ✅ <strong>Clear Visual Output</strong> – Color-coded trend signals across 6 timeframes, from 1m to Daily.
          </li>
          <li className="text-gray-800">
            ✅ <strong>Lightweight and Easy to Use</strong> – Just click <strong>Scan</strong>. No setup. No coding. No platform dependency.
          </li>
        </ul>
        
        <h3 className="text-gray-800 text-center">What's Included:</h3>
        <ul className="ml-5">
          <li className="text-gray-800">✅ Instant access to the standalone scanner app</li>
          <li className="text-gray-800">✅ No Recurring or Subscription Fees. Lifetime FREE Upgrades.</li>
          <li className="text-gray-800">✅ Float, price, volume spike, and catalyst filters built-in</li>
          <li className="text-gray-800">✅ Proprietary AI-assisted momentum detection</li>
          <li className="text-gray-800">✅ 5–10 qualified trade opportunities daily</li>
          <li className="text-gray-800">✅ Works alongside any brokerage account</li>
          <li className="text-gray-800">✅ Compatible with Windows, Mac, Android, and iOS — available as a mobile download or use through your desktop browser</li>
        </ul>
        
        <h3 className="text-gray-800 text-center">As easy as 1, 2, 3:</h3>
        <ol className="ml-5">
          <li className="text-gray-800">Open the scanner app</li>
          <li className="text-gray-800">Click the <strong>Scan</strong> button</li>
          <li className="text-gray-800">Review results with directional bias, float, volume, and catalyst data</li>
          <li className="text-gray-800">Execute trades using your broker (if pre-market access is available)</li>
        </ol>
        
        <h3 className="text-center text-gray-800">
          One Time Low Price <span className="text-teal-700 font-bold">$97</span> ... No Recurring or Subscription Fees
        </h3>
        <p className="text-center font-bold mt-5 text-gray-800">
          No subscriptions. No bloat. Just a sharp trading tool that gives you an undeniable proven edge before most traders even have a clue.
        </p>
        
        <div className="text-center">
          <Link 
            to="/scanner" 
            className="bg-teal-700 text-white py-4 px-6 text-center inline-block rounded-md mt-5 no-underline font-bold hover:bg-teal-800 transition-colors"
          >
            Try Scanner Now - Get the Trading Edge You've Been Looking For
          </Link>
        </div>
        
        <h3 className="text-gray-800 text-center">Pricing Comparison:</h3>
        <table className="mt-10 w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2.5 text-center bg-gray-100 text-gray-800">Feature</th>
              <th className="border border-gray-300 p-2.5 text-center bg-gray-100 text-gray-800">Izzy'z Scanner</th>
              <th className="border border-gray-300 p-2.5 text-center bg-gray-100 text-gray-800">Typical Scanner</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2.5 text-center text-gray-800">Price</td>
              <td className="border border-gray-300 p-2.5 text-center text-gray-800">$97 (one-time)</td>
              <td className="border border-gray-300 p-2.5 text-center text-gray-800">$39/month</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2.5 text-center text-gray-800">Lifetime Access</td>
              <td className="border border-gray-300 p-2.5 text-center text-gray-800">✅</td>
              <td className="border border-gray-300 p-2.5 text-center text-gray-800">❌</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2.5 text-center text-gray-800">Pre-Market Scanning</td>
              <td className="border border-gray-300 p-2.5 text-center text-gray-800">✅</td>
              <td className="border border-gray-300 p-2.5 text-center text-gray-800">❌</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2.5 text-center text-gray-800">Catalyst Detection</td>
              <td className="border border-gray-300 p-2.5 text-center text-gray-800">✅</td>
              <td className="border border-gray-300 p-2.5 text-center text-gray-800">❌</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2.5 text-center text-gray-800">Momentum Confirmation</td>
              <td className="border border-gray-300 p-2.5 text-center text-gray-800">✅</td>
              <td className="border border-gray-300 p-2.5 text-center text-gray-800">❌</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2.5 text-center text-gray-800">Broker Independence</td>
              <td className="border border-gray-300 p-2.5 text-center text-gray-800">✅</td>
              <td className="border border-gray-300 p-2.5 text-center text-gray-800">❌</td>
            </tr>
          </tbody>
        </table>
        
        <div className="mt-10">
          <h3 className="text-gray-800 text-center">What Traders Are Saying:</h3>
          <div className="bg-gray-50 border-l-4 border-teal-700 mb-5 p-4 rounded-md flex items-center gap-4">
            <img 
              alt="Sarah" 
              src="https://randomuser.me/api/portraits/women/44.jpg"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <div><strong className="text-gray-800">Sarah M.</strong></div>
              <div className="text-yellow-500 text-lg mt-1">★★★★★</div>
              <div className="text-gray-800">"Been trading for 8 years. This is the first time I consistently catch pre-market runners. Total game changer."</div>
            </div>
          </div>
          <div className="bg-gray-50 border-l-4 border-teal-700 mb-5 p-4 rounded-md flex items-center gap-4">
            <img 
              alt="Mark" 
              src="https://randomuser.me/api/portraits/men/22.jpg"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <div><strong className="text-gray-800">Mark T.</strong></div>
              <div className="text-yellow-500 text-lg mt-1">★★★★★</div>
              <div className="text-gray-800">"I was skeptical... but 3 back-to-back green trades in pre-market? I'm convinced."</div>
            </div>
          </div>
          <div className="bg-gray-50 border-l-4 border-teal-700 mb-5 p-4 rounded-md flex items-center gap-4">
            <img 
              alt="Alex" 
              src="https://randomuser.me/api/portraits/men/12.jpg"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <div><strong className="text-gray-800">Alex D.</strong></div>
              <div className="text-yellow-500 text-lg mt-1">★★★★★</div>
              <div className="text-gray-800">"Saves me an hour of chart scanning every morning. Click. Done. Profit."</div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex gap-5 justify-center">
          <img alt="Trusted" src="https://img.icons8.com/ios-filled/50/verified-account.png" className="h-10"/>
          <img alt="Rated" src="https://img.icons8.com/ios-filled/50/thumb-up.png" className="h-10"/>
          <img alt="Reliable" src="https://img.icons8.com/ios-filled/50/handshake.png" className="h-10"/>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;