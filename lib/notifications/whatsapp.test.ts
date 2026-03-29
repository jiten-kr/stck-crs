import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const { mockCreate } = vi.hoisted(() => ({
  mockCreate: vi.fn(),
}));

vi.mock("twilio", () => ({
  default: vi.fn(() => ({
    messages: { create: mockCreate },
  })),
}));

import {
  buildLiveClassTwilioContentVariables,
  sendWhatsAppMessage,
} from "./whatsapp";

/**
 * Regression: Twilio Content templates for WhatsApp usually bind payload fields to
 * positional variables ("1", "2", …). Sending only camelCase keys meant the join URL
 * was not substituted, so recipients saw the template sample (e.g. example.com)
 * while the real URL still appeared on the payment-success page (DB/API path).
 */
describe("buildLiveClassTwilioContentVariables", () => {
  const sample = {
    customerName: "Ada",
    orderId: 99,
    itemName: "Live Trading",
    amount: "₹1,000",
    classDate: "30 Mar 2026",
    classTime: "8 PM IST",
    classUrl: "https://meet.example.com/live-abc",
  };

  it("includes named keys for Twilio templates that use named variables", () => {
    const v = buildLiveClassTwilioContentVariables(sample);
    expect(v.customerName).toBe("Ada");
    expect(v.orderId).toBe("99");
    expect(v.itemName).toBe("Live Trading");
    expect(v.amount).toBe("₹1,000");
    expect(v.classDate).toBe("30 Mar 2026");
    expect(v.classTime).toBe("8 PM IST");
    expect(v.classUrl).toBe("https://meet.example.com/live-abc");
  });

  it("includes positional keys 1–7 so Meta {{1}}…{{7}} templates receive the live URL", () => {
    const v = buildLiveClassTwilioContentVariables(sample);
    expect(v["1"]).toBe(sample.customerName);
    expect(v["2"]).toBe("99");
    expect(v["3"]).toBe(sample.itemName);
    expect(v["4"]).toBe(sample.amount);
    expect(v["5"]).toBe(sample.classDate);
    expect(v["6"]).toBe(sample.classTime);
    expect(v["7"]).toBe(sample.classUrl);
  });

  it("coerces every value to string (Twilio expects string contentVariables)", () => {
    const v = buildLiveClassTwilioContentVariables(sample);
    for (const val of Object.values(v)) {
      expect(typeof val).toBe("string");
    }
  });
});

describe("sendWhatsAppMessage (Twilio Content / HX)", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    mockCreate.mockReset();
    mockCreate.mockResolvedValue({
      sid: "SMxxx",
      status: "queued",
    });
    process.env.TWILIO_ACCOUNT_SID = "ACtest";
    process.env.TWILIO_AUTH_TOKEN = "test_token";
    process.env.TWILIO_WHATSAPP_FROM = "whatsapp:+15551234567";
  });

  afterEach(() => {
    process.env.TWILIO_ACCOUNT_SID = originalEnv.TWILIO_ACCOUNT_SID;
    process.env.TWILIO_AUTH_TOKEN = originalEnv.TWILIO_AUTH_TOKEN;
    process.env.TWILIO_WHATSAPP_FROM = originalEnv.TWILIO_WHATSAPP_FROM;
  });

  it("passes contentVariables as JSON with all string values for HX templates", async () => {
    const templateData = buildLiveClassTwilioContentVariables({
      customerName: "Bob",
      orderId: 1,
      itemName: "Course",
      amount: "₹500",
      classDate: "Mon",
      classTime: "7 PM",
      classUrl: "https://zoom.us/j/123",
    });

    const result = await sendWhatsAppMessage({
      to: "+919876543210",
      templateName: "HXdeadbeef0000000000000000000000",
      templateData,
    });

    expect(result.success).toBe(true);
    expect(mockCreate).toHaveBeenCalledTimes(1);
    const payload = mockCreate.mock.calls[0][0] as {
      contentSid: string;
      contentVariables: string;
    };
    expect(payload.contentSid).toBe("HXdeadbeef0000000000000000000000");

    const parsed = JSON.parse(payload.contentVariables) as Record<
      string,
      string
    >;
    expect(parsed["7"]).toBe("https://zoom.us/j/123");
    expect(parsed.classUrl).toBe("https://zoom.us/j/123");
    expect(parsed["2"]).toBe("1");
    for (const val of Object.values(parsed)) {
      expect(typeof val).toBe("string");
    }
  });
});
