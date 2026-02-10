/**
 * Global type declarations for analytics providers
 */

interface Window {
  // Google Analytics 4
  gtag?: (
    command: 'config' | 'event' | 'js' | 'set',
    targetId: string | Date,
    config?: Record<string, any>
  ) => void;
  dataLayer?: any[];

  // TikTok Pixel
  ttq?: {
    track: (event: string, data?: Record<string, any>) => void;
    page: () => void;
    identify: (data: Record<string, any>) => void;
    _i?: Record<string, any>;
    _t?: Record<string, any>;
    _o?: Record<string, any>;
  };

  // Meta Pixel (Facebook)
  fbq?: (
    command: 'init' | 'track' | 'trackCustom',
    eventName: string,
    data?: Record<string, any>
  ) => void;
  _fbq?: any;

  // Microsoft Clarity
  clarity?: (command: 'set' | 'identify' | 'consent', ...args: any[]) => void;
}
