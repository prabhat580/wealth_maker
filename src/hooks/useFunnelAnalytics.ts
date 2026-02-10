import { useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Generate or retrieve session ID
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('funnel_session_id');
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    sessionStorage.setItem('funnel_session_id', sessionId);
  }
  return sessionId;
};

// Detect device type
const getDeviceType = () => {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

export interface FunnelEvent {
  event_type: 'step_view' | 'step_complete' | 'cta_click' | 'form_start' | 'form_complete' | 'drop_off' | 'profile_view';
  step_number?: number;
  step_name?: string;
  metadata?: Record<string, any>;
}

export function useFunnelAnalytics() {
  const sessionId = useRef(getSessionId());
  const lastTrackedStep = useRef<number>(-1);

  const trackEvent = useCallback(async (event: FunnelEvent) => {
    try {
      await supabase.from('funnel_events').insert({
        session_id: sessionId.current,
        event_type: event.event_type,
        step_number: event.step_number,
        step_name: event.step_name,
        metadata: event.metadata || {},
        device_type: getDeviceType(),
        referrer: document.referrer || null,
      });
    } catch (error) {
      // Silent fail - don't interrupt user experience
      console.debug('Analytics event failed:', error);
    }
  }, []);

  const trackStepView = useCallback((stepNumber: number, stepName: string) => {
    // Prevent duplicate tracking of same step
    if (lastTrackedStep.current === stepNumber) return;
    lastTrackedStep.current = stepNumber;
    
    trackEvent({
      event_type: 'step_view',
      step_number: stepNumber,
      step_name: stepName,
    });
  }, [trackEvent]);

  const trackStepComplete = useCallback((stepNumber: number, stepName: string, answerValue?: any) => {
    trackEvent({
      event_type: 'step_complete',
      step_number: stepNumber,
      step_name: stepName,
      metadata: { answer_provided: !!answerValue },
    });
  }, [trackEvent]);

  const trackCTAClick = useCallback((ctaName: string, location: string) => {
    trackEvent({
      event_type: 'cta_click',
      step_name: ctaName,
      metadata: { location },
    });
  }, [trackEvent]);

  const trackFormStart = useCallback(() => {
    trackEvent({
      event_type: 'form_start',
      step_name: 'account_creation',
    });
  }, [trackEvent]);

  const trackFormComplete = useCallback((profileType: string) => {
    trackEvent({
      event_type: 'form_complete',
      step_name: 'account_creation',
      metadata: { profile_type: profileType },
    });
  }, [trackEvent]);

  const trackProfileView = useCallback((profileType: string, confidence: number) => {
    trackEvent({
      event_type: 'profile_view',
      step_name: 'profile_result',
      metadata: { profile_type: profileType, confidence },
    });
  }, [trackEvent]);

  // Track page unload as potential drop-off
  useEffect(() => {
    const handleUnload = () => {
      // Use sendBeacon for reliable tracking on page exit
      const data = JSON.stringify({
        session_id: sessionId.current,
        event_type: 'drop_off',
        device_type: getDeviceType(),
        metadata: { last_step: lastTrackedStep.current },
      });
      
      navigator.sendBeacon?.(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/funnel_events`,
        data
      );
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  return {
    trackStepView,
    trackStepComplete,
    trackCTAClick,
    trackFormStart,
    trackFormComplete,
    trackProfileView,
    sessionId: sessionId.current,
  };
}
