/**
 * Application-wide constants
 */

export const PLATFORM_NAME = "MayankFin";
export const PLATFORM_DESCRIPTION = "Online Course Platform";
export const PLATFORM_FULL_NAME = `${PLATFORM_NAME} - ${PLATFORM_DESCRIPTION}`;
export const PLATFORM_SUPPORT_EMAIL = "contact.mayankfin@gmail.com";
export const PLATFORM_SUPPORT_PHONE = "+91 9997336099";
export const GENERAL_SUPPORT_EMAIL = "mayankfinhub@gmail.com";
export const LEARNERS_COUNT = "2,000+";
export const LIVE_TRADING_CLASS_ITEM_ID = 2;
export const LIVE_TRADING_CLASS_ENROLMENT_COURSE_ID = 4;
export const LIVE_TRADING_CLASS_PRICE_INR = 199;
export const ENROLL_CLASS_PRICE_INR = 2499;
/** Shown crossed out on the live class CTA (marketing list price). */
export const LIVE_TRADING_CLASS_NAME = "Live Trading Class";

/**
 * Centralized contact details for use across the platform
 */
export const contactDetails = {
  businessName: PLATFORM_NAME,
  ownerName: "Mayank Kumar",
  email: {
    support: "contact.mayankfin@gmail.com",
    general: "mayankfinhub@gmail.com",
  },
  phone: {
    support: "+91 9997336099",
  },
  address: {
    full: "Bagwara, Sahaspur, Uttar Pradesh, India - 246745",
  },
  hours: {
    days: "Monday - Sunday",
    time: "9:00 AM - 9:00 PM IST",
  },
  website: "https://mayankfin.com",
} as const;
