import { describe, it, expect } from "vitest";
import {
  escapeHtml,
  sanitizeUrlForHref,
  buildOrderConfirmationEmailText,
  buildOrderConfirmationContent,
  buildOrderConfirmationEmailHtml,
} from "./contentBuilder";
import type { OrderConfirmationData } from "./types";

function sampleOrderData(
  overrides: Partial<OrderConfirmationData> = {},
): OrderConfirmationData {
  const paidAt = new Date("2026-03-15T12:00:00.000Z");
  return {
    userId: 1,
    userName: "Test User",
    email: "u@example.com",
    phone: "+919999999999",
    orderId: 42,
    bookingId: "42",
    paymentId: "pay_test",
    gatewayOrderId: "gw_test",
    amount: 10000,
    currency: "INR",
    itemName: "Live Course",
    itemId: 2,
    nextLiveClassDate: paidAt.toISOString(),
    nextLiveClassTime: "8 PM IST",
    liveClassUrl: null,
    whatsappGroupUrl: null,
    paidAt,
    ...overrides,
  };
}

describe("escapeHtml", () => {
  it("escapes HTML special characters", () => {
    expect(escapeHtml(`a<b>&x"'y`)).toBe(
      "a&lt;b&gt;&amp;x&quot;&#039;y",
    );
  });

  it("leaves plain text unchanged", () => {
    expect(escapeHtml("hello")).toBe("hello");
  });
});

describe("sanitizeUrlForHref", () => {
  it("accepts https URLs", () => {
    expect(sanitizeUrlForHref(" https://meet.example.com/x?y=1 ")).toBe(
      "https://meet.example.com/x?y=1",
    );
  });

  it("accepts http URLs", () => {
    const out = sanitizeUrlForHref("http://example.com");
    expect(out).toMatch(/^http:\/\/example\.com\/?$/);
  });

  it("rejects javascript URLs", () => {
    expect(sanitizeUrlForHref("javascript:alert(1)")).toBeNull();
  });

  it("rejects empty or invalid input", () => {
    expect(sanitizeUrlForHref("")).toBeNull();
    expect(sanitizeUrlForHref("not-a-url")).toBeNull();
  });
});

describe("buildOrderConfirmationEmailText", () => {
  it("includes live class and WhatsApp URLs when configured", () => {
    const data = sampleOrderData({
      liveClassUrl: "https://meet.example.com/class",
      whatsappGroupUrl: "https://chat.whatsapp.com/invite",
    });
    const text = buildOrderConfirmationEmailText(data);
    expect(text).toContain("Live class link: https://meet.example.com/class");
    expect(text).toContain(
      "WhatsApp group link: https://chat.whatsapp.com/invite",
    );
    expect(text).toContain("Save");
  });

  it("uses legacy footnote when links are not configured", () => {
    const text = buildOrderConfirmationEmailText(sampleOrderData());
    expect(text).toContain("2 hours before");
    expect(text).not.toContain("Live class link:");
  });
});

describe("buildOrderConfirmationContent", () => {
  it("adds link rows to class details when URLs exist", () => {
    const c = buildOrderConfirmationContent(
      sampleOrderData({
        liveClassUrl: "https://meet.example.com/z",
        whatsappGroupUrl: "https://chat.whatsapp.com/abc",
      }),
    );
    const labels = c.classDetails.items.map((i) => i.label);
    expect(labels).toContain("Live class link");
    expect(labels).toContain("WhatsApp group");
    expect(c.footer.joiningLinkNote.toLowerCase()).toContain("save");
  });

  it("omits link rows when URLs missing", () => {
    const c = buildOrderConfirmationContent(sampleOrderData());
    const labels = c.classDetails.items.map((i) => i.label);
    expect(labels).not.toContain("Live class link");
    expect(labels).not.toContain("WhatsApp group");
    expect(c.footer.joiningLinkNote).toContain("2 hours");
  });
});

describe("buildOrderConfirmationEmailHtml", () => {
  it("embeds link anchors for http(s) URLs", () => {
    const html = buildOrderConfirmationEmailHtml(
      sampleOrderData({
        liveClassUrl: "https://meet.example.com/safe",
        whatsappGroupUrl: "https://chat.whatsapp.com/g",
      }),
    );
    expect(html).toContain("https://meet.example.com/safe");
    expect(html).toContain("https://chat.whatsapp.com/g");
    expect(html).toContain("Live class link:");
    expect(html).toContain("WhatsApp group:");
  });

  it("escapes item name in HTML body", () => {
    const html = buildOrderConfirmationEmailHtml(
      sampleOrderData({ itemName: 'Evil<script>alert(1)</script>' }),
    );
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });
});
