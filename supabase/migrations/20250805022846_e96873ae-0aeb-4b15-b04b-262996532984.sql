-- Enable pg_cron and pg_net extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a cron job to run background scan every 15 minutes
SELECT cron.schedule(
  'background-momentum-scan',
  '*/15 * * * *', -- Every 15 minutes
  $$
  SELECT
    net.http_post(
        url:='https://qwkriyjknveiyzinydzi.supabase.co/functions/v1/background-scan',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3a3JpeWprbnZlaXl6aW55ZHppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMzAzMjIsImV4cCI6MjA2OTkwNjMyMn0.Dvn_5OFw7m5rzqdKTlGWnhqyBvWwv6Vq9r55oYZ73MI"}'::jsonb,
        body:='{"scheduled": true}'::jsonb
    ) as request_id;
  $$
);