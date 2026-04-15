import {
  fieldLengthLimits,
  isAllowedContributionModel,
  rateLimitWindowsMs,
  submissionTiming,
} from "./contact/constants";
import { buildContactEmailHtml, sendContactEmail } from "./contact/email";
import {
  getClientIp,
  getRateLimitSettings,
  isAllowedBrowserSubmission,
  isRateLimited,
} from "./contact/rate-limit";
import {
  jsonResponse,
  redirectToError,
  redirectToSuccess,
  rejectSubmission,
  wantsJsonResponse,
} from "./contact/response";
import { verifyTurnstileToken } from "./contact/turnstile";
import {
  asString,
  isLikelyEmail,
  isLikelyHttpUrl,
  normalizeEmail,
  sha256Hex,
  toNumber,
} from "./contact/utils";

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
    return rejectSubmission(request);
  }

  const clientIp = getClientIp(request);

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY?.trim() ?? "";
  const rateLimits = getRateLimitSettings();

  if (!apiKey || !fromEmail || !toEmail) {
    return rejectSubmission(request);
  }

  const formData = await request.formData();
  const name = asString(formData.get("name"));
  const email = asString(formData.get("email"));
  const org = asString(formData.get("org"));
  const message = asString(formData.get("message"));
  const existingSite = asString(formData.get("existing-site"));
  const contributionModel = asString(formData.get("contribution-model"));
  const budgetContext = asString(formData.get("budget-context"));
  const hpField = asString(formData.get("project-url"));
  const startedAtRaw = asString(formData.get("form-started-at"));
  const turnstileToken = asString(formData.get("cf-turnstile-response"));
  const normalizedEmail = normalizeEmail(email);

  if (hpField) {
    return rejectSubmission(request);
  }

  if (!name || !normalizedEmail || !message || !contributionModel) {
    return rejectSubmission(request);
  }

  if (!isAllowedContributionModel(contributionModel)) {
    return rejectSubmission(request);
  }

  if (
    name.length > fieldLengthLimits.maxNameLength ||
    normalizedEmail.length > fieldLengthLimits.maxEmailLength ||
    org.length > fieldLengthLimits.maxOrgLength ||
    existingSite.length > fieldLengthLimits.maxExistingSiteLength ||
    message.length > fieldLengthLimits.maxMessageLength ||
    contributionModel.length > fieldLengthLimits.maxContributionModelLength ||
    budgetContext.length > fieldLengthLimits.maxBudgetContextLength
  ) {
    return rejectSubmission(request);
  }

  if (!isLikelyEmail(normalizedEmail)) {
    return rejectSubmission(request);
  }

  if (existingSite && !isLikelyHttpUrl(existingSite)) {
    return rejectSubmission(request);
  }

  const startedAt = toNumber(startedAtRaw);
  const now = Date.now();
  if (!startedAt) {
    return rejectSubmission(request);
  }

  const elapsedMs = now - startedAt;
  if (
    elapsedMs < submissionTiming.minSubmissionTimeMs ||
    elapsedMs > submissionTiming.maxSubmissionAgeMs
  ) {
    return rejectSubmission(request);
  }

  if (turnstileSecret) {
    const expectedHostname = new URL(request.url).hostname;
    const turnstileOk = await verifyTurnstileToken(
      turnstileToken,
      turnstileSecret,
      clientIp,
      expectedHostname,
    );

    if (!turnstileOk) {
      return rejectSubmission(request);
    }
  }

  if (clientIp) {
    const burstLimit = await isRateLimited(
      `ip:${clientIp}:burst`,
      rateLimitWindowsMs.burst,
      rateLimits.maxRequestsPerBurstByIp,
    );
    if (burstLimit.limited) {
      return rejectSubmission(request, 429, burstLimit.retryAfterSeconds);
    }

    const dailyIpLimit = await isRateLimited(
      `ip:${clientIp}:day`,
      rateLimitWindowsMs.daily,
      rateLimits.maxRequestsPerDayByIp,
    );
    if (dailyIpLimit.limited) {
      return rejectSubmission(request, 429, dailyIpLimit.retryAfterSeconds);
    }
  }

  const emailHash = await sha256Hex(normalizedEmail);
  const dailyEmailLimit = await isRateLimited(
    `email:${emailHash}:day`,
    rateLimitWindowsMs.daily,
    rateLimits.maxRequestsPerDayByEmail,
  );
  if (dailyEmailLimit.limited) {
    return rejectSubmission(request, 429, dailyEmailLimit.retryAfterSeconds);
  }

  const html = buildContactEmailHtml({
    name,
    normalizedEmail,
    org,
    contributionModel,
    budgetContext,
    existingSite,
    message,
  });

  let sendResponse: Response;

  try {
    sendResponse = await sendContactEmail({
      apiKey,
      fromEmail,
      toEmail,
      replyTo: normalizedEmail,
      subjectName: name,
      html,
    });
  } catch {
    if (wantsJsonResponse(request)) {
      return jsonResponse({ ok: false }, 502);
    }

    return redirectToError(request);
  }

  if (!sendResponse.ok) {
    if (wantsJsonResponse(request)) {
      return jsonResponse({ ok: false }, 502);
    }

    return redirectToError(request);
  }

  if (wantsJsonResponse(request)) {
    return jsonResponse({ ok: true }, 200);
  }

  return redirectToSuccess(request);
}
