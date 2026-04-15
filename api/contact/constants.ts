export const resendApiUrl = "https://api.resend.com/emails";
export const turnstileVerifyUrl =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
export const suspiciousRedirectPath = "/?contact=error#contact";

export const resendTimeoutMs = 8000;
export const turnstileTimeoutMs = 5000;

export const rateLimitWindowsMs = {
  burst: 60 * 1000,
  daily: 24 * 60 * 60 * 1000,
} as const;

export const defaultRateLimitSettings = {
  maxRequestsPerBurstByIp: 6,
  maxRequestsPerDayByIp: 30,
  maxRequestsPerDayByEmail: 8,
} as const;

export const submissionTiming = {
  minSubmissionTimeMs: 3000,
  maxSubmissionAgeMs: 2 * 60 * 60 * 1000,
} as const;

export const fieldLengthLimits = {
  maxNameLength: 120,
  maxEmailLength: 254,
  maxOrgLength: 160,
  maxExistingSiteLength: 2048,
  maxMessageLength: 5000,
  maxContributionModelLength: 40,
  maxBudgetContextLength: 1000,
} as const;

const allowedContributionModels = new Set([
  "free-needed",
  "sliding-scale",
  "budget",
  "not-sure",
]);

export const isAllowedContributionModel = (value: string): boolean =>
  allowedContributionModels.has(value);

export const formatContributionModel = (value: string): string => {
  switch (value) {
    case "free-needed":
      return "Fully free is needed right now";
    case "sliding-scale":
      return "Can contribute on a sliding scale";
    case "budget":
      return "Has a real budget and happy to contribute";
    case "not-sure":
      return "Not sure yet";
    default:
      return "Not provided";
  }
};
