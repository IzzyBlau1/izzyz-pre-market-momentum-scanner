-- Remove the old cron job
SELECT cron.unschedule('auto-futures-scan');

-- Create a new cron job that runs every 2 minutes instead (more reasonable)
SELECT cron.schedule(
  'auto-futures-scan',
  '*/2 * * * *', -- Every 2 minutes
  $$
  SELECT net.http_post(
      url := 'https://qwkriyjknveiyzinydzi.supabase.co/functions/v1/background-scan',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3a3JpeWprbnZlaXl6aW55ZHppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMzAzMjIsImV4cCI6MjA2OTkwNjMyMn0.Dvn_5OFw7m5rzqdKTlGWnhqyBvWwv6Vq9r55oYZ73MI"}'::jsonb,
      body := '{"auto_scan": true}'::jsonb
  );
  $$
);