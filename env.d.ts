declare namespace NodeJS {
  interface ProcessEnv {
    APP_URL: string;
    RAW_APP_URL: string;
    API_URL?: string;
    EMAIL_DOMAIN?: string;
    TRUST_PILOT?: string;
    NEXT_PUBLIC_MATOMO_URL?: string;
    NEXT_PUBLIC_MATOMO_SITE_ID?: string;
    NEXT_PUBLIC_SITE_URL?: string;
  }
}