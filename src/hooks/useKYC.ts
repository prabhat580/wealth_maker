import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export type KYCStatus = 'PENDING' | 'IN_PROGRESS' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';
export type DocumentType = 'PAN' | 'AADHAAR' | 'PASSPORT' | 'VOTER_ID' | 'DRIVING_LICENSE' | 'ADDRESS_PROOF' | 'PHOTO' | 'SIGNATURE';

export interface KYCRecord {
  id: string;
  user_id: string;
  pan_number: string | null;
  aadhaar_masked: string | null;
  ckyc_kin: string | null;
  kra_status: string | null;
  kyc_source: 'CKYC' | 'KRA' | 'FRESH' | null;
  status: KYCStatus;
  kyc_data: Record<string, unknown>;
  verified_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserDocument {
  id: string;
  user_id: string;
  doc_type: DocumentType;
  doc_number: string | null;
  storage_path: string | null;
  file_name: string | null;
  file_size: number | null;
  mime_type: string | null;
  verification_status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';
  verification_notes: string | null;
  extracted_data: Record<string, unknown>;
  uploaded_at: string;
  verified_at: string | null;
}

interface KYCInitResponse {
  status: 'verified' | 'pending' | 'already_verified' | 'error';
  source?: 'CKYC' | 'KRA';
  message: string;
  requires_documents?: boolean;
  required_documents?: DocumentType[];
  kyc_record?: KYCRecord;
}

interface KYCStatusResponse {
  kyc_record: KYCRecord | null;
  documents: UserDocument[];
  kyc_complete: boolean;
}

export function useKYC() {
  const { user, session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [kycRecord, setKycRecord] = useState<KYCRecord | null>(null);
  const [documents, setDocuments] = useState<UserDocument[]>([]);

  // Initiate KYC check
  const initiateKYC = useCallback(async (
    pan: string,
    aadhaarLast4?: string,
    dob?: string,
    fullName?: string
  ): Promise<KYCInitResponse> => {
    if (!session?.access_token) {
      toast.error('Please log in to continue');
      return { status: 'error', message: 'Not authenticated' };
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('kyc-orchestrator', {
        body: {
          pan: pan.toUpperCase(),
          aadhaar_last4: aadhaarLast4,
          dob,
          full_name: fullName,
        },
      });

      if (error) throw error;

      if (data.kyc_record) {
        setKycRecord(data.kyc_record);
      }

      if (data.status === 'verified') {
        toast.success(`KYC verified via ${data.source}`);
      } else if (data.status === 'already_verified') {
        toast.info('Your KYC is already complete');
      } else if (data.status === 'pending') {
        toast.info('Please upload your identity documents');
      }

      return data as KYCInitResponse;
    } catch (error: any) {
      console.error('[KYC] Init error:', error);
      toast.error(error.message || 'Failed to initiate KYC');
      return { status: 'error', message: error.message };
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Get KYC status
  const getKYCStatus = useCallback(async (): Promise<KYCStatusResponse | null> => {
    if (!user) return null;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('kyc-orchestrator', {
        method: 'GET',
      });

      if (error) throw error;

      setKycRecord(data.kyc_record);
      setDocuments(data.documents || []);
      return data as KYCStatusResponse;
    } catch (error: any) {
      console.error('[KYC] Status error:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Upload document
  const uploadDocument = useCallback(async (
    file: File,
    docType: DocumentType,
    docNumber?: string
  ): Promise<UserDocument | null> => {
    if (!user) {
      toast.error('Please log in to continue');
      return null;
    }

    setLoading(true);
    try {
      // Upload to storage
      const filePath = `${user.id}/${docType}_${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('kyc-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create document record
      const { data: docRecord, error: dbError } = await supabase
        .from('user_documents')
        .insert({
          user_id: user.id,
          doc_type: docType,
          doc_number: docNumber,
          storage_path: filePath,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
          verification_status: 'PENDING',
        })
        .select()
        .single();

      if (dbError) throw dbError;

      toast.success(`${docType} uploaded successfully`);
      setDocuments(prev => [...prev, docRecord as unknown as UserDocument]);
      return docRecord as unknown as UserDocument;
    } catch (error: any) {
      console.error('[KYC] Upload error:', error);
      toast.error(`Failed to upload ${docType}: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Check if all required documents are uploaded
  const hasRequiredDocuments = useCallback((requiredTypes: DocumentType[]): boolean => {
    return requiredTypes.every(type => 
      documents.some(doc => doc.doc_type === type && doc.verification_status !== 'REJECTED')
    );
  }, [documents]);

  return {
    loading,
    kycRecord,
    documents,
    initiateKYC,
    getKYCStatus,
    uploadDocument,
    hasRequiredDocuments,
    isKYCComplete: kycRecord?.status === 'VERIFIED',
  };
}
