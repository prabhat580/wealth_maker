-- Create funnel analytics table to track drop-offs
CREATE TABLE public.funnel_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'step_view', 'step_complete', 'cta_click', 'form_start', 'form_complete', 'drop_off'
  step_number INTEGER,
  step_name TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  device_type TEXT, -- 'mobile', 'desktop', 'tablet'
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for analytics queries
CREATE INDEX idx_funnel_events_session ON public.funnel_events(session_id);
CREATE INDEX idx_funnel_events_type ON public.funnel_events(event_type);
CREATE INDEX idx_funnel_events_created ON public.funnel_events(created_at);

-- Enable RLS but allow anonymous inserts (tracking is anonymous)
ALTER TABLE public.funnel_events ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to insert events (anonymous tracking)
CREATE POLICY "Anyone can insert funnel events" 
ON public.funnel_events 
FOR INSERT 
WITH CHECK (true);

-- Policy to prevent reads except by authenticated users (for admin analytics)
CREATE POLICY "Only authenticated users can view funnel events" 
ON public.funnel_events 
FOR SELECT 
USING (auth.uid() IS NOT NULL);