-- Add unique constraint on symbol to prevent duplicates
ALTER TABLE public.momentum_scans 
ADD CONSTRAINT momentum_scans_symbol_unique UNIQUE (symbol);

-- Clean up duplicates, keeping only the most recent entry for each symbol
DELETE FROM public.momentum_scans 
WHERE id NOT IN (
  SELECT DISTINCT ON (symbol) id 
  FROM public.momentum_scans 
  ORDER BY symbol, scan_timestamp DESC
);