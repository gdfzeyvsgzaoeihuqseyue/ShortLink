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
// SOCIAL LINKS
// ===============================================
// Définition du type pour un lien social tel que retourné par le backend
export interface SocialLinkApi {
  id: string;
  media: string;
  link: string;
  createdAt: number;
  updatedAt: number;
}

// Définition du type pour le lien social formaté pour le frontend
export interface SocialLink {
  name: string;
  href: string;
  icon: any;
  title?: string;
}

