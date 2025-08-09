import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BarChart3, Zap, Monitor, Users, Shield, ChevronRight, Star, Check } from "lucide-react";
import { useState, useEffect } from "react";
const LandingPage = () => {
  const [momentumStates, setMomentumStates] = useState<{
    [key: string]: string[];
  }>({});
  const signals = ['LONG', 'SHORT', 'WeakBuy', 'WeakShort', 'StrongBuy', 'StrongShort', 'HOLD'];
  const getSignalStyle = (signal: string) => {
    switch (signal) {
      case 'LONG':
        return 'bg-green-400 text-white';
      case 'SHORT':
        return 'bg-red-500 text-white';
      case 'WeakBuy':
        return 'bg-blue-500 text-white';
      case 'WeakShort':
        return 'bg-fuchsia-500 text-white';
      case 'StrongBuy':
        return 'bg-green-800 text-white';
      case 'StrongShort':
        return 'bg-red-700 text-white';
      case 'HOLD':
        return 'bg-yellow-500 text-black';
      default:
        return 'bg-gray-500 text-white';
    }
  };
  const getRandomSignal = () => signals[Math.floor(Math.random() * signals.length)];
  const initializeMomentumStates = () => {
    const tickers = ['AMD', 'NVDA', 'TSLA', 'MSFT', 'AAPL', 'SPY', '/NQ', '/GC', '/CL'];
    const states: {
      [key: string]: string[];
    } = {};
    tickers.forEach(ticker => {
      if (ticker === 'SPY' || ticker === '/NQ' || ticker === 'NVDA') {
        // Keep these all green (LONG)
        states[ticker] = Array(16).fill('LONG');
      } else {
        // Initialize with random signals for other tickers
        states[ticker] = Array(16).fill(null).map(() => getRandomSignal());
      }
    });
    setMomentumStates(states);
  };
  useEffect(() => {
    initializeMomentumStates();
  }, []);

  // Animation stopped per user request

  const features = [{
    icon: TrendingUp,
    title: "Real-Time Momentum Analysis",
    description: "Track momentum across multiple timeframes with instant visual feedback. No charts needed - just pure, actionable data."
  }, {
    icon: BarChart3,
    title: "Custom Column Technology",
    description: "Our revolutionary custom column setup shows momentum changes in real-time with color-coded indicators across all timeframes."
  }, {
    icon: Monitor,
    title: "Space-Efficient Design",
    description: "Monitor unlimited instruments without multiple screens. Perfect for traders with limited monitor space - see everything at once."
  }, {
    icon: Zap,
    title: "Dual Momentum Studies",
    description: "Advanced dual momentum analysis for each timeframe and instrument, giving you complete market insight in one compact view."
  }];
  const testimonials = [{
    name: "Marcus Chen",
    role: "Day Trader",
    content: "The custom column setup is genius. I can monitor 20+ stocks across all timeframes on a single screen. Game changer for my setup.",
    rating: 5
  }, {
    name: "Sarah Rodriguez",
    role: "Swing Trader",
    content: "Finally, a solution that doesn't require multiple monitors. The real-time momentum colors give me instant market insight.",
    rating: 5
  }, {
    name: "David Thompson",
    role: "Professional Trader",
    content: "This workspace saves me hours of analysis. The momentum tracking across metals and oil futures is incredibly powerful.",
    rating: 5
  }];
  const pricingPlans = [{
    name: "Essential",
    price: "$49",
    period: "/month",
    description: "Perfect for individual traders getting started",
    features: ["Real-time momentum tracking", "Up to 5 custom instruments", "Basic momentum indicators", "Email support"],
    popular: false
  }, {
    name: "Professional",
    price: "$99",
    period: "/month",
    description: "Ideal for serious traders and small teams",
    features: ["Unlimited instruments", "Custom column technology", "Dual momentum studies", "Advanced timeframe analysis", "Priority support", "Training materials"],
    popular: true
  }, {
    name: "Enterprise",
    price: "$199",
    period: "/month",
    description: "Built for trading firms and institutions",
    features: ["Everything in Professional", "Multi-user access", "Custom indicator development", "Dedicated account manager", "24/7 phone support", "API access"],
    popular: false
  }];
  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">IzzyzTradingTools.com</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Reviews</a>
              <Button variant="outline" size="sm">Sign In</Button>
              <Button size="sm">Get Started</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Live Tool Showcase */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">See Our Custom Column Tool in Action</h2>
            <p className="text-lg text-muted-foreground">
              Real momentum analysis across multiple timeframes for various instruments - all in one view
            </p>
          </div>
          <div className="relative bg-card/50 backdrop-blur-sm rounded-lg border p-8 w-full mx-auto overflow-x-auto">
            <div className="min-w-[1400px]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left p-3 font-semibold bg-muted/30">Symbol</th>
                    <th className="text-left p-3 font-semibold bg-muted/30">Last</th>
                    <th className="text-center p-3 font-semibold bg-yellow-500/20">3m_STOCH_WR</th>
                    <th className="text-center p-3 font-semibold bg-yellow-500/20">3m_TDI</th>
                    <th className="text-center p-3 font-semibold bg-yellow-500/20">5M_STOCH_WR</th>
                    <th className="text-center p-3 font-semibold bg-yellow-500/20">5m_TDI</th>
                    <th className="text-center p-3 font-semibold bg-yellow-500/20">15m_STOCH...</th>
                    <th className="text-center p-3 font-semibold bg-yellow-500/20">15m_TDI</th>
                    <th className="text-center p-3 font-semibold bg-red-500/20">1H_STOCH_WR</th>
                    <th className="text-center p-3 font-semibold bg-yellow-500/20">1h_TDI</th>
                    <th className="text-center p-3 font-semibold bg-yellow-500/20">4H_STOCH_WR</th>
                    <th className="text-center p-3 font-semibold bg-yellow-500/20">4H_TDI</th>
                    <th className="text-center p-3 font-semibold bg-yellow-500/20">D_STOCH_WR</th>
                    <th className="text-center p-3 font-semibold bg-yellow-500/20">D_TDI</th>
                    <th className="text-center p-3 font-semibold bg-yellow-500/20">W_STOCH_WR</th>
                    <th className="text-center p-3 font-semibold bg-yellow-500/20">W_TDI</th>
                    <th className="text-center p-3 font-semibold bg-yellow-500/20">M_STOC...</th>
                    <th className="text-center p-3 font-semibold bg-yellow-500/20">M_TDI</th>
                  </tr>
                </thead>
                <tbody>
                  {/* AMD Row */}
                  <tr className="border-b border-border/30">
                    <td className="p-3 font-semibold text-cyan-400">AMD</td>
                    <td className="p-3 text-green-400">152.34</td>
                    {momentumStates['AMD']?.map((signal, index) => <td key={index} className={`p-3 text-center font-semibold transition-all duration-300 ${getSignalStyle(signal)}`}>
                        {signal}
                      </td>)}
                  </tr>
                  
                  {/* NVDA Row - Always LONG */}
                  <tr className="border-b border-border/30">
                    <td className="p-3 font-semibold text-cyan-400">NVDA</td>
                    <td className="p-3 text-green-400">139.76</td>
                    {momentumStates['NVDA']?.map((signal, index) => <td key={index} className={`p-3 text-center font-semibold transition-all duration-300 ${getSignalStyle(signal)}`}>
                        {signal}
                      </td>)}
                  </tr>
                  
                  {/* TSLA Row */}
                  <tr className="border-b border-border/30">
                    <td className="p-3 font-semibold text-cyan-400">TSLA</td>
                    <td className="p-3 text-green-400">248.67</td>
                    {momentumStates['TSLA']?.map((signal, index) => <td key={index} className={`p-3 text-center font-semibold transition-all duration-300 ${getSignalStyle(signal)}`}>
                        {signal}
                      </td>)}
                  </tr>
                  
                  {/* MSFT Row */}
                  <tr className="border-b border-border/30">
                    <td className="p-3 font-semibold text-cyan-400">MSFT</td>
                    <td className="p-3 text-green-400">421.89</td>
                    {momentumStates['MSFT']?.map((signal, index) => <td key={index} className={`p-3 text-center font-semibold transition-all duration-300 ${getSignalStyle(signal)}`}>
                        {signal}
                      </td>)}
                  </tr>
                  
                  {/* AAPL Row */}
                  <tr className="border-b border-border/30">
                    <td className="p-3 font-semibold text-cyan-400">AAPL</td>
                    <td className="p-3 text-green-400">234.56</td>
                    {momentumStates['AAPL']?.map((signal, index) => <td key={index} className={`p-3 text-center font-semibold transition-all duration-300 ${getSignalStyle(signal)}`}>
                        {signal}
                      </td>)}
                  </tr>
                  
                  {/* SPY Row - Always LONG */}
                  <tr className="border-b border-border/30">
                    <td className="p-3 font-semibold text-cyan-400">SPY</td>
                    <td className="p-3 text-green-400">598.12</td>
                    {momentumStates['SPY']?.map((signal, index) => <td key={index} className={`p-3 text-center font-semibold transition-all duration-300 ${getSignalStyle(signal)}`}>
                        {signal}
                      </td>)}
                  </tr>
                  
                  {/* /NQ Row - Always LONG */}
                  <tr className="border-b border-border/30">
                    <td className="p-3 font-semibold text-cyan-400">/NQ</td>
                    <td className="p-3 text-green-400">21850.25</td>
                    {momentumStates['/NQ']?.map((signal, index) => <td key={index} className={`p-3 text-center font-semibold transition-all duration-300 ${getSignalStyle(signal)}`}>
                        {signal}
                      </td>)}
                  </tr>
                  
                  {/* /GC Row */}
                  <tr className="border-b border-border/30">
                    <td className="p-3 font-semibold text-cyan-400">/GC</td>
                    <td className="p-3 text-green-400">2642.80</td>
                    {momentumStates['/GC']?.map((signal, index) => <td key={index} className={`p-3 text-center font-semibold transition-all duration-300 ${getSignalStyle(signal)}`}>
                        {signal}
                      </td>)}
                  </tr>
                  
                  {/* /CL Row */}
                  <tr className="border-b border-border/30">
                    <td className="p-3 font-semibold text-cyan-400">/CL</td>
                    <td className="p-3 text-green-400">73.42</td>
                    {momentumStates['/CL']?.map((signal, index) => <td key={index} className={`p-3 text-center font-semibold transition-all duration-300 ${getSignalStyle(signal)}`}>
                        {signal}
                      </td>)}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="outline" className="mb-4 px-3 py-1">
            <Zap className="w-3 h-3 mr-1" />
            Revolutionary Trading Technology
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Master Market Momentum<br />
            <span className="text-primary">Without the Clutter</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Our custom column technology delivers real-time momentum analysis across multiple timeframes. 
            Track unlimited instruments on a single screen with color-coded visual feedback that changes as market conditions evolve.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="px-8 py-3 text-lg bg-red-600 hover:bg-red-500 text-gray-500">
              Start Free Trial
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
              Watch Demo
            </Button>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">99%</div>
              <p className="text-muted-foreground">Screen Space Saved</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">5x</div>
              <p className="text-muted-foreground">Faster Analysis</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">∞</div>
              <p className="text-muted-foreground">Instruments Tracked</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gradient-to-r from-card/50 to-background">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Modern Traders</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to track market momentum efficiently, from stocks to futures and beyond.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/50">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                The Smart Solution for <span className="text-primary">Space-Constrained Traders</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Whether you're trading from a laptop or have limited monitor space, our custom column technology 
                lets you monitor unlimited instruments with dual momentum studies across all timeframes - 
                all in one compact, visually intuitive interface.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-foreground">Monitor stocks, metals, oil futures and more</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-foreground">Real-time color-coded momentum changes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-foreground">No charts required - pure data efficiency</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-foreground">Perfect for single or dual monitor setups</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-card to-card/50 p-8 rounded-lg border border-border/50 shadow-xl">
                <h3 className="text-xl font-semibold mb-4">Live Momentum Dashboard</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-background/50 rounded">
                    <span className="font-medium">SPY</span>
                    <div className="flex space-x-2">
                      <Badge className="bg-success/20 text-success border-success/30">1M</Badge>
                      <Badge className="bg-success/20 text-success border-success/30">5M</Badge>
                      <Badge className="bg-warning/20 text-warning border-warning/30">15M</Badge>
                      <Badge className="bg-success/20 text-success border-success/30">1H</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-background/50 rounded">
                    <span className="font-medium">QQQ</span>
                    <div className="flex space-x-2">
                      <Badge className="bg-success/20 text-success border-success/30">1M</Badge>
                      <Badge className="bg-warning/20 text-warning border-warning/30">5M</Badge>
                      <Badge className="bg-success/20 text-success border-success/30">15M</Badge>
                      <Badge className="bg-success/20 text-success border-success/30">1H</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-background/50 rounded">
                    <span className="font-medium">GLD</span>
                    <div className="flex space-x-2">
                      <Badge className="bg-destructive/20 text-destructive border-destructive/30">1M</Badge>
                      <Badge className="bg-destructive/20 text-destructive border-destructive/30">5M</Badge>
                      <Badge className="bg-warning/20 text-warning border-warning/30">15M</Badge>
                      <Badge className="bg-warning/20 text-warning border-warning/30">1H</Badge>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Colors update in real-time as momentum shifts across timeframes
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 bg-gradient-to-r from-card/30 to-background">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Professional Traders</h2>
            <p className="text-xl text-muted-foreground">See what our users are saying about their trading transformation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => <Card key={index} className="border-border/50 bg-gradient-to-br from-card to-card/50">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-primary text-primary" />)}
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Trading Edge</h2>
            <p className="text-xl text-muted-foreground">Professional tools for every level of trader</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => <Card key={index} className={`relative border-border/50 ${plan.popular ? 'ring-2 ring-primary shadow-xl scale-105' : ''}`}>
                {plan.popular && <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center space-x-1">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => <li key={featureIndex} className="flex items-center space-x-3">
                        <Check className="w-4 h-4 text-success" />
                        <span className="text-sm">{feature}</span>
                      </li>)}
                  </ul>
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                    {plan.popular ? "Start Free Trial" : "Get Started"}
                  </Button>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Trading?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of traders who've revolutionized their analysis with our custom column technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8 py-3 text-lg">
              Start 7-Day Free Trial
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
              Schedule Demo
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • Cancel anytime • 30-day money-back guarantee
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-foreground">IzzyzTradingTools</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Empowering traders with revolutionary momentum analysis technology.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Training</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/50 mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 IzzyzTradingTools.com. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>;
};
export default LandingPage;