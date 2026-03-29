export type ValidatedLiveClassLinks = {
  liveClassUrl: string;
  whatsappGroupUrl: string;
};

function tryParseHttpUrl(raw: string): URL | null {
  try {
    const u = new URL(raw.trim());
    if (u.protocol !== "http:" && u.protocol !== "https:") {
      return null;
    }
    return u;
  } catch {
    return null;
  }
}

function isWhatsAppGroupUrl(u: URL): boolean {
  const host = u.hostname.toLowerCase();
  return (
    host === "chat.whatsapp.com" ||
    host === "wa.me" ||
    host === "www.wa.me"
  );
}

/**
 * Validates admin live-class + WhatsApp links (shared by API and UI).
 * Both URLs are required, must be http(s), WhatsApp must be a recognized invite domain,
 * and the two URLs must not be the same (after URL normalization).
 */
export function validateLiveClassLinks(
  liveRaw: string,
  whatsappRaw: string,
):
  | { ok: true; value: ValidatedLiveClassLinks }
  | { ok: false; error: string } {
  const liveTrim = liveRaw.trim();
  const waTrim = whatsappRaw.trim();

  if (!liveTrim) {
    return { ok: false, error: "Live class URL is required." };
  }
  if (!waTrim) {
    return { ok: false, error: "WhatsApp group URL is required." };
  }

  const liveUrl = tryParseHttpUrl(liveTrim);
  if (!liveUrl) {
    return {
      ok: false,
      error: "Live class URL must be a valid http or https URL.",
    };
  }

  const waUrl = tryParseHttpUrl(waTrim);
  if (!waUrl) {
    return {
      ok: false,
      error: "WhatsApp group URL must be a valid http or https URL.",
    };
  }

  if (!isWhatsAppGroupUrl(waUrl)) {
    return {
      ok: false,
      error:
        "WhatsApp group URL must use chat.whatsapp.com or wa.me (invite/group link).",
    };
  }

  if (liveUrl.href === waUrl.href) {
    return {
      ok: false,
      error: "Live class URL and WhatsApp group URL must be different.",
    };
  }

  return {
    ok: true,
    value: {
      liveClassUrl: liveUrl.toString(),
      whatsappGroupUrl: waUrl.toString(),
    },
  };
}
