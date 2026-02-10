import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface KYCInitRequest {
  pan: string;
  aadhaar_last4?: string;
  dob?: string;
  full_name?: string;
}

interface KYCCheckResponse {
  status: 'found' | 'not_found' | 'error';
  source?: 'CKYC' | 'KRA';
  kin?: string;
  kyc_data?: Record<string, unknown>;
  message?: string;
}

// Validate PAN format
function validatePAN(pan: string): boolean {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan.toUpperCase());
}

// Mock CKYC lookup (replace with actual API integration)
async function lookupCKYC(pan: string): Promise<KYCCheckResponse> {
  console.log(`[CKYC] Looking up PAN: ${pan.substring(0, 5)}****`);
  
  // In production, this would call the actual CERSAI CKYC API
  // For now, simulate a response
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simulate 30% chance of finding existing CKYC record
  if (Math.random() < 0.3) {
    return {
      status: 'found',
      source: 'CKYC',
      kin: `KIN${Date.now()}`,
      kyc_data: {
        name: 'Retrieved from CKYC',
        kyc_type: 'CKYC',
        verified_date: new Date().toISOString(),
      }
    };
  }
  
  return { status: 'not_found' };
}

// Mock KRA lookup (replace with actual API integration)
async function lookupKRA(pan: string): Promise<KYCCheckResponse> {
  console.log(`[KRA] Looking up PAN: ${pan.substring(0, 5)}****`);
  
  // In production, this would call CVL/CAMS/NDML KRA APIs
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simulate 40% chance of finding existing KRA record
  if (Math.random() < 0.4) {
    return {
      status: 'found',
      source: 'KRA',
      kyc_data: {
        name: 'Retrieved from KRA',
        kyc_type: 'KRA',
        kra_status: 'VERIFIED',
        verified_date: new Date().toISOString(),
      }
    };
  }
  
  return { status: 'not_found' };
}

// Log audit entry
async function logAudit(
  supabase: any,
  userId: string,
  kycRecordId: string | null,
  action: string,
  apiCalled: string,
  requestSummary: Record<string, unknown>,
  responseSummary: Record<string, unknown>,
  status: string,
  errorMessage?: string
) {
  try {
    await supabase.from('kyc_audit_log').insert({
      user_id: userId,
      kyc_record_id: kycRecordId,
      action,
      api_called: apiCalled,
      request_summary: requestSummary,
      response_summary: responseSummary,
      status,
      error_message: errorMessage,
    });
  } catch (err) {
    console.error('[Audit] Failed to log:', err);
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the JWT and get user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    // Route: POST /kyc-orchestrator/initiate
    if (req.method === 'POST' && path === 'kyc-orchestrator') {
      const body: KYCInitRequest = await req.json();
      
      // Validate PAN
      if (!body.pan || !validatePAN(body.pan)) {
        return new Response(
          JSON.stringify({ error: 'Invalid PAN format. Expected: ABCDE1234F' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const panUpper = body.pan.toUpperCase();
      console.log(`[KYC] Initiating KYC check for user: ${user.id}`);

      // Check if user already has a KYC record
      const { data: existingKyc } = await supabase
        .from('kyc_records')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingKyc && existingKyc.status === 'VERIFIED') {
        return new Response(
          JSON.stringify({
            status: 'already_verified',
            message: 'KYC already completed',
            kyc_record: existingKyc
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Step 1: Check CKYC
      const ckycResult = await lookupCKYC(panUpper);
      await logAudit(
        supabase, user.id, existingKyc?.id || null,
        'CKYC_LOOKUP', 'CERSAI CKYC API',
        { pan: `${panUpper.substring(0, 5)}****` },
        { status: ckycResult.status },
        ckycResult.status === 'found' ? 'SUCCESS' : 'NOT_FOUND'
      );

      if (ckycResult.status === 'found') {
        // Found in CKYC - update/create record
        const kycData = {
          user_id: user.id,
          pan_number: panUpper,
          ckyc_kin: ckycResult.kin,
          kyc_source: 'CKYC',
          status: 'VERIFIED',
          kyc_data: ckycResult.kyc_data,
          verified_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
        };

        const { data: kycRecord, error: upsertError } = await supabase
          .from('kyc_records')
          .upsert(kycData, { onConflict: 'user_id' })
          .select()
          .single();

        if (upsertError) {
          console.error('[KYC] Upsert error:', upsertError);
          throw upsertError;
        }

        return new Response(
          JSON.stringify({
            status: 'verified',
            source: 'CKYC',
            message: 'KYC verified via CKYC',
            kyc_record: kycRecord
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Step 2: Check KRA
      const kraResult = await lookupKRA(panUpper);
      await logAudit(
        supabase, user.id, existingKyc?.id || null,
        'KRA_LOOKUP', 'CVL/CAMS KRA API',
        { pan: `${panUpper.substring(0, 5)}****` },
        { status: kraResult.status },
        kraResult.status === 'found' ? 'SUCCESS' : 'NOT_FOUND'
      );

      if (kraResult.status === 'found') {
        // Found in KRA - create CKYC record and update
        const kycData = {
          user_id: user.id,
          pan_number: panUpper,
          kra_status: 'VERIFIED',
          kyc_source: 'KRA',
          status: 'VERIFIED',
          kyc_data: kraResult.kyc_data,
          verified_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        };

        const { data: kycRecord, error: upsertError } = await supabase
          .from('kyc_records')
          .upsert(kycData, { onConflict: 'user_id' })
          .select()
          .single();

        if (upsertError) throw upsertError;

        return new Response(
          JSON.stringify({
            status: 'verified',
            source: 'KRA',
            message: 'KYC verified via KRA',
            kyc_record: kycRecord
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Step 3: No existing KYC found - require document upload
      const pendingKyc = {
        user_id: user.id,
        pan_number: panUpper,
        aadhaar_masked: body.aadhaar_last4 ? `XXXX-XXXX-${body.aadhaar_last4}` : null,
        kyc_source: 'FRESH',
        status: 'PENDING',
        kyc_data: {
          full_name: body.full_name,
          dob: body.dob,
          initiated_at: new Date().toISOString(),
        }
      };

      const { data: kycRecord, error: insertError } = await supabase
        .from('kyc_records')
        .upsert(pendingKyc, { onConflict: 'user_id' })
        .select()
        .single();

      if (insertError) throw insertError;

      await logAudit(
        supabase, user.id, kycRecord.id,
        'KYC_INITIATED', 'Internal',
        { pan: `${panUpper.substring(0, 5)}****` },
        { status: 'PENDING', requires_documents: true },
        'PENDING'
      );

      return new Response(
        JSON.stringify({
          status: 'pending',
          message: 'No existing KYC found. Please upload identity documents.',
          requires_documents: true,
          required_documents: ['PAN', 'AADHAAR', 'PHOTO'],
          kyc_record: kycRecord
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Route: GET /kyc-orchestrator/status
    if (req.method === 'GET') {
      const { data: kycRecord } = await supabase
        .from('kyc_records')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      const { data: documents } = await supabase
        .from('user_documents')
        .select('*')
        .eq('user_id', user.id);

      return new Response(
        JSON.stringify({
          kyc_record: kycRecord,
          documents: documents || [],
          kyc_complete: kycRecord?.status === 'VERIFIED'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    console.error('[KYC] Error:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
