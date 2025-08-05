-- Create table for cached momentum scan results
CREATE TABLE public.momentum_scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL,
  company_name TEXT,
  price DECIMAL(10,4) NOT NULL,
  previous_close DECIMAL(10,4) NOT NULL,
  change_percent DECIMAL(8,4) NOT NULL,
  volume BIGINT NOT NULL,
  volume_spike DECIMAL(8,2) NOT NULL,
  estimated_float BIGINT,
  catalyst TEXT,
  momo1_signals JSONB NOT NULL,
  momo2_signals JSONB NOT NULL,
  scan_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.momentum_scans ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can view momentum scans" 
ON public.momentum_scans 
FOR SELECT 
USING (true);

-- Only the system can insert/update (via edge functions)
CREATE POLICY "System can insert momentum scans" 
ON public.momentum_scans 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update momentum scans" 
ON public.momentum_scans 
FOR UPDATE 
USING (true);

-- Create indexes for performance
CREATE INDEX idx_momentum_scans_scan_timestamp ON public.momentum_scans(scan_timestamp DESC);
CREATE INDEX idx_momentum_scans_symbol ON public.momentum_scans(symbol);
CREATE INDEX idx_momentum_scans_change_percent ON public.momentum_scans(change_percent DESC);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_momentum_scans_updated_at
BEFORE UPDATE ON public.momentum_scans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable real-time for the table
ALTER TABLE public.momentum_scans REPLICA IDENTITY FULL;

-- Add table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.momentum_scans;