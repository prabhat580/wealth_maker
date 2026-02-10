-- Create enum for KYC source
CREATE TYPE public.kyc_source AS ENUM ('CKYC', 'KRA', 'FRESH');

-- Create enum for KYC status
CREATE TYPE public.kyc_status AS ENUM ('PENDING', 'IN_PROGRESS', 'VERIFIED', 'REJECTED', 'EXPIRED');

-- Create enum for document types
CREATE TYPE public.document_type AS ENUM ('PAN', 'AADHAAR', 'PASSPORT', 'VOTER_ID', 'DRIVING_LICENSE', 'ADDRESS_PROOF', 'PHOTO', 'SIGNATURE');

-- Create enum for verification status
CREATE TYPE public.verification_status AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED');

-- Create kyc_records table
CREATE TABLE public.kyc_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  pan_number TEXT,
  aadhaar_masked TEXT,
  ckyc_kin TEXT,
  kra_status TEXT,
  kyc_source kyc_source,
  status kyc_status NOT NULL DEFAULT 'PENDING',
  kyc_data JSONB DEFAULT '{}'::jsonb,
  verified_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_user_kyc UNIQUE (user_id)
);

-- Create user_documents table
CREATE TABLE public.user_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  doc_type document_type NOT NULL,
  doc_number TEXT,
  storage_path TEXT,
  file_name TEXT,
  file_size INTEGER,
  mime_type TEXT,
  verification_status verification_status NOT NULL DEFAULT 'PENDING',
  verification_notes TEXT,
  extracted_data JSONB DEFAULT '{}'::jsonb,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create kyc_audit_log table
CREATE TABLE public.kyc_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kyc_record_id UUID REFERENCES public.kyc_records(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  api_called TEXT,
  request_summary JSONB,
  response_summary JSONB,
  status TEXT,
  error_message TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_kyc_records_user_id ON public.kyc_records(user_id);
CREATE INDEX idx_kyc_records_pan ON public.kyc_records(pan_number);
CREATE INDEX idx_kyc_records_kin ON public.kyc_records(ckyc_kin);
CREATE INDEX idx_kyc_records_status ON public.kyc_records(status);
CREATE INDEX idx_user_documents_user_id ON public.user_documents(user_id);
CREATE INDEX idx_user_documents_type ON public.user_documents(doc_type);
CREATE INDEX idx_kyc_audit_log_user_id ON public.kyc_audit_log(user_id);
CREATE INDEX idx_kyc_audit_log_kyc_record ON public.kyc_audit_log(kyc_record_id);
CREATE INDEX idx_kyc_audit_log_created ON public.kyc_audit_log(created_at DESC);

-- Enable RLS on all tables
ALTER TABLE public.kyc_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS policies for kyc_records
CREATE POLICY "Users can view their own KYC record"
ON public.kyc_records FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own KYC record"
ON public.kyc_records FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own KYC record"
ON public.kyc_records FOR UPDATE
USING (auth.uid() = user_id);

-- RLS policies for user_documents
CREATE POLICY "Users can view their own documents"
ON public.user_documents FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can upload their own documents"
ON public.user_documents FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents"
ON public.user_documents FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents"
ON public.user_documents FOR DELETE
USING (auth.uid() = user_id);

-- RLS policies for kyc_audit_log (read-only for users)
CREATE POLICY "Users can view their own audit logs"
ON public.kyc_audit_log FOR SELECT
USING (auth.uid() = user_id);

-- Service role can insert audit logs (via edge functions)
CREATE POLICY "Service role can insert audit logs"
ON public.kyc_audit_log FOR INSERT
WITH CHECK (true);

-- Create trigger for updated_at on kyc_records
CREATE TRIGGER update_kyc_records_updated_at
BEFORE UPDATE ON public.kyc_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on user_documents
CREATE TRIGGER update_user_documents_updated_at
BEFORE UPDATE ON public.user_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for KYC documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'kyc-documents',
  'kyc-documents',
  false,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
);

-- Storage policies for kyc-documents bucket
CREATE POLICY "Users can upload their own KYC documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'kyc-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own KYC documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'kyc-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own KYC documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'kyc-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own KYC documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'kyc-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);