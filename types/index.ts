// ===============================================
// ANALYTICS
// ===============================================
export interface ShortLinkAnalytics {
  id: string;
  shortLink: string;
  timestamp: number;
  ipAddress: string;
  userAgent: string;
  langue: string;
  source: {
    type: 'direct' | 'social_media' | 'search_engine' | 'referral' | 'unknown';
    nom: string;
    referent: string | null;
  };
  geolocalisation: {
    pays: string;
    ville: string;
  };
  appareil: {
    os: string;
    navigateur: string;
    type: string;
  };
}

// Interface de données
export interface AnalyticsStats {
  totalClicks: number;
  uniqueVisitors: number;
  topCountries: [string, number][];
  topCities: [string, number][];
  topDevices: [string, number][];
  topBrowsers: [string, number][];
  topSources: [string, number][];
  topOs: [string, number][];
  topLanguages: [string, number][];
  clicksByDay: [string, number][];
  clicksByHour: [string, number][];
}

export interface GetLinkWithAnalyticsResponse {
  success: boolean;
  message: string;
  data: ShortLink & {
    analytics?: ShortLinkAnalytics[];
  };
}

// ===============================================
// LIENS
// ===============================================
export interface ShortLink {
  id: string
  longUrl: string
  shortCode: string
  shortLink: string
  clicks: number
  createdAt: number
  updatedAt: number
  disabled?: boolean
  analytics?: Readonly<ShortLinkAnalytics[]>;
  metadata?: LinkMetadata;
}

// ===============================================
// METADATA
// ===============================================
export interface LinkMetadata {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  favicon?: string;
  keywords?: string;
  language?: string;
  author?: string;
  source?: string;
  siteName?: string;
  ogType?: string;
  twitterCard?: string;
  allOgImages?: readonly string[]; 
  allImgTags?: readonly string[];
  lastUpdated?: number; // Add this field
}

export interface ExtractMetadataResponse {
  success: boolean;
  message: string;
  data: LinkMetadata;
}

export interface CreateLinkResponse {
  message: string
  link: ShortLink
}

export interface GetLinksResponse {
  success: boolean
  message: string
  nb: number
  nbOnPage: number
  currentPage: number
  totalPages: number
  data: ShortLink[]
}

export interface GetLinkResponse {
  success: boolean
  message: string
  data: ShortLink & { analytics?: readonly ShortLinkAnalytics[] }
}

export interface UpdateLinkResponse {
  success: boolean
  message: string
  data: ShortLink
}

export interface DeleteLinkResponse {
  message: string
  deleted: ShortLink
}


// ===============================================
// LOG
// ===============================================
export interface LogEntry {
  id: string
  eventType: string
  updatedBy: string
  LogAt: string
  oldUrl?: string
  newUrl?: string
}

export interface LinkDetails {
  id: string
  shortCode: string
  createdAt: string
  updatedAt: string
}

export interface GetLogsResponse {
  success: boolean
  message: string
  linkDetails: LinkDetails
  data: LogEntry[]
}

// ===============================================
// QR CODE
// ===============================================
export interface QRCodeOptions {
  format?: 'png' | 'svg' | 'jpeg' | 'webp';
  title?: string;
  size?: number;
  quality?: number;
  foregroundColor?: string;
  backgroundColor?: string;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  margin?: number;
  logoFile?: File | null;
  logoSize?: number;
  addSignature?: boolean;
  signatureColor?: string;
  signatureFontSize?: number;
}

export interface QRCodeResponse {
  success: boolean;
  message: string;
  blob?: Blob;
  url?: string;
}

// ===============================================
// REDIRECTS
// ===============================================
export interface RedirectResponse {
  success: boolean
  message: string
  redirectUrl?: string
}


// ===============================================
// ROBOTS.TXT
// ===============================================
export interface UserAgentRules {
  allow?: string[]; 
  disallow?: string[]; 

  // allow?: readonly string[]; 
  // disallow?: readonly string[];
}

export interface RobotsTxtConfig {
  id: string;
  title: string;
  userAgents: { [key: string]: UserAgentRules };
  sitemapUrl?: string;
  customRules?: string;
  lastGenerated: string; 
  createdAt: string;
  updatedAt: string;
}

export interface GenerateRobotsTxtPayload {
  title: string;
  userAgents: { [key: string]: UserAgentRules };
  sitemapUrl?: string;
  customRules?: string;
}

export interface GenerateRobotsTxtResponse {
  success: boolean;
  message: string;
  data: RobotsTxtConfig;
  robotsTxtContent: string;
}

export interface GetRobotsTxtsResponse {
  message: string;
  nb: number;
  nbOnPage: number;
  currentPage: number;
  totalPages: number;
  data: RobotsTxtConfig[];
}

export interface GetRobotsTxtResponse {
  success: boolean;
  message: string;
  data: RobotsTxtConfig;
}

export interface UpdateRobotsTxtResponse {
  success: boolean;
  message: string;
  data: RobotsTxtConfig;
}

export interface DeleteRobotsTxtResponse {
  success: boolean;
  message: string;
  data: RobotsTxtConfig;
}


// ===============================================
// SITEMAP
// ===============================================
export interface ShortLinkSitemap {
  id: string;
  title?: string;
  url: string;
  sitemapXml: string;
  options: SitemapGenerationOptions; 
  urlsCount: number;
  lastGenerated: string; 
  createdAt: string;
  updatedAt: string;
  scannedUrls?: string[];
}

export interface SitemapGenerationOptions {
  url: string;
  includePriority?: boolean;
  includeLastmod?: boolean;
  includeChangefreq?: boolean;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  maxPages?: number;
  followRobotsTxt?: boolean;
  ignoreNoindex?: boolean;
  ignoreNofollow?: boolean;
  ignoreNonCanonical?: boolean;
  includeImages?: boolean;
  title?: string;
  socketId?: string; // Add this field for backend communication
}

export interface GenerateSitemapResponse {
  message: string;
  sitemapId: string;
  urlsCount: number;
  sitemapXml: string;
}

export interface GetSitemapsResponse {
  message: string;
  nb: number;
  nbOnPage: number;
  currentPage: number;
  totalPages: number;
  data: ShortLinkSitemap[];
}

export interface GetSitemapResponse {
  success: boolean;
  message: string;
  data: ShortLinkSitemap;
}

export interface UpdateSitemapResponse {
  succes: boolean;
  message: string;
  data: ShortLinkSitemap;
}

export interface DeleteSitemapResponse {
  success: boolean;
  message: string;
  data: ShortLinkSitemap;
}

// New interface for real-time sitemap progress messages
export interface SitemapProgressMessage {
  type: 'start' | 'info' | 'progress' | 'ignored' | 'error' | 'complete' | 'warning';
  message?: string;
  url?: string;
  reason?: string;
  error?: string;
}


// ===============================================
// SOCIALLINKS
// ===============================================
// Backend
export interface SocialLinkApi {
  id: string;
  media: string;
  link: string;
  createdAt: number;
  updatedAt: number;
}

// Frontend
export interface SocialLink {
  name: string;
  href: string;
  icon: any;
  title?: string;
}
