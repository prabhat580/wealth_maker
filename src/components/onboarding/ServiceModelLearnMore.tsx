import { useState } from 'react';
import { Info, Shield, Wallet, Scale, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export function ServiceModelLearnMore() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground hover:text-foreground hover:bg-zen/10"
        >
          <HelpCircle className="w-4 h-4" />
          Learn More
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary" />
            Understanding Service Models
          </DialogTitle>
          <DialogDescription>
            Both models are SEBI-regulated. Choose based on how you prefer to pay for financial guidance.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="comparison" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="ria">Fee-Based (RIA)</TabsTrigger>
            <TabsTrigger value="distribution">Commission-Based</TabsTrigger>
          </TabsList>

          {/* Comparison Tab */}
          <TabsContent value="comparison" className="mt-4 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* RIA Card */}
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">Fee-Based Advisory (RIA)</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <ComparisonItem positive>Fiduciary duty — legally bound to act in your interest</ComparisonItem>
                  <ComparisonItem positive>Transparent, upfront fee structure</ComparisonItem>
                  <ComparisonItem positive>No product commissions = unbiased advice</ComparisonItem>
                  <ComparisonItem positive>Comprehensive financial planning</ComparisonItem>
                  <ComparisonItem negative>Advisory fee applies (₹15,000 - ₹75,000/year typical)</ComparisonItem>
                </ul>
              </div>

              {/* Distribution Card */}
              <div className="p-4 rounded-xl border border-secondary/20 bg-secondary/5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-secondary" />
                  </div>
                  <h3 className="font-semibold text-foreground">Commission-Based</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <ComparisonItem positive>No advisory fee — zero upfront cost</ComparisonItem>
                  <ComparisonItem positive>Good for straightforward investment needs</ComparisonItem>
                  <ComparisonItem positive>AMFI-registered with regulatory oversight</ComparisonItem>
                  <ComparisonItem neutral>Commission embedded in product expense ratio</ComparisonItem>
                  <ComparisonItem neutral>Limited to product recommendations</ComparisonItem>
                </ul>
              </div>
            </div>

            {/* Fee Comparison Table */}
            <div className="p-4 rounded-xl border bg-card">
              <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-muted-foreground" />
                Fee Structure Comparison
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 text-muted-foreground font-medium">Aspect</th>
                      <th className="text-left py-2 text-primary font-medium">RIA (Fee-Based)</th>
                      <th className="text-left py-2 text-secondary font-medium">Distribution</th>
                    </tr>
                  </thead>
                  <tbody className="text-foreground">
                    <tr className="border-b border-border/50">
                      <td className="py-2.5">Advisory Fee</td>
                      <td className="py-2.5">₹15,000 - ₹75,000/year*</td>
                      <td className="py-2.5">None</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2.5">Product Commission</td>
                      <td className="py-2.5">None (Direct Plans)</td>
                      <td className="py-2.5">0.5% - 1.5%/year (embedded)</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2.5">Mutual Fund Plans</td>
                      <td className="py-2.5">Direct Plans (lower expense)</td>
                      <td className="py-2.5">Regular Plans</td>
                    </tr>
                    <tr>
                      <td className="py-2.5">Break-even Portfolio</td>
                      <td className="py-2.5 text-muted-foreground">Typically ₹15-20 Lakhs+</td>
                      <td className="py-2.5 text-muted-foreground">Better for smaller portfolios</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                *Fee varies based on complexity, assets, and advisor. AMEYA offers competitive, transparent pricing.
              </p>
            </div>
          </TabsContent>

          {/* RIA Tab */}
          <TabsContent value="ria" className="mt-4 space-y-4">
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                What is a Registered Investment Adviser (RIA)?
              </h3>
              <p className="text-sm text-muted-foreground">
                A SEBI-Registered Investment Adviser is a fiduciary — legally obligated to put your interests first. 
                They provide personalized financial advice for a transparent fee, with no hidden commissions.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Regulatory Framework</h4>
              <div className="grid gap-2">
                <RegulationItem 
                  title="SEBI (Investment Advisers) Regulations, 2013"
                  description="Governs registration, qualifications, and conduct of investment advisers in India"
                />
                <RegulationItem 
                  title="Fiduciary Standard"
                  description="RIAs must act solely in clients' best interests, avoiding conflicts of interest"
                />
                <RegulationItem 
                  title="Fee-Only Model"
                  description="Cannot receive commissions from product manufacturers — ensures unbiased advice"
                />
                <RegulationItem 
                  title="Risk Profiling & Suitability"
                  description="Must assess your risk capacity, goals, and constraints before recommendations"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl border bg-card">
              <h4 className="font-medium text-foreground mb-2">Services Typically Included</h4>
              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                <ServiceItem>Comprehensive financial planning</ServiceItem>
                <ServiceItem>Investment portfolio design</ServiceItem>
                <ServiceItem>Tax planning strategies</ServiceItem>
                <ServiceItem>Retirement planning</ServiceItem>
                <ServiceItem>Insurance needs analysis</ServiceItem>
                <ServiceItem>Estate planning guidance</ServiceItem>
                <ServiceItem>Goal-based investing</ServiceItem>
                <ServiceItem>Periodic portfolio reviews</ServiceItem>
              </div>
            </div>
          </TabsContent>

          {/* Distribution Tab */}
          <TabsContent value="distribution" className="mt-4 space-y-4">
            <div className="p-4 rounded-xl border border-secondary/20 bg-secondary/5">
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-secondary" />
                What is Commission-Based Distribution?
              </h3>
              <p className="text-sm text-muted-foreground">
                Distributors help you invest in mutual funds and other products. They earn commission from 
                product manufacturers (AMCs), so there's no direct fee to you. This model works well for 
                straightforward investment needs.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Regulatory Framework</h4>
              <div className="grid gap-2">
                <RegulationItem 
                  title="AMFI Registration (ARN)"
                  description="Distributors are registered with AMFI and regulated by SEBI"
                />
                <RegulationItem 
                  title="Disclosure Requirements"
                  description="Must disclose commissions received from each product"
                />
                <RegulationItem 
                  title="Suitability Norms"
                  description="Required to recommend products suitable for your risk profile"
                />
                <RegulationItem 
                  title="Grievance Redressal"
                  description="Access to SEBI SCORES platform for complaint resolution"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl border bg-card">
              <h4 className="font-medium text-foreground mb-2">How Commissions Work</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5">•</span>
                  <span>Commission is part of the mutual fund's expense ratio (typically 0.5%-1.5%/year)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5">•</span>
                  <span>You invest in "Regular Plans" which include distributor commission</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5">•</span>
                  <span>No separate fee is charged to you directly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5">•</span>
                  <span>Commission is deducted from fund returns, not your investment amount</span>
                </li>
              </ul>
            </div>

            <div className="p-3 rounded-lg bg-muted/50 border text-sm">
              <p className="text-muted-foreground">
                <strong className="text-foreground">Best suited for:</strong> Investors with straightforward needs, 
                smaller portfolios, or those who prefer product-focused guidance without upfront fees.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            AMEYA by Bajaj Capital is both a SEBI-Registered Investment Adviser (RIA) and AMFI-Registered Distributor. 
            Choose the model that best fits your needs.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper Components
function ComparisonItem({ children, positive, negative, neutral }: { 
  children: React.ReactNode; 
  positive?: boolean;
  negative?: boolean;
  neutral?: boolean;
}) {
  return (
    <li className="flex items-start gap-2">
      {positive && <CheckCircle className="w-4 h-4 text-zen shrink-0 mt-0.5" />}
      {negative && <XCircle className="w-4 h-4 text-destructive/70 shrink-0 mt-0.5" />}
      {neutral && <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />}
      <span className="text-muted-foreground">{children}</span>
    </li>
  );
}

function RegulationItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-3 rounded-lg bg-muted/50 border">
      <h5 className="font-medium text-foreground text-sm">{title}</h5>
      <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
    </div>
  );
}

function ServiceItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <CheckCircle className="w-3.5 h-3.5 text-zen shrink-0" />
      <span>{children}</span>
    </div>
  );
}