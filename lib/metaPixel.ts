/**
 * Meta (Facebook) Pixel Utility
 *
 * This module provides type-safe methods for tracking Meta Pixel events.
 * All methods check for SSR and pixel availability before executing.
 */

// Extend the Window interface to include fbq
declare global {
  interface Window {
    fbq: FacebookPixel;
    _fbq: FacebookPixel;
  }
}

type FacebookPixel = {
  (
    action:
      | "init"
      | "track"
      | "trackCustom"
      | "trackSingle"
      | "trackSingleCustom",
    eventNameOrPixelId: string,
    params?: Record<string, unknown>,
  ): void;
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  push?: (...args: unknown[]) => void;
  loaded?: boolean;
  version?: string;
};

// Standard Meta Pixel events
export type MetaPixelStandardEvent =
  | "PageView"
  | "AddPaymentInfo"
  | "AddToCart"
  | "AddToWishlist"
  | "CompleteRegistration"
  | "Contact"
  | "CustomizeProduct"
  | "Donate"
  | "FindLocation"
  | "InitiateCheckout"
  | "Lead"
  | "Purchase"
  | "Schedule"
  | "Search"
  | "StartTrial"
  | "SubmitApplication"
  | "Subscribe"
  | "ViewContent";

// Common event parameters
export interface PurchaseParams {
  value: number;
  currency: string;
  content_ids?: string[];
  content_name?: string;
  content_type?: string;
  contents?: Array<{ id: string; quantity: number }>;
  num_items?: number;
}

export interface AddToCartParams {
  value?: number;
  currency?: string;
  content_ids?: string[];
  content_name?: string;
  content_type?: string;
  contents?: Array<{ id: string; quantity: number }>;
}

export interface ViewContentParams {
  value?: number;
  currency?: string;
  content_ids?: string[];
  content_name?: string;
  content_type?: string;
  content_category?: string;
}

export interface InitiateCheckoutParams {
  value?: number;
  currency?: string;
  content_ids?: string[];
  content_name?: string;
  content_type?: string;
  contents?: Array<{ id: string; quantity: number }>;
  num_items?: number;
}

export interface LeadParams {
  value?: number;
  currency?: string;
  content_name?: string;
  content_category?: string;
}

export interface CompleteRegistrationParams {
  value?: number;
  currency?: string;
  content_name?: string;
  status?: string;
}

// Check if we're in browser and fbq is available
const isBrowser = (): boolean => {
  return typeof window !== "undefined";
};

const isPixelAvailable = (): boolean => {
  return isBrowser() && typeof window.fbq === "function";
};

/**
 * Track a page view event
 * This is automatically called on route changes by PixelTracker component
 */
export const pageview = (): void => {
  if (!isPixelAvailable()) {
    if (process.env.NODE_ENV === "development") {
      console.log("[Meta Pixel] pageview() called but pixel not available");
    }
    return;
  }

  window.fbq("track", "PageView");

  if (process.env.NODE_ENV === "development") {
    console.log("[Meta Pixel] PageView tracked");
  }
};

/**
 * Track a standard Meta Pixel event
 * @param eventName - Standard event name (e.g., 'Purchase', 'AddToCart')
 * @param params - Event parameters
 */
export const trackEvent = <T extends Record<string, unknown>>(
  eventName: MetaPixelStandardEvent,
  params?: T,
): void => {
  if (!isPixelAvailable()) {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[Meta Pixel] trackEvent('${eventName}') called but pixel not available`,
        params,
      );
    }
    return;
  }

  if (params) {
    window.fbq("track", eventName, params);
  } else {
    window.fbq("track", eventName);
  }

  if (process.env.NODE_ENV === "development") {
    console.log(`[Meta Pixel] Event '${eventName}' tracked`, params);
  }
};

/**
 * Track a custom event (not in the standard event list)
 * @param eventName - Custom event name
 * @param params - Event parameters
 */
export const trackCustomEvent = <T extends Record<string, unknown>>(
  eventName: string,
  params?: T,
): void => {
  if (!isPixelAvailable()) {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[Meta Pixel] trackCustomEvent('${eventName}') called but pixel not available`,
        params,
      );
    }
    return;
  }

  if (params) {
    window.fbq("trackCustom", eventName, params);
  } else {
    window.fbq("trackCustom", eventName);
  }

  if (process.env.NODE_ENV === "development") {
    console.log(`[Meta Pixel] Custom event '${eventName}' tracked`, params);
  }
};

// Convenience methods for common events

/**
 * Track a purchase event
 */
export const trackPurchase = (params: PurchaseParams): void => {
  trackEvent("Purchase", { ...params });
};

/**
 * Track an add to cart event
 */
export const trackAddToCart = (params: AddToCartParams): void => {
  trackEvent("AddToCart", { ...params });
};

/**
 * Track a view content event
 */
export const trackViewContent = (params: ViewContentParams): void => {
  trackEvent("ViewContent", { ...params });
};

/**
 * Track an initiate checkout event
 */
export const trackInitiateCheckout = (params: InitiateCheckoutParams): void => {
  trackEvent("InitiateCheckout", { ...params });
};

/**
 * Track a lead event
 */
export const trackLead = (params: LeadParams): void => {
  trackEvent("Lead", { ...params });
};

/**
 * Track a complete registration event
 */
export const trackCompleteRegistration = (
  params: CompleteRegistrationParams,
): void => {
  trackEvent("CompleteRegistration", { ...params });
};

/**
 * Track a contact event
 */
export const trackContact = (): void => {
  trackEvent("Contact");
};

/**
 * Track a search event
 */
export const trackSearch = (searchString?: string): void => {
  trackEvent(
    "Search",
    searchString ? { search_string: searchString } : undefined,
  );
};
