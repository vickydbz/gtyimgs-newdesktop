export type PlatformMode = 'windows' | 'macos';

export type ContributorTier = 'Exclusive' | 'Non-Exclusive';

export interface ContributorProfile {
  id: string;
  name: string;
  email: string;
  studioName: string;
  tier: ContributorTier;
  royaltyRate: string; // e.g. "40%"
  avatarUrl: string;
  activeAssets: number;
  lifetimeEarningsUSD: number;
  unpaidBalanceUSD: number;
  nextPayoutDate: string;
  payoutProvider: 'Payoneer' | 'PayPal' | 'Direct Wire';
  payoutAccount: string;
  taxStatus: 'W-8BEN Verified' | 'W-9 Verified' | 'Pending Review';
  withholdingRate: number; // 0 for treaty, 30 standard
  espConnected: boolean;
  authMethod: 'ESP_CREDENTIALS' | 'API_KEY' | 'DEMO_PORTFOLIO';
}

export type AssetCategory = 
  | 'Technology & AI'
  | 'Business & Finance'
  | 'Sustainable Energy'
  | 'Healthcare & Medicine'
  | 'Travel & Nature'
  | 'Modern Lifestyle'
  | 'Industrial & Architecture';

export type SubmissionStatus = 
  | 'draft'
  | 'validating'
  | 'in_review'
  | 'approved'
  | 'rejected';

export interface StockAsset {
  id: string;
  gettyId: string;
  title: string;
  description: string;
  category: AssetCategory;
  thumbnailUrl: string;
  uploadDate: string;
  resolution: string; // e.g. "9504 x 6336 (60.2 MP)"
  aspectRatio: string;
  fileSizeMB: number;
  camera: string;
  lens: string;
  iso: number;
  shutter: string;
  aperture: string;
  colorSpace: 'sRGB' | 'Adobe RGB' | 'Display P3';
  licenseType: 'Creative RF' | 'Editorial' | 'Extended Commercial';
  collection: 'iStock Signature' | 'iStock Essentials' | 'Getty Images Creative' | 'Getty Editorial';
  modelRelease: 'Signed & Verified' | 'Not Required (No Faces)' | 'Pending';
  propertyRelease: 'Signed & Verified' | 'Not Required' | 'Pending';
  keywords: string[];
  disambiguatedKeywords: { tag: string; disambiguation: string }[];
  status: SubmissionStatus;
  // Sales telemetry
  totalQuantitySold: number;
  grossSalesUSD: number;
  netRoyaltyUSD: number;
  averageRoyaltyPerDownload: number;
  lastLicensedDate: string;
  topBuyerCountries: string[];
}

export interface RoyaltyStatement {
  id: string;
  statementNumber: string; // e.g. "ESP-2026-10-84920"
  periodMonth: string; // "October 2026"
  periodYear: number;
  periodMonthIndex: number; // 1-12
  payoutDate: string; // "2026-10-25"
  grossBillingsUSD: number;
  contributorNetUSD: number;
  totalLicensesSold: number;
  taxWithheldUSD: number;
  paymentStatus: 'Paid' | 'Processing' | 'Scheduled';
  payoutMethod: string;
  breakdown: {
    istockSignatureLicenses: number;
    istockSignatureUSD: number;
    istockEssentialsLicenses: number;
    istockEssentialsUSD: number;
    gettyCreativeLicenses: number;
    gettyCreativeUSD: number;
    extendedLicenses: number;
    extendedUSD: number;
  };
}

export interface CountrySalesData {
  countryCode: string; // "US", "DE", etc.
  countryName: string;
  region: 'North America' | 'Europe' | 'Asia-Pacific' | 'Latin America' | 'Middle East & Africa';
  licensesSold: number;
  grossSalesUSD: number;
  netEarningsUSD: number;
  sharePercent: number;
  growthRateYoY: number; // e.g. +14.2
  topSellingCategory: AssetCategory;
  lat: number;
  lng: number;
}

export interface KeywordPerformance {
  tag: string;
  disambiguation: string; // Getty controlled vocabulary disambiguation
  searchImpressionsMonthly: number;
  portfolioAssetsTagged: number;
  licensesDriven: number;
  totalEarningsUSD: number;
  clickThroughRate: number; // e.g. 8.4%
  conversionRate: number; // e.g. 14.8%
  searchVelocity: 'Rising' | 'Evergreen' | 'High Demand' | 'Seasonal Peak';
  difficultyScore: number; // 0-100
}

export interface IndustryEvent {
  id: string;
  title: string;
  category: 'Tech & Innovation' | 'Sports & Athletics' | 'Culture & Fashion' | 'Environment & Policy' | 'Commercial & Retail';
  eventDate: string;
  eventEndDate?: string;
  location: string;
  optimalUploadWindowStart: string; // 90 days before
  optimalUploadWindowEnd: string; // 45 days before
  daysUntilWindowCloses: number;
  windowStatus: 'Active Golden Window' | 'Upcoming' | 'Closed';
  description: string;
  recommendedKeywords: string[];
  visualChecklist: string[];
}

export interface SeasonalTrendItem {
  id: string;
  nicheTitle: string;
  category: AssetCategory;
  peakDemandMonths: string[];
  historicalGrowthYoY: number;
  marketSupplySaturation: 'Low Competition' | 'Moderate' | 'High Competition';
  demandIndexScore: number; // 0-100
  recommendedUploadDeadline: string;
  monthlyDemandCurve: number[]; // 12 numbers representing relative demand (Jan to Dec, 0-100)
  commercialBuyerProfile: string;
  shootTips: string[];
}

export type ActiveTab = 
  | 'dashboard'
  | 'upload'
  | 'royalties'
  | 'geo'
  | 'reports'
  | 'keywords'
  | 'seasonal'
  | 'events'
  | 'trends';
