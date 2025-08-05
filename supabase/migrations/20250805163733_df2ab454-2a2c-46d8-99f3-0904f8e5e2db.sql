-- First, delete duplicates keeping only the most recent for each symbol
DELETE FROM public.momentum_scans 
WHERE id NOT IN (
  SELECT DISTINCT ON (symbol) id 
  FROM public.momentum_scans 
  ORDER BY symbol, scan_timestamp DESC
);

-- Now add the unique constraint
ALTER TABLE public.momentum_scans 
ADD CONSTRAINT momentum_scans_symbol_unique UNIQUE (symbol);