import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useKYC, DocumentType } from '@/hooks/useKYC';
import { 
  Shield, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Upload, 
  FileText, 
  User, 
  CreditCard,
  Fingerprint,
  Camera,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface KYCModuleProps {
  onComplete?: () => void;
  className?: string;
}

const DOCUMENT_CONFIG: Record<DocumentType, { icon: typeof FileText; label: string; description: string }> = {
  PAN: { icon: CreditCard, label: 'PAN Card', description: 'Permanent Account Number card' },
  AADHAAR: { icon: Fingerprint, label: 'Aadhaar Card', description: 'UIDAI issued Aadhaar' },
  PASSPORT: { icon: FileText, label: 'Passport', description: 'Valid Indian passport' },
  VOTER_ID: { icon: User, label: 'Voter ID', description: 'Election Commission issued' },
  DRIVING_LICENSE: { icon: CreditCard, label: 'Driving License', description: 'Valid driving license' },
  ADDRESS_PROOF: { icon: FileText, label: 'Address Proof', description: 'Utility bill or bank statement' },
  PHOTO: { icon: Camera, label: 'Photo', description: 'Recent passport-size photo' },
  SIGNATURE: { icon: FileText, label: 'Signature', description: 'Your signature sample' },
};

export function KYCModule({ onComplete, className }: KYCModuleProps) {
  const { 
    loading, 
    kycRecord, 
    documents, 
    initiateKYC, 
    getKYCStatus, 
    uploadDocument,
    isKYCComplete 
  } = useKYC();

  const [step, setStep] = useState<'pan' | 'documents' | 'complete'>('pan');
  const [pan, setPan] = useState('');
  const [panError, setPanError] = useState('');
  const [requiredDocs, setRequiredDocs] = useState<DocumentType[]>(['PAN', 'AADHAAR', 'PHOTO']);

  // Check existing KYC status on mount
  useEffect(() => {
    getKYCStatus().then(status => {
      if (status?.kyc_complete) {
        setStep('complete');
      } else if (status?.kyc_record?.status === 'PENDING') {
        setStep('documents');
      }
    });
  }, [getKYCStatus]);

  // Validate PAN format
  const validatePAN = useCallback((value: string): boolean => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(value.toUpperCase());
  }, []);

  const handlePANSubmit = async () => {
    const panUpper = pan.toUpperCase();
    if (!validatePAN(panUpper)) {
      setPanError('Invalid PAN format. Expected: ABCDE1234F');
      return;
    }
    setPanError('');

    const result = await initiateKYC(panUpper);
    
    if (result.status === 'verified' || result.status === 'already_verified') {
      setStep('complete');
      onComplete?.();
    } else if (result.status === 'pending' && result.requires_documents) {
      setRequiredDocs(result.required_documents || ['PAN', 'AADHAAR', 'PHOTO']);
      setStep('documents');
    }
  };

  const handleFileUpload = async (docType: DocumentType, file: File) => {
    await uploadDocument(file, docType);
  };

  const getUploadedDoc = (docType: DocumentType) => {
    return documents.find(d => d.doc_type === docType);
  };

  const uploadedCount = requiredDocs.filter(t => getUploadedDoc(t)).length;
  const progress = (uploadedCount / requiredDocs.length) * 100;

  // Render complete state
  if (step === 'complete' || isKYCComplete) {
    return (
      <Card className={cn("border-zen/30 bg-gradient-to-br from-zen/5 to-background", className)}>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-zen/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-zen" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">KYC Verified</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Your identity has been verified via {kycRecord?.kyc_source || 'CKYC'}
              </p>
            </div>
            {kycRecord?.ckyc_kin && (
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">CKYC KIN</p>
                <p className="font-mono text-sm">{kycRecord.ckyc_kin}</p>
              </div>
            )}
            <Badge variant="outline" className="bg-zen/10 text-zen border-zen/30">
              <Shield className="w-3 h-3 mr-1" />
              Identity Verified
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render PAN input step
  if (step === 'pan') {
    return (
      <Card className={cn("border-border/50", className)}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Identity Verification</CardTitle>
              <CardDescription>We'll check existing KYC records first</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pan">PAN Number</Label>
            <Input
              id="pan"
              placeholder="ABCDE1234F"
              value={pan}
              onChange={(e) => {
                setPan(e.target.value.toUpperCase());
                setPanError('');
              }}
              maxLength={10}
              className={cn(
                "font-mono text-center text-lg tracking-widest",
                panError && "border-destructive"
              )}
            />
            {panError && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {panError}
              </p>
            )}
          </div>

          <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              We'll first check CKYC and KRA databases for existing records
            </p>
          </div>

          <Button 
            onClick={handlePANSubmit} 
            disabled={loading || pan.length !== 10}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Checking KYC Records...
              </>
            ) : (
              <>
                Verify Identity
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Your data is encrypted and securely processed
          </p>
        </CardContent>
      </Card>
    );
  }

  // Render document upload step
  return (
    <Card className={cn("border-border/50", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Upload className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <CardTitle className="text-lg">Upload Documents</CardTitle>
              <CardDescription>Complete your KYC by uploading required documents</CardDescription>
            </div>
          </div>
          <Badge variant="outline">
            {uploadedCount}/{requiredDocs.length}
          </Badge>
        </div>
        <Progress value={progress} className="h-2 mt-4" />
      </CardHeader>
      <CardContent className="space-y-4">
        {requiredDocs.map((docType) => {
          const config = DOCUMENT_CONFIG[docType];
          const Icon = config.icon;
          const uploaded = getUploadedDoc(docType);

          return (
            <div
              key={docType}
              className={cn(
                "border rounded-lg p-4 transition-all",
                uploaded 
                  ? "border-zen/30 bg-zen/5" 
                  : "border-dashed border-border hover:border-primary/50"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    uploaded ? "bg-zen/20" : "bg-muted"
                  )}>
                    {uploaded ? (
                      <CheckCircle2 className="w-5 h-5 text-zen" />
                    ) : (
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{config.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {uploaded ? uploaded.file_name : config.description}
                    </p>
                  </div>
                </div>

                {uploaded ? (
                  <Badge variant="secondary" className="bg-zen/10 text-zen">
                    Uploaded
                  </Badge>
                ) : (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*,application/pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(docType, file);
                      }}
                      disabled={loading}
                    />
                    <Button variant="outline" size="sm" asChild>
                      <span>
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-1" />
                            Upload
                          </>
                        )}
                      </span>
                    </Button>
                  </label>
                )}
              </div>
            </div>
          );
        })}

        {uploadedCount === requiredDocs.length && (
          <div className="bg-zen/10 border border-zen/20 rounded-lg p-4 text-center">
            <CheckCircle2 className="w-8 h-8 text-zen mx-auto mb-2" />
            <p className="font-medium text-zen">All documents uploaded!</p>
            <p className="text-sm text-muted-foreground mt-1">
              Your documents are being verified. This usually takes 1-2 business days.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
