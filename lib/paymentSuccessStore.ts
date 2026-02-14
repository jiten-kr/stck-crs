export type PaymentSuccessStoredData = {
  userName: string;
  email: string;
  phone: string;
  bookingId: string;
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  nextLiveClassDate: string;
  nextLiveClassTime: string;
};

const STORAGE_KEY = "payment_success";

const ensureLocalStorage = () => {
  if (typeof window === "undefined" || !window.localStorage) {
    throw new Error("localStorage is not available");
  }
};

export const setPaymentSuccessData = async (
  data: PaymentSuccessStoredData,
): Promise<void> => {
  ensureLocalStorage();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getPaymentSuccessData =
  async (): Promise<PaymentSuccessStoredData | null> => {
    ensureLocalStorage();
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PaymentSuccessStoredData;
  };

export const clearPaymentSuccessData = async (): Promise<void> => {
  ensureLocalStorage();
  window.localStorage.removeItem(STORAGE_KEY);
};
