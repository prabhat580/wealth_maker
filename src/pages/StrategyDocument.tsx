import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Printer, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StrategyDocument = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Data Architecture Strategy | Confidential';
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Print-hidden header */}
      <div className="print:hidden sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print / Save PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Document content */}
      <article className="max-w-4xl mx-auto px-6 py-12 print:py-0 print:px-0">
        {/* Header */}
        <header className="mb-12 pb-8 border-b-2 border-gray-900">
          <p className="text-sm text-gray-500 mb-2">CONFIDENTIAL</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Data Architecture Strategy
          </h1>
          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            <div><span className="font-medium">Date:</span> December 2024</div>
            <div><span className="font-medium">Status:</span> Approved for Implementation</div>
            <div><span className="font-medium">Version:</span> 1.0</div>
          </div>
        </header>

        {/* Executive Summary */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b">
            Executive Summary
          </h2>
          <p className="text-gray-700 mb-4">
            This document outlines the strategic decision to migrate from legacy Oracle infrastructure 
            to a modern cloud-native architecture while optimizing our CRM and adding a CDP layer for 
            enhanced client engagement.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 border">
            <p className="font-semibold mb-2">Key Decisions:</p>
            <ul className="space-y-1 text-gray-700">
              <li>✅ Migrate Oracle → Lovable Cloud (Postgres)</li>
              <li>✅ Retain LeadSquared CRM for pre-client acquisition</li>
              <li>✅ Add CDP layer (CleverTap/MoEngage) for post-client engagement</li>
              <li>❌ Skip separate CDP for pre-client (CRM handles this)</li>
            </ul>
          </div>
        </section>

        {/* Current State Assessment */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b">
            1. Current State Assessment
          </h2>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Pain Points</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">System</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Issue</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Impact</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Oracle DB</td>
                  <td className="border border-gray-300 px-4 py-2">Archaic, high licensing cost</td>
                  <td className="border border-gray-300 px-4 py-2">₹8-15L/year, maintenance overhead</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">LeadSquared</td>
                  <td className="border border-gray-300 px-4 py-2">Good for acquisition, weak post-client</td>
                  <td className="border border-gray-300 px-4 py-2">Limited lifecycle automation</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">No CDP</td>
                  <td className="border border-gray-300 px-4 py-2">No behavioral analytics</td>
                  <td className="border border-gray-300 px-4 py-2">Reactive vs proactive engagement</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Target Architecture */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b">
            2. Target Architecture
          </h2>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">2.1 System Responsibilities</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Layer</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">System</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Responsibility</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Acquisition</td>
                  <td className="border border-gray-300 px-4 py-2">LeadSquared</td>
                  <td className="border border-gray-300 px-4 py-2">Lead capture, assignment, pipeline, drip campaigns</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-medium">Source of Truth</td>
                  <td className="border border-gray-300 px-4 py-2">Lovable Cloud</td>
                  <td className="border border-gray-300 px-4 py-2">Profiles, holdings, transactions, goals, KYC</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Engagement</td>
                  <td className="border border-gray-300 px-4 py-2">CDP (CleverTap/MoEngage)</td>
                  <td className="border border-gray-300 px-4 py-2">Behavioral events, segments, journeys, alerts</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-medium">Intelligence</td>
                  <td className="border border-gray-300 px-4 py-2">Edge Functions</td>
                  <td className="border border-gray-300 px-4 py-2">AI advisor, market data, sync orchestration</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">2.2 Data Flow Architecture</h3>
          <div className="bg-gray-50 border rounded-lg p-4 font-mono text-xs overflow-x-auto mb-4">
            <pre className="whitespace-pre">{`┌─────────────────────────────────────────────────────────────────────────┐
│                         PRE-CLIENT (ACQUISITION)                        │
├─────────────────────────────────────────────────────────────────────────┤
│  Website/Ads → LeadSquared → Assignment → Pipeline → Drip Campaigns    │
│                                    │                                    │
│                            [Conversion Event]                           │
│                                    ↓                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                      LOVABLE CLOUD (SOURCE OF TRUTH)                    │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  ┌───────────────┐       │
│  │ profiles │  │ holdings │  │ transactions │  │  user_goals   │       │
│  └──────────┘  └──────────┘  └──────────────┘  └───────────────┘       │
│                                    │                                    │
│                          [Event Sync Edge Fn]                           │
│                                    ↓                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                       CDP LAYER (POST-CLIENT ENGAGEMENT)                │
├─────────────────────────────────────────────────────────────────────────┤
│  Behavioral Events → Dynamic Segments → Lifecycle Journeys → Alerts    │
└─────────────────────────────────────────────────────────────────────────┘`}</pre>
          </div>
        </section>

        {/* Implementation Phases */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b">
            3. Implementation Phases
          </h2>
          
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Phase 1: Database Migration (Weeks 1-3)</h3>
              <p className="text-blue-800 text-sm mb-3">Objective: Replace Oracle with Cloud-native tables</p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Create holdings & transactions tables</li>
                <li>• Data migration scripts & ETL pipeline</li>
                <li>• Validation & reconciliation</li>
                <li>• Production cutover & Oracle decommission</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-900 mb-2">Phase 2: LeadSquared Integration (Weeks 2-4)</h3>
              <p className="text-green-800 text-sm mb-3">Objective: Bi-directional sync between CRM and Cloud</p>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Create lead_sync_cache table</li>
                <li>• Build sync edge function</li>
                <li>• Webhook configuration</li>
                <li>• Testing & validation</li>
              </ul>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Phase 3: CDP Integration (Weeks 4-6)</h3>
              <p className="text-purple-800 text-sm mb-3">Objective: Enable behavioral analytics and automated engagement</p>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• CDP vendor selection & contract</li>
                <li>• Event schema & sync edge function</li>
                <li>• Configure segments & lifecycle journeys</li>
                <li>• Production launch</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Cost Analysis */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b">
            4. Cost Analysis
          </h2>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Annual Cost Comparison</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Component</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Current</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Proposed</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Delta</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Oracle DB License</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">₹8-15L</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">₹0</td>
                  <td className="border border-gray-300 px-4 py-2 text-right text-green-600 font-medium">-₹8-15L</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">LeadSquared CRM</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">₹3-5L</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">₹3-5L</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">₹0</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">CDP Platform</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">₹0</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">₹2-4L</td>
                  <td className="border border-gray-300 px-4 py-2 text-right text-red-600">+₹2-4L</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">Cloud Compute</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">₹1-2L</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">₹1.5-3L</td>
                  <td className="border border-gray-300 px-4 py-2 text-right text-red-600">+₹0.5-1L</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Edge Functions</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">₹0</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">₹0.5-1L</td>
                  <td className="border border-gray-300 px-4 py-2 text-right text-red-600">+₹0.5-1L</td>
                </tr>
                <tr className="bg-gray-900 text-white font-semibold">
                  <td className="border border-gray-700 px-4 py-2">Total</td>
                  <td className="border border-gray-700 px-4 py-2 text-right">₹12-22L</td>
                  <td className="border border-gray-700 px-4 py-2 text-right">₹7-13L</td>
                  <td className="border border-gray-700 px-4 py-2 text-right text-green-400">-₹5-9L</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-2xl font-bold text-green-800 mb-1">Net Annual Savings: ₹5-9L/year</p>
            <p className="text-green-700">3-Year TCO Savings: ₹22L</p>
          </div>
        </section>

        {/* CDP Vendor Comparison */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b">
            5. CDP Vendor Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Criteria</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">CleverTap</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">MoEngage</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">WebEngage</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Pricing (2-5K MAU)</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">₹2-3L/yr</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">₹2.5-4L/yr</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">₹1.5-2.5L/yr</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-medium">Wealth-specific features</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">Good</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">Good</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">Basic</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Indian support</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">Excellent</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">Excellent</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">Good</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-medium">Journey builder</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">Advanced</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">Advanced</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">Basic</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Recommendation</td>
                  <td className="border border-gray-300 px-4 py-2 text-center bg-yellow-50">⭐ Primary</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">Alternative</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">Budget option</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Immediate Next Steps */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b">
            6. Immediate Next Steps
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-center w-12">#</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Owner</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Deadline</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-center">1</td>
                  <td className="border border-gray-300 px-4 py-2">Approve this document</td>
                  <td className="border border-gray-300 px-4 py-2">Leadership</td>
                  <td className="border border-gray-300 px-4 py-2">This week</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-center">2</td>
                  <td className="border border-gray-300 px-4 py-2">Create holdings/transactions migrations</td>
                  <td className="border border-gray-300 px-4 py-2">Dev</td>
                  <td className="border border-gray-300 px-4 py-2">Week 1</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-center">3</td>
                  <td className="border border-gray-300 px-4 py-2">Begin Oracle data export</td>
                  <td className="border border-gray-300 px-4 py-2">DevOps</td>
                  <td className="border border-gray-300 px-4 py-2">Week 1</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-center">4</td>
                  <td className="border border-gray-300 px-4 py-2">Initiate CDP vendor discussions</td>
                  <td className="border border-gray-300 px-4 py-2">Product</td>
                  <td className="border border-gray-300 px-4 py-2">Week 1</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-center">5</td>
                  <td className="border border-gray-300 px-4 py-2">Configure LeadSquared webhook</td>
                  <td className="border border-gray-300 px-4 py-2">Dev</td>
                  <td className="border border-gray-300 px-4 py-2">Week 2</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Approval Signatures */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b">
            7. Approval Signatures
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Signature</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Product Owner</td>
                  <td className="border border-gray-300 px-4 py-2 h-12"></td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">Tech Lead</td>
                  <td className="border border-gray-300 px-4 py-2 h-12"></td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Finance</td>
                  <td className="border border-gray-300 px-4 py-2 h-12"></td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">Compliance</td>
                  <td className="border border-gray-300 px-4 py-2 h-12"></td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-300 text-sm text-gray-500 text-center">
          <p>Document Version: 1.0 | Last Updated: December 2024</p>
          <p className="mt-1">CONFIDENTIAL - Internal Use Only</p>
        </footer>
      </article>
    </div>
  );
};

export default StrategyDocument;
