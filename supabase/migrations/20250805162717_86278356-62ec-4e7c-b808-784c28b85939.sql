-- Update momentum_scans table for futures instruments
ALTER TABLE public.momentum_scans 
ADD COLUMN expiration_date DATE,
ADD COLUMN contract_month TEXT;

-- Update the symbol column to allow longer futures symbols like "NQ03-25"
-- Add some sample futures data
INSERT INTO public.momentum_scans (
  symbol, 
  company_name, 
  price, 
  previous_close, 
  change_percent, 
  volume, 
  volume_spike, 
  momo1_signals, 
  momo2_signals,
  expiration_date,
  contract_month
) VALUES 
('NQ03-25', 'E-mini NASDAQ 100', 21000.00, 20950.00, 0.24, 150000, 1.2, '{"1m": "bullish", "5m": "neutral", "15m": "bearish"}', '{"30m": "bullish", "1h": "neutral", "4h": "bullish", "1d": "bullish"}', '2025-03-21', 'MAR25'),
('ES03-25', 'E-mini S&P 500', 5800.00, 5790.00, 0.17, 200000, 1.1, '{"1m": "neutral", "5m": "bullish", "15m": "bullish"}', '{"30m": "bullish", "1h": "bullish", "4h": "neutral", "1d": "bullish"}', '2025-03-21', 'MAR25'),
('YM03-25', 'E-mini Dow Jones', 43500.00, 43450.00, 0.11, 80000, 1.0, '{"1m": "bearish", "5m": "neutral", "15m": "bullish"}', '{"30m": "neutral", "1h": "bullish", "4h": "bullish", "1d": "neutral"}', '2025-03-21', 'MAR25'),
('RTY03-25', 'E-mini Russell 2000', 2350.00, 2340.00, 0.43, 120000, 1.3, '{"1m": "bullish", "5m": "bullish", "15m": "neutral"}', '{"30m": "bullish", "1h": "bearish", "4h": "neutral", "1d": "bullish"}', '2025-03-21', 'MAR25'),
('VX03-25', 'VIX Futures', 18.50, 19.20, -3.65, 95000, 1.5, '{"1m": "bearish", "5m": "bearish", "15m": "bearish"}', '{"30m": "bearish", "1h": "bearish", "4h": "bearish", "1d": "bearish"}', '2025-03-21', 'MAR25');

-- Clean up old stock data
DELETE FROM public.momentum_scans WHERE symbol NOT IN ('NQ03-25', 'ES03-25', 'YM03-25', 'RTY03-25', 'VX03-25');