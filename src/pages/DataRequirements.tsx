import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const documentContent = `# Data Integration Requirements Document
## Bajaj Capital Portfolio Dashboard

**Document Version:** 1.0  
**Date:** December 9, 2024  
**Purpose:** Define data requirements for LeadSquared CRM and Oracle Database integration

---

## 1. LeadSquared CRM - Required Data Points

### 1.1 Lead Identity

| Field Name | Data Type | Description | Sync Direction | Required |
|------------|-----------|-------------|----------------|----------|
| lead_id | String | Unique identifier for the lead | Read | Yes |
| first_name | String | Lead's first name | Read | Yes |
| last_name | String | Lead's last name | Read | Yes |
| email | String | Primary email address | Read | Yes |
| phone | String | Primary phone number | Read | Yes |
| created_date | DateTime | Date lead was created | Read | Yes |

### 1.2 Lead Status & Assignment

| Field Name | Data Type | Description | Sync Direction | Required |
|------------|-----------|-------------|----------------|----------|
| lead_stage | Enum | Current stage in sales funnel (New/Contacted/Qualified/Converted) | Read/Write | Yes |
| lead_source | String | Acquisition channel (Website/Referral/Campaign/Walk-in) | Read | Yes |
| assigned_sales_exec_id | String | ID of assigned sales executive | Read | Yes |
| assigned_sales_exec_name | String | Name of assigned sales executive | Read | Yes |
| last_activity_date | DateTime | Date of last interaction | Read | Yes |
| next_followup_date | DateTime | Scheduled follow-up date | Read/Write | No |

### 1.3 Client Profile

| Field Name | Data Type | Description | Sync Direction | Required |
|------------|-----------|-------------|----------------|----------|
| kyc_status | Enum | KYC completion status (Pending/Partial/Complete) | Read | Yes |
| pan_number | String | PAN (masked: XXXXX1234X) | Read | Yes |
| date_of_birth | Date | For age calculation | Read | Yes |
| occupation | String | Employment type | Read | No |
| annual_income_range | Enum | Income bracket | Read | Yes |
| risk_profile | Enum | Conservative/Moderate/Aggressive | Read/Write | Yes |
| investor_type | Enum | Profile classification | Read/Write | Yes |

### 1.4 Goals & Investment Preferences

| Field Name | Data Type | Description | Sync Direction | Required |
|------------|-----------|-------------|----------------|----------|
| primary_goal | String | Main financial goal | Read/Write | Yes |
| goal_amount | Decimal | Target corpus in INR | Read/Write | Yes |
| goal_target_date | Date | When goal should be achieved | Read/Write | Yes |
| investment_horizon | Integer | Timeline in years | Read/Write | Yes |
| monthly_sip_capacity | Decimal | Available monthly investment | Read/Write | Yes |
| preferred_asset_classes | Array[String] | Preferred investment types | Read/Write | No |
| existing_investments | Boolean | Has prior investments | Read | No |

---

## 2. Oracle Database - Required Data Points

### 2.1 Client Identity & Account

| Field Name | Data Type | Description | Sync Direction | Required |
|------------|-----------|-------------|----------------|----------|
| client_id | String | Unique client ID (must map to LSQ lead_id) | Read | Yes |
| account_number | String | Trading/demat account number | Read | Yes |
| account_status | Enum | Active/Dormant/Closed | Read | Yes |
| account_opening_date | Date | When account was opened | Read | Yes |

### 2.2 Holdings Summary (Per Asset Class)

| Field Name | Data Type | Description | Sync Direction | Required |
|------------|-----------|-------------|----------------|----------|
| holding_id | String | Unique holding identifier | Read | Yes |
| client_id | String | Reference to client | Read | Yes |
| asset_class | Enum | MF/Stocks/FD/Insurance/Bonds/UnlistedEquity/NCD_MLD | Read | Yes |
| scheme_name | String | Name of instrument/scheme | Read | Yes |
| isin | String | ISIN code where applicable | Read | No |
| units_held | Decimal(15,4) | Quantity of units | Read | Yes |
| average_cost | Decimal(15,4) | Average purchase price | Read | Yes |
| invested_amount | Decimal(15,2) | Total cost basis in INR | Read | Yes |
| current_nav | Decimal(15,4) | Current NAV/price | Read | Yes |
| current_value | Decimal(15,2) | Market value in INR | Read | Yes |
| returns_absolute | Decimal(15,2) | Absolute P&L in INR | Read | Yes |
| returns_percentage | Decimal(8,4) | Percentage returns | Read | Yes |
| returns_xirr | Decimal(8,4) | XIRR returns (if available) | Read | No |
| as_of_date | Date | Valuation date | Read | Yes |

### 2.3 Transaction History

| Field Name | Data Type | Description | Sync Direction | Required |
|------------|-----------|-------------|----------------|----------|
| transaction_id | String | Unique transaction reference | Read | Yes |
| client_id | String | Reference to client | Read | Yes |
| holding_id | String | Reference to holding | Read | Yes |
| transaction_type | Enum | Buy/Sell/SIP/Switch/Dividend/Interest/Maturity | Read | Yes |
| transaction_date | DateTime | Execution timestamp | Read | Yes |
| amount | Decimal(15,2) | Transaction value in INR | Read | Yes |
| units | Decimal(15,4) | Units transacted | Read | Yes |
| nav_price | Decimal(15,4) | Execution price | Read | Yes |
| folio_number | String | Folio reference (for MF) | Read | No |
| order_id | String | Order reference number | Read | No |

### 2.4 SIP Details

| Field Name | Data Type | Description | Sync Direction | Required |
|------------|-----------|-------------|----------------|----------|
| sip_id | String | SIP registration ID | Read | Yes |
| client_id | String | Reference to client | Read | Yes |
| scheme_name | String | SIP scheme name | Read | Yes |
| sip_amount | Decimal(15,2) | Monthly SIP amount | Read | Yes |
| sip_date | Integer | Debit day of month (1-28) | Read | Yes |
| sip_start_date | Date | SIP start date | Read | Yes |
| sip_end_date | Date | SIP end date (if applicable) | Read | No |
| sip_status | Enum | Active/Paused/Stopped/Completed | Read | Yes |
| total_installments_paid | Integer | Count of completed SIPs | Read | Yes |
| next_sip_date | Date | Next debit date | Read | Yes |

### 2.5 Instrument Master Data

| Field Name | Data Type | Description | Sync Direction | Required |
|------------|-----------|-------------|----------------|----------|
| isin | String | ISIN code | Read | Yes |
| scheme_code | String | Internal scheme code | Read | Yes |
| scheme_name | String | Full scheme name | Read | Yes |
| scheme_category | String | Equity/Debt/Hybrid/ELSS/etc. | Read | Yes |
| asset_class | Enum | MF/Stocks/FD/Insurance/Bonds/UnlistedEquity/NCD_MLD | Read | Yes |
| amc_name | String | AMC/Issuer name | Read | Yes |
| scheme_type | String | Open-ended/Close-ended | Read | No |
| risk_category | String | Very High/High/Moderate/Low | Read | No |
| maturity_date | Date | For FD/Bonds/NCD (if applicable) | Read | No |
| interest_rate | Decimal(8,4) | For fixed income instruments | Read | No |
| lock_in_period | Integer | Lock-in days (if any) | Read | No |

---

## 3. API & Access Requirements

### 3.1 LeadSquared API

| Requirement | Details |
|-------------|---------|
| **API Type** | REST API |
| **Authentication** | API Key + Access Key |
| **Base URL** | https://{your-instance}.leadsquared.com/v2/ |
| **Required Endpoints** | GET /Leads, POST /Leads, GET /LeadActivities |
| **Permissions** | Read access to Leads, Activities; Write access to Lead fields |
| **Rate Limits** | Document expected calls/minute |
| **Webhook (Optional)** | URL for real-time lead updates |

### 3.2 Oracle Database

| Requirement | Details |
|-------------|---------|
| **Connection Method** | REST API Gateway / Oracle REST Data Services (ORDS) |
| **Authentication** | Service account with OAuth2 or API Key |
| **Required Access** | SELECT on: clients, holdings, transactions, sip_master, scheme_master |
| **IP Whitelisting** | May be required for edge function IPs |
| **Data Format** | JSON response preferred |
| **Pagination** | Required for large result sets (holdings, transactions) |

---

## 4. Data Linking & Mapping

### 4.1 Primary Key Mapping

The critical link between both systems:

LeadSquared.lead_id  ←→  Oracle.client_id

**Important:** If these identifiers don't match today, you will need either:
1. A mapping table maintained in Oracle/LeadSquared
2. A shared identifier (e.g., PAN number as secondary key)

### 4.2 Suggested Mapping Table (If Required)

| Field | Type | Description |
|-------|------|-------------|
| mapping_id | UUID | Primary key |
| lsq_lead_id | String | LeadSquared lead ID |
| oracle_client_id | String | Oracle client ID |
| pan_number | String | Shared identifier |
| created_at | DateTime | Mapping creation date |
| verified | Boolean | Mapping verified flag |

---

## 5. Data Freshness & Sync Requirements

| Data Type | Freshness Requirement | Sync Method |
|-----------|----------------------|-------------|
| Lead Status | On-demand | API call on page load |
| Holdings Summary | On-demand | API call with cache (5 min) |
| Transactions | On-demand | API call with pagination |
| NAV/Prices | Daily | Batch update or real-time API |
| SIP Status | On-demand | API call on dashboard load |

---

## 6. Security & Compliance

### 6.1 Data Handling Requirements

- All API calls over HTTPS/TLS 1.2+
- PAN numbers must be masked in transit and at rest
- Audit logging for all data access
- Data retention policy compliance
- SEBI/RBI regulatory requirements met

### 6.2 Credentials Management

All API keys and credentials will be stored securely in:
- Lovable Cloud Secrets Manager (encrypted at rest)
- Never exposed in client-side code
- Rotatable without code changes

---

## 7. Action Items Checklist

### For LeadSquared Team:
- [ ] Generate API Key and Access Key with required permissions
- [ ] Document rate limits and quotas
- [ ] Confirm available fields match requirements above
- [ ] Set up webhook endpoint (optional)
- [ ] Provide sandbox/test environment credentials

### For Oracle/IT Team:
- [ ] Set up REST API gateway (ORDS or custom)
- [ ] Create service account with read-only access
- [ ] Document API endpoints and authentication method
- [ ] Confirm client_id mapping to LeadSquared lead_id
- [ ] Provide sample data for testing
- [ ] Document any IP whitelisting requirements

---

## 8. Contact & Ownership

| Role | Name | Contact |
|------|------|---------|
| Project Owner | | |
| LeadSquared Admin | | |
| Oracle DBA | | |
| IT Security | | |

---

*Document prepared for Bajaj Capital Portfolio Dashboard Integration*
`;

export default function DataRequirements() {
  const navigate = useNavigate();

  const handleDownload = () => {
    const blob = new Blob([documentContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data-integration-requirements.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-primary" />
              <div>
                <CardTitle>Data Integration Requirements</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  LeadSquared CRM & Oracle Database Integration Specs
                </p>
              </div>
            </div>
            <Button onClick={handleDownload} className="gap-2">
              <Download className="w-4 h-4" />
              Download .md
            </Button>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-[600px] whitespace-pre-wrap">
                {documentContent}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
