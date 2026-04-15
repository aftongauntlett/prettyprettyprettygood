import {
  formatContributionModel,
  resendApiUrl,
  resendTimeoutMs,
} from "./constants";
import { escapeHtml } from "./utils";

type ContactEmailBodyData = {
  name: string;
  normalizedEmail: string;
  org: string;
  contributionModel: string;
  budgetContext: string;
  existingSite: string;
  message: string;
};

type SendContactEmailArgs = {
  apiKey: string;
  fromEmail: string;
  toEmail: string;
  replyTo: string;
  subjectName: string;
  html: string;
};

export const buildContactEmailHtml = ({
  name,
  normalizedEmail,
  org,
  contributionModel,
  budgetContext,
  existingSite,
  message,
}: ContactEmailBodyData): string => `
  <h2>New project inquiry</h2>
  <p><strong>Name:</strong> ${escapeHtml(name)}</p>
  <p><strong>Email:</strong> ${escapeHtml(normalizedEmail)}</p>
  <p><strong>Organization or project:</strong> ${escapeHtml(org || "Not provided")}</p>
  <p><strong>Funding preference:</strong> ${escapeHtml(formatContributionModel(contributionModel))}</p>
  <p><strong>Budget context:</strong> ${escapeHtml(budgetContext || "Not provided")}</p>
  <p><strong>Existing website:</strong> ${escapeHtml(existingSite || "Not provided")}</p>
  <h3>Message</h3>
  <p>${escapeHtml(message).replaceAll("\n", "<br />")}</p>
`;

export const sendContactEmail = async ({
  apiKey,
  fromEmail,
  toEmail,
  replyTo,
  subjectName,
  html,
}: SendContactEmailArgs): Promise<Response> => {
  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => {
    timeoutController.abort("resend-timeout");
  }, resendTimeoutMs);

  try {
    return await fetch(resendApiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: replyTo,
        subject: `New project inquiry from ${subjectName}`,
        html,
      }),
      signal: timeoutController.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
};
