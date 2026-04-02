const resendApiUrl = "https://api.resend.com/emails";

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

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  const toEmail = process.env.CONTACT_TO_EMAIL ?? "afton.gauntlett@gmail.com";

  if (!apiKey) {
    return redirectTo(request.url, "/?contact=error#contact");
  }

  const formData = await request.formData();
  const name = asString(formData.get("name"));
  const email = asString(formData.get("email"));
  const org = asString(formData.get("org"));
  const message = asString(formData.get("message"));
  const existingSite = asString(formData.get("existing-site"));

  if (!name || !email || !message) {
    return redirectTo(request.url, "/?contact=error#contact");
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

  const sendResponse = await fetch(resendApiUrl, {
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
  });

  if (!sendResponse.ok) {
    return redirectTo(request.url, "/?contact=error#contact");
  }

  return redirectTo(request.url, "/?contact=sent#contact");
}
