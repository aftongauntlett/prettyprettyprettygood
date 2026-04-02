const resendApiUrl = "https://api.resend.com/emails";
const suspiciousRedirectPath = "/?contact=error#contact";
const resendTimeoutMs = 8000;
const rateLimitWindowMs = 10 * 60 * 1000;
const maxRequestsPerWindow = 5;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type GlobalWithRateLimit = typeof globalThis & {
  __contactRateLimitStore?: Map<string, RateLimitEntry>;
};

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const asString = (value: FormDataEntryValue | null): string =>
  typeof value === "string" ? value.trim() : "";

const redirectTo = (requestUrl: string, path: string): Response => {
  const url = new URL(path, requestUrl);
  return Response.redirect(url, 303);
};

const getRateLimitStore = (): Map<string, RateLimitEntry> => {
  const scope = globalThis as GlobalWithRateLimit;
  scope.__contactRateLimitStore ??= new Map<string, RateLimitEntry>();
  return scope.__contactRateLimitStore;
};

const pruneExpiredRateLimitEntries = (
  store: Map<string, RateLimitEntry>,
  now: number,
): void => {
  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
};

const getClientIp = (request: Request): string | null => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const [firstIp] = forwardedFor.split(",");
    const parsed = firstIp?.trim();
    if (parsed) {
      return parsed;
    }
  }

  const fallbackHeaders = [
    "x-real-ip",
    "cf-connecting-ip",
    "fly-client-ip",
    "x-vercel-forwarded-for",
  ];

  for (const header of fallbackHeaders) {
    const ip = request.headers.get(header)?.trim();
    if (ip) {
      return ip;
    }
  }

  return null;
};

const isAllowedBrowserSubmission = (request: Request): boolean => {
  const requestOrigin = new URL(request.url).origin;
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  if (!origin && !referer) {
    return false;
  }

  if (origin && origin !== requestOrigin) {
    return false;
  }

  if (referer) {
    try {
      if (new URL(referer).origin !== requestOrigin) {
        return false;
      }
    } catch {
      return false;
    }
  }

  return true;
};

const isRateLimited = (key: string): boolean => {
  const now = Date.now();
  const store = getRateLimitStore();
  pruneExpiredRateLimitEntries(store, now);
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, {
      count: 1,
      resetAt: now + rateLimitWindowMs,
    });
    return false;
  }

  if (entry.count >= maxRequestsPerWindow) {
    return true;
  }

  entry.count += 1;
  store.set(key, entry);
  return false;
};

export const config = {
  runtime: "edge",
};

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: {
        Allow: "POST",
      },
    });
  }

  if (!isAllowedBrowserSubmission(request)) {
    return redirectTo(request.url, suspiciousRedirectPath);
  }

  const clientIp = getClientIp(request);
  if (clientIp && isRateLimited(clientIp)) {
    return redirectTo(request.url, suspiciousRedirectPath);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  const toEmail = process.env.CONTACT_TO_EMAIL ?? "afton.gauntlett@gmail.com";

  if (!apiKey) {
    return redirectTo(request.url, suspiciousRedirectPath);
  }

  const formData = await request.formData();
  const name = asString(formData.get("name"));
  const email = asString(formData.get("email"));
  const org = asString(formData.get("org"));
  const message = asString(formData.get("message"));
  const existingSite = asString(formData.get("existing-site"));
  const hpField = asString(formData.get("project-url"));

  if (hpField) {
    return redirectTo(request.url, suspiciousRedirectPath);
  }

  if (!name || !email || !message) {
    return redirectTo(request.url, suspiciousRedirectPath);
  }

  const html = `
    <h2>New project inquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Organization or project:</strong> ${escapeHtml(org || "Not provided")}</p>
    <p><strong>Existing website:</strong> ${escapeHtml(existingSite || "Not provided")}</p>
    <h3>Message</h3>
    <p>${escapeHtml(message).replaceAll("\n", "<br />")}</p>
  `;

  let sendResponse: Response;

  try {
    const timeoutController = new AbortController();
    const timeoutId = setTimeout(() => {
      timeoutController.abort("resend-timeout");
    }, resendTimeoutMs);

    try {
      sendResponse = await fetch(resendApiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          reply_to: email,
          subject: `New project inquiry from ${name}`,
          html,
        }),
        signal: timeoutController.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    const isTimeout =
      error instanceof DOMException && error.name === "AbortError";
    console.error("contact_email_send_failed", {
      reason: isTimeout ? "timeout" : "request_exception",
      timeoutMs: resendTimeoutMs,
      method: request.method,
      endpoint: resendApiUrl,
      hasClientIp: Boolean(clientIp),
    });
    return redirectTo(request.url, suspiciousRedirectPath);
  }

  if (!sendResponse.ok) {
    console.error("contact_email_send_failed", {
      reason: "provider_non_ok",
      timeoutMs: resendTimeoutMs,
      method: request.method,
      endpoint: resendApiUrl,
      status: sendResponse.status,
      statusText: sendResponse.statusText,
      hasClientIp: Boolean(clientIp),
    });
    return redirectTo(request.url, suspiciousRedirectPath);
  }

  return redirectTo(request.url, "/?contact=sent#contact");
}
