-- Enable pg_cron extension for scheduled functions
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension for HTTP requests in cron jobs
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a cron job to auto-scan futures data every 30 seconds
SELECT cron.schedule(
  'auto-futures-scan',
  '*/30 * * * * *', -- Every 30 seconds
  $$
  SELECT net.http_post(
      url := 'https://qwkriyjknveiyzinydzi.supabase.co/functions/v1/background-scan',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3a3JpeWprbnZlaXl6aW55ZHppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMzAzMjIsImV4cCI6MjA2OTkwNjMyMn0.Dvn_5OFw7m5rzqdKTlGWnhqyBvWwv6Vq9r55oYZ73MI"}'::jsonb,
      body := '{"auto_scan": true}'::jsonb
  );
  $$
);

-- Enable realtime for momentum_scans table
ALTER TABLE momentum_scans REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE momentum_scans;